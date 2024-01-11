// the packeges and variables needed fo the setup
const request = require('supertest') // this is the code that lets us run our code like postman
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server') // this creates the fake mongodb database that exists on our memory not on atlas
const app  = require('../app') //this is our api application we made with express this is the thing that we are giving to supertest to test
const server = app.listen(8080, () => console.log('Testing on PORT 8080'))
const User = require('../models/user') // this is for us to be able to do crud operation on the user
let mongoServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri(), { useNewUrlParser: true, useUnifiedTopology: true })
})

afterAll(async () => {
  await mongoose.connection.close() // shut off mongoose connection with mongodb
  mongoServer.stop() // this shuts off the database 
  server.close() // this closes the server 
})


describe('Test the users endpoints', () => {
    // users
  test('It should create a new user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body.user.name).toEqual('John Doe')
    expect(response.body.user.email).toEqual('john.doe@example.com')
    expect(response.body).toHaveProperty('token')
  })

  test('It should login a user', async () => {
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
    await user.save()

    const response = await request(app)
      .post('/users/login')
      .send({ email: 'john.doe@example.com', password: 'password123' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body.user.name).toEqual('John Doe')
    expect(response.body.user.email).toEqual('john.doe@example.com')
    expect(response.body).toHaveProperty('token')
  })

  test('It should update a user', async () => {
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
    await user.save()
    const token = await user.generateAuthToken()

    const response = await request(app)
      .put(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Jane Doe', email: 'jane.doe@example.com' })
    
    expect(response.statusCode).toBe(200)
    expect(response.body.name).toEqual('Jane Doe')
    expect(response.body.email).toEqual('jane.doe@example.com')
  })

  test('It should delete a user', async () => {
    const user = new User({ name: 'John Doe', email: 'john.doe@example.com', password: 'password123' })
    await user.save()
    const token = await user.generateAuthToken()

    const response = await request(app)
      .delete(`/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`)
    
    expect(response.statusCode).toBe(200)
    expect(response.body.message).toEqual('User deleted')
  })
})