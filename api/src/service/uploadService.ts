import type { FileConfig } from '../db/schema'
import { buildUploadKey, putFile, validateFileUpload } from '../lib/r2'
import type { UploadRepository } from '../repository/uploadRepository'

export interface UploadServiceResult {
  status: 200 | 400 | 404
  body: Record<string, unknown>
}

export class UploadService {
  constructor(private readonly repository: UploadRepository) {}

  async uploadSurveyFile(
    slug: string,
    formData: FormData,
    assetsBucket: R2Bucket,
  ): Promise<UploadServiceResult> {
    const survey = await this.repository.getSurveyBySlug(slug)
    if (!survey) {
      return { status: 404, body: { error: 'Survey not found' } }
    }

    const file = formData.get('file')
    const questionId = formData.get('questionId')

    if (!(file instanceof File)) {
      return { status: 400, body: { error: 'File is required' } }
    }
    if (typeof questionId !== 'string' || !questionId) {
      return { status: 400, body: { error: 'Question ID is required' } }
    }

    const question = await this.repository.getFileQuestion(questionId, survey.id)
    if (!question) {
      return { status: 400, body: { error: 'Invalid file question' } }
    }

    const config = JSON.parse(question.config_json) as FileConfig
    const maxSizeMb = config.maxSizeMb ?? 5

    const fileError = validateFileUpload(file, maxSizeMb)
    if (fileError) {
      return { status: 400, body: { error: fileError } }
    }

    const key = buildUploadKey(survey.id, file.name)
    await putFile(assetsBucket, key, file)

    return {
      status: 200,
      body: {
        fileKey: key,
        fileName: file.name,
        mimeType: file.type,
      },
    }
  }
}