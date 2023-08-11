require('dotenv').config()
require('./db')
const express = require('express')
crypto = require('node:crypto')
const _ = require('lodash')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const {
  validateCreateProduct,
  validateUpdateProduct
} = require('./validateProduct')

const { auth, adminAuth } = require('./middleware/auth')

const data = require('./mockData.json')
const { default: mongoose } = require('mongoose')

const { register, login, submit } = require('./controllers/user.controller')
const {
  createTodo,
  createTodoPage,
  getTodos,
  updateTodo,
  deleteTodo,
  getTodo,
  getAllTodos
} = require('./controllers/todo.controller')
const app = express()
const PORT = process.env.PORT

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

app.post('/api/v1/users/register', register)
app.post('/api/v1/users/login', login)

app.get('/', (req, res) => {
  // any logic to to figure out if the user is logged
  res.render('index', { name: 'John', age: 10, isLoggedIn: false })
})

app.get('/users/login', (req, res) => {
  res.render('submit', { errors: {}, isLoggedIn: false })
})
app.post('/users/login', submit)

app.use(auth)

app.get('/todos', (req, res) => {
  res.render('create-todo', { isLoggedIn: true })
})
app.post('/todos', createTodoPage)

app.post('/api/v1/todos', createTodo)

app.get('/api/v1/todos', getTodos)

app.get('/api/v1/todos/admin', adminAuth, getAllTodos)

app.patch('/api/v1/todos/:id', updateTodo)

app.delete('/api/v1/todos/:id', deleteTodo)

app.get('/api/v1/todos/:id', getTodo)

app.post('/logout', (req, res) => {
  const JWT_KEY = process.env.JWT_KEY_NAME
  res.cookie([JWT_KEY], '').redirect('/users/login')
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
