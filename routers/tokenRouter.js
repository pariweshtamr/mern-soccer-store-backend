import express from 'express'
import { sendPasswordResetOtp } from '../helpers/email.helper.js'
import { verifyRefreshJWT, createAccessJWT } from '../helpers/jwt.helper.js'
import { createUniqueOtp } from '../models/Pin/Pin.model.js'
import {
  getUserByEmail,
  getUserByUsernameAndRefreshToken,
} from '../models/User/User.model.js'
const tokenRouter = express.Router()

tokenRouter.all('/', (req, res, next) => {
  next()
})

tokenRouter.get('/', async (req, res) => {
  try {
    const { authorization } = req.headers

    // check if the token is valid
    const { username } = verifyRefreshJWT(authorization)

    // get the userInfo
    if (username) {
      // get user id from db by username
      const filter = {
        username,
        refreshJWT: authorization,
      }
      const user = await getUserByUsernameAndRefreshToken(filter)

      // create accessJWT and store in db
      if (user?._id) {
        const accessJWT = await createAccessJWT({ _id: user._id, username })

        // return the new accessJWT
        return res.json({
          accessJWT,
        })
      }
    }
    res.status(401).json({
      status: 'error',
      message: 'Unauthenticated',
    })
  } catch (error) {
    console.log(error)
    res.status(401).json({
      status: 'error',
      message: 'Unauthenticated',
    })
  }
})

// request OTP for resetting password

tokenRouter.post('/request-otp', async (req, res) => {
  try {
    //get email
    const { email } = req.body

    //get user by email
    if (email) {
      const user = await getUserByEmail(email)

      if (user?._id) {
        // create otp and store in db along with user id
        const result = await createUniqueOtp({
          email,
          type: 'passwordResetOtp',
        })

        if (!result?._id) {
          return res.json({
            status: 'error',
            message: 'Please try again later.',
          })
        }

        // send email with otp to client
        const emailObj = {
          email,
          otp: result.pin,
          firstName: user.firstName,
        }
        sendPasswordResetOtp(emailObj)
      }
    }

    res.json({
      status: 'success',
      message:
        'We have sent you an OTP in your email address. The OTP will expire in 10 minutes.',
    })
  } catch (error) {
    console.log(error)
    res.json({
      status: 'error',
      message: 'Error. Unable to process your request.',
    })
  }
})

export default tokenRouter
