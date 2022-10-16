const Joi = require('joi');

module.exports.postSchema = Joi.object({
  post: Joi.object({
    caption: Joi.string().allow(null, '').max(700).messages({
      'string.max': 'Caption must be less than 700 characters',
    }),
    images: Joi.string(),
  }).required(),
});

module.exports.commentSchema = Joi.object({
  comment: Joi.object({
    text: Joi.string().required().max(700).messages({
      'string.max': 'Comment must be less than 700 characters',
    }),
  }).required(),
});

module.exports.userSchema = Joi.object({
  user: Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2 })
      .message('Enter a valid email address')
      .required(),
    username: Joi.string()
      .max(30)
      .regex(/^[a-zA-Z0-9_.]*$/)
      .required()
      .messages({
        'string.max': 'Enter a username under 30 characters.',
        'string.pattern.base':
          'Usernames can only use letters, numbers, underscores and periods.',
      }),
    fullName: Joi.string().max(30).allow('').messages({
      'string.max': 'Enter a name under 30 characters.',
    }),
    bio: Joi.string().max(150).allow('').messages({
      'string.max': 'Bio must be less than 150 characters',
    }),
    password: Joi.string(),
  }).required(),
});

module.exports.passwordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Create a password at least 6 characters long.',
  }),
  repeat_password: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Please make sure both passwords match.',
  }),
}).required();

module.exports.forgotPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    'string.min': 'Create a password at least 6 characters long.',
  }),
  repeat_password: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Please make sure both passwords match.',
  }),
}).required();
