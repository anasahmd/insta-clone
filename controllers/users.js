const User = require('../models/users');
const { cloudinary } = require('../cloudinary');

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
};

module.exports.renderSignup = (req, res) => {
  res.render('users/signup');
};

module.exports.userSignup = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body.user;
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

module.exports.accountEdit = async (req, res) => {
  const user = req.user;
  req.body.user.username = req.body.user.username.toLowerCase();
  req.body.user.bio = req.body.user.bio.replace(/\r\n\r\n/g, '');
  const updatedUser = await User.findByIdAndUpdate(user._id, {
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
