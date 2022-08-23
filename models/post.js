const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment');

const PostSchema = new Schema({
  caption: String,
  image: String,
  edited: Boolean,
  date: Date,
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
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
