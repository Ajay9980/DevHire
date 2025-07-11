import userRoutes from './routes/userRoutes'
import taskRoutes from './routes/taskRoutes'
import paymentRoutes from './routes/paymentRoutes'
import taskSubmissionRoutes from './routes/taskSubmissionRoutes'
import bidRoutes from './routes/bidRoutes'
import rewriteRoutes from './routes/rewriteRoutes'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
const app = express()
 
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}))
 


app.use('/api/user',userRoutes)
app.use('/api/task',taskRoutes)
app.use('/api/tasksubmission',taskSubmissionRoutes)
app.use('/api/bid',bidRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/rewrite', rewriteRoutes)


app.listen(3000,()=>{
    console.log('server is running on http://localhost:3000')
})