const User = require('../models/users');
const Notification = require('../models/notifications');
const ExpressError = require('../utils/ExpressError');

module.exports.followUser = async (req, res) => {
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

  // Creating notification

  const notification = new Notification({
    sender: user._id,
    receiver: followUser._id,
    nType: 'follow',
    refer: user._id,
    docModel: 'User',
  });

  followUser.notifications.push(notification);
  await notification.save();

  //Created a notification

  await followUser.save();
  await user.save();
  updatedFollowUser = await User.findById(followId);
  res.send({
    button: `<button class="btn btn-outline-secondary btn-sm px-3 btn-unfollow"><span class="fs-7 fw-5">Following</span></button>`,
    action: `/follow/${updatedFollowUser._id}/unfollow`,
    followers: updatedFollowUser.followers,
  });
};

module.exports.unfollowUser = async (req, res) => {
  const followId = req.params.id;
  const userId = req.user._id;
  const followUser = await User.findById(followId).populate('notifications');
  const user = await User.findById(userId);

  //Removing notification
  const notification = await Notification.findOne({
    refer: user._id,
    receiver: followId,
    docModel: 'User',
  });

  await User.findByIdAndUpdate(followUser._id, {
    $pull: { followers: user._id, notifications: notification._id },
  });

  await Notification.findByIdAndDelete(notification._id);
  //Removed notification

  await User.findByIdAndUpdate(user._id, {
    $pull: { following: followUser._id },
  });
  updatedFollowUser = await User.findById(followId);
  res.send({
    button: `<button class="btn btn-primary btn-sm px-3 btn-follow">Follow</button>`,
    action: `/follow/${updatedFollowUser._id}/follow`,
    followers: updatedFollowUser.followers,
  });
};
