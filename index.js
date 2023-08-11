require('dotenv').config()
require('./db')
const express = require('express')
crypto = require('node:crypto')
const _ = require('lodash')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const {
  validateCreateProduct,
  validateUpdateProduct
} = require('./validateProduct')

const { auth, adminAuth } = require('./middleware/auth')

const data = require('./mockData.json')
const { default: mongoose } = require('mongoose')

const { register, login } = require('./controllers/user.controller')
const {
  createTodo,
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
app.use(cookieParser())

app.post('/api/v1/users/register', register)
app.post('/api/v1/users/login', login)

app.get('/', (req, res) => {
  res.render('index', { name: 'John', age: 10 })
})

// app.use(auth)

app.post('/api/v1/todos', createTodo)

app.get('/api/v1/todos', getTodos)

app.get('/api/v1/todos/admin', adminAuth, getAllTodos)

app.patch('/api/v1/todos/:id', updateTodo)

app.delete('/api/v1/todos/:id', deleteTodo)

app.get('/api/v1/todos/:id', getTodo)

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
