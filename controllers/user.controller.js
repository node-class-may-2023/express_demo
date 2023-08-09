const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userModel = require('../models/User.model')
const { validateCreateUser } = require('../validators/user.validator')

const register = async (req, res) => {
  try {
    // destructure the email and password
    const { email, password, isAdmin } = req.body

    // in case email or password is missing, return 422
    if (!email || !password) {
      res.status(422).send('wrong email or password')
      return
    }

    // in case of existing user by email, return 400
    const existingUsers = await userModel.find({ email })
    if (existingUsers.length) {
      res.status(400).send('You can not use this email')
      return
    }

    // use bcrypt to hash the password
    const passwordHash = await bcrypt.hash(password, 10)

    // validate user
    const { error } = validateCreateUser({ email, password })
    if (error) {
      res.status(400).send('wrong email or password')
      return
    }

    // create the user in DB
    await userModel.create({ email, passwordHash, isAdmin })

    res.send('user registration completed')
  } catch (userRegisterError) {
    res.status(500).send(userRegisterError.message)
  }
}

const login = async (req, res) => {
  try {
    // destructure the email, and password
    const { email, password } = req.body

    // in case of no email or password
    if (!email || !password) {
      res.status(422).send('wrong email or password')
      return
    }

    // check if user exists
    const user = await userModel.findOne({ email }).exec()
    if (!user) {
      res.status(401).send('incorrect email or password')
      return
    }

    // check if the password is valid
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      res.status(401).send('incorrect email or password')
      return
    }

    // issue token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY
    })

    const JWT_KEY = process.env.JWT_KEY_NAME

    // TODO: retest cookies with template engines
    res
      .header({ [JWT_KEY]: token })
      // .cookie({ [JWT_KEY]: token })
      .send('access granted')
  } catch (userLoginError) {
    res.status(500).send(userLoginError.message)
  }
}

module.exports = {
  register,
  login
}
