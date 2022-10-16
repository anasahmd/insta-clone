const { cloudinary } = require('../cloudinary');
const Post = require('../models/post');
const User = require('../models/users');
const ExpressError = require('../utils/ExpressError');

module.exports.renderNewForm = (req, res) => {
  res.render('posts/new');
};

module.exports.createPost = async (req, res) => {
  if (!req.body.post) throw new ExpressError('Invalid Post Data', 400);
  const user = await User.findById(req.user._id);
  const post = new Post(req.body.post);
  post.caption = post.caption.replace(/\r\n\r\n/g, '');
  post.image.filename = req.file.filename;
  post.image.url = req.file.path;
  post.user = req.user._id;
  user.posts.push(post);
  await post.save();
  await user.save();
  req.flash('success', 'Your post has been shared');
  res.redirect('/');
};

module.exports.showPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: 'comments',
        options: { sort: { likes: -1, date: -1 } },
        populate: {
          path: 'user',
          select: 'username dp',
        },
      })
      .populate('user');
    res.render('posts/show', { post });
  } catch (e) {
    return next(new ExpressError('Post not found', 404));
  }
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
  req.body.post.caption = req.body.post.caption.replace(/\r\n\r\n/g, '');
  const post = await Post.findByIdAndUpdate(id, {
    ...req.body.post,
    edited: true,
  });
  res.redirect(`/p/${post._id}`);
};

module.exports.deletePost = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndUpdate(req.user._id, { $pull: { posts: id } });
  const post = await Post.findById(id);
  await cloudinary.uploader.destroy(post.image.filename);
  await Post.findByIdAndDelete(id);
  res.redirect('/');
};

module.exports.likedBy = async (req, res) => {
  const post = await Post.findById(req.params.id).populate({
    path: 'likes',
    select: ['username', 'fullName'],
  });
  const listUsers = post.likes;
  res.render('users/listuser', { listUsers });
};
