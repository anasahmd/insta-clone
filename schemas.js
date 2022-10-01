const Joi = require('joi');

module.exports.postSchema = Joi.object({
  post: Joi.object({
    caption: Joi.string().allow(null, '').max(700),
    images: Joi.string(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    text: Joi.string().required().max(700),
  }).required(),
});

module.exports.userSchema = Joi.object({
  user: Joi.object({
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    username: Joi.string()
      .min(3)
      .max(30)
      .regex(/^[a-zA-Z0-9_.]*$/)
      .required(),
    fullName: Joi.string().max(30).allow(''),
    bio: Joi.string().max(150).allow(''),
    password: Joi.string(),
  }).required(),
});

module.exports.passwordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  password: Joi.string().min(6).required(),
  repeat_password: Joi.ref('password'),
}).required();
