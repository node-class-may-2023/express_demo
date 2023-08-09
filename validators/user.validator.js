const Joi = require('joi')

const validateCreateUser = user => {
  // const pattern = /^\S+@\S+$/g
  const schema = Joi.object({
    email: Joi.string()
      .min(4)
      .max(128)
      //.regex(new RegExp(pattern))
      .required(),
    password: Joi.string().min(4).max(128).required(),
    isAdmin: Joi.bool()
  })

  return schema.validate(user)
}

module.exports = {
  validateCreateUser
}
