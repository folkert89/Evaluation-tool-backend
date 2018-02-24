
const mongoose = require('../config/database')
const { Schema } = mongoose

const evaluationSchema = new Schema({
  date: { type: Date, default: Date.now },
  evaluation: { type: String, default: 'red' },
  remark: { type: String }
});

const studentsSchema = new Schema({
  name: {type: String, required: true},
  photo: { type: String, default: 'https://upload.wikimedia.org/wikipedia/commons/a/ad/Placeholder_no_text.svg', required: true },
  evaluations: [evaluationSchema]
});

const batchesSchema = new Schema({
  batchNumber: { type: String, required: true},
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, default: Date.now },
  students: [studentsSchema]
});

module.exports = mongoose.model('batches', batchesSchema)
