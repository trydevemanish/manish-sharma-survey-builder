import { useState } from 'react'
import { apiFetch } from '../../lib/api'
import type { AnswerInput, AnswerValue, PublicSurveyDto } from '../../types/survey'
import { Button } from '../ui/Button'
import { isAnswerValid, QuestionStep } from './QuestionStep'

type SurveyWizardProps = {
  survey: PublicSurveyDto
}

export function SurveyWizard({ survey }: SurveyWizardProps) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const questions = survey.questions
  const current = questions[step]
  const currentValue = current ? answers[current.id] : undefined
  const canAdvance = current ? isAnswerValid(current, currentValue) : false

  const setAnswer = (questionId: string, value: AnswerValue) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const payload: AnswerInput[] = questions.map((q) => ({
        questionId: q.id,
        value: answers[q.id] as AnswerValue,
      }))
      await apiFetch(`/api/public/surveys/${survey.slug}/responses`, {
        method: 'POST',
        body: { answers: payload },
      })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Thank you!</h2>
        <p className="mt-2 text-slate-600">Your response has been recorded.</p>
      </div>
    )
  }

  if (!current) {
    return <p className="text-slate-600">This survey has no questions yet.</p>
  }

  return (
    <div className="mx-auto w-full max-w-xl">
      <div className="mb-6 flex items-center justify-between text-sm text-slate-500">
        <span>
          Question {step + 1} of {questions.length}
        </span>
        <div className="h-2 w-40 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-[var(--brand)] transition-all"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <QuestionStep
        question={current}
        slug={survey.slug}
        value={currentValue}
        onChange={(value) => setAnswer(current.id, value)}
      />

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-8 flex items-center justify-between">
        <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Back
        </Button>
        {step < questions.length - 1 ? (
          <Button disabled={!canAdvance} onClick={() => setStep((s) => s + 1)}>
            Next
          </Button>
        ) : (
          <Button disabled={!canAdvance || submitting} onClick={() => void submit()}>
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        )}
      </div>
    </div>
  )
}
