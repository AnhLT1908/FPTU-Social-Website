const express = require('express');
const { protect } = require('../controllers/authController');
const commentController = require('../controllers/commentController');
const router = express.Router({ mergeParams: true });
router
  .route('/')
  .get(commentController.getAllComments)
  .post(protect, commentController.createNewComment);
router
  .route('/:id')
  .get(commentController.getCommentById)
  .patch(protect, commentController.updateComment)
  .delete(protect, commentController.deleteComment)
router.route('/get-by-post/:id').get(commentController.getCommentByPostId);
router.patch('/:id/vote', protect, commentController.voteComment);
module.exports = router;
