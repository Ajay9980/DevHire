import express from 'express'
import { getUserById, signin, signout, signup, uploadUserImg } from '../controllers/userController'
import { userMiddleware } from '../middlewares/userMiddleware'
import { upload } from '../middlewares/multerMiddleware'

const router = express.Router()

router.post('/signup',upload,signup)
router.post('/signin',signin)
router.post('/signout',signout)
router.get('/user', userMiddleware,getUserById)
router.post('/uploadimg',userMiddleware,upload,uploadUserImg)

export default router;