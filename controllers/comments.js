const User = require('../models/users');
const Post = require('../models/post');
const Comment = require('../models/comment');

module.exports.createComment = async (req, res) => {
  const user = await User.findById(req.user._id);
  const post = await Post.findById(req.params.id);
  const comment = new Comment({ ...req.body.comment, user });
  post.comments.push(comment);
  await comment.save();
  await post.save();
  res.redirect(`/p/${post._id}#comment`);
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
  await Comment.findByIdAndDelete(commentId);
  res.redirect(`/p/${id}#comment`);
};

module.exports.likedBy = async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId).populate({
    path: 'likes',
    select: ['username', 'fullName'],
  });
  const listUsers = comment.likes;
  res.render('users/listuser', { listUsers });
};
