import type { QuestionDto } from '../../types/survey'

type SurveyPreviewProps = {
  title: string
  logoUrl: string
  primaryColor: string
  questions: QuestionDto[]
}

export function SurveyPreview({ title, logoUrl, primaryColor, questions }: SurveyPreviewProps) {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          {logoUrl ? (
            <img src={logoUrl} alt="Preview logo" className="h-12 w-12 rounded-xl object-contain" />
          ) : (
            <div
              className="flex h-12 w-12 items-center justify-center rounded-2xl text-lg font-semibold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {title.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-slate-500">Public survey preview</p>
            <h3 className="text-lg font-semibold text-slate-900">{title || 'Untitled survey'}</h3>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {questions.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
            Add questions to see the live preview.
          </div>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{question.title || 'Untitled question'}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {question.type.replace('_', ' ')}
                  </p>
                </div>
              </div>
              {question.type === 'multiple_choice' ? (
                <div className="space-y-2">
                  {((question.config as { options?: string[] }).options ?? []).map((option, index) => (
                    <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      {option || `Option ${index + 1}`}
                    </div>
                  ))}
                </div>
              ) : question.type === 'rating' ? (
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <span key={rating} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm text-slate-700">
                      {rating}
                    </span>
                  ))}
                </div>
              ) : question.type === 'long_text' ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Long answer text field preview
                </div>
              ) : question.type === 'number' ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Numeric response field preview
                </div>
              ) : question.type === 'file' ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  File upload field preview
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  Short text response field preview
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
