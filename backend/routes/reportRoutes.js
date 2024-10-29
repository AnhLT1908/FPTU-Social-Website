const express = require('express');
const { protect } = require('../controllers/authController');
const reportController = require('../controllers/reportController');
const router = express.Router();

// Các route cụ thể hơn
router
  .route('/v2')
  .get(reportController.getAllReportsPaginate); // Lấy tất cả báo cáo với phân trang

router.get('/stats', reportController.getReportStats); // Lấy thống kê báo cáo

// Route để vô hiệu hóa bài viết được báo cáo
router.patch('/:reportId/deactivate-post', reportController.deactivateReportedPost);

// Các route CRUD cơ bản cho báo cáo
router
  .route('/')
  .get(reportController.getAllReports) // Lấy tất cả báo cáo
  .post(protect, reportController.createNewReport); // Tạo báo cáo mới (yêu cầu bảo vệ)

router
  .route('/:id')
  .get(reportController.getReportById) // Lấy báo cáo theo ID
  .patch(protect, reportController.updateReport) // Cập nhật báo cáo (yêu cầu bảo vệ)
  .delete(protect, reportController.deleteReport); // Xóa báo cáo (yêu cầu bảo vệ)

module.exports = router;
