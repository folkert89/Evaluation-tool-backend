const { User } = require('../models')
const passport = require('../config/auth')

const users = [{
  name: "arno",
  email: "arno@codaisseur.nl",
  password: "abcd1234"
},{
  name: "wouter",
  email: "wouter@codaisseur.nl",
  password: "abcd1234"
},{
  name: "matt",
  email: "matt@codaisseur.nl",
  password: "abcd1234"
},{
  name: "bram",
  email: "bram@codaisseur.nl",
  password: "abcd1234"
},{
  name: "mike",
  email: "mike@codaisseur.nl",
  password: "abcd1234"
},{
  name: "arien",
  email: "arien@codaisseur.nl",
  password: "abcd1234"
}]

users.map(user => {
  User.register(new User({name: user.name, email: user.email}), user.password, (err, user) => {
    if (err) {
      err.status = 422
      throw err
    }
  })
})
