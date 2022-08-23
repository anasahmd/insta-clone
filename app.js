const express = require('express');
const app = express();
const path = require('path');
const Post = require('./models/post');
const Comment = require('./models/comment');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const { postSchema } = require('./schemas');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost:27017/social-media')
  .then(() => {
    console.log('CONNECTION OPEN!!!');
  })
  .catch((err) => {
    console.log('OH NO ERROR!!!!');
    console.log(err);
  });

app.get('/', (req, res) => {
  res.redirect('/posts');
});

app.get(
  '/posts',
  catchAsync(async (req, res) => {
    const posts = await Post.find();
    res.render('posts/index', { posts });
  })
);

app.get('/posts/new', (req, res) => {
  res.render('posts/new');
});

app.post(
  '/posts',
  validatePost,
  catchAsync(async (req, res) => {
    if (!req.body.post) throw new ExpressError('Invalid Campground Data', 400);
    const date = new Date();
    const post = new Post({ ...req.body.post, date });
    await post.save();
    res.redirect('/posts');
  })
);

app.get(
  '/posts/:id',
  catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id).populate('comments');
    if (!post) {
      return next(new ExpressError('Post Not Found', 404));
    }
    res.render('posts/show', { post });
  })
);

app.get(
  '/posts/:id/edit',
  catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return next(new ExpressError('Post Not Found', 404));
    }
    res.render('posts/edit', { post });
  })
);

app.put(
  '/posts/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
    res.redirect(`/posts/${post._id}`);
  })
);

app.delete(
  '/posts/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.redirect('/posts');
  })
);

app.post(
  '/posts/:id/comments',
  catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    const comment = new Comment({ ...req.body.comment });
    post.comments.push(comment);
    await comment.save();
    await post.save();
    res.redirect(`/posts/${post._id}`);
  })
);

app.delete(
  '/posts/:id/comments/:commentId',
  catchAsync(async (req, res) => {
    const { id, commentId } = req.params;
    await Post.findByIdAndUpdate(id, { $pull: { comments: commentId } });
    await Comment.findByIdAndDelete(commentId);
    res.redirect(`/posts/${id}`);
  })
);

app.all('*', (req, res, next) => {
  next(new ExpressError('Page not found', 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something Went Wrong';
  res.status(statusCode).render('error', { err });
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
