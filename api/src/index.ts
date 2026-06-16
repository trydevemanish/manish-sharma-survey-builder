import { Hono } from 'hono'
import { corsMiddleware } from './middleware/cors'
import publicRoutes from './routes/public'
import surveys from './routes/surveys'
import uploads from './routes/uploads'

const app = new Hono<{ Bindings: Env }>()

app.use('*', corsMiddleware)

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.route('/api/surveys', surveys)
app.route('/api/public', publicRoutes)
app.route('/api/public', uploads)

app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app
