require('dotenv').config()
require('./db')
const express = require('express')
crypto = require('node:crypto')
const _ = require('lodash')
const cors = require('cors')
const {
  validateCreateProduct,
  validateUpdateProduct
} = require('./validateProduct')
const { validateCreateTodo, validateUpdateTodo } = require('./Validators')

const data = require('./mockData.json')
const { default: mongoose } = require('mongoose')

const todoModel = require('./models/Todo')
const app = express()
const PORT = process.env.PORT

// route, endpoint, path

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello')
})

app.post('/api/v1/todos', async (req, res) => {
  try {
    const { body: todo } = req
    const { error, value } = validateCreateTodo(todo)

    if (error) {
      res.status(400).send(error)
      return
    }

    const newTodo = await todoModel.create(value)
    res.send(newTodo)
  } catch (dbErr) {
    res.status(500).send('server error, try again later')
  }
})

app.get('/api/v1/todos', async (req, res) => {
  try {
    const todoList = await todoModel.find()
    res.send(todoList)
  } catch (err) {
    res.status(500).send('Server error try again later')
  }
})

app.patch('/api/v1/todos/:id', async (req, res) => {
  try {
    // destructure the id from the request params
    const { id } = req.params

    // get the todo by id

    const todo = await todoModel.find({ _id: id }).exec()
    if (!todo.length) {
      // if the todo doesn't exist? 404 - NOT FOUND
      res.status(404).send('Not Found')
      return
    }

    // if the todo is found?
    // validate the data to be updated
    const { error, value } = validateUpdateTodo(req.body)
    // validation fails? 400 - Bad Request
    if (error) {
      res.status(400).send('Bad Request')
      return
    }
    // validation pass? update the record (data)
    await todoModel.updateOne({ _id: id }, value)
    const updatedTodo = await todoModel.findById(id)
    // res 200 + the new data
    res.send(updatedTodo)
  } catch (error) {
    res.status(500).send('Server Error')
  }
})

app.delete('/api/v1/todos/:id', async (req, res) => {
  try {
    // destructure the id from the request params : id=1
    const { id } = req.params
    // find if the todo record with the id exists
    const todo = await todoModel.find({ _id: id }).exec()
    if (!todo.length) {
      // if the todo doesn't exist? 404 - NOT FOUND
      res.status(404).send('Not Found')
      return
    }
    // if the todo exist
    // delete the todo from the data set
    await todoModel.deleteOne({ _id: id })
    // return the rest of the todo list, and status 200
    res.send(todo?.[0])
  } catch (deleteError) {
    res.status(500).send('Server Error')
  }
})

// query params
// route param
app.get('/api/v1/todos/:id', async (req, res) => {
  try {
    // extract (destructure) the id from the route parameters
    const { id } = req.params

    // find that id in the todo list
    const todo = await todoModel.find({ _id: id }).exec()
    if (!todo.length) {
      // if the todo doesn't exist? 404 - NOT FOUND
      res.status(404).send('Not Found')
      return
    }

    // if there id is found, return the found todo
    res.send(todo?.[0])
  } catch (findOneError) {
    res.status(500).send('Server Error')
  }
})

// catch all endpoint
app.get('*', (req, res) => {
  res
    .status(404)
    .send(
      '<html><body><p>Sorry Page Not Found. <a href="/">Home</a></p></body></html>'
    )
})

mongoose.connection.once('open', () => {
  app.listen(PORT, () => {
    console.log(`server started on port ${PORT}`)
  })
  console.log('DB connection established')
})
