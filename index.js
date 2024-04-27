/*global process*/
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

morgan.token('body', (req) => {
   return JSON.stringify(req.body)
})

const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.use(express.static('dist'))

const cors = require('cors')
app.use(cors())

// MongoDB and Mongoose handling
const Person = require('./modules/person')

// get all entries
app.get('/api/persons', (request, response) => {
   Person.find({}).then(persons => {
      response.json(persons)
   })
})

// get single entry
app.get('/api/persons/:id', (request, response, next) => {
   Person.findById(request.params.id)
      .then(person => {
         response.json(person)
      })
      .catch(error => next(error))
})

// delete single entry
app.delete('/api/persons/:id', (request, response, next) => {
   // const id = Number(request.params.id)
   // entries = entries.filter(entry => entry.id !== id)

   // response.status(204).end()
   Person.findByIdAndDelete(request.params.id)
      .then(() => response.status(204).end())
      .catch(error => next(error))
})

// add single entry
app.post('/api/persons', (request, response, next) => {
   const body = request.body

   const person = new Person({
      name: body.name,
      number: body.number,
   })
   person.save()
      .then(savedPerson => response.json(savedPerson))
      .catch(error => next(error))
})

// update single entry
app.put('/api/persons/:id', (request, response, next) => {
   const { name, number } = request.body

   Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
   )
      .then(updatedPerson => response.json(updatedPerson))
      .catch(error => next(error))
})

// get info page
app.get('/info', (request, response) => {
   Person.find({}).then(persons => {
      const entryCount = persons.length
      const timestamp = new Date().toString()
      response.send(
         `
         <p>Phonebook has info for ${entryCount} people</p>
         <p>${timestamp}</p>
         `
      )
   })

})

// error handler middleware (because of 4 parameters)
const errorHandler = (error, request, response, next) => {
   console.error(error.message)

   if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
   } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message })
   }

   // pass error to default express error handler
   next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
   console.log(`started on port ${PORT}`)
})