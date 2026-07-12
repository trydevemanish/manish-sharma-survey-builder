import type { FileConfig, SurveyRow } from '../db/schema'

export interface UploadRepository {
  getSurveyBySlug(slug: string): Promise<SurveyRow | null>
  getFileQuestion(questionId: string, surveyId: string): Promise<{ config_json: string } | null>
}

export class D1UploadRepository implements UploadRepository {
  constructor(private readonly db: D1Database) {}

  async getSurveyBySlug(slug: string): Promise<SurveyRow | null> {
    const survey = await this.db
      .prepare('SELECT * FROM surveys WHERE slug = ?')
      .bind(slug)
      .first<SurveyRow>()

    return survey ?? null
  }

  async getFileQuestion(questionId: string, surveyId: string): Promise<{ config_json: string } | null> {
    const question = await this.db
      .prepare('SELECT config_json FROM questions WHERE id = ? AND survey_id = ? AND type = ?')
      .bind(questionId, surveyId, 'file')
      .first<{ config_json: string }>()

    return question ?? null
  }
}