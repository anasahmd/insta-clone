const User = require('../models/users');
const { cloudinary } = require('../cloudinary');
const ExpressError = require('../utils/ExpressError');
const Post = require('../models/post');
const prohibitedUsername = [
  'accounts',
  'login',
  'follow',
  'like',
  'logout',
  'password',
  'edit',
  'signup',
  'followers',
  'following',
  'profilepicture',
  'editdp',
  'removedp',
  'new',
  'liked_by',
  'search',
  'explore',
  'direct',
  'inbox',
  'activity',
  'home',
  'create',
  'style',
  'story',
  'admin',
];

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.renderSignup = (req, res) => {
  res.render('users/signup');
};

module.exports.userSignup = async (req, res, next) => {
  try {
    const { username, email, password, fullName } = req.body.user;
    if (prohibitedUsername.indexOf(username) !== -1) {
      return next(new ExpressError(`Username not available`, 400));
    }
    const newUser = new User({
      username,
      email,
      fullName,
    });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'User registered successfully');
      res.redirect('/');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/accounts/signup');
  }
};

module.exports.userLogin = (req, res) => {
  req.flash('success', 'Welcome Back');
  res.redirect('/');
};

module.exports.userLogout = (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
};

module.exports.renderEditForm = async (req, res) => {
  const user = req.user;
  res.render('users/edit', { user });
};

module.exports.accountEdit = async (req, res, next) => {
  const user = req.user;
  req.body.user.username = req.body.user.username.toLowerCase();
  if (prohibitedUsername.indexOf(req.body.user.username) !== -1) {
    return next(new ExpressError(`Username not available`, 400));
  }
  req.body.user.bio = req.body.user.bio.replace(/\r\n\r\n/g, '');
  await User.findByIdAndUpdate(user._id, {
    ...req.body.user,
  });
  req.session.passport.user = req.body.user.username;
  res.redirect(`/${req.body.user.username}`);
};

module.exports.renderUserIndex = async (req, res) => {
  const { username } = req.params;
  const user = await User.findByUsername(username).populate({
    path: 'posts',
    options: { sort: { date: -1 } },
  });
  res.render('users/index', { user });
};

module.exports.renderFollowers = async (req, res) => {
  const { username } = req.params;
  const user = await User.findByUsername(username).populate({
    path: 'followers',
    select: ['username', 'fullName'],
  });
  const listUsers = user.followers;
  res.render('users/listuser', { listUsers });
};

module.exports.renderFollowing = async (req, res) => {
  const { username } = req.params;
  const user = await User.findByUsername(username).populate({
    path: 'following',
    select: ['username', 'fullName'],
  });
  const listUsers = user.following;
  res.render('users/listuser', { listUsers });
};

module.exports.editDp = async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id);
  if (user.dp.filename) {
    await cloudinary.uploader.destroy(user.dp.filename);
  }
  user.dp.filename = req.file.filename;
  user.dp.url = req.file.path;
  await user.save();
  res.redirect(`/${user.username}`);
};

module.exports.removeDp = async (req, res) => {
  const id = req.user._id;
  const user = await User.findById(id);
  if (user.dp.filename) {
    await cloudinary.uploader.destroy(user.dp.filename);
  }
  user.dp.filename = '';
  user.dp.url = '';
  await user.save();
  res.redirect(`/${user.username}`);
};

module.exports.renderDpForm = (req, res) => {
  res.render('users/editdp');
};

module.exports.renderPasswordChangeForm = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.render('users/editpwd', { user });
};

module.exports.changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  await user.changePassword(req.body.oldPassword, req.body.password);
  req.flash('success', 'Password Changed');
  res.redirect('/accounts/password/change');
};

module.exports.renderExplore = async (req, res) => {
  const posts = await Post.find({}).sort({ date: -1 });
  res.render('users/explore', { posts });
};

module.exports.renderSearchForm = (req, res) => {
  res.render('users/search');
};

module.exports.searchUsers = async (req, res) => {
  if (req.query.value) {
    const users = await User.find({
      username: { $regex: '^' + req.query.value, $options: 'i' },
    });
    res.send({ users });
  }
};
