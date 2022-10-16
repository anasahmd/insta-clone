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
    req.flash('error', `${msg}`);
    return res.redirect('/p/new');
  } else {
    next();
  }
};

module.exports.validateEditPost = (req, res, next) => {
  const { error } = postSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    req.flash('error', `${msg}`);
    return res.redirect(req.get('referer'));
  } else {
    next();
  }
};

module.exports.validateComment = (req, res, next) => {
  const { error } = commentSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    req.flash('error', `${msg}`);
    return res.redirect(req.get('referer'));
  } else {
    next();
  }
};

module.exports.validateUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    req.flash('error', `${msg}`);
    return res.redirect('/accounts/edit');
  } else {
    next();
  }
};

module.exports.validateSignupUser = (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    req.flash('error', `${msg}`);
    return res.redirect('/accounts/signup');
  } else {
    next();
  }
};

module.exports.validatePassword = (req, res, next) => {
  const { error } = passwordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    req.flash('error', `${msg}`);
    return res.redirect('/accounts/password/change');
  } else {
    next();
  }
};

module.exports.validateForgotPassword = (req, res, next) => {
  const { error } = forgotPasswordSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    req.flash('error', `${msg}`);
    return res.redirect(req.get('referer'));
  } else {
    next();
  }
};

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'Please Log in!');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (
    !(post.user.equals(req.user._id) || req.user.username === process.env.ADMIN)
  ) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/p/${id}`);
  }
  next();
};

module.exports.isCommentAuthor = async (req, res, next) => {
  const { id, commentId } = req.params;
  const post = await Post.findById(id);
  const comment = await Comment.findById(commentId);
  if (
    !(
      comment.user.equals(req.user._id) ||
      post.user.equals(req.user._id) ||
      req.user.username === process.env.ADMIN
    )
  ) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/p/${id}`);
  }
  next();
};

module.exports.checkReturnTo = (req, res, next) => {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
  }
  next();
};
