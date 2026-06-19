export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'number'
  | 'multiple_choice'
  | 'rating'
  | 'file'

export type MultipleChoiceOption = { id: string; label: string }
export type MultipleChoiceConfig = { options: MultipleChoiceOption[] }

export type LongTextConfig = { maxLength: number }
export type NumberConfig = { min?: number; max?: number }
export type FileConfig = { accept?: string[]; maxSizeMb: number }

export type QuestionConfig = Record<string, unknown>

export type ShortTextAnswer = { text: string }
export type LongTextAnswer = { text: string }
export type NumberAnswer = { number: number }
export type MultipleChoiceAnswer = { choice: string }
export type RatingAnswer = { rating: number }
export type FileAnswer = { fileKey: string; fileName: string; mimeType: string }

export type AnswerValue =
  | ShortTextAnswer
  | LongTextAnswer
  | NumberAnswer
  | MultipleChoiceAnswer
  | RatingAnswer
  | FileAnswer

export interface QuestionDto {
  id: string
  type: QuestionType
  title: string
  config: QuestionConfig
  sortOrder: number
}

export interface SurveyDto {
  id: string
  title: string
  slug: string
  primaryColor: string
  logoUrl: string | null
  questions: QuestionDto[]
  createdAt: number
  updatedAt: number
}

export interface SurveyListItem {
  id: string
  title: string
  slug: string
  primaryColor: string
  logoUrl: string | null
  responseCount: number
  createdAt: number
  updatedAt: number
}

export interface PublicSurveyDto {
  title: string
  slug: string
  primaryColor: string
  logoUrl: string | null
  questions: QuestionDto[]
}

export interface QuestionInput {
  id: string
  type: QuestionType
  title: string
  config: QuestionConfig
  sortOrder: number
}

export interface SurveyInput {
  title: string
  primaryColor: string
  logoUrl: string | null
  questions: QuestionInput[]
}

export interface AnswerInput {
  questionId: string
  value: AnswerValue
}

export interface ResponseAnswerDto {
  questionId: string
  questionTitle: string
  questionType: QuestionType
  value: AnswerValue
}

export interface ResponseDto {
  id: string
  submittedAt: number
  answers: ResponseAnswerDto[]
}

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  short_text: 'Short text',
  long_text: 'Long text',
  number: 'Number',
  multiple_choice: 'Multiple choice',
  rating: 'Rating',
  file: 'File upload',
}

export const FILE_MAX_SIZE_MB = 5
export const LONG_TEXT_MAX_LENGTH = 500
