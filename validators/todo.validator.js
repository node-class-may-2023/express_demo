const Joi = require('joi');

/**
 * It validates the data schema of a todo
 *
 * @param {object} todo
 * @property {string} todo.todoText
 * @property {string} todo.isComplete
 * @property {string} todo.createdOn
 * @returns {object}
 */
const validateCreateTodo = todoItem => {
  const schema = Joi.object({
    todoText: Joi.string().min(3).max(512).required(),
    isComplete: Joi.bool(),
    createdOn: Joi.date()
  });

  return schema.validate(todoItem);
};

/**
 * It validates the data schema of a todo
 *
 * @param {object} todo
 * @property {string} todo.todoText
 * @property {string} todo.isComplete
 * @property {string} todo.createdOn
 * @returns {object}
 */
const validateUpdateTodo = todoItem => {
  const schema = Joi.object({
    todoText: Joi.string().min(3).max(512),
    isComplete: Joi.bool(),
    updatedOn: Joi.date()
  });

  return schema.validate(todoItem);
};


module.exports = { validateCreateTodo, validateUpdateTodo }
