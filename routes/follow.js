const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');

const ExpressError = require('../utils/ExpressError');

const { isLoggedIn } = require('../middleware');
const User = require('../models/users');

router.post(
  '/:id/follow',
  catchAsync(async (req, res) => {
    const followId = req.params.id;
    const userId = req.user._id;
    if (followId == userId) {
      return next(new ExpressError(`You can't follow yourself!`, 400));
    }
    const user = await User.findById(userId);
    if (user.following.includes(followId)) {
      return next(new ExpressError(`You can't follow a person twice`, 400));
    }
    const followUser = await User.findById(followId);
    followUser.followers.push(user._id);
    user.following.push(followUser._id);
    await followUser.save();
    await user.save();
    updatedFollowUser = await User.findById(followId);
    res.send({
      button: `<button class="btn btn-outline-secondary btn-sm px-4 btn-unfollow"><span class="fs-7 fw-5">Following</span></button>`,
      action: `/follow/${updatedFollowUser._id}/unfollow`,
      followers: updatedFollowUser.followers,
    });
  })
);

router.post(
  '/:id/unfollow',
  catchAsync(async (req, res) => {
    const followId = req.params.id;
    const userId = req.user._id;
    const followUser = await User.findById(followId);
    const user = await User.findById(userId);
    await User.findByIdAndUpdate(followUser._id, {
      $pull: { followers: user._id },
    });
    await User.findByIdAndUpdate(user._id, {
      $pull: { following: followUser._id },
    });
    updatedFollowUser = await User.findById(followId);
    res.send({
      button: `<button class="btn btn-primary btn-sm px-3 btn-follow">Follow</button>`,
      action: `/follow/${updatedFollowUser._id}/follow`,
      followers: updatedFollowUser.followers,
    });
  })
);

module.exports = router;
