import express from 'express'
import { userMiddleware } from '../middlewares/userMiddleware'
import { acceptBid, createBid, getBids, getBidsByTaskId } from '../controllers/bidController'

const router = express.Router()

router.post('/bid/:id',userMiddleware,createBid)
router.post('/acceptbid/task/:id',userMiddleware,acceptBid)
router.get('/bid/:id', userMiddleware , getBids)
router.get('/bidbytaskid/:id',userMiddleware, getBidsByTaskId)

export default router