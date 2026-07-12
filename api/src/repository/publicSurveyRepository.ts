import type { AnswerInput, QuestionRow, SurveyRow } from '../db/schema'
import { newId } from '../lib/ids'

export interface PublicSurveyRepository {
  getSurveyBySlug(slug: string): Promise<SurveyRow | null>
  getQuestionsBySurveyId(surveyId: string): Promise<QuestionRow[]>
  createResponse(surveyId: string, answers: AnswerInput[]): Promise<string>
}

export class D1PublicSurveyRepository implements PublicSurveyRepository {
  constructor(private readonly db: D1Database) {}

  async getSurveyBySlug(slug: string): Promise<SurveyRow | null> {
    const survey = await this.db
      .prepare('SELECT * FROM surveys WHERE slug = ?')
      .bind(slug)
      .first<SurveyRow>()

    return survey ?? null
  }

  async getQuestionsBySurveyId(surveyId: string): Promise<QuestionRow[]> {
    const result = await this.db
      .prepare('SELECT * FROM questions WHERE survey_id = ? ORDER BY sort_order ASC')
      .bind(surveyId)
      .all<QuestionRow>()

    return result.results ?? []
  }

  async createResponse(surveyId: string, answers: AnswerInput[]): Promise<string> {
    const responseId = newId()
    const now = Date.now()

    const statements = [
      this.db.prepare('INSERT INTO responses (id, survey_id, submitted_at) VALUES (?, ?, ?)').bind(
        responseId,
        surveyId,
        now,
      ),
      ...answers.map((answer) =>
        this.db
          .prepare(
            `INSERT INTO response_answers (id, response_id, question_id, value_json)
             VALUES (?, ?, ?, ?)`,
          )
          .bind(newId(), responseId, answer.questionId, JSON.stringify(answer.value)),
      ),
    ]

    await this.db.batch(statements)

    return responseId
  }
}
