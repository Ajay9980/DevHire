import express from 'express'
import { rewrite } from '../controllers/rewriteController'
const router = express.Router()


router.post('/rewrite',rewrite)

export default router