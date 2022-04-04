import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
    },
    size: {
      type: Array,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Number,
      default: true,
    },
    numReviews: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

const Product = mongoose.model('Product', ProductSchema)
export default Product
