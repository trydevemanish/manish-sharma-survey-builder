import { useRef, useState } from 'react'
import { apiFetch } from '../../lib/api'
import type { AnswerValue, FileAnswer, QuestionDto } from '../../types/survey'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

type QuestionStepProps = {
  question: QuestionDto
  slug: string
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}

export function QuestionStep({ question, slug, value, onChange }: QuestionStepProps) {
  switch (question.type) {
    case 'short_text':
      return (
        <Input
          label={question.title}
          value={(value as { text?: string } | undefined)?.text ?? ''}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      )
    case 'long_text': {
      const text = (value as { text?: string } | undefined)?.text ?? ''
      const maxLength = 500
      return (
        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-slate-700">{question.title}</span>
          <textarea
            className="min-h-32 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            value={text}
            maxLength={maxLength}
            onChange={(e) => onChange({ text: e.target.value })}
          />
          <span className="text-xs text-slate-500">
            {text.length}/{maxLength}
          </span>
        </label>
      )
    }
    case 'number':
      return (
        <Input
          label={question.title}
          type="number"
          value={(value as { number?: number } | undefined)?.number?.toString() ?? ''}
          onChange={(e) => onChange({ number: Number(e.target.value) })}
        />
      )
    case 'multiple_choice': {
      const options = (question.config as { options?: string[] }).options ?? []
      const selected = (value as { choice?: string } | undefined)?.choice
      return (
        <fieldset className="space-y-3">
          <legend className="text-sm font-medium text-slate-700">{question.title}</legend>
          {options.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50"
            >
              <input
                type="radio"
                name={question.id}
                checked={selected === option}
                onChange={() => onChange({ choice: option })}
              />
              <span className="text-sm text-slate-800">{option}</span>
            </label>
          ))}
        </fieldset>
      )
    }
    case 'rating': {
      const selected = (value as { rating?: number } | undefined)?.rating
      return (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-700">{question.title}</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                type="button"
                className={`h-12 w-12 rounded-full border text-sm font-semibold transition ${
                  selected === rating
                    ? 'border-transparent bg-[var(--brand)] text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                }`}
                onClick={() => onChange({ rating })}
              >
                {rating}
              </button>
            ))}
          </div>
        </div>
      )
    }
    case 'file':
      return <FileUploadStep question={question} slug={slug} value={value} onChange={onChange} />
    default:
      return null
  }
}

function FileUploadStep({
  question,
  slug,
  value,
  onChange,
}: {
  question: QuestionDto
  slug: string
  value: AnswerValue | undefined
  onChange: (value: AnswerValue) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileAnswer = value as FileAnswer | undefined

  const handleFile = async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('questionId', question.id)

      const result = await apiFetch<FileAnswer>(`/api/public/surveys/${slug}/upload`, {
        method: 'POST',
        formData,
      })
      onChange(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-slate-700">{question.title}</p>
      <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
        <p className="text-sm text-slate-600">Drag and drop a file, or click to browse</p>
        <p className="mt-1 text-xs text-slate-500">Images or PDF, max 5MB</p>
        <Button
          variant="secondary"
          size="sm"
          className="mt-4"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? 'Uploading...' : 'Choose file'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleFile(file)
          }}
        />
      </div>
      {fileAnswer?.fileName ? (
        <p className="text-sm text-green-700">Uploaded: {fileAnswer.fileName}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  )
}

export function isAnswerValid(question: QuestionDto, value: AnswerValue | undefined): boolean {
  if (!value) return false
  switch (question.type) {
    case 'short_text':
    case 'long_text':
      return Boolean((value as { text?: string }).text?.trim())
    case 'number':
      return (
        typeof (value as { number?: number }).number === 'number' &&
        !Number.isNaN((value as { number?: number }).number)
      )
    case 'multiple_choice':
      return Boolean((value as { choice?: string }).choice)
    case 'rating':
      return typeof (value as { rating?: number }).rating === 'number'
    case 'file':
      return Boolean((value as FileAnswer).fileKey)
    default:
      return false
  }
}
