import type { Context } from 'hono'
import type { SurveyInput } from '../db/schema'
import { getFile } from '../lib/r2'
import type { SurveyService } from '../service/surveyService'
import type { AuthVariables } from '../middleware/clerk';

export class SurveyController {
  constructor(private readonly service: SurveyService) {}

  async getMe(c: Context<{ Bindings: Env; Variables: AuthVariables }>) {
    return c.json({
      userId: c.get('userId'),
      email: c.get('userEmail'),
    })
  }

  async listSurveys(c: Context<{ Bindings: Env; Variables: AuthVariables }>) {
    const userId = c.get('userId')
    const surveys = await this.service.listSurveys(userId)
    return c.json({ surveys })
  }

  async createSurvey(c: Context<{ Bindings: Env; Variables: AuthVariables }>) {
    const userId = c.get('userId')
    const survey = await this.service.createSurvey(userId)
    return c.json({ survey }, 201)
  }

  async getSurvey(c: Context<{ Bindings: Env; Variables: AuthVariables }>) {
    const userId = c.get('userId')
    const surveyId = c.req.param('id') as string
    const survey = await this.service.getSurvey(userId, surveyId)

    if (!survey) {
      return c.json({ error: 'Survey not found' }, 404)
    }

    return c.json({ survey })
  }

  async updateSurvey(c: Context<{ Bindings: Env; Variables: AuthVariables }>) {
    const userId = c.get('userId')
    const surveyId = c.req.param('id') as string
    const body = await c.req.json<SurveyInput>()

    const result = await this.service.updateSurvey(userId, surveyId, body)
    return c.json(result.body, result.status)
  }

  async deleteSurvey(c: Context<{ Bindings: Env; Variables: AuthVariables }>) {
    const userId = c.get('userId')
    const surveyId = c.req.param('id') as string
    const deleted = await this.service.deleteSurvey(userId, surveyId)

    if (!deleted) {
      return c.json({ error: 'Survey not found' }, 404)
    }

    return c.json({ ok: true })
  }

  async getResponses(c: Context<{ Bindings: Env; Variables: AuthVariables }>) {
    const userId = c.get('userId')
    const surveyId = c.req.param('id') as string
    const responses = await this.service.getResponses(userId, surveyId)

    if (responses === null) {
      return c.json({ error: 'Survey not found' }, 404)
    }

    return c.json({ responses })
  }

  async getFile(c: Context<{ Bindings: Env; Variables: AuthVariables }>) {
    const userId = c.get('userId')
    const surveyId = c.req.param('id') as string
    const fileKey = c.req.query('key')

    if (!fileKey) {
      return c.json({ error: 'File key is required' }, 400)
    }

    if (!fileKey.startsWith(`uploads/${surveyId}/`)) {
      return c.json({ error: 'Invalid file key' }, 403)
    }

    const exists = await this.service.surveyExistsForUser(userId, surveyId)
    if (!exists) {
      return c.json({ error: 'Survey not found' }, 404)
    }

    const object = await getFile(c.env.ASSETS, fileKey)
    if (!object) {
      return c.json({ error: 'File not found' }, 404)
    }

    const headers = new Headers()
    if (object.httpMetadata?.contentType) {
      headers.set('Content-Type', object.httpMetadata.contentType)
    }

    const originalName = object.customMetadata?.originalName
    if (originalName) {
      headers.set('Content-Disposition', `inline; filename="${originalName}"`)
    }

    return new Response(object.body, { headers })
  }
}