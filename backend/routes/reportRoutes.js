const express = require('express');
const { protect } = require('../controllers/authController');
const reportController = require('../controllers/reportController');
const router = express.Router();
router
  .route('/')
  .get(reportController.getAllReports)
  .post(protect, reportController.createNewReport);
router
  .route('/:id')
  .get(reportController.getReportById)
  .patch(protect, reportController.updateReport)
  .delete(protect, reportController.deleteReport);

module.exports = router;
