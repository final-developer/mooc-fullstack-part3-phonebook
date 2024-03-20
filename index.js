const express = require('express')
const morgan = require('morgan')

morgan.token('body', (req, res) => {
   return JSON.stringify(req.body)
})

const app = express()

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(express.json())

const cors = require('cors')
app.use(cors())


let entries = [
   {
      "id": 1,
      "name": "Arto Hellas",
      "number": "040-123456"
   },
   {
      "id": 2,
      "name": "Ada Lovelace",
      "number": "39-44-5323523"
   },
   {
      "id": 3,
      "name": "Dan Abramov",
      "number": "12-43-234345"
   },
   {
      "id": 4,
      "name": "Mary Poppendieck",
      "number": "39-23-6423122"
   },
   {
      "id": 5,
      "name": "Max Mustermann",
      "number": "46987156854798"
   }
]

// get all entries
app.get('/api/persons', (request, response) => {
   response.json(entries)
})

// get single entry
app.get('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   const person = entries.find(entry => entry.id === id)

   if (person) {
      response.json(person)
   } else {
      response.status(404).send()
   }
})

// delete single entry
app.delete('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   entries = entries.filter(entry => entry.id !== id)

   response.status(204).end()
})

// generate random id
function getRandomId(max) {
   return Math.floor(Math.random() * max);
}

// add single entry
app.post('/api/persons', (request, response) => {
   const body = request.body

   if (!body.name || !body.number) {
      return response.status(400).json({
         error: 'name or number missing'
      })
   }

   if (entries.filter(entry => entry.name === body.name).length > 0) {
      return response.status(400).json({
         error: 'name already exists'
      })
   }

   const entry = {
      id: getRandomId(100000),
      name: body.name,
      number: body.number
   }

   entries = entries.concat(entry)
   response.json(entry)
})

// get info page
app.get('/info', (request, response) => {
   const entryCount = entries.length
   const timestamp = new Date().toString()
   response.send(
      `
      <p>Phonebook has info for ${entryCount} people</p>
      <p>${timestamp}</p>
      `
   )
})

const PORT = 3001
app.listen(PORT, () => {
   console.log(`started on http://localhost:${PORT}/`)
})