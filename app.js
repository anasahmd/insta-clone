const express = require('express');
const app = express();
const path = require('path');
const Post = require('./models/post');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/', async (req, res) => {
  res.redirect('/posts');
});

app.get('/posts', async (req, res) => {
  const posts = await Post.find();
  res.render('posts/index', { posts });
});

app.get('/');

app.get('/posts/new', (req, res) => {
  res.render('posts/new');
});

app.post('/posts', async (req, res) => {
  const date = new Date();
  const post = new Post({ ...req.body.post, date });
  await post.save();
  res.redirect('/posts');
});

app.get('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render('posts/show', { post });
});

app.get('/posts/:id/edit', async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  res.render('posts/edit', { post });
});

app.put('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, { ...req.body.post });
  res.redirect(`/posts/${post._id}`);
});

app.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;
  await Post.findByIdAndDelete(id);
  res.redirect('/posts');
});

app.listen(3000, () => {
  console.log('Listening on port 3000!');
});
