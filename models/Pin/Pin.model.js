import Pin from "./Pin.schema.js"
import RandomNumberGenerator from "../../utils/RandomNumberGenerator.js"

//creating a unique email validation info
const pinLength = 6
export const createUniqueEmailConfirmation = async (email) => {
  try {
    // generate random 6 digit numbers
    const pin = RandomNumberGenerator(pinLength)

    if (!pin || !email) {
      return false
    }

    const newEmailValidation = {
      pin,
      email,
    }

    // store pin with email in pin table

    const result = await Pin(newEmailValidation).save()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const createUniqueOtp = async ({ email, type }) => {
  try {
    // generate random 6 digit numbers
    const pin = RandomNumberGenerator(pinLength)

    if (!pin || !email) {
      return false
    }

    const newOtp = {
      pin,
      email,
      type,
    }

    // store pin with email in pin table

    const result = await Pin(newOtp).save()
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const findUserEmailVerification = async (filterObj) => {
  try {
    const result = await Pin.findOne({ filterObj }) //{pin, email}
    return result

    // store pin with email in Pin table
  } catch (error) {
    throw new Error(error)
  }
}

export const deleteInfo = async (filterObj) => {
  try {
    const result = await Pin.findOneAndDelete(filterObj)
    return result
  } catch (error) {
    throw new Error(error)
  }
}
