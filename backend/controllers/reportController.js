const Report = require('../models/reportModel');
const Post =require('../models/postModel')
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
// CRUD
exports.getReportById = factoryGetOne(Report, [
  { path: 'userId',select:'username' },{
    path: 'reportEntityId',select:'title content ',
  }
 
]);

exports.createNewReport = factoryCreateOne(Report);
exports.getAllReports = factoryGetAll(Report);
exports.updateReport = factoryUpdateOne(Report);
exports.deleteReport = factoryDeleteOne(Report);

// Hàm lấy tất cả báo cáo với phân trang và lọc theo điều kiện
exports.getAllReportsPaginate = catchAsync(async (req, res, next) => {
  // Thiết lập bộ lọc cho các trường cần lọc
  const { page = 1, limit = 10, status, entityType, description } = req.query;

  // Cấu hình bộ lọc dựa vào query parameters
  let filter = {};
  if (status) filter.status = status;
  if (entityType) filter.entityType = entityType;
  if (description) filter.description = new RegExp(description, 'i'); // Tìm kiếm không phân biệt hoa thường

  // Sử dụng APIFeatures để áp dụng các bộ lọc, sắp xếp, và phân trang
  const features = new APIFeatures(Report.find(filter), req.query)
      .sort()          // Sắp xếp (nếu cần)
      .limitFields()   // Giới hạn trường (nếu cần)
      .paginate();     // Phân trang

  // Thực thi query
  const reports = await features.query.populate({
      path: 'userId',
      select: 'username -_id' // Populate trường username từ bảng User
  });

  // Tính tổng số báo cáo thỏa mãn bộ lọc
  const totalReports = await Report.countDocuments(filter);

  // Phản hồi kết quả
  res.status(200).json({
      results: reports.length,
      total: totalReports,
      totalPages: Math.ceil(totalReports / limit),
      data: reports,
  });
});
exports.getReportStats = catchAsync(async (req, res, next) => {
  const totalReports = await Report.countDocuments({});
  const processedReports = await Report.countDocuments({ status: 'Approved' });
  const unprocessedReports = await Report.countDocuments({ status: 'Waiting' });

  res.status(200).json({
      totalReports,
      processedReports,
      unprocessedReports,
  });
});


exports.deactivateReportedPost = catchAsync(async (req, res, next) => {
    const { reportId } = req.params;

    // Lấy report theo reportId
    const report = await Report.findById(reportId);
    if (!report) {
        return res.status(404).json({
            error: {
                status: 404,
                message: "Report not found"
            }
        });
    }

    // Kiểm tra entityType của report là 'Post' và lấy reportEntityId (là postId)
    if (report.entityType === 'Post') {
        const postId = report.reportEntityId;

        // Cập nhật isActive của Post thành false
        const updatedPost = await Post.findByIdAndUpdate(postId, { isActive: false }, { new: true });

        if (!updatedPost) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: "Post not found or already deactivated"
                }
            });
        }

        res.status(200).json({
            message: "Post deactivated successfully",
            post: updatedPost
        });
    } else {
        res.status(400).json({
            error: {
                status: 400,
                message: "The report is not associated with a Post entity"
            }
        });
    }
});
