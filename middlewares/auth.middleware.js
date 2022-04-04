import { verifyAccessJWT } from '../helpers/jwt.helper.js'
import { getSession } from '../models/Session/Session.model.js'
import { getUserById } from '../models/User/User.model.js'

export const isUser = async (req, res, next) => {
  try {
    const { authorization } = req.headers

    if (authorization) {
      //validate the accessJWT
      const decoded = verifyAccessJWT(authorization)

      if (decoded === 'jwt expired') {
        return res.status(403).json({
          status: 'error',
          message: 'jwt expired',
        })
      }
      const session = decoded?.username
        ? await getSession({ token: authorization })
        : null

      if (session?._id) {
        const user = await getUserById(session.userId)

        if (user?.isAdmin === false) {
          req.user = user
          // req.user.password = undefined
          // req.user.refreshJWT = undefined;

          next()
          return
        }
      }
    }
    return res.status(401).json({
      status: 'error',
      message: 'Unauthenticated. Please log in again.',
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Server error.',
    })
  }
}
