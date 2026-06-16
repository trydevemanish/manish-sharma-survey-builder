import type { MultipleChoiceConfig, QuestionInput } from '../../types/survey'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

type QuestionEditorProps = {
  question: QuestionInput
  onChange: (question: QuestionInput) => void
}

export function QuestionEditor({ question, onChange }: QuestionEditorProps) {
  const updateTitle = (title: string) => onChange({ ...question, title })

  if (question.type === 'multiple_choice') {
    const config = question.config as MultipleChoiceConfig
    const options = config.options ?? []

    const updateOption = (index: number, value: string) => {
      const next = [...options]
      next[index] = value
      onChange({ ...question, config: { options: next } })
    }

    const addOption = () => {
      onChange({ ...question, config: { options: [...options, `Option ${options.length + 1}`] } })
    }

    const removeOption = (index: number) => {
      if (options.length <= 2) return
      onChange({ ...question, config: { options: options.filter((_, i) => i !== index) } })
    }

    return (
      <div className="space-y-4">
        <Input
          label="Question title"
          value={question.title}
          onChange={(e) => updateTitle(e.target.value)}
        />
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-700">Options</p>
          {options.map((option) => (
            <div key={option} className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                value={option}
                onChange={(e) => updateOption(options.indexOf(option), e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeOption(options.indexOf(option))}
              >
                Remove
              </Button>
            </div>
          ))}
          <Button variant="secondary" size="sm" onClick={addOption}>
            Add option
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <Input
        label="Question title"
        value={question.title}
        onChange={(e) => updateTitle(e.target.value)}
      />
      {question.type === 'long_text' ? (
        <p className="text-sm text-slate-500">Respondents can enter up to 500 characters.</p>
      ) : null}
      {question.type === 'file' ? (
        <p className="text-sm text-slate-500">Respondents can upload images or PDF up to 5MB.</p>
      ) : null}
      {question.type === 'rating' ? (
        <p className="text-sm text-slate-500">Respondents rate from 1 to 5.</p>
      ) : null}
    </div>
  )
}
