const express = require('express');
const { protect } = require('../controllers/authController');
const postController = require('../controllers/postController');
const router = express.Router();
router.get('/feed', postController.getGuestFeed);
router.get('/my-feed', protect, postController.getMyFeed);
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
