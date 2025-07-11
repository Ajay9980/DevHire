import express from 'express'
import { createPaymentOrder, getUserPayment, verifyPayment } from '../controllers/paymentController'
import { userMiddleware } from '../middlewares/userMiddleware'


const router = express.Router()

router.post('/createpayment',createPaymentOrder)
router.post('/verifypayment',verifyPayment)
router.get('/getuserpayment',userMiddleware,getUserPayment)

export default router