import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { nanoid } from 'nanoid'
import { useEffect, useState } from 'react'
import { BrandingPanel } from '../../../../components/builder/BrandingPanel'
import { QuestionEditor } from '../../../../components/builder/QuestionEditor'
import { QuestionList } from '../../../../components/builder/QuestionList'
import { SurveyPreview } from '../../../../components/builder/SurveyPreview'
import { Button } from '../../../../components/ui/Button'
import { Input } from '../../../../components/ui/Input'
import { copyToClipboard, defaultConfigForType } from '../../../../lib/survey-utils'
import { useApi } from '../../../../lib/use-api'
import type { QuestionDto, QuestionInput, QuestionType, SurveyDto } from '../../../../types/survey'

export const Route = createFileRoute('/_app/surveys/$id/edit')({
  component: SurveyEditPage,
})

function SurveyEditPage() {
  const { id } = Route.useParams()
  const { api } = useApi()
  const queryClient = useQueryClient()

  const [title, setTitle] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const [logoUrl, setLogoUrl] = useState('')
  const [questions, setQuestions] = useState<QuestionInput[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [slug, setSlug] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['survey', id],
    queryFn: () => api<{ survey: SurveyDto }>(`/api/surveys/${id}`),
  })

  useEffect(() => {
    if (data?.survey) {
      const survey = data.survey
      setTitle(survey.title)
      setPrimaryColor(survey.primaryColor)
      setLogoUrl(survey.logoUrl ?? '')
      setSlug(survey.slug)
      const mapped = survey.questions.map((q) => ({
        id: q.id,
        type: q.type,
        title: q.title,
        config: q.config,
        sortOrder: q.sortOrder,
      }))
      setQuestions(mapped)
      setSelectedId(mapped[0]?.id ?? null)
    }
  }, [data])

  const saveSurvey = useMutation({
    mutationFn: () =>
      api<{ survey: SurveyDto }>(`/api/surveys/${id}`, {
        method: 'PUT',
        body: {
          title,
          primaryColor,
          logoUrl: logoUrl || null,
          questions: questions.map((q, index) => ({
            ...q,
            sortOrder: index,
          })),
        },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['survey', id] })
      await queryClient.invalidateQueries({ queryKey: ['surveys'] })
      setMessage('Survey saved')
      setTimeout(() => setMessage(null), 2500)
    },
  })

  const selectedQuestion = questions.find((q) => q.id === selectedId)

  const addQuestion = (type: QuestionType) => {
    const newQuestion: QuestionInput = {
      id: nanoid(),
      type,
      title: '',
      config: defaultConfigForType(type),
      sortOrder: questions.length,
    }
    setQuestions((prev) => [...prev, newQuestion])
    setSelectedId(newQuestion.id)
  }

  const removeQuestion = (questionId: string) => {
    const remaining = questions.filter((q) => q.id !== questionId)
    setQuestions(remaining)
    if (selectedId === questionId) {
      setSelectedId(remaining[0]?.id ?? null)
    }
  }

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    setQuestions((prev) => {
      const index = prev.findIndex((q) => q.id === questionId)
      if (index < 0) return prev
      const target = direction === 'up' ? index - 1 : index + 1
      if (target < 0 || target >= prev.length) return prev
      const next = [...prev]
      const [item] = next.splice(index, 1)
      if (!item) return prev
      next.splice(target, 0, item)
      return next
    })
  }

  const copyLink = async () => {
    await copyToClipboard(`${window.location.origin}/s/${slug}`)
    setMessage('Public link copied')
    setTimeout(() => setMessage(null), 2500)
  }

  if (isLoading) {
    return <div className="p-8 text-slate-600">Loading survey...</div>
  }

  if (error) {
    return <div className="p-8 text-red-600">{error.message}</div>
  }

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => void copyLink()}>
            Copy link
          </Button>
          <Link to="/surveys/$id/responses" params={{ id }}>
            <Button variant="secondary">Responses</Button>
          </Link>
          <Button onClick={() => saveSurvey.mutate()} disabled={saveSurvey.isPending}>
            {saveSurvey.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {message ? <p className="mb-4 text-sm text-green-700">{message}</p> : null}
      {saveSurvey.error ? (
        <p className="mb-4 text-sm text-red-600">{saveSurvey.error.message}</p>
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Questions</h2>
          <div className="max-h-[calc(100vh-20rem)] overflow-y-auto pr-1">
            {selectedId ? (
              <QuestionList
                questions={questions}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onAdd={addQuestion}
                onRemove={removeQuestion}
                onMove={moveQuestion}
              />
            ) : (
              <p className="text-sm text-slate-500">Select a question to edit</p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-900">Edit question</h2>
          {selectedQuestion ? (
            <QuestionEditor
              question={selectedQuestion}
              onChange={(updated) =>
                setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)))
              }
            />
          ) : (
            <p className="text-sm text-slate-500">Select a question to edit</p>
          )}
        </section>

        <section className="space-y-6 rounded-xl border border-slate-200 bg-white p-4">
          <div>
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Branding</h2>
            <BrandingPanel
              primaryColor={primaryColor}
              logoUrl={logoUrl}
              onColorChange={setPrimaryColor}
              onLogoUrlChange={setLogoUrl}
            />
          </div>
          <div>
            <h2 className="mb-4 text-sm font-semibold text-slate-900">Preview</h2>
            <SurveyPreview
              title={title}
              logoUrl={logoUrl}
              primaryColor={primaryColor}
              questions={questions as QuestionDto[]}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
