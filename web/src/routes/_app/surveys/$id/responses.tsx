import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Button } from '../../../../components/ui/Button'
import { Card } from '../../../../components/ui/Card'
import { formatDate } from '../../../../lib/survey-utils'
import { useApi } from '../../../../lib/use-api'
import type { FileAnswer, ResponseDto } from '../../../../types/survey'

export const Route = createFileRoute('/_app/surveys/$id/responses')({
  component: SurveyResponsesPage,
})

function SurveyResponsesPage() {
  const { id } = Route.useParams()
  const { api } = useApi()
  const { getToken } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['responses', id],
    queryFn: () => api<{ responses: ResponseDto[] }>(`/api/surveys/${id}/responses`),
  })

  const openFile = async (fileKey: string) => {
    const token = await getToken()
    const url = `/api/surveys/${id}/files?key=${encodeURIComponent(fileKey)}`
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: 'include',
    })
    if (!response.ok) return
    const blob = await response.blob()
    const objectUrl = URL.createObjectURL(blob)
    window.open(objectUrl, '_blank')
  }

  const responses = data?.responses ?? []

  return (
    <div className="p-8 max-h-screen">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Responses</h1>
          <p className="mt-1 text-sm text-slate-600">{responses.length} submissions</p>
        </div>
        <Link to="/surveys/$id/edit" params={{ id }}>
          <Button variant="secondary">Back to editor</Button>
        </Link>
      </div>

      {isLoading ? <p className="text-slate-600">Loading responses...</p> : null}
      {error ? <p className="text-red-600">{error.message}</p> : null}

      {!isLoading && responses.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="text-slate-600">
            No responses yet. Share your public link to collect answers.
          </p>
        </div>
      ) : null}

      <div className="space-y-4 max-h-[82vh] overflow-y-auto scrollbar-none">
        {responses.map((response) => (
          <Card key={response.id} className="p-5">
            <p className="text-sm font-medium text-slate-900">
              Submitted {formatDate(response.submittedAt)}
            </p>
            <div className="mt-4 space-y-3">
              {response.answers.map((answer) => (
                <div key={answer.questionId} className="rounded-lg bg-slate-50 px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {answer.questionTitle}
                  </p>
                  <div className="mt-1 text-sm text-slate-800">
                    <AnswerValue
                      type={answer.questionType}
                      value={answer.value}
                      onOpenFile={(key) => void openFile(key)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AnswerValue({
  type,
  value,
  onOpenFile,
}: {
  type: string
  value: ResponseDto['answers'][number]['value']
  onOpenFile: (key: string) => void
}) {
  if (type === 'file') {
    const file = value as FileAnswer
    return (
      <button
        type="button"
        className="text-indigo-600 underline"
        onClick={() => onOpenFile(file.fileKey)}
      >
        {file.fileName}
      </button>
    )
  }
  if (type === 'rating') {
    return <span>{(value as { rating: number }).rating} / 5</span>
  }
  if (type === 'multiple_choice') {
    return <span>{(value as { choice: string }).choice}</span>
  }
  if (type === 'number') {
    return <span>{(value as { number: number }).number}</span>
  }
  if (type === 'short_text' || type === 'long_text') {
    return <span>{(value as { text: string }).text}</span>
  }
  return <span>{JSON.stringify(value)}</span>
}
