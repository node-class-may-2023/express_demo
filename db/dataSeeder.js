require('dotenv').config({ path: '../.env' })
const mongoose = require('mongoose')
const todoModel = require('../models/Todo')
const mockData = require('../mockData.json')

const dbBaseUrl = process.env.DB_URL
const dbPassword = process.env.DB_PASSWORD
const dbName = process.env.DB_NAME

let uri = dbBaseUrl.replace('<password>', dbPassword)

uri = uri.replace('<db-name>', dbName)

const seedDb = async () => {
  try {
    // connect with db
    await mongoose.connect(uri)
    console.log('db connection established')

    if (process.argv[2] === '--override') {
      await todoModel.deleteMany()
    }

    await todoModel.insertMany(mockData)

    // verify the seeded data
    const allData = await todoModel.find().exec()
    if (allData.length >= mockData.length) {
      console.log('seeding completed successfully')
    }
  } catch (err) {
    console.error('mongodb seeding error', err.message)
  } finally {
    await mongoose.connection.close()
    console.log('mongodb connection closed')
  }
}

seedDb()
