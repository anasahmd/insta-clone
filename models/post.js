const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');
const User = require('./users');

const PostSchema = new Schema({
  caption: String,
  image: String,
  edited: Boolean,
  date: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

PostSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Comment.deleteMany({
      _id: {
        $in: doc.comments,
      },
    });
  }
});

module.exports = mongoose.model('Post', PostSchema);
