import { rowToQuestionDto } from '../db/mappers'
import type { AnswerInput, PublicSurveyDto, QuestionConfig, QuestionType } from '../db/schema'
import { validateSubmissionAnswers } from '../lib/validation'
import type { PublicSurveyRepository } from '../repository/publicSurveyRepository'

type QuestionViewModel = {
  id: string
  type: QuestionType
  config: QuestionConfig
}

export interface SubmitSurveyResponseResult {
  status: number
  body: { ok: true; responseId: string } | { error: string }
}

export class PublicSurveyService {
  constructor(private readonly repository: PublicSurveyRepository) {}

  async getPublicSurvey(slug: string): Promise<PublicSurveyDto | null> {
    const survey = await this.repository.getSurveyBySlug(slug)
    if (!survey) {
      return null
    }

    const questions = await this.repository.getQuestionsBySurveyId(survey.id)

    return {
      title: survey.title,
      slug: survey.slug,
      primaryColor: survey.primary_color,
      logoUrl: survey.logo_url,
      questions: questions.map(rowToQuestionDto),
    }
  }

  async submitSurveyResponse(slug: string, answers: AnswerInput[]): Promise<SubmitSurveyResponseResult> {
    const survey = await this.repository.getSurveyBySlug(slug)
    if (!survey) {
      return { status: 404, body: { error: 'Survey not found' } }
    }

    const questions = await this.repository.getQuestionsBySurveyId(survey.id)
    const questionViewModels: QuestionViewModel[] = questions.map((question) => ({
      id: question.id,
      type: question.type,
      config: JSON.parse(question.config_json),
    }))

    const validationError = validateSubmissionAnswers(questionViewModels, answers)
    if (validationError) {
      return { status: 400, body: { error: validationError } }
    }

    const responseId = await this.repository.createResponse(survey.id, answers)

    return { status: 201, body: { ok: true, responseId } }
  }
}
