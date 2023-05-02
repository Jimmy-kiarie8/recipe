const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  uid: {
    type: String,
    required: true
  }
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;
