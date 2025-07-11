import express from 'express'
import { userMiddleware } from '../middlewares/userMiddleware'
import { getFileUrl, uploadTaskFile } from '../controllers/taskSubmissionController'
import { upload } from '../middlewares/multerMiddleware'

const router = express.Router()

router.post('/upload/task/:id',userMiddleware,upload,uploadTaskFile)
router.get('/getfileurl/:id',getFileUrl)

export default router