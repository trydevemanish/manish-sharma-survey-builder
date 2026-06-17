import { Link } from '@tanstack/react-router'
import { formatDate, publicSurveyUrl } from '../../lib/survey-utils'
import type { SurveyListItem } from '../../types/survey'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

type SurveyCardProps = {
  survey: SurveyListItem
  onCopyLink: (slug: string) => void
  onDelete?: (id: string, title: string) => void
}

export function SurveyCard({ survey, onCopyLink, onDelete }: SurveyCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: survey.primaryColor }}
            />
            <h3 className="font-semibold text-slate-900">{survey.title}</h3>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            {survey.responseCount} responses · Updated {formatDate(survey.updatedAt)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Link to="/surveys/$id/edit" params={{ id: survey.id }}>
          <Button variant="secondary" size="sm">
            Edit
          </Button>
        </Link>
        <Link to="/surveys/$id/responses" params={{ id: survey.id }}>
          <Button variant="secondary" size="sm">
            Responses
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={() => onCopyLink(survey.slug)}>
          Copy link
        </Button>
        {onDelete ? (
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(survey.id, survey.title)}
          >
            Delete
          </Button>
        ) : null}
      </div>
    </Card>
  )
}

export function getCopiedLinkMessage(slug: string) {
  return `Link copied: ${publicSurveyUrl(slug)}`
}
