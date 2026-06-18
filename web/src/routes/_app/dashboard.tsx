import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { SurveyCard } from '../../components/dashboard/SurveyCard'
import { Button } from '../../components/ui/Button'
import { ConfirmationModal } from '../../components/ui/ConfirmationModal'
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

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [pendingDeleteSurvey, setPendingDeleteSurvey] = useState<{
    id: string
    title: string
  } | null>(null)
  const [confirmationText, setConfirmationText] = useState('')

  const openDeleteModal = (surveyId: string, title: string) => {
    setPendingDeleteSurvey({ id: surveyId, title })
    setConfirmationText('')
    setIsDeleteModalOpen(true)
  }

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false)
    setPendingDeleteSurvey(null)
    setConfirmationText('')
  }

  const handleConfirmDelete = async () => {
    if (!pendingDeleteSurvey) return
    await deleteSurvey.mutateAsync(pendingDeleteSurvey.id)
    closeDeleteModal()
  }

  const surveys = data?.surveys ?? []

  const handleCopyLink = async (slug: string) => {
    await copyToClipboard(`${window.location.origin}/s/${slug}`)
    setMessage('Public link copied to clipboard')
    setTimeout(() => setMessage(null), 2500)
  }

  return (
    <div className="h-screen p-8 flex flex-col">
      <div className="shrink-0">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
            <p className="mt-1 text-sm text-slate-600">
              All surveys you have created
            </p>
          </div>

          <Button
            onClick={() => createSurvey.mutate()}
            disabled={createSurvey.isPending}
          >
            {createSurvey.isPending ? "Creating..." : "New survey"}
          </Button>
        </div>

        {message && (
          <p className="mb-4 text-sm text-green-700">{message}</p>
        )}

        {isLoading && (
          <p className="text-slate-600">Loading surveys...</p>
        )}

        {error && (
          <p className="text-red-600">{error.message}</p>
        )}
      </div>

      {/* Scrollable Cards Area */}
      <div className="flex-1 overflow-y-auto scrollbar-none">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 pb-6">
          {surveys.map((survey) => (
            <SurveyCard
              key={survey.id}
              survey={survey}
              onCopyLink={handleCopyLink}
              onDelete={openDeleteModal}
            />
          ))}
        </div>
      </div>

      <ConfirmationModal
        open={isDeleteModalOpen}
        title="Delete survey"
        description={pendingDeleteSurvey ? pendingDeleteSurvey.title : "Untitled"}
        actionLabel="Delete survey"
        cancelLabel="Cancel"
        requiredText={pendingDeleteSurvey?.title}
        value={confirmationText}
        onValueChange={setConfirmationText}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        confirmDisabled={confirmationText !== pendingDeleteSurvey?.title || deleteSurvey.isPending}
      />
    </div>
  )
}
