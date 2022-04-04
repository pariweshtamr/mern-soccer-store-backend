import express from 'express'
import { isUser } from '../middlewares/auth.middleware.js'
const cartRouter = express.Router()

cartRouter.get('/', isUser, async (req, res) => {
  res.status(200)
})

export default cartRouter
