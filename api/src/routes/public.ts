import { Hono } from 'hono'
import { rowToQuestionDto } from '../db/mappers'
import type { AnswerInput, QuestionRow, SurveyRow } from '../db/schema'
import { newId } from '../lib/ids'
import { validateSubmissionAnswers } from '../lib/validation'

const publicRoutes = new Hono<{ Bindings: Env }>()

publicRoutes.get('/surveys/:slug', async (c) => {
  const slug = c.req.param('slug')

  const survey = await c.env.DB.prepare('SELECT * FROM surveys WHERE slug = ?')
    .bind(slug)
    .first<SurveyRow>()

  if (!survey) {
    return c.json({ error: 'Survey not found' }, 404)
  }

  const questions = await c.env.DB.prepare(
    'SELECT * FROM questions WHERE survey_id = ? ORDER BY sort_order ASC',
  )
    .bind(survey.id)
    .all<QuestionRow>()

  return c.json({
    survey: {
      title: survey.title,
      slug: survey.slug,
      primaryColor: survey.primary_color,
      logoUrl: survey.logo_url,
      questions: (questions.results ?? []).map(rowToQuestionDto),
    },
  })
})

publicRoutes.post('/surveys/:slug/responses', async (c) => {
  const slug = c.req.param('slug')
  const body = await c.req.json<{ answers: AnswerInput[] }>()

  const survey = await c.env.DB.prepare('SELECT * FROM surveys WHERE slug = ?')
    .bind(slug)
    .first<SurveyRow>()

  if (!survey) {
    return c.json({ error: 'Survey not found' }, 404)
  }

  const questionsResult = await c.env.DB.prepare(
    'SELECT * FROM questions WHERE survey_id = ? ORDER BY sort_order ASC',
  )
    .bind(survey.id)
    .all<QuestionRow>()

  const questions = (questionsResult.results ?? []).map((q) => ({
    id: q.id,
    type: q.type,
    config: JSON.parse(q.config_json),
  }))

  const validationError = validateSubmissionAnswers(questions, body.answers ?? [])
  if (validationError) {
    return c.json({ error: validationError }, 400)
  }

  const responseId = newId()
  const now = Date.now()

  const statements = [
    c.env.DB.prepare('INSERT INTO responses (id, survey_id, submitted_at) VALUES (?, ?, ?)').bind(
      responseId,
      survey.id,
      now,
    ),
    ...(body.answers ?? []).map((answer) =>
      c.env.DB.prepare(
        `INSERT INTO response_answers (id, response_id, question_id, value_json)
         VALUES (?, ?, ?, ?)`,
      ).bind(newId(), responseId, answer.questionId, JSON.stringify(answer.value)),
    ),
  ]

  await c.env.DB.batch(statements)

  return c.json({ ok: true, responseId }, 201)
})

export default publicRoutes
