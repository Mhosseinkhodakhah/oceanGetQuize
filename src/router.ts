import { Router } from 'express'
import contentController from './controler'
import middleWare from './middleware/middleware'
import { lessonRole, subLessonRole } from './validators'

const controller = new contentController()
const auth = new middleWare().auth

const router = Router()

router.get('/get-levels' , auth , controller.getLevels)

router.get('/open-level/:levelId' , auth , controller.openLevel)

export default router;