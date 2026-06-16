import { cors } from 'hono/cors'

export const corsMiddleware = cors({
  origin: (origin) => origin || 'http://localhost:5173',
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
})
