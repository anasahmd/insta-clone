const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users');

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    (req, res, next) => {
      req.body.username = req.body.username.toLowerCase();
      next();
    },
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.userLogin
  );

router
  .route('/accounts/signup')
  .get(users.renderSignup)
  .post(catchAsync(users.userSignup));

router.get('/logout', users.userLogout);

router
  .route('/accounts/edit')
  .get(isLoggedIn, catchAsync(users.renderEditForm))
  .post(isLoggedIn, catchAsync(users.accountEdit));

router.get('/:username', catchAsync(users.renderUserIndex));

router.get('/:username/followers', catchAsync(users.renderFollowers));

router.get('/:username/following', catchAsync(users.renderFollowing));

module.exports = router;
