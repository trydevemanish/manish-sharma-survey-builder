import { rowToQuestionDto, rowToSurveyDto, rowToSurveyListItem, rowsToResponseDto } from '../db/mappers'
import type {
  QuestionInput,
  QuestionRow,
  ResponseAnswerRow,
  ResponseRow,
  SurveyDto,
  SurveyInput,
  SurveyListItem,
  SurveyRow,
} from '../db/schema'
import { defaultConfigForType, validateSurveyInput } from '../lib/validation'
import { newId, newSlug } from '../lib/ids'
import type { SurveyRepository } from '../repository/surveyRepository'

export interface UpdateSurveyResult {
  status: 200 | 400 | 404 | 500
  body: { survey?: SurveyDto; error?: string }
}

export class SurveyService {
  constructor(private readonly repository: SurveyRepository) {}

  async listSurveys(userId: string): Promise<SurveyListItem[]> {
    const surveys = await this.repository.getSurveysByUserId(userId)
    return surveys.map((survey) => rowToSurveyListItem(survey, survey.response_count))
  }

  async createSurvey(userId: string): Promise<SurveyDto> {
    const now = Date.now()
    const surveyId = newId()
    const slug = newSlug()
    const questionId = newId()
    const survey: SurveyRow = {
      id: surveyId,
      clerk_user_id: userId,
      title: 'Untitled Survey',
      slug,
      primary_color: '#6366f1',
      logo_url: null,
      created_at: now,
      updated_at: now,
    }
    const question: QuestionRow = {
      id: questionId,
      survey_id: surveyId,
      type: 'short_text',
      title: 'Your first question',
      config_json: JSON.stringify(defaultConfigForType('short_text')),
      sort_order: 0,
    }

    await this.repository.createSurvey(survey, question)
    return rowToSurveyDto(survey, [question])
  }

  async getSurvey(userId: string, surveyId: string): Promise<SurveyDto | null> {
    const survey = await this.repository.getSurveyByIdAndUserId(surveyId, userId)
    if (!survey) return null

    const questions = await this.repository.getQuestionsBySurveyId(surveyId)
    return rowToSurveyDto(survey, questions)
  }

  async updateSurvey(userId: string, surveyId: string, body: SurveyInput): Promise<UpdateSurveyResult> {
    const existing = await this.repository.getSurveyByIdAndUserId(surveyId, userId)
    if (!existing) {
      return { status: 404, body: { error: 'Survey not found' } }
    }

    const validationError = validateSurveyInput(body.title, body.primaryColor, body.questions)
    if (validationError) {
      return { status: 400, body: { error: validationError } }
    }

    const now = Date.now()
    await this.repository.updateSurvey(surveyId, body.title, body.primaryColor, body.logoUrl, now)
    await this.repository.deleteQuestionsBySurveyId(surveyId)

    const questions = body.questions.map((q: QuestionInput, index: number) => ({
      id: q.id,
      survey_id: surveyId,
      type: q.type,
      title: q.title,
      config_json: JSON.stringify(q.config ?? {}),
      sort_order: index,
    }))

    await this.repository.insertQuestions(questions)

    const survey = await this.repository.getSurveyById(surveyId)
    if (!survey) {
      return { status: 500, body: { error: 'Failed to update survey' } }
    }

    const questionRows = await this.repository.getQuestionsBySurveyId(surveyId)
    return { status: 200, body: { survey: rowToSurveyDto(survey, questionRows) } }
  }

  async deleteSurvey(userId: string, surveyId: string): Promise<boolean> {
    const changes = await this.repository.deleteSurveyByIdAndUserId(surveyId, userId)
    return changes > 0
  }

  async getResponses(userId: string, surveyId: string) {
    const exists = await this.repository.surveyExistsForUser(surveyId, userId)
    if (!exists) return null

    const responses = await this.repository.getResponsesBySurveyId(surveyId)
    const result = []

    for (const response of responses) {
      const answers = await this.repository.getResponseAnswersByResponseId(response.id)
      result.push(rowsToResponseDto(response, answers))
    }

    return result
  }

  async surveyExistsForUser(userId: string, surveyId: string): Promise<boolean> {
    return this.repository.surveyExistsForUser(surveyId, userId)
  }
}