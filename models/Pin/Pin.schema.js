import mongoose from 'mongoose'

const PinSchema = mongoose.Schema(
  {
    pin: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'emailValidation',
    },
  },
  {
    timestamps: true,
  },
)

const Pin = mongoose.model('Pin', PinSchema)
export default Pin
