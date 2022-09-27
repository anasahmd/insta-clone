const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    require: true,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Comment', commentSchema);
