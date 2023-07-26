const Joi = require('joi');

/**
 * It validates the data schema of a product
 *
 * @param {object} product
 * @property {string} product.name
 * @property {string} product.size
 * @property {string} product.color
 * @returns {object}
 */
const validateCreateProduct = product => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(512).required(),
    size: Joi.string().valid('large', 'medium', 'small'),
    color: Joi.string().required()
  });

  return schema.validate(product);
};

/**
 * It validates the data schema of a product
 *
 * @param {object} product
 * @property {string} product.name
 * @property {string} product.size
 * @property {string} product.color
 * @returns {object}
 */
const validateUpdateProduct = product => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(512),
    size: Joi.string().valid('large', 'medium', 'small'),
    color: Joi.string()
  });

  return schema.validate(product);
};

module.exports = { validateCreateProduct, validateUpdateProduct };
