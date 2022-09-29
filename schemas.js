const Joi = require('joi');

module.exports.postSchema = Joi.object({
  post: Joi.object({
    caption: Joi.string().allow(null, ''),
    images: Joi.string(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    text: Joi.string().required(),
  }).required(),
});
