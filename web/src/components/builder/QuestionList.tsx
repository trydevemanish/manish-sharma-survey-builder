import type { QuestionInput } from '../../types/survey'
import { QUESTION_TYPE_LABELS } from '../../types/survey'
import { Button } from '../ui/Button'

type QuestionListProps = {
  questions: QuestionInput[]
  selectedId: string
  onSelect: (id: string) => void
  onRemove: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
}

export function QuestionList({
  questions,
  selectedId,
  onSelect,
  onRemove,
  onMove,
}: QuestionListProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`rounded-lg border p-3 transition ${
              selectedId === question.id
                ? 'border-indigo-300 bg-indigo-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <button
              type="button"
              className="w-full text-left"
              onClick={() => onSelect(question.id)}
            >
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {QUESTION_TYPE_LABELS[question.type]}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-900">{question.title}</p>
            </button>
            <div className="mt-2 flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                disabled={index === 0}
                onClick={() => onMove(question.id, 'up')}
              >
                Up
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={index === questions.length - 1}
                onClick={() => onMove(question.id, 'down')}
              >
                Down
              </Button>
              <Button
                variant="ghost"
                size="sm"
                disabled={questions.length === 1}
                onClick={() => onRemove(question.id)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
