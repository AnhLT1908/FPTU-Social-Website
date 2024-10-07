const express = require('express');
const { protect } = require('../controllers/authController');
const voteController = require('../controllers/voteController');
const router = express.Router();
router
  .route('/')
  .get(voteController.getAllVotes)
  .post(protect, voteController.createNewVote);
router
  .route('/:id')
  .get(voteController.getVoteById)
  .patch(protect, voteController.updateVote)
  .delete(protect, voteController.deleteVote);

module.exports = router;
