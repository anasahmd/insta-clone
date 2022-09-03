const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    require: true,
  },
  likes: Number,
  date: Date,
});

module.exports = mongoose.model('Comment', commentSchema);
