import express from "express"
import Stripe from "stripe"

const paymentRouter = express.Router()

paymentRouter.post("/create", async (req, res) => {
  const secret = process.env.STRIPE_KEY
  const stripe = Stripe(secret)
  try {
    const { amount } = req.body
    const paymentIntent = await stripe.paymentIntents.create({
      description: "Soccer Boot Store.",
      amount,
      currency: "aud",
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
