const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'user email is required'],
    unique: true,
    minLength: 5,
    maxLength: 128,
    match: [/^\S+@\S+$/g, 'invalid email format']
    // regex - someCharacters@someOtherCharacters
  },
  passwordHash: {
    type: String,
    required: [true, 'password is required'],
    minLength: 4,
    maxLength: 128
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdOn: {
    type: Date,
    default: Date.now
  },
  updatedOn: {
    type: Date,
    default: Date.now
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User
