const express = require('express');
const { protect } = require('../controllers/authController');
const postController = require('../controllers/postController');
const commentRouter = require('./commentRoutes');
const router = express.Router();
router.use('/:postId/comments', commentRouter);
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
router.patch('/:id/vote', protect, postController.votePost);
module.exports = router;
