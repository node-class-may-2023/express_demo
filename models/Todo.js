const mongoose = require('mongoose')

// create schema

const todoSchema = new mongoose.Schema({
  todoText: {
    type: String,
    minLength: 3,
    maxLength: 512,
    required: [true, 'todo text is required']
  },
  isComplete: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId
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

// create model from schema

const Todo = mongoose.model('Todo', todoSchema)

module.exports = Todo
