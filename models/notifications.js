const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  message: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  nType: {
    type: String,
    enum: ['comment', 'commentLike', 'like', 'follow'],
  },
  refer: {
    type: Schema.Types.ObjectId,
    refPath: 'docModel',
    required: true,
  },
  docModel: {
    type: String,
    required: true,
    enum: ['User', 'Comment', 'Post'],
  },
  isRead: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model('Notification', notificationSchema);
