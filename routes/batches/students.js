// routes/batches.js
const router = require('express').Router()
const passport = require('../../config/auth')
const { Batch, User } = require('../../models')

const authenticate = passport.authorize('jwt', { session: false })

const loadBatch = (req, res, next) => {
  const id = req.params.id

  Batch.findById(id)
    .then((batch) => {
      req.batch = batch
      next()
    })
    .catch((error) => next(error))
}

module.exports = io => {
  router
    .get('/batches/:id/students', loadBatch, (req, res, next) => {
      if (!req.batch || !req.batch.students) { return next() }
      res.json(req.batch.students)

    })

    .post('/batches/:id/students', authenticate, loadBatch, (req, res, next) => {
      if (!req.batch) { return next() }

      const newStudent = {
        name: req.body.name,
        photo: req.body.photo,
        evaluations: []
      }

      if (req.batch.students.filter(student => (student.name===req.body.name)).length>0) {
        console.log('now')
        const error = Error.new('You already joined this game!')
        error.status = 401
        return next(error)
      }

      req.batch.students = req.batch.students.concat( newStudent )

      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))
    },

    (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENTS_UPDATED',
        payload: {
          batch: req.batch,
          students: req.batch.students
        }
      })
      res.json(req.batch.students)
    })

    .post('/batches/:id/students/:studentId/evaluations', authenticate, loadBatch, (req, res, next) => {
      if (!req.batch) { return next() }

      const studentId = req.params.studentId

      const student = req.batch.students.filter((s) => (s.id === studentId))[0]

      const newEvaluation = {
        evaluation: req.body.color,
        date: req.body.date,
        remark: req.body.remark,
      }

      console.log(newEvaluation)

      student.evaluations = student.evaluations.concat( newEvaluation )

      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))
    },

    (req, res, next) => {
      io.emit('action', {
        type: 'BATCH_STUDENTS_UPDATED',
        payload: {
          batch: req.batch,
          students: req.batch.students
        }
      })
      res.json(req.batch.students)
    })

    .delete('/batches/:id/students', authenticate, (req, res, next) => {
      if (!req.batch) { return next() }

      const userId = req.account._id
      const currentStudent = req.batch.students.filter((p) => p.userId.toString() === userId.toString())[0]

      if (!currentStudent) {
        const error = Error.new('You are not a student of this batch!')
        error.status = 401
        return next(error)
      }

      req.batch.students = req.batch.students.filter((p) => p.userId.toString() !== userId.toString())
      req.batch.save()
        .then((batch) => {
          req.batch = batch
          next()
        })
        .catch((error) => next(error))

    },

    // Respond with new student data in JSON and over socket
    (req, res, next) => {
      io.emit('action', {
        type: 'GAME_PLAYERS_UPDATED',
        payload: {
          batch: req.batch,
          students: req.students
        }
      })
      res.json(req.students)
    })

  return router
}
