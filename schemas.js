const Joi = require('joi');

module.exports.postSchema = Joi.object({
  post: Joi.object({
    caption: Joi.string(),
    image: Joi.string().required(),
  }).required(),
});
