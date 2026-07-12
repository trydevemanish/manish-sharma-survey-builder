import type {
  QuestionRow,
  ResponseAnswerRow,
  ResponseRow,
  SurveyRow,
} from '../db/schema'

export interface SurveyRepository {
  getSurveysByUserId(userId: string): Promise<Array<SurveyRow & { response_count: number }>>
  createSurvey(survey: SurveyRow, initialQuestion: QuestionRow): Promise<void>
  getSurveyByIdAndUserId(surveyId: string, userId: string): Promise<SurveyRow | null>
  getSurveyById(surveyId: string): Promise<SurveyRow | null>
  getQuestionsBySurveyId(surveyId: string): Promise<QuestionRow[]>
  updateSurvey(surveyId: string, title: string, primaryColor: string, logoUrl: string | null, updatedAt: number): Promise<void>
  deleteQuestionsBySurveyId(surveyId: string): Promise<void>
  insertQuestions(questions: QuestionRow[]): Promise<void>
  deleteSurveyByIdAndUserId(surveyId: string, userId: string): Promise<number>
  surveyExistsForUser(surveyId: string, userId: string): Promise<boolean>
  getResponsesBySurveyId(surveyId: string): Promise<ResponseRow[]>
  getResponseAnswersByResponseId(
    responseId: string,
  ): Promise<Array<ResponseAnswerRow & { question_title: string; question_type: string }>>
}

export class D1SurveyRepository implements SurveyRepository {
  constructor(private readonly db: D1Database) {}

  async getSurveysByUserId(userId: string): Promise<Array<SurveyRow & { response_count: number }>> {
    const result = await this.db
      .prepare(
        `SELECT s.*, COUNT(r.id) as response_count
         FROM surveys s
         LEFT JOIN responses r ON r.survey_id = s.id
         WHERE s.clerk_user_id = ?
         GROUP BY s.id
         ORDER BY s.updated_at DESC`,
      )
      .bind(userId)
      .all<SurveyRow & { response_count: number }>()

    return result.results ?? []
  }

  async createSurvey(survey: SurveyRow, initialQuestion: QuestionRow): Promise<void> {
    await this.db.batch([
      this.db
        .prepare(
          `INSERT INTO surveys (id, clerk_user_id, title, slug, primary_color, logo_url, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(survey.id, survey.clerk_user_id, survey.title, survey.slug, survey.primary_color, survey.logo_url, survey.created_at, survey.updated_at),
      this.db
        .prepare(
          `INSERT INTO questions (id, survey_id, type, title, config_json, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          initialQuestion.id,
          initialQuestion.survey_id,
          initialQuestion.type,
          initialQuestion.title,
          initialQuestion.config_json,
          initialQuestion.sort_order,
        ),
    ])
  }

  async getSurveyByIdAndUserId(surveyId: string, userId: string): Promise<SurveyRow | null> {
    const survey = await this.db
      .prepare('SELECT * FROM surveys WHERE id = ? AND clerk_user_id = ?')
      .bind(surveyId, userId)
      .first<SurveyRow>()

    return survey ?? null
  }

  async getSurveyById(surveyId: string): Promise<SurveyRow | null> {
    const survey = await this.db
      .prepare('SELECT * FROM surveys WHERE id = ?')
      .bind(surveyId)
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

  async updateSurvey(
    surveyId: string,
    title: string,
    primaryColor: string,
    logoUrl: string | null,
    updatedAt: number,
  ): Promise<void> {
    await this.db
      .prepare(
        `UPDATE surveys SET title = ?, primary_color = ?, logo_url = ?, updated_at = ?
         WHERE id = ?`,
      )
      .bind(title, primaryColor, logoUrl, updatedAt, surveyId)
      .run()
  }

  async deleteQuestionsBySurveyId(surveyId: string): Promise<void> {
    await this.db.prepare('DELETE FROM questions WHERE survey_id = ?').bind(surveyId).run()
  }

  async insertQuestions(questions: QuestionRow[]): Promise<void> {
    const statements = questions.map((question) =>
      this.db
        .prepare(
          `INSERT INTO questions (id, survey_id, type, title, config_json, sort_order)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .bind(
          question.id,
          question.survey_id,
          question.type,
          question.title,
          question.config_json,
          question.sort_order,
        ),
    )

    if (statements.length > 0) {
      await this.db.batch(statements)
    }
  }

  async deleteSurveyByIdAndUserId(surveyId: string, userId: string): Promise<number> {
    const result = await this.db
      .prepare('DELETE FROM surveys WHERE id = ? AND clerk_user_id = ?')
      .bind(surveyId, userId)
      .run()

    return result.meta.changes ?? 0
  }

  async surveyExistsForUser(surveyId: string, userId: string): Promise<boolean> {
    const survey = await this.db
      .prepare('SELECT id FROM surveys WHERE id = ? AND clerk_user_id = ?')
      .bind(surveyId, userId)
      .first()

    return !!survey
  }

  async getResponsesBySurveyId(surveyId: string): Promise<ResponseRow[]> {
    const result = await this.db
      .prepare('SELECT * FROM responses WHERE survey_id = ? ORDER BY submitted_at DESC')
      .bind(surveyId)
      .all<ResponseRow>()

    return result.results ?? []
  }

  async getResponseAnswersByResponseId(
    responseId: string,
  ): Promise<Array<ResponseAnswerRow & { question_title: string; question_type: string }>> {
    const result = await this.db
      .prepare(
        `SELECT ra.*, q.title as question_title, q.type as question_type
         FROM response_answers ra
         JOIN questions q ON q.id = ra.question_id
         WHERE ra.response_id = ?
         ORDER BY q.sort_order ASC`,
      )
      .bind(responseId)
      .all<ResponseAnswerRow & { question_title: string; question_type: string }>()

    return result.results ?? []
  }
}