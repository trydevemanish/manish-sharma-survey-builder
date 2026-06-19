import type { QuestionConfig, QuestionType } from '../types/survey'
import { FILE_MAX_SIZE_MB, LONG_TEXT_MAX_LENGTH } from '../types/survey'

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

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString()
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export function publicSurveyUrl(slug: string): string {
  return `${window.location.origin}/s/${slug}`
}
