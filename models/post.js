const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  caption: String,
  image: String,
  edited: Boolean,
  date: Date,
});

module.exports = mongoose.model('Post', postSchema);
