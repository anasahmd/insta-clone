const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { postSchema } = require('../schemas');
const { isLoggedIn, isAuthor } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Post = require('../models/post');
const User = require('../models/users');

const validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  '/',
  catchAsync(async (req, res) => {
    const posts = await Post.find().populate('user');
    res.render('posts/index', { posts });
  })
);

router.get('/new', isLoggedIn, (req, res) => {
  res.render('posts/new');
});

router.post(
  '/',
  isLoggedIn,
  validatePost,
  catchAsync(async (req, res) => {
    if (!req.body.post) throw new ExpressError('Invalid Post Data', 400);
    const user = await User.findById(req.user._id);
    const post = new Post(req.body.post);
    post.user = req.user._id;
    user.posts.push(post);
    await post.save();
    await user.save();
    req.flash('success', 'Your post has been shared');
    res.redirect('/posts');
  })
);

router.get(
  '/:id',
  catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'username',
        },
      })
      .populate('user');
    if (!post) {
      req.flash('error', 'Post Not Found');
      return res.redirect('/posts');
      // return next(new ExpressError('Post Not Found', 404));
    }
    res.render('posts/show', { post });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new ExpressError('Post Not Found', 404));
    }
    res.render('posts/edit', { post });
  })
);

router.put(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    res.redirect(`/posts/${post._id}`);
  })
);

router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndUpdate(req.user._id, { $pull: { posts: id } });
    await Post.findByIdAndDelete(id);
    res.redirect('/posts');
  })
);

module.exports = router;
