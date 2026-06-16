export function newId(): string {
  return crypto.randomUUID()
}

export function newSlug(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let slug = ''
  const bytes = crypto.getRandomValues(new Uint8Array(10))
  for (const byte of bytes) {
    slug += chars[byte % chars.length]
  }
  return slug
}
