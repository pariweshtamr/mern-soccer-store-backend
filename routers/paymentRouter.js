import express from 'express'
import Stripe from 'stripe'

const paymentRouter = express.Router()

const stripe = Stripe(
  'sk_test_51KShxEIHP3y9z5gN3jl9bAn6dhZAFwZVKqjawzAtfGpwdCRRRBGh5lErkFwkS79XsYjZ8zKqq9hLAKQhMp6wi4Fe00i6Uxq9S6',
)

paymentRouter.post('/create', async (req, res) => {
  try {
    const { amount } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      description: 'Soccer Boot Store.',
      amount,
      currency: 'aud',
    })

    res.status(200).send(paymentIntent.client_secret)
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message,
    })
  }
})

export default paymentRouter
