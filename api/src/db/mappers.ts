import type {
  QuestionDto,
  QuestionRow,
  ResponseAnswerDto,
  ResponseAnswerRow,
  ResponseDto,
  ResponseRow,
  SurveyDto,
  SurveyListItem,
  SurveyRow,
} from './schema'

export function rowToQuestionDto(row: QuestionRow): QuestionDto {
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    config: JSON.parse(row.config_json),
    sortOrder: row.sort_order,
  }
}

export function rowToSurveyDto(survey: SurveyRow, questions: QuestionRow[]): SurveyDto {
  return {
    id: survey.id,
    title: survey.title,
    slug: survey.slug,
    primaryColor: survey.primary_color,
    logoUrl: survey.logo_url,
    questions: questions.map(rowToQuestionDto).sort((a, b) => a.sortOrder - b.sortOrder),
    createdAt: survey.created_at,
    updatedAt: survey.updated_at,
  }
}

export function rowToSurveyListItem(survey: SurveyRow, responseCount: number): SurveyListItem {
  return {
    id: survey.id,
    title: survey.title,
    slug: survey.slug,
    primaryColor: survey.primary_color,
    logoUrl: survey.logo_url,
    responseCount,
    createdAt: survey.created_at,
    updatedAt: survey.updated_at,
  }
}

export function rowsToResponseDto(
  response: ResponseRow,
  answers: Array<ResponseAnswerRow & { question_title: string; question_type: string }>,
): ResponseDto {
  return {
    id: response.id,
    submittedAt: response.submitted_at,
    answers: answers.map(
      (a): ResponseAnswerDto => ({
        questionId: a.question_id,
        questionTitle: a.question_title,
        questionType: a.question_type as ResponseAnswerDto['questionType'],
        value: JSON.parse(a.value_json),
      }),
    ),
  }
}
