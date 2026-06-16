export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'number'
  | 'multiple_choice'
  | 'rating'
  | 'file'

export type MultipleChoiceConfig = { options: string[] }
export type LongTextConfig = { maxLength: number }
export type NumberConfig = { min?: number; max?: number }
export type FileConfig = { accept?: string[]; maxSizeMb: number }

export type QuestionConfig =
  | Record<string, never>
  | MultipleChoiceConfig
  | LongTextConfig
  | NumberConfig
  | FileConfig

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

export interface SurveyRow {
  id: string
  clerk_user_id: string
  title: string
  slug: string
  primary_color: string
  logo_url: string | null
  created_at: number
  updated_at: number
}

export interface QuestionRow {
  id: string
  survey_id: string
  type: QuestionType
  title: string
  config_json: string
  sort_order: number
}

export interface ResponseRow {
  id: string
  survey_id: string
  submitted_at: number
}

export interface ResponseAnswerRow {
  id: string
  response_id: string
  question_id: string
  value_json: string
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

export interface PublicSurveyDto {
  title: string
  slug: string
  primaryColor: string
  logoUrl: string | null
  questions: QuestionDto[]
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

export const FILE_MAX_SIZE_MB = 5
export const LONG_TEXT_MAX_LENGTH = 500
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
]
