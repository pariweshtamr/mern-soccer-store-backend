import express from 'express'
import { comparePassword, hashPassword } from '../helpers/bcrypt.helper.js'
import {
  sendEmailVerificationConfirmation,
  sendEmailVerificationLink,
  sendPasswordUpdateNotification,
} from '../helpers/email.helper.js'
import { getJWTs } from '../helpers/jwt.helper.js'
import { isUser } from '../middlewares/auth.middleware.js'
import {
  createUserValidation,
  forgotPasswordResetFormValidation,
  loginUserFormValidation,
  passwordUpdateFormValidation,
  userEmailVerificationValidation,
} from '../middlewares/formValidation.middleware.js'
import {
  createUniqueEmailConfirmation,
  deleteInfo,
  findUserEmailVerification,
} from '../models/Pin/Pin.model.js'
import { removeSession } from '../models/Session/Session.model.js'
import {
  createUser,
  getUserByUsername,
  removeRefreshJWT,
  verifyEmail,
  updateUserProfile,
  updateUserProfileByEmail,
} from '../models/User/User.model.js'

const userRouter = express.Router()

// CREATE NEW USER
userRouter.post('/register', createUserValidation, async (req, res) => {
  try {
    //encrypt password
    const hashPass = hashPassword(req.body.password)

    if (hashPass) {
      req.body.password = hashPass

      const { _id, firstName, email } = await createUser(req.body)

      // ======================= Commented for deployment purpose ============================== //
      // if (_id) {
      //   // create unique activation link
      //   const { pin } = await createUniqueEmailConfirmation(email)

      //   if (pin) {
      //     // email the link to the new user email
      //     const forSendingEmail = {
      //       firstName,
      //       email,
      //       pin,
      //     }
      //     sendEmailVerificationLink(forSendingEmail)
      //   }

      // }

      // ======================================================================================= //

      return res.json({
        status: 'success',
        message:
          'New user has been successfully created. You will be navigated to the login page shortly...',
        // We have sent an email confirmation to your email, please check and follow the instructions to verify and activate your account',
      })
    }
    res.json({
      status: 'error',
      message: 'Unable to create new user. Please try again later',
    })
  } catch (error) {
    let msg = 'Error, Unable to create new user'
    console.log(error.message)
    if (error.message.includes('E11000 duplicate key error collection')) {
      msg = 'Error, an account already exists for this email address'
    }
    res.json({
      status: 'error',
      message: 'Unable to create new user',
    })
  }
})

// ======================= Commented for deployment purpose ============================== //

//email verification
// userRouter.patch(
//   '/email-verification',
//   userEmailVerificationValidation,
//   async (req, res) => {
//     try {
//       const result = await findUserEmailVerification(req.body)

//       if (result?._id) {
//         //information is valid now we can update the user
//         const data = await verifyEmail(result.email)
//         console.log(data)
//         if (data?._id) {
//           // delete the pin info
//           deleteInfo(req.body)

//           // send email confirmation to user
//           sendEmailVerificationConfirmation({
//             firstName: data.firstName,
//             email: data.email,
//           })

//           return res.json({
//             status: 'success',
//             message: 'Your email has been verified. You may now log in.',
//           })
//         }
//       }
//       res.json({
//         status: 'error',
//         message:
//           'Unable to verify your email. The link is either invalid or expired.',
//       })
//     } catch (error) {
//       console.log(error)
//       res.json({
//         status: 'error',
//         message: 'Error, Unable to verify the email. Please try again later.',
//       })
//     }
//   },
// )

// ================================================================================================ //

//USER LOGIN
userRouter.post('/login', loginUserFormValidation, async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await getUserByUsername(username)

    if (user?._id) {
      // Check if password is valid or not

      const isPasswordMatch = comparePassword(password, user.password)

      if (isPasswordMatch) {
        // GET JWTs tHEN SEND TO CLIENT
        const jwts = await getJWTs({ _id: user._id, username: user.username })
        user.password = undefined

        return res.json({
          status: 'success',
          messsage: 'Login successful',
          jwts,
          user,
        })
      }
    }
    res.status(401).json({
      status: 'error',
      messsage: 'Unauthorized',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Error, unable to login at the moment. Please try again later',
    })
  }
})

// user logout
userRouter.post('/logout', async (req, res) => {
  try {
    const { accessJWT, refreshJWT } = req.body
    accessJWT && (await removeSession(accessJWT))
    refreshJWT && (await removeRefreshJWT(refreshJWT))

    res.json({
      status: 'success',
      message: 'Logging out...',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      status: 'error',
      message: 'Error, unable to Logout, Please try again later.',
    })
  }
})

// Get user info
userRouter.get('/', isUser, (req, res) => {
  req.user.password = undefined
  req.user.refreshJWT = undefined
  res.json({
    status: 'success',
    message: 'User Profile',
    user: req.user,
  })
})

// Update User info
userRouter.patch('/', isUser, async (req, res) => {
  try {
    const { _id } = req.user
    console.log(_id, req.body)

    if (_id) {
      const result = await updateUserProfile(_id, req.body)

      if (result?._id) {
        return res.json({
          status: 'success',
          message: 'Your profile has been updated successfully',
        })
      }
    }

    return res.json({
      status: 'error',
      message: 'Unable to update user information. Please try again later.',
    })
  } catch (error) {
    console.log(error)
    return res.json({
      status: 'error',
      message: 'Unable to update user information. Please try again later.',
    })
  }
})

// Update password when logged in
userRouter.post(
  '/password-update',
  isUser,
  passwordUpdateFormValidation,
  async (req, res) => {
    try {
      const { _id, password, firstName, email } = req.user
      const { currentPassword } = req.body
      console.log(req.body)
      //make sure the current password matches the onse in the database
      const passMatched = comparePassword(currentPassword, password)
      if (passMatched) {
        // if matched, then encrypt the new password and store in db
        const hashedPass = hashPassword(req.body.password)
        if (hashedPass) {
          //update user table
          const user = await updateUserProfile(_id, { password: hashedPass })
          if (user._id) {
            res.json({
              status: 'success',
              message: 'Password updated successfully',
            })
            // send email notification
            sendPasswordUpdateNotification({ firstName, email })
            return
          }
        }
      }
      res.json({
        status: 'error',
        message: 'Unable to update password. Please try again later.',
      })
    } catch (error) {
      res.json({
        status: 'error',
        message: 'Error, unable to process your request.',
      })
    }
  },
)

// reset forgotten password when logged out
userRouter.post(
  '/reset-password',
  forgotPasswordResetFormValidation,
  async (req, res) => {
    try {
      const { otp, password, firstName, email } = req.body

      //validate if otp and email exists in db
      const filter = { pin: otp, email }
      const hasOtp = await findUserEmailVerification(filter)

      if (hasOtp?._id) {
        // encrypt new password coming from frontend
        const hashPass = hashPassword(password)
        if (hashPass) {
          //update user table with the new password
          const user = await updateUserProfileByEmail(email, {
            password: hashPass,
          })
          if (user._id) {
            res.json({
              status: 'success',
              message: 'Password updated successfully',
            })
            // send email notification
            sendPasswordUpdateNotification({ email })

            //don't forget to delete the otp set from db
            deleteInfo(filter)

            return
          }
        }
      }
      res.json({
        status: 'error',
        message: 'Unable to reset password. Please try again later.',
      })
    } catch (error) {
      res.json({
        status: 'error',
        message: 'Error, unable to process your request.',
      })
    }
  },
)

export default userRouter
