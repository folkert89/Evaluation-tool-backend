// routes/users.js
const router = require('express').Router()
const { User } = require('../models')
const passport = require('../config/auth')

router.get('/users/me', passport.authorize('jwt', { session: false }), (req, res, next) => {
  if (!req.account) {
    const error = new Error('Unauthorized')
    error.status = 401
    next(error)
  }

  res.json(req.account)
})

module.exports = router
