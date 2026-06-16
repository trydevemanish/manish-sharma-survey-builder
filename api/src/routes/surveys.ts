import { Hono } from 'hono'
import { rowsToResponseDto, rowToSurveyDto, rowToSurveyListItem } from '../db/mappers'
import type {
  QuestionInput,
  QuestionRow,
  ResponseAnswerRow,
  ResponseRow,
  SurveyInput,
  SurveyRow,
} from '../db/schema'
import { newId, newSlug } from '../lib/ids'
import { getFile } from '../lib/r2'
import { defaultConfigForType, validateSurveyInput } from '../lib/validation'
import { type AuthVariables, clerkAuth } from '../middleware/clerk'

const surveys = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

surveys.use('*', clerkAuth)

surveys.get('/me', (c) => {
  return c.json({
    userId: c.get('userId'),
    email: c.get('userEmail'),
  })
})

surveys.get('/', async (c) => {
  const userId = c.get('userId')
  const result = await c.env.DB.prepare(
    `SELECT s.*, COUNT(r.id) as response_count
     FROM surveys s
     LEFT JOIN responses r ON r.survey_id = s.id
     WHERE s.clerk_user_id = ?
     GROUP BY s.id
     ORDER BY s.updated_at DESC`,
  )
    .bind(userId)
    .all<SurveyRow & { response_count: number }>()

  const items = (result.results ?? []).map((row) => rowToSurveyListItem(row, row.response_count))
  return c.json({ surveys: items })
})

