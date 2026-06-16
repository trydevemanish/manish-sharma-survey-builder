import { ALLOWED_MIME_TYPES, FILE_MAX_SIZE_MB } from '../db/schema'

export function validateFileUpload(file: File, maxSizeMb = FILE_MAX_SIZE_MB): string | null {
  const maxBytes = maxSizeMb * 1024 * 1024
  if (file.size > maxBytes) {
    return `File must be ${maxSizeMb}MB or smaller`
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return 'File type not allowed. Use images or PDF.'
  }
  return null
}

export function buildUploadKey(surveyId: string, fileName: string): string {
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_')
  return `uploads/${surveyId}/${crypto.randomUUID()}-${safeName}`
}

export async function putFile(bucket: R2Bucket, key: string, file: File): Promise<void> {
  const buffer = await file.arrayBuffer()
  await bucket.put(key, buffer, {
    httpMetadata: { contentType: file.type },
    customMetadata: { originalName: file.name },
  })
}

export async function getFile(bucket: R2Bucket, key: string): Promise<R2ObjectBody | null> {
  const object = await bucket.get(key)
  return object
}
