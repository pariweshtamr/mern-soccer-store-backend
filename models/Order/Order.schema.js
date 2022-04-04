import mongoose from 'mongoose'
const Schema = mongoose.Schema

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    cartItems: [
      {
        name: { type: String },
        productQuantity: { type: Number },
        image: { type: String },
        price: { type: String },
        numReviews: { type: String },
        description: { type: String },
        inStock: { type: Number },
      },
    ],
    totalAmount: { type: Number },
    totalQuantity: { type: Number },
    shippingAddress: {
      address: { type: String },
      city: { type: String },
      postalCode: { type: Number },
      country: { type: String },
    },
    paymentMethod: {
      type: String,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      emailAddress: { type: String },
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
)

const Order = mongoose.model('Order', OrderSchema)
export default Order
