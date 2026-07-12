import type { Context } from 'hono'
import type { AnswerInput } from '../db/schema'
import type { PublicSurveyService } from '../service/publicSurveyService'

export class PublicSurveyController {
  constructor(private readonly publicSurveyService: PublicSurveyService) {}

  async getSurvey(c: Context<{ Bindings: Env }>) {
    const slug = c.req.param('slug')
    const survey = await this.publicSurveyService.getPublicSurvey(slug)

    if (!survey) {
      return c.json({ error: 'Survey not found' }, 404)
    }

    return c.json({ survey })
  }

  async submitResponse(c: Context<{ Bindings: Env }>) {
    const slug = c.req.param('slug')
    const body = await c.req.json<{ answers: AnswerInput[] }>()

    const result = await this.publicSurveyService.submitSurveyResponse(slug, body.answers ?? [])

    return c.json(result.body, result.status)
  }
}
