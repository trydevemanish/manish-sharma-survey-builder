import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { SurveyWizard } from '../components/public/SurveyWizard'
import { Button } from '../components/ui/Button'
import type { PublicSurveyDto } from '../types/survey'

export const Route = createFileRoute('/draft')({
  component: DraftPage,
})

function DraftPage() {
  const [draft, setDraft] = useState<PublicSurveyDto | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('survey-draft')
      if (!raw) return
      const parsed = JSON.parse(raw)
      setDraft(parsed)
    } catch (e) {
      // ignore
    }
  }, [])

  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <p className="mb-4 text-sm text-slate-600">No draft found. Go back to the editor to preview.</p>
          <Button variant="secondary" onClick={() => window.history.back()}>
            Back to editor
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ '--brand': draft.primaryColor } as CSSProperties}
    >
      <div className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-4 flex justify-center">
            <header className="flex flex-col items-center">
                {draft.logoUrl ? (
                <img
                    src={draft.logoUrl}
                    alt="Survey logo"
                    className="mb-4 h-14 w-14 object-contain"
                />
                ) : (
                <div
                    className="mb-4 flex h-14 w-14 items-center justify-center rounded-full text-lg font-bold text-white"
                    style={{ backgroundColor: draft.primaryColor }}
                >
                    {draft.title.charAt(0).toUpperCase()}
                </div>
                )}
                <h1 className="text-3xl font-bold text-slate-900">{draft.title}</h1>
            </header>
        </div>
        <SurveyWizard survey={draft} isPreview={true} />
      </div>

      <div className='mt-4 flex flex-col gap-2 items-center'>
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
          <strong>Preview mode:</strong> Responses cannot be saved. This is for preview only.
        </div>
        <Button variant="secondary" size="sm" onClick={() => window.history.back()}>
        ← Back to editor
        </Button>
      </div>
    </div>
  )
}
