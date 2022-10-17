const User = require('../models/users');
const Post = require('../models/post');
const Notification = require('../models/notifications');
const Comment = require('../models/comment');

module.exports.likeComment = async (req, res) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);
  if (comment.likes.includes(req.user._id)) {
    await Comment.findByIdAndUpdate(commentId, {
      $pull: { likes: req.user._id },
    });
    //Removing notification
    const notification = await Notification.findOne({
      refer: commentId,
      docModel: 'Comment',
      nType: 'commentLike',
      sender: req.user._id,
    });

    if (notification) {
      const commentUser = await User.findById(comment.user);
      await User.findByIdAndUpdate(commentUser._id, {
        $pull: { notifications: notification._id },
      });

      await Notification.findByIdAndDelete(notification._id);
      await commentUser.save();
    }
    //Removed notification
  } else {
    comment.likes.push(req.user._id);
    // Creating notification
    const commentUser = await User.findById(comment.user);

    if (!req.user._id.equals(commentUser._id)) {
      const notification = new Notification({
        sender: req.user._id,
        receiver: commentUser._id,
        nType: 'commentLike',
        refer: comment._id,
        docModel: 'Comment',
      });

      commentUser.notifications.push(notification);
      await notification.save();
      await commentUser.save();
    }
    //created notification

    await comment.save();
  }

  const updatedComment = await Comment.findById(commentId);
  let updatedHeart;
  let resText;
  if (updatedComment.likes.length > 0) {
    resText = `<span class="text-muted fs-8 fw-5" data-like-count="${updatedComment.likes.length}">${updatedComment.likes.length} <% if(${updatedComment.likes.length} > 1){%> likes <% } else {%>like<% }%></span>`;
  } else {
    resText = `<span class="text-muted fs-8 fw-5" data-like-count="0"><span>`;
  }
  if (updatedComment.likes.includes(req.user._id)) {
    updatedHeart = `<i class="fa-solid fa-heart red-heart fs-8"></i>`;
  } else {
    updatedHeart = `<i class="fa-regular fa-heart fs-8"></i>`;
  }
  res.send({
    text: `${resText}`,
    heart: `${updatedHeart}`,
  });
};

module.exports.likePost = async (req, res) => {
  if (!req.user._id) {
    isLoggedIn();
  }
  const { id } = req.params;
  const post = await Post.findById(id);
  if (post.likes.includes(req.user._id)) {
    //Removing notification

    const notification = await Notification.findOne({
      refer: post._id,
      docModel: 'Post',
      nType: 'like',
      sender: req.user._id,
    });

    if (notification) {
      const user = await User.findById(post.user._id);
      await User.findByIdAndUpdate(user._id, {
        $pull: { notifications: notification._id },
      });

      await Notification.findByIdAndDelete(notification._id);
      await user.save();
    }
    //Removed notification
    await Post.findByIdAndUpdate(id, { $pull: { likes: req.user._id } });
  } else {
    post.likes.push(req.user._id);

    // Creating notification
    const user = await User.findById(post.user);

    if (!req.user._id.equals(user._id)) {
      const notification = new Notification({
        sender: req.user._id,
        receiver: user._id,
        nType: 'like',
        refer: post._id,
        docModel: 'Post',
      });

      user.notifications.push(notification);
      await notification.save();
    }

    //Created notification

    await user.save();
    await post.save();
  }
  const updatedPost = await Post.findById(id);
  let updatedHeart;
  if (updatedPost.likes.includes(req.user._id)) {
    updatedHeart = `<i class="fa-solid fa-heart red-heart"></i>`;
  } else {
    updatedHeart = `<i class="fa-regular fa-heart"></i>`;
  }
  res.send({
    text: `<div class="fs-7 mt-2">
      <% if (${updatedPost.likes.length}){ %>
      <span class="fw-6" data-like-count="${updatedPost.likes.length}"
        ><%= ${updatedPost.likes.length} %> <% if(${updatedPost.likes.length} > 1){ %> likes <%
        }else { %> like <% } %>
      </span>
      <% } else { %><span data-like-count="${updatedPost.likes.length}">Be the first to <b class="like-this">like this </b><span>
      <% } %>
    </div>`,
    heart: `${updatedHeart}`,
  });
};
