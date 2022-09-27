const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn } = require('../middleware');
const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/users');

router.post(
  '/comment/:commentId',
  catchAsync(async (req, res) => {
    // if (!req.user._id) {
    //   isLoggedIn();
    // }
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (comment.likes.includes(req.user._id)) {
      await Comment.findByIdAndUpdate(commentId, {
        $pull: { likes: req.user._id },
      });
    } else {
      comment.likes.push(req.user._id);
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
  })
);

router.post(
  '/:id',
  catchAsync(async (req, res) => {
    if (!req.user._id) {
      isLoggedIn();
    }
    const { id } = req.params;
    const post = await Post.findById(id);
    if (post.likes.includes(req.user._id)) {
      await Post.findByIdAndUpdate(id, { $pull: { likes: req.user._id } });
    } else {
      post.likes.push(req.user._id);
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
      <span class="fw-bolder" data-like-count="${updatedPost.likes.length}"
        ><%= ${updatedPost.likes.length} %> <% if(${updatedPost.likes.length} > 1){ %> likes <%
        }else { %> like <% } %>
      </span>
      <% } else { %><span data-like-count="${updatedPost.likes.length}">Be the first to <b>like this </b><span>
      <% } %>
    </div>`,
      heart: `${updatedHeart}`,
    });
  })
);

// router.get(
//   '/:id',
//   catchAsync(async (req, res) => {
//     const post = await Post.findById(req.params.id);
//     res.send(
//       `<small class="fw-bolder" <% if (!${post.likes.length}){ %>hidden <% } %> >${post.likes.length} <% if(${post.likes.length} > 1){%> likes <% }else { %> like <% } %></small><% if (${post.likes.length}){ %><br /><% } %>`
//     );
//   })
// );

module.exports = router;
