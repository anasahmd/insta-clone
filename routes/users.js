const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const User = require('../models/users');
const passport = require('passport');

router.get('/login', (req, res) => {
  res.render('users/login');
});

router.get('/accounts/signup', (req, res) => {
  res.render('users/signup');
});

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
        res.redirect('/posts');
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
    res.redirect('/posts');
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
  '/:username',
  catchAsync(async (req, res) => {
    const { username } = req.params;
    const user = await User.findByUsername(username).populate('posts');
    res.render('users/index', { user });
  })
);

module.exports = router;
