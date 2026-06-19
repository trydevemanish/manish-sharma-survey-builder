import type {
  AnswerInput,
  AnswerValue,
  FileConfig,
  LongTextConfig,
  MultipleChoiceConfig,
  NumberConfig,
  QuestionConfig,
  QuestionInput,
  QuestionType,
} from '../db/schema'
import { FILE_MAX_SIZE_MB, LONG_TEXT_MAX_LENGTH } from '../db/schema'

const QUESTION_TYPES: QuestionType[] = [
  'short_text',
  'long_text',
  'number',
  'multiple_choice',
  'rating',
  'file',
]

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/

export function isValidHexColor(color: string): boolean {
  return HEX_COLOR.test(color)
}

export function validateQuestionInput(question: QuestionInput): string | null {
  if (!QUESTION_TYPES.includes(question.type)) {
    return `Invalid question type: ${question.type}`
  }
  if (!question.title.trim()) {
    return 'Question title is required'
  }

  switch (question.type) {
    case 'multiple_choice': {
      const config = question.config as MultipleChoiceConfig
      if (!config.options || config.options.length < 2) {
        return 'Multiple choice needs at least 2 options'
      }
      if (config.options.some((o) => !o.label.trim())) {
        return 'Multiple choice options cannot be empty'
      }
      if (new Set(config.options.map((o) => o.id)).size !== config.options.length) {
        return 'Multiple choice option ids must be unique'
      }
      break
    }
    case 'long_text': {
      const config = question.config as LongTextConfig
      if (!config.maxLength || config.maxLength > LONG_TEXT_MAX_LENGTH) {
        return `Long text max length must be <= ${LONG_TEXT_MAX_LENGTH}`
      }
      break
    }
    case 'file': {
      const config = question.config as FileConfig
      if (!config.maxSizeMb || config.maxSizeMb > FILE_MAX_SIZE_MB) {
        return `File max size must be <= ${FILE_MAX_SIZE_MB}MB`
      }
      break
    }
  }

  return null
}

export function validateSurveyInput(
  title: string,
  primaryColor: string,
  questions: QuestionInput[],
): string | null {
  if (!title.trim()) {
    return 'Survey title is required'
  }
  if (!isValidHexColor(primaryColor)) {
    return 'Primary color must be a valid hex color'
  }
  if (questions.length === 0) {
    return 'Survey must have at least one question'
  }
  for (const question of questions) {
    const error = validateQuestionInput(question)
    if (error) return error
  }
  return null
}

const createOption = (label: string, index: number) => ({
  id: `option-${Date.now()}-${index}-${Math.random().toString(36).slice(2)}`,
  label,
})

export function defaultConfigForType(type: QuestionType): QuestionConfig {
  switch (type) {
    case 'multiple_choice':
      return { options: [createOption('Option 1', 0), createOption('Option 2', 1)] }
    case 'long_text':
      return { maxLength: LONG_TEXT_MAX_LENGTH }
    case 'number':
      return {}
    case 'file':
      return { maxSizeMb: FILE_MAX_SIZE_MB, accept: ['image/*', 'application/pdf'] }
    default:
      return {}
  }
}

export function validateAnswer(
  type: QuestionType,
  config: QuestionConfig,
  value: AnswerValue,
): string | null {
  switch (type) {
    case 'short_text': {
      const v = value as { text?: string }
      if (!v.text?.trim()) return 'Text answer is required'
      return null
    }
    case 'long_text': {
      const v = value as { text?: string }
      const maxLength = (config as LongTextConfig).maxLength ?? LONG_TEXT_MAX_LENGTH
      if (!v.text?.trim()) return 'Text answer is required'
      if (v.text.length > maxLength) return `Text must be at most ${maxLength} characters`
      return null
    }
    case 'number': {
      const v = value as { number?: number }
      if (typeof v.number !== 'number' || Number.isNaN(v.number)) {
        return 'Valid number is required'
      }
      const numConfig = config as NumberConfig
      if (numConfig.min !== undefined && v.number < numConfig.min) {
        return `Number must be at least ${numConfig.min}`
      }
      if (numConfig.max !== undefined && v.number > numConfig.max) {
        return `Number must be at most ${numConfig.max}`
      }
      return null
    }
    case 'multiple_choice': {
      const v = value as { choice?: string }
      const options = (config as MultipleChoiceConfig).options ?? []
      if (!v.choice || !options.some((o) => o.id === v.choice)) {
        return 'Select a valid option'
      }
      return null
    }
    case 'rating': {
      const v = value as { rating?: number }
      if (typeof v.rating !== 'number' || v.rating < 1 || v.rating > 5) {
        return 'Rating must be between 1 and 5'
      }
      return null
    }
    case 'file': {
      const v = value as { fileKey?: string; fileName?: string; mimeType?: string }
      if (!v.fileKey || !v.fileName || !v.mimeType) {
        return 'File upload is required'
      }
      return null
    }
    default:
      return 'Unknown question type'
  }
}

export function validateSubmissionAnswers(
  questions: Array<{ id: string; type: QuestionType; config: QuestionConfig }>,
  answers: AnswerInput[],
): string | null {
  if (answers.length !== questions.length) {
    return 'Please answer all questions'
  }

  const questionMap = new Map(questions.map((q) => [q.id, q]))
  const seen = new Set<string>()

  for (const answer of answers) {
    if (seen.has(answer.questionId)) {
      return 'Duplicate answer for question'
    }
    seen.add(answer.questionId)

    const question = questionMap.get(answer.questionId)
    if (!question) {
      return 'Unknown question in submission'
    }

    const error = validateAnswer(question.type, question.config, answer.value)
    if (error) return error
  }

  for (const question of questions) {
    if (!seen.has(question.id)) {
      return 'Please answer all questions'
    }
  }

  return null
}
