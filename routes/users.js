const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { isLoggedIn } = require('../middleware');
const users = require('../controllers/users');
const multer = require('multer');
const { storagedp } = require('../cloudinary');
const upload = multer({ storage: storagedp });

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

router.get('/logout', isLoggedIn, users.userLogout);

router
  .route('/accounts/edit')
  .get(isLoggedIn, catchAsync(users.renderEditForm))
  .post(isLoggedIn, catchAsync(users.accountEdit));

router.get('/accounts/profilepicture', isLoggedIn, users.renderDpForm);

router.post(
  '/accounts/editdp',
  isLoggedIn,
  upload.single('image'),
  catchAsync(users.editDp)
);

router.post('/accounts/removedp', isLoggedIn, users.removeDp);

router.get('/:username', catchAsync(users.renderUserIndex));

router.get('/:username/followers', catchAsync(users.renderFollowers));

router.get('/:username/following', catchAsync(users.renderFollowing));

module.exports = router;
