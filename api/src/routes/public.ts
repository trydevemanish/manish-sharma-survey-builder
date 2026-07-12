import { Hono, type Context } from 'hono'
import { PublicSurveyController } from '../controllers/publicSurveyController'
import { D1PublicSurveyRepository } from '../repository/publicSurveyRepository'
import { PublicSurveyService } from '../service/publicSurveyService'

const publicRoutes = new Hono<{ Bindings: Env }>()

const createController = (c: Context<{ Bindings: Env }>) => {
  const repository = new D1PublicSurveyRepository(c.env.DB)
  const service = new PublicSurveyService(repository)
  return new PublicSurveyController(service)
}

publicRoutes.get('/surveys/:slug', async (c) => {
  const controller = createController(c)
  return controller.getSurvey(c)
})

publicRoutes.post('/surveys/:slug/responses', async (c) => {
  const controller = createController(c)
  return controller.submitResponse(c)
})

export default publicRoutes
