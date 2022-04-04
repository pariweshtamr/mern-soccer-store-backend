import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()

import cors from 'cors'
import helmet from 'helmet'

const PORT = process.env.PORT || 8000

// Connect MongoDB
import mongoClient from './config/db.js'
mongoClient()

//Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())

//IMPORT ROUTERS
import userRouter from './routers/userRouter.js'
import categoryRouter from './routers/categoryRouter.js'
import productRouter from './routers/productRouter.js'
import cartRouter from './routers/cartRouter.js'
import tokenRouter from './routers/tokenRouter.js'
import paymentRouter from './routers/paymentRouter.js'
import orderRouter from './routers/orderRouter.js'

// USE ROUTERS
app.use('/user', userRouter)
app.use('/category', categoryRouter)
app.use('/products', productRouter)
app.use('/cart', cartRouter)
app.use('/token', tokenRouter)
app.use('/payment', paymentRouter)
app.use('/order', orderRouter)

app.use('/', (req, res) => {
  res.json({ message: 'Server is ready' })
})

app.listen(PORT, (error) => {
  if (error) {
    return console.log(error)
  }
  console.log(`Backend server is running at ${PORT}`)
})
