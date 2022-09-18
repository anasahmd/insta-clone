const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { commentSchema } = require('../schemas');
const { isLoggedIn, isCommentAuthor } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/users');

const validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  '/',
  isLoggedIn,
  validateComment,
  catchAsync(async (req, res) => {
    const user = await User.findById(req.user._id);
    const post = await Post.findById(req.params.id);
    const comment = new Comment({ ...req.body.comment, user });
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/posts/${post._id}`);
  })
);

router.delete(
  '/:commentId',
  isLoggedIn,
  isCommentAuthor,
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/posts/${id}`);
  })
);

module.exports = router;
