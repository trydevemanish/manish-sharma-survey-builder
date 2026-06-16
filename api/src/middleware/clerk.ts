import { verifyToken } from '@clerk/backend'
import { createMiddleware } from 'hono/factory'

export type AuthVariables = {
  userId: string
  userEmail: string | null
}

export const clerkAuth = createMiddleware<{ Bindings: Env; Variables: AuthVariables }>(
  async (c, next) => {
    const authHeader = c.req.header('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const token = authHeader.slice(7)
    try {
      const payload = await verifyToken(token, {
        secretKey: c.env.CLERK_SECRET_KEY,
      })
      const userId = payload.sub
      if (!userId) {
        return c.json({ error: 'Unauthorized' }, 401)
      }
      c.set('userId', userId)
      c.set('userEmail', (payload.email as string | undefined) ?? null)
      await next()
    } catch {
      return c.json({ error: 'Unauthorized' }, 401)
    }
  },
)
