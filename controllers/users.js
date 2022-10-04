const User = require('../models/users');
const { cloudinary } = require('../cloudinary');
const ExpressError = require('../utils/ExpressError');
const Post = require('../models/post');
const Notification = require('../models/notifications');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
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
  user.dp.url =
    'https://res.cloudinary.com/dtq8oqzvj/image/upload/v1664818880/Don%27t%20Delete/instadefault_h1kqsb.jpg';
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

module.exports.renderForgotForm = async (req, res) => {
  res.render('users/forgotpwd');
};

module.exports.forgotPassword = async (req, res) => {
  let token;
  crypto.randomBytes(20, (err, buf) => {
    if (err) {
      console.log(err);
      return;
    }
    token = buf.toString('hex');
  });
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    req.flash('error', 'No users found');
    return res.redirect('/accounts/password/reset');
  }

  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000;

  await user.save();

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'anasahmad00239@gmail.com',
      pass: process.env.GMAILAPW,
    },
  });
  const mailOptions = {
    to: user.email,
    from: 'Dext',
    subject: 'Dext Password Reset',
    text:
      `Sorry to hear you're having trouble logging into Dext. We got a message that you forgot your password. If this was you, you can reset your password now.\n\n` +
      `https://${req.headers.host}/accounts/password/reset/confirm/${token} \n\n` +
      `If you didn’t request a password reset, you can ignore this message \n\n` +
      `Only people who know your Dext password can log into your account.\n\n`,

    html: `<div style="max-width: 600px;"><p>Sorry to hear you're having trouble logging into Dext. We got a message that you forgot your password. If this was you, you can reset your password now.<p><a href="https://${req.headers.host}/accounts/password/reset/confirm/${token}">Reset your password</a><p>If you didn’t request a password reset, you can ignore this message</p><p>Only people who know your Dext password can log into your account.</p></div>`,
  };
  transporter.sendMail(mailOptions, (err) => {
    req.flash(
      'success',
      `We sent an email to ${user.email} with a link to get back into your account.`
    );
    res.redirect('/accounts/password/reset');
  });
};

module.exports.renderForgotConfirmForm = async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ExpressError(`Sorry, this page isn't available`, 400));
  }
  res.render('users/forgotconfirm', { token: req.params.token });
};

module.exports.forgotConfirmPassword = async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ExpressError(`Sorry, this page isn't available`, 400));
  }
  await user.setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  req.login(user, (err) => {
    if (err) return next(err);
  });
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'anasahmad00239@gmail.com',
      pass: process.env.GMAILAPW,
    },
  });
  const mailOptions = {
    to: user.email,
    from: 'Dext',
    subject: 'Your Dext password has been changed',
    text: `This is a confirmation that the password for your Instagram account ${user.username} has just been changed.`,

    html: `<div style="max-width: 600px;"><p>This is a confirmation that the password for your Dext account ${user.username} has just been changed.</p></div>`,
  };
  transporter.sendMail(mailOptions);
  req.flash('success', `Your password has been changed.`);
  res.redirect('/');
};

module.exports.renderAccountActivity = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'notifications',
    populate: [{ path: 'sender', select: 'username dp' }, { path: 'refer' }],
    options: { sort: { createdAt: -1 } },
  });
  await Notification.updateMany(
    {
      _id: { $in: user.notifications },
    },
    { isRead: true }
  );
  res.render('users/activity', { user });
};
