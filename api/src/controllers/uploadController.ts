import type { Context } from 'hono'
import type { UploadService } from '../service/uploadService'

export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  async uploadFile(c: Context<{ Bindings: Env }>) {
    const slug = c.req.param('slug') as string
    const formData = await c.req.formData()
    const result = await this.uploadService.uploadSurveyFile(slug, formData, c.env.ASSETS)
    return c.json(result.body, result.status)
  }
}