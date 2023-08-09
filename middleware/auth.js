const jwt = require('jsonwebtoken')
const userModel = require('../models/User.model')

const getToken = req => {
  const JWT_KEY = process.env.JWT_KEY_NAME
  // try reading JWT from headers
  const requestJWTHeader = req.headers[JWT_KEY]
  if (requestJWTHeader) return requestJWTHeader

  // try reading JWT from cookies
  const requestJWTCookie = req.cookies[JWT_KEY]
  if (requestJWTCookie) return requestJWTCookie
}

const auth = async (req, res, next) => {
  try {
    const token = getToken(req)

    // in case no token, send 401
    if (!token) {
      res.status(401).send('unauthorized access')
      return
    }

    // in case no payload, send 401
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    if (!payload) {
      res.status(401).send('unauthorized access')
      return
    }

    // destructure email from payload
    const { email } = payload

    // verify the email exists in our DB
    const user = await userModel.findOne({ email }).exec()

    // verify the user exists
    if (!user) {
      res.status(401).send('unauthorized access')
      return
    }

    // inject the user object into the request object
    if (!req.loggedInUser) {
      Object.defineProperty(req, 'loggedInUser', {
        value: user,
        writable: false
      })
    } else {
      throw new Error('loggedInUser property already exist')
    }
    next()
  } catch (authError) {
    res.status(500).send(authError.message)
  }
}

const adminAuth = (req, res, next) => {
  if (!req.loggedInUser.isAdmin) {
    res
      .status(401)
      .send(
        'unauthorized access, contact your system administrator if you need access to this resource'
      )
    return
  }

  next()
}

module.exports = { auth, adminAuth }
