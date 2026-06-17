import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { SurveyCard } from '../../components/dashboard/SurveyCard'
import { Button } from '../../components/ui/Button'
import { copyToClipboard } from '../../lib/survey-utils'
import { useApi } from '../../lib/use-api'
import type { SurveyListItem } from '../../types/survey'

export const Route = createFileRoute('/_app/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { api } = useApi()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [message, setMessage] = useState<string | null>(null)

  const { data, isLoading, error } = useQuery({
    queryKey: ['surveys'],
    queryFn: () => api<{ surveys: SurveyListItem[] }>('/api/surveys'),
  })

  const createSurvey = useMutation({
    mutationFn: () => api<{ survey: { id: string } }>('/api/surveys', { method: 'POST' }),
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: ['surveys'] })
      navigate({ to: '/surveys/$id/edit', params: { id: result.survey.id } })
    },
  })

  const deleteSurvey = useMutation({
    mutationFn: (surveyId: string) =>
      api<{ ok: true }>(`/api/surveys/${surveyId}`, { method: 'DELETE' }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['surveys'] })
      setMessage('Survey deleted')
      setTimeout(() => setMessage(null), 2500)
    },
  })

  const handleDeleteSurvey = async (surveyId: string, title: string) => {
    const confirmed = window.confirm(
      `Delete “${title}”? This will remove the survey and all related response data permanently.`
    )
    if (!confirmed) return
    await deleteSurvey.mutateAsync(surveyId)
  }

  const surveys = data?.surveys ?? []

  const handleCopyLink = async (slug: string) => {
    await copyToClipboard(`${window.location.origin}/s/${slug}`)
    setMessage('Public link copied to clipboard')
    setTimeout(() => setMessage(null), 2500)
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600">All surveys you have created</p>
        </div>
        <Button onClick={() => createSurvey.mutate()} disabled={createSurvey.isPending}>
          {createSurvey.isPending ? 'Creating...' : 'New survey'}
        </Button>
      </div>

      {message ? <p className="mb-4 text-sm text-green-700">{message}</p> : null}
      {isLoading ? <p className="text-slate-600">Loading surveys...</p> : null}
      {error ? <p className="text-red-600">{error.message}</p> : null}

      {!isLoading && surveys.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-lg font-semibold text-slate-900">No surveys yet</h2>
          <p className="mt-2 text-sm text-slate-600">
            Create your first branded survey to get started.
          </p>
          <Button
            className="mt-4"
            onClick={() => createSurvey.mutate()}
            disabled={createSurvey.isPending}
          >
            Create survey
          </Button>
        </div>
      ) : null}

      <div className="overflow-x-auto pb-3">
        <div className="min-w-full grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onCopyLink={handleCopyLink}
              onDelete={handleDeleteSurvey}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
