const express = require('express');
const { protect } = require('../controllers/authController');
const postController = require('../controllers/postController');
const router = express.Router();
router
  .route('/')
  .get(postController.getAllPosts)
  .post(protect, postController.createNewPost);
router
  .route('/:id')
  .get(postController.getPostById)
  .patch(protect, postController.updatePost)
  .delete(protect, postController.deletePost);

module.exports = router;
