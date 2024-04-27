/*global process*/
const mongoose = require('mongoose')

// define schema
const personSchema = new mongoose.Schema({
   id: Number,
   name: String,
   number: String,
})
const Person = mongoose.model('Person', personSchema)

// get all persons from db
const getPersons = () => {
   Person.find({}).then(result => {
      console.log('phonebook:')
      result.forEach(person => {
         console.log(`${person['name']} ${person['number']}`)
      })
      mongoose.connection.close()
   })
}

// add person to db
const addPerson = () => {
   // generate random id
   function getRandomId(max) {
      return Math.floor(Math.random() * max)
   }

   // adding new person to phonebook
   const person = new Person({
      id: getRandomId(100000),
      name: name,
      number: number,
   })
   person.save().then(result => {
      console.log(`added ${result['name']} number ${result['number']} to phonebook`)
      mongoose.connection.close()
   })
}

// handle console input / arguments
const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
if (process.argv.length < 3) {
   console.log('required arguments: <password> (optional: <name> <phonenumber>)')
   process.exit(1)
}
if (process.argv.length === 3) {
   getPersons()
} else if (process.argv.length === 5) {
   addPerson()
}


const url = `mongodb+srv://developer:${password}@mooc-p3-phonebook.nvtm7vy.mongodb.net/?retryWrites=true&w=majority&appName=mooc-p3-phonebook`

mongoose.set('strictQuery', false)
mongoose.connect(url)




