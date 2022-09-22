const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/users');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/accounts/signup', (req, res) => {
  res.render('users/signup');
});

// Validate User maybe

router.post(
  '/accounts/signup',
  catchAsync(async (req, res) => {
    try {
      const { username, email, password, fullName } = req.body;
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
  })
);

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'Welcome Back');
    res.redirect('/');
  }
);

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

router.get(
  '/accounts/edit',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = req.user;
    res.render('users/edit', { user });
  })
);

router.post(
  '/accounts/edit',
  isLoggedIn,
  catchAsync(async (req, res) => {
    const user = req.user;
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      ...req.body,
    });
    res.redirect(`/${updatedUser.username}`);
  })
);

router.get(
  '/:username',
  catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findByUsername(username).populate('posts');
    res.render('users/index', { user });
  })
);

router.get(
  '/:username/followers',
  catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findByUsername(username).populate({
      path: 'followers',
      select: ['username', 'fullName'],
    });
    const listUsers = user.followers;
    res.render('users/listuser', { listUsers });
  })
);

router.get(
  '/:username/following',
  catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findByUsername(username).populate({
      path: 'following',
      select: ['username', 'fullName'],
    });
    const listUsers = user.following;
    res.render('users/listuser', { listUsers });
  })
);

module.exports = router;
