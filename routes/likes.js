const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const { isLoggedIn } = require('../middleware');
const Post = require('../models/post');
const User = require('../models/users');

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
    res.send(
      `<div class="fs-7 mt-2">
      <% if (${updatedPost.likes.length}){ %>
      <span class="fw-bolder"
        ><%= ${updatedPost.likes.length} %> <% if(${updatedPost.likes.length} > 1){ %> likes <%
        }else { %> like <% } %>
      </span>
      <% } else { %> Be the first to <b>like this </b>
      <% } %>
    </div>`
    );
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
