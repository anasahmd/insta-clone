const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const follow = require('../controllers/follow');

router.post('/:id/follow', catchAsync(follow.followUser));

router.post('/:id/unfollow', catchAsync(follow.unfollowUser));

module.exports = router;
