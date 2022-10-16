const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
var uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;
const Post = require('./post');
const Comment = require('./comment');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  fullName: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  },
  dp: {
    url: {
      type: String,
      default: `https://res.cloudinary.com/dtq8oqzvj/image/upload/v1664818880/Don%27t%20Delete/instadefault_h1kqsb.jpg`,
    },
    filename: String,
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  bio: {
    type: String,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  notifications: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
    },
  ],
});

userSchema.plugin(passportLocalMongoose, {
  usernameQueryFields: ['email'],
  usernameLowerCase: true,
});

uniqueValidator.defaults.message = `Another account is using the same {PATH}`;
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
