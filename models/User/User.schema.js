import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 30,
    },
    lastName: {
      type: String,
      required: true,
      max: 30,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      max: 50,
      unique: true,
      index: 1,
    },
    isEmailConfirmed: {
      type: Boolean,
      required: true,
      default: false,
    },
    password: {
      type: String,
      required: true,
      min: 7,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    refreshJWT: {
      type: String,
      default: '',
    },
    Orders: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Order',
      },
    ],
  },
  {
    timestamps: true,
  },
)

const User = mongoose.model('User', UserSchema)
export default User
