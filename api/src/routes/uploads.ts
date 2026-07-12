import { Hono, type Context } from 'hono'
import { UploadController } from '../controllers/uploadController'
import { D1UploadRepository } from '../repository/uploadRepository'
import { UploadService } from '../service/uploadService'

const uploads = new Hono<{ Bindings: Env }>()

const createController = (c: Context<{ Bindings: Env }>) => {
  const repository = new D1UploadRepository(c.env.DB)
  const service = new UploadService(repository)
  return new UploadController(service)
}

uploads.post('/surveys/:slug/upload', async (c) => createController(c).uploadFile(c))

export default uploads