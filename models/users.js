const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
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
      default: `https://res.cloudinary.com/dtq8oqzvj/image/upload/v1664629311/Dext%20Profile%20Images/instadefault_lowfpp.jpg`,
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
});

userSchema.plugin(passportLocalMongoose, {
  usernameQueryFields: ['email'],
  usernameLowerCase: true,
});

module.exports = mongoose.model('User', userSchema);
