import Joi from 'joi'

const shortstr = Joi.string().max(30).alphanum().required()
const email = Joi.string()
  .max(50)
  .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'au'] } })
  .required()
const password = Joi.string().min(7).max(30).required()

export const createUserValidation = (req, res, next) => {
  //server validation
  const schema = Joi.object({
    firstName: shortstr,
    lastName: shortstr,
    username: shortstr,
    email: email,
    password: password,
  })

  const value = schema.validate(req.body)
  console.log(value)

  if (value.error) {
    return res.json({
      status: 'error',
      message: value.error.message,
    })
  }
  next()
}

export const userEmailVerificationValidation = (req, res, next) => {
  const schema = Joi.object({
    email: email,
    pin: Joi.string().min(6).required(),
  })

  const value = schema.validate(req.body)
  console.log(value)

  if (value.error) {
    return res.json({
      status: 'error',
      message: value.error.message,
    })
  }
  next()
}

export const loginUserFormValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      username: shortstr,
      password: password,
    })

    const { error } = schema.validate(req.body)

    if (error) {
      return res.json({
        status: 'error',
        message: error.message,
      })
    }

    next()
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Error, Unable to process your request. Please try again later.',
    })
  }
}

export const passwordUpdateFormValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      currentPassword: password,
      password,
    })
    const { error } = schema.validate(req.body)
    if (error) {
      return res.json({
        status: 'error',
        message: error.message,
      })
    }
    next()
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Error, Unable to process your request. Please try again later.',
    })
  }
}

export const forgotPasswordResetFormValidation = (req, res, next) => {
  try {
    const schema = Joi.object({
      otp: shortstr,
      email: email,
      password: password,
    })
    const { error } = schema.validate(req.body)
    if (error) {
      return res.json({
        status: 'error',
        message: error.message,
      })
    }
    next()
  } catch (error) {
    res.json({
      status: 'error',
      message: 'Error, Unable to process your request. Please try again later.',
    })
  }
}
