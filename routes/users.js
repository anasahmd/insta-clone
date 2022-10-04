const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn, validateUser, validatePassword } = require('../middleware');
const users = require('../controllers/users');
const multer = require('multer');
const { storagedp } = require('../cloudinary');
const upload = multer({ storage: storagedp });
const User = require('../models/users');

router
  .route('/login')
  .get(users.renderLogin)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.userLogin
  );

router
  .route('/accounts/signup')
  .get(users.renderSignup)
  .post(validateUser, catchAsync(users.userSignup));

router.get('/logout', isLoggedIn, users.userLogout);

router
  .route('/accounts/edit')
  .get(isLoggedIn, catchAsync(users.renderEditForm))
  .post(isLoggedIn, validateUser, catchAsync(users.accountEdit));

router.get('/accounts/profilepicture', isLoggedIn, users.renderDpForm);

router.post(
  '/accounts/editdp',
  isLoggedIn,
  upload.single('image'),
  catchAsync(users.editDp)
);

router.post('/accounts/removedp', isLoggedIn, users.removeDp);

router.get('/accounts/activity', catchAsync(users.renderAccountActivity));

router.get(
  '/accounts/password/change',
  isLoggedIn,
  catchAsync(users.renderPasswordChangeForm)
);

router.put(
  '/accounts/password',
  isLoggedIn,
  validatePassword,
  catchAsync(users.changePassword)
);

router.get('/accounts/password/reset', catchAsync(users.renderForgotForm));

router.post('/forgot', catchAsync(users.forgotPassword));

router.post('/forgot/:token', catchAsync(users.forgotConfirmPassword));

router.get(
  '/accounts/password/reset/confirm/:token',
  catchAsync(users.renderForgotConfirmForm)
);

router.get('/explore', catchAsync(users.renderExplore));

router.get('/explore/search', users.renderSearchForm);

router.get('/explore/search/users', catchAsync(users.searchUsers));

router.get('/:username', catchAsync(users.renderUserIndex));

router.get('/:username/followers', catchAsync(users.renderFollowers));

router.get('/:username/following', catchAsync(users.renderFollowing));

module.exports = router;
