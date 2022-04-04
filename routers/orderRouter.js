import express from 'express'
import { isUser } from '../middlewares/auth.middleware.js'
import { getOrderByUser } from '../models/Order/Order.model.js'
import Order from '../models/Order/Order.schema.js'

const orderRouter = express.Router()

// create order

orderRouter.post('/', isUser, async (req, res) => {
  const {
    cartItems,
    totalAmount,
    totalQuantity,
    shippingAddress,
    paymentMethod,
  } = req.body

  const id = req.user
  console.log(id)

  try {
    const order = new Order({
      user: req.user._id,
      shippingAddress,
      cartItems,
      totalAmount,
      totalQuantity,
      paymentMethod,
    })

    const orderCreated = await order.save()
    res.status(200).json({ order: orderCreated })
  } catch (error) {
    console.log(error)
    res.json({ error })
  }
})

// get orders

orderRouter.get('/', isUser, async (req, res) => {
  res.status(200)
})

// get paid orders

orderRouter.get('/paid', isUser, async (req, res) => {
  const user = req.user._id
  try {
    const result = await getOrderByUser(user)
    if (!result) {
      res.json({
        message: 'No orders placed',
      })
    }

    // converting object to array to use filter function
    const values = Object.values(result)
    const paidOrders = values.filter((order) => order.isPaid)

    res.status(200).json({ paidOrders })
  } catch (error) {
    console.log(error)
    res.status(501).json({ message: 'Some error occurred' })
  }
})

// update order status

orderRouter.post('/orderstatus', async (req, res) => {
  const { orderId: id, isPaid } = req.body
  try {
    const orderUpdated = await Order.findByIdAndUpdate(
      id,
      { isPaid },
      { new: true },
    )
    res.status(200).json({ order: orderUpdated })
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: error })
  }
})

export default orderRouter
