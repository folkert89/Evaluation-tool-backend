const request = require('superagent')
const batches = require('./fixtures/batches.json')
// const students = require('./fixtures/students.json')

const createUrl = (path) => {
  return `${process.env.HOST || `http://localhost:${process.env.PORT || 3030}`}${path}`
}

const createBatches = (token) => {
  return batches.map((batch) => {
    return request
      .post(createUrl('/batches'))
      .set('Authorization', `Bearer ${token}`)
      .send(batch)
      .then((res) => {
        console.log('Batch seeded...', res.body.batchNumber)
        // console.log("and the body ", res.body)
        // return createStudents(res.body.token, res.body._id)
      })
      .catch((err) => {
        console.error('Error seeding batch!', err)
      })
  })
}

// const createStudents = (token, id) => {
//   return students.map((student) => {
//     return request
//       .post(createUrl(`/batches/${id}/students`))
//       .set('Authorization', `Bearer ${token}`)
//       .send(student)
//       .then((res) => {
//         console.log('Student seeded...', res.body.name)
//       })
//       .catch((err) => {
//         console.error('Error seeding student!', err)
//       })
//   })
// }

const authenticate = (email, password) => {
  request
    .post(createUrl('/sessions'))
    .send({ email, password })
    .then((res) => {
      console.log('Authenticated!')
      return createBatches(res.body.token)
    })
    .catch((err) => {
      console.error('Failed to authenticate!', err.message)
    })
}

authenticate("arno@codaisseur.nl", "abcd1234")
