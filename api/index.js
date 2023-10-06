import express, { json } from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRouter from './routes/user.js'
import authRouter from './routes/auth.js'

dotenv.config()

mongoose.connect(process.env.MONGO)
    .then(() => console.log('Connect to MongoDb'))
    .catch(err => console.log(err))

const app = express()

app.use(json())

app.listen(3000, () => console.log('Server running at port 3000'))

app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const errorMessage = err.message || 'Internal server error'

    return res.status(statusCode).json({
        success: false,
        statusCode,
        errorMessage
    })
})