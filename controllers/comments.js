const User = require('../models/users');
const Post = require('../models/post');
const Comment = require('../models/comment');
const Notification = require('../models/notifications');

module.exports.createComment = async (req, res) => {
  const user = await User.findById(req.user._id);
  const post = await Post.findById(req.params.id);
  const comment = new Comment({ ...req.body.comment, user, post });
  post.comments.push(comment);

  // Creating notification
  const postUser = await User.findById(post.user);

  if (!req.user._id.equals(postUser._id)) {
    const notification = new Notification({
      sender: req.user._id,
      receiver: postUser._id,
      nType: 'comment',
      refer: comment._id,
      docModel: 'Comment',
    });

    postUser.notifications.push(notification);
    await notification.save();
    await postUser.save();
  }

  //created notification

  await comment.save();
  await post.save();
  res.redirect(`/p/${post._id}#comment`);
};

module.exports.deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });

  //Removing notification
  const notification = await Notification.findOne({
    refer: commentId,
    docModel: 'Comment',
  });

  if (notification) {
    const post = await Post.findById(id);
    const postUser = await User.findById(post.user);
    await User.findByIdAndUpdate(postUser._id, {
      $pull: { notifications: notification._id },
    });

    await Notification.findByIdAndDelete(notification._id);
    await postUser.save();
  }
  //Removed notification
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
