const express = require('express');
const { protect } = require('../controllers/authController');
const commentController = require('../controllers/commentController');
const router = express.Router();
router
  .route('/')
  .get(commentController.getAllComments)
  .post(protect, commentController.createNewComment);
router
  .route('/:id')
  .get(commentController.getCommentById)
  .patch(protect, commentController.updateComment)
  .delete(protect, commentController.deleteComment);

module.exports = router;
