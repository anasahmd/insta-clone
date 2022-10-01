const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validatePost } = require('../middleware');
const posts = require('../controllers/posts');
const comments = require('../controllers/comments');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

router
  .route('/')
  .get(catchAsync(posts.index))
  .post(
    isLoggedIn,
    upload.single('image'),
    validatePost,
    catchAsync(posts.createPost)
  );

router.get('/new', isLoggedIn, posts.renderNewForm);

router
  .route('/:id')
  .get(catchAsync(posts.showPost))
  .put(isLoggedIn, isAuthor, catchAsync(posts.updatePost))
  .delete(isLoggedIn, isAuthor, catchAsync(posts.deletePost));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(posts.renderEditForm));

router.get('/:id/liked_by', catchAsync(posts.likedBy));

router.get('/:id/c/:commentId/liked_by', catchAsync(comments.likedBy));

module.exports = router;
