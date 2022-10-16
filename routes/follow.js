const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const follow = require('../controllers/follow');
const { isLoggedIn } = require('../middleware');

router.post('/:id/follow', isLoggedIn, catchAsync(follow.followUser));

router.post('/:id/unfollow', isLoggedIn, catchAsync(follow.unfollowUser));

module.exports = router;