surveys.post('/', async (c) => {
  const userId = c.get('userId')
  const now = Date.now()
  const surveyId = newId()
  const slug = newSlug()
  const questionId = newId()

  await c.env.DB.batch([
    c.env.DB.prepare(
      `INSERT INTO surveys (id, clerk_user_id, title, slug, primary_color, logo_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(surveyId, userId, 'Untitled Survey', slug, '#6366f1', null, now, now),
    c.env.DB.prepare(
      `INSERT INTO questions (id, survey_id, type, title, config_json, sort_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
    ).bind(
      questionId,
      surveyId,
      'short_text',
      'Your first question',
      JSON.stringify(defaultConfigForType('short_text')),
      0,
    ),
  ])

  const survey = await c.env.DB.prepare('SELECT * FROM surveys WHERE id = ?')
    .bind(surveyId)
    .first<SurveyRow>()
  const questions = await c.env.DB.prepare(
    'SELECT * FROM questions WHERE survey_id = ? ORDER BY sort_order ASC',
  )
    .bind(surveyId)
    .all<QuestionRow>()

  if (!survey) {
    return c.json({ error: 'Failed to create survey' }, 500)
  }

  return c.json({ survey: rowToSurveyDto(survey, questions.results ?? []) }, 201)
})

surveys.get('/:id', async (c) => {
  const userId = c.get('userId')
  const surveyId = c.req.param('id')

  const survey = await c.env.DB.prepare('SELECT * FROM surveys WHERE id = ? AND clerk_user_id = ?')
    .bind(surveyId, userId)
    .first<SurveyRow>()

  if (!survey) {
    return c.json({ error: 'Survey not found' }, 404)
  }

  const questions = await c.env.DB.prepare(
    'SELECT * FROM questions WHERE survey_id = ? ORDER BY sort_order ASC',
  )
    .bind(surveyId)
    .all<QuestionRow>()

  return c.json({ survey: rowToSurveyDto(survey, questions.results ?? []) })
})

surveys.put('/:id', async (c) => {
  const userId = c.get('userId')
  const surveyId = c.req.param('id')
  const body = await c.req.json<SurveyInput>()

  const existing = await c.env.DB.prepare(
    'SELECT * FROM surveys WHERE id = ? AND clerk_user_id = ?',
  )
    .bind(surveyId, userId)
    .first<SurveyRow>()

  if (!existing) {
    return c.json({ error: 'Survey not found' }, 404)
  }

  const validationError = validateSurveyInput(body.title, body.primaryColor, body.questions)
  if (validationError) {
    return c.json({ error: validationError }, 400)
  }

  const now = Date.now()
  const statements = [
    c.env.DB.prepare(
      `UPDATE surveys SET title = ?, primary_color = ?, logo_url = ?, updated_at = ?
       WHERE id = ?`,
    ).bind(body.title, body.primaryColor, body.logoUrl, now, surveyId),
    c.env.DB.prepare('DELETE FROM questions WHERE survey_id = ?').bind(surveyId),
    ...body.questions.map((q: QuestionInput, index: number) =>
      c.env.DB.prepare(
        `INSERT INTO questions (id, survey_id, type, title, config_json, sort_order)
         VALUES (?, ?, ?, ?, ?, ?)`,
      ).bind(q.id, surveyId, q.type, q.title, JSON.stringify(q.config ?? {}), index),
    ),
  ]

  await c.env.DB.batch(statements)

  const survey = await c.env.DB.prepare('SELECT * FROM surveys WHERE id = ?')
    .bind(surveyId)
    .first<SurveyRow>()
  const questions = await c.env.DB.prepare(
    'SELECT * FROM questions WHERE survey_id = ? ORDER BY sort_order ASC',
  )
    .bind(surveyId)
    .all<QuestionRow>()

  if (!survey) {
    return c.json({ error: 'Failed to update survey' }, 500)
  }

  return c.json({ survey: rowToSurveyDto(survey, questions.results ?? []) })
})

surveys.delete('/:id', async (c) => {
  const userId = c.get('userId')
  const surveyId = c.req.param('id')

  const result = await c.env.DB.prepare('DELETE FROM surveys WHERE id = ? AND clerk_user_id = ?')
    .bind(surveyId, userId)
    .run()

  if (result.meta.changes === 0) {
    return c.json({ error: 'Survey not found' }, 404)
  }

  return c.json({ ok: true })
})

surveys.get('/:id/responses', async (c) => {
  const userId = c.get('userId')
  const surveyId = c.req.param('id')

  const survey = await c.env.DB.prepare('SELECT id FROM surveys WHERE id = ? AND clerk_user_id = ?')
    .bind(surveyId, userId)
    .first()

  if (!survey) {
    return c.json({ error: 'Survey not found' }, 404)
  }

  const responses = await c.env.DB.prepare(
    'SELECT * FROM responses WHERE survey_id = ? ORDER BY submitted_at DESC',
  )
    .bind(surveyId)
    .all<ResponseRow>()

  const responseList = responses.results ?? []
  const result = []

  for (const response of responseList) {
    const answers = await c.env.DB.prepare(
      `SELECT ra.*, q.title as question_title, q.type as question_type
       FROM response_answers ra
       JOIN questions q ON q.id = ra.question_id
       WHERE ra.response_id = ?
       ORDER BY q.sort_order ASC`,
    )
      .bind(response.id)
      .all<ResponseAnswerRow & { question_title: string; question_type: string }>()

    result.push(rowsToResponseDto(response, answers.results ?? []))
  }

  return c.json({ responses: result })
})

surveys.get('/:id/files', async (c) => {
  const userId = c.get('userId')
  const surveyId = c.req.param('id')
  const fileKey = c.req.query('key')

  if (!fileKey) {
    return c.json({ error: 'File key is required' }, 400)
  }

  const survey = await c.env.DB.prepare('SELECT id FROM surveys WHERE id = ? AND clerk_user_id = ?')
    .bind(surveyId, userId)
    .first()

  if (!survey) {
    return c.json({ error: 'Survey not found' }, 404)
  }

  if (!fileKey.startsWith(`uploads/${surveyId}/`)) {
    return c.json({ error: 'Invalid file key' }, 403)
  }

  const object = await getFile(c.env.ASSETS, fileKey)
  if (!object) {
    return c.json({ error: 'File not found' }, 404)
  }

  const headers = new Headers()
  if (object.httpMetadata?.contentType) {
    headers.set('Content-Type', object.httpMetadata.contentType)
  }
  const originalName = object.customMetadata?.originalName
  if (originalName) {
    headers.set('Content-Disposition', `inline; filename="${originalName}"`)
  }

  return new Response(object.body, { headers })
})

export default surveys
