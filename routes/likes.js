const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const likes = require('../controllers/likes');

const { isLoggedIn } = require('../middleware');

router.post('/comment/:commentId', isLoggedIn, catchAsync(likes.likeComment));

router.post('/:id', isLoggedIn, catchAsync(likes.likePost));

module.exports = router;
