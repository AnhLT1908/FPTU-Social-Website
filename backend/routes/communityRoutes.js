const express = require('express');
const { protect } = require('../controllers/authController');
const communityController = require('../controllers/communityController');
const router = express.Router();
router
  .route('/')
  .get(communityController.getAllCommunities)
  .post(protect, communityController.createNewCommunity);
router
  .route('/:id')
  .get(communityController.getCommunityById)
  .patch(protect, communityController.updateCommunity)
  .delete(
    protect,
    communityController.isModerator,
    communityController.deleteCommunity
  );
router.route('/get-post/:id').get(communityController.getPostInCommunity);
router.route('/get-user/:id').get(communityController.getUserInCommunity);
router.route('/join').post(communityController.addUserById);
router.route('/access/:id').patch(communityController.accessRequest);
router.route('/request/:id').patch(communityController.addRequest);
module.exports = router;
