import { cors } from 'hono/cors'

export const corsMiddleware = (frontendUrl: string) => cors({
  origin: (origin) => origin || frontendUrl,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
})
