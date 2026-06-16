import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import type { CSSProperties } from 'react'
import { SurveyWizard } from '../../components/public/SurveyWizard'
import { apiFetch } from '../../lib/api'
import type { PublicSurveyDto } from '../../types/survey'

export const Route = createFileRoute('/s/$slug')({
  component: PublicSurveyPage,
})

function PublicSurveyPage() {
  const { slug } = Route.useParams()

  const { data, isLoading, error } = useQuery({
    queryKey: ['public-survey', slug],
    queryFn: () => apiFetch<{ survey: PublicSurveyDto }>(`/api/public/surveys/${slug}`),
  })

  const survey = data?.survey

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        Loading survey...
      </div>
    )
  }

  if (error || !survey) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-slate-900">Survey not found</h1>
          <p className="mt-2 text-sm text-slate-600">This link may be invalid or expired.</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ '--brand': survey.primaryColor } as CSSProperties}
    >
      <div className="mx-auto max-w-3xl px-6 py-12">
        <header className="mb-10 text-center">
          {survey.logoUrl ? (
            <img
              src={survey.logoUrl}
              alt="Survey logo"
              className="mx-auto mb-4 h-14 w-14 object-contain"
            />
          ) : (
            <div
              className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
              style={{ backgroundColor: survey.primaryColor }}
            >
              {survey.title.charAt(0).toUpperCase()}
            </div>
          )}
          <h1 className="text-3xl font-bold text-slate-900">{survey.title}</h1>
        </header>
        <SurveyWizard survey={survey} />
      </div>
    </div>
  )
}
