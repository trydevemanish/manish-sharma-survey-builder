import { Hono, type Context } from 'hono'
import { SurveyController } from '../controllers/surveyController'
import { D1SurveyRepository } from '../repository/surveyRepository'
import { SurveyService } from '../service/surveyService'
import { type AuthVariables, clerkAuth } from '../middleware/clerk'

const surveys = new Hono<{ Bindings: Env; Variables: AuthVariables }>()

surveys.use('*', clerkAuth)

const createController = (c: Context<{ Bindings: Env; Variables: AuthVariables }>) => {
  const repository = new D1SurveyRepository(c.env.DB)
  const service = new SurveyService(repository)
  return new SurveyController(service)
}

surveys.get('/me', (c) => createController(c).getMe(c))

surveys.get('/', async (c) => createController(c).listSurveys(c))

surveys.post('/', async (c) => createController(c).createSurvey(c))

surveys.get('/:id', async (c) => createController(c).getSurvey(c))

surveys.put('/:id', async (c) => createController(c).updateSurvey(c))

surveys.delete('/:id', async (c) => createController(c).deleteSurvey(c))

surveys.get('/:id/responses', async (c) => createController(c).getResponses(c))

surveys.get('/:id/files', async (c) => createController(c).getFile(c))

export default surveys