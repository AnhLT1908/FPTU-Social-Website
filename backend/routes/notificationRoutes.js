const express = require('express');
const { protect } = require('../controllers/authController');
const notificationController = require('../controllers/notificationController');
const router = express.Router();
router.route('/').get(protect, notificationController.getMyNotifications);
router
  .route('/:id')
  .patch(protect, notificationController.updateNotification)
  .delete(protect, notificationController.deleteNotification);
module.exports = router;
