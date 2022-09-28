const Post = require('../models/post');
const User = require('../models/users');

module.exports.index = async (req, res) => {
  const posts = await Post.find().populate('user').sort({ date: -1 });
  res.render('posts/index', { posts });
};

module.exports.renderNewForm = (req, res) => {
  res.render('posts/new');
};

module.exports.createPost = async (req, res) => {
  if (!req.body.post) throw new ExpressError('Invalid Post Data', 400);
  const user = await User.findById(req.user._id);
  const post = new Post(req.body.post);
  post.user = req.user._id;
  user.posts.push(post);
  await post.save();
  await user.save();
  req.flash('success', 'Your post has been shared');
  res.redirect('/p');
};

module.exports.showPost = async (req, res, next) => {
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
    return res.redirect('/p');
    // return next(new ExpressError('Post Not Found', 404));
  }
  res.render('posts/show', { post });
};

module.exports.renderEditForm = async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return next(new ExpressError('Post Not Found', 404));
  }
  res.render('posts/edit', { post });
};

module.exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findByIdAndUpdate(id, {
    ...req.body.post,
    edited: true,
  });
  res.redirect(`/p/${post._id}`);
};

module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(req.user._id, { $pull: { posts: id } });
  await Post.findByIdAndDelete(id);
  res.redirect('/p');
};

module.exports.likedBy = async (req, res) => {
  const post = await Post.findById(req.params.id).populate({
    path: 'likes',
    select: ['username', 'fullName'],
  });
  const listUsers = post.likes;
  res.render('users/listuser', { listUsers });
};
