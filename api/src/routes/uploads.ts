import { Hono } from 'hono'
import type { FileConfig, SurveyRow } from '../db/schema'
import { buildUploadKey, putFile, validateFileUpload } from '../lib/r2'

const uploads = new Hono<{ Bindings: Env }>()

uploads.post('/surveys/:slug/upload', async (c) => {
  const slug = c.req.param('slug')

  const survey = await c.env.DB.prepare('SELECT * FROM surveys WHERE slug = ?')
    .bind(slug)
    .first<SurveyRow>()

  if (!survey) {
    return c.json({ error: 'Survey not found' }, 404)
  }

  const formData = await c.req.formData()
  const file = formData.get('file')
  const questionId = formData.get('questionId')

  if (!(file instanceof File)) {
    return c.json({ error: 'File is required' }, 400)
  }
  if (typeof questionId !== 'string' || !questionId) {
    return c.json({ error: 'Question ID is required' }, 400)
  }

  const question = await c.env.DB.prepare(
    'SELECT * FROM questions WHERE id = ? AND survey_id = ? AND type = ?',
  )
    .bind(questionId, survey.id, 'file')
    .first<{ config_json: string }>()

  if (!question) {
    return c.json({ error: 'Invalid file question' }, 400)
  }

  const config = JSON.parse(question.config_json) as FileConfig
  const maxSizeMb = config.maxSizeMb ?? 5

  const fileError = validateFileUpload(file, maxSizeMb)
  if (fileError) {
    return c.json({ error: fileError }, 400)
  }

  const key = buildUploadKey(survey.id, file.name)
  await putFile(c.env.ASSETS, key, file)

  return c.json({
    fileKey: key,
    fileName: file.name,
    mimeType: file.type,
  })
})

export default uploads
