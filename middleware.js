const Post = require('./models/post');
const Comment = require('./models/comment');
const {
  postSchema,
  commentSchema,
  userSchema,
  passwordSchema,
  forgotPasswordSchema,
} = require('./schemas');
const ExpressError = require('./utils/ExpressError');

module.exports.validatePost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validatePassword = (req, res, next) => {
  const { error } = passwordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.validateForgotPassword = (req, res, next) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'Please Log in!');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post.user.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/posts/${id}`);
  }
  next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const post = await Post.findById(id);
  const comment = await Comment.findById(commentId);
  if (!(comment.user.equals(req.user._id) || post.user.equals(req.user._id))) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/posts/${id}`);
  }
  next();
};
