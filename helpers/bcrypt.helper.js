import bcrypt from 'bcryptjs'

const saltRounds = 10

export const hashPassword = (plainPassword) => {
  return bcrypt.hashSync(plainPassword, saltRounds)
}

export const comparePassword = (plainPassword, hashPasswordFromDB) => {
  return bcrypt.compareSync(plainPassword, hashPasswordFromDB)
}
