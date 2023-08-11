const {
  validateCreateTodo,
  validateUpdateTodo
} = require('../validators/todo.validator')
const todoModel = require('../models/Todo')

const createTodo = async (req, res) => {
  try {
    // destructure request body (JSON)
    const { body: todo } = req

    // validate request body
    const { error, value } = validateCreateTodo(todo)

    // in case of invalid data, respond with 400
    if (error) {
      res.status(400).send(error)
      return
    }

    // get the logged in user id
    const userId = req?.loggedInUser?._id

    // in case of valid data, create new document (record)
    const newTodo = await todoModel.create({ ...value, userId })

    // send response with newly created record (incl. id)
    res.send(newTodo)
  } catch (dbErr) {
    // in case of unexpected error, respond with 500
    res.status(500).send(dbErr.message)
  }
}

const createTodoPage = async (req, res) => {
  try {
    // destructure request body (JSON)
    const { body: todo } = req

    // validate request body
    const { error, value } = validateCreateTodo(todo)

    // in case of invalid data, respond with 400
    if (error) {
      res.status(400).render('error', { error })
      return
    }

    // get the logged in user id
    const userId = req?.loggedInUser?._id

    // in case of valid data, create new document (record)
    const newTodo = await todoModel.create({ ...value, userId })

    // send response with newly created record (incl. id)
    res.send('successfully created')
  } catch (dbErr) {
    // in case of unexpected error, respond with 500
    res.status(500).render('error', { error: dbErr.message })
  }
}

const getTodos = async (req, res) => {
  try {
    // destructure filter params
    const { limit = 5 } = req.query

    const userId = req?.loggedInUser?._id

    // read records with filters applied
    const todoList = await todoModel.find({ userId }).limit(limit)

    // send read record
    // res.send(todoList)
    res.render('index', { items: todoList })
  } catch (err) {
    // in case of unexpected error, respond with 500
    res.status(500).send('Server error try again later')
  }
}

const getAllTodos = async (req, res) => {
  try {
    // destructure filter params
    const { limit = 5 } = req.query

    // read records with filters applied
    const todoList = await todoModel.find().limit(limit)

    // send read record
    res.send(todoList)
  } catch (err) {
    // in case of unexpected error, respond with 500
    res.status(500).send('Server error try again later')
  }
}

const updateTodo = async (req, res) => {
  try {
    // destructure the id from the request params
    const { id } = req.params

    const userId = req?.loggedInUser?._id

    // get the todo by id
    const todo = await todoModel.findOne({ _id: id, userId }).exec()

    // in case the todo doesn't exist, respond with 404 - NOT FOUND
    if (!todo) {
      res.status(404).send('Not Found')
      return
    }

    // in case todo is found, proceed
    // validate the data to be updated
    const { error, value } = validateUpdateTodo(req.body)

    // validation fails? 400 - Bad Request
    if (error) {
      res.status(400).send('Bad Request')
      return
    }

    // validation pass?
    // update the record (data)
    await todoModel.updateOne({ _id: id }, value)
    const updatedTodo = await todoModel.findById(id)

    // res 200 + the new data
    res.send(updatedTodo)
  } catch (error) {
    // in case of unexpected error, respond with 500
    res.status(500).send('Server Error')
  }
}

const deleteTodo = async (req, res) => {
  try {
    // destructure the id from the request params : id=1
    const { id } = req.params

    const userId = req?.loggedInUser?._id

    // find if the todo record with the id exists
    const todo = await todoModel.findOne({ _id: id, userId }).exec()

    // if the todo doesn't exist? 404 - NOT FOUND
    if (!todo) {
      res.status(404).send('Not Found')
      return
    }

    // if the todo exist
    // delete the todo from the data set
    await todoModel.deleteOne({ _id: id })
    // return the rest of the todo list, and status 200
    res.send(todo)
  } catch (deleteError) {
    // in case of unexpected error, respond with 500
    res.status(500).send('Server Error')
  }
}

const getTodo = async (req, res) => {
  try {
    // extract (destructure) the id from the route parameters
    const { id } = req.params

    const userId = req?.loggedInUser?._id

    // find that id in the todo list
    const todo = await todoModel.findOne({ _id: id, userId }).exec()
    if (!todo) {
      // if the todo doesn't exist? 404 - NOT FOUND
      res.status(404).send('Not Found')
      return
    }

    // if there id is found, return the found todo
    res.send(todo)
  } catch (findOneError) {
    // in case of unexpected error respond with 500 - SERVER ERROR
    res.status(500).send('Server Error')
  }
}

module.exports = {
  createTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getTodo,
  getAllTodos,
  createTodoPage
}
