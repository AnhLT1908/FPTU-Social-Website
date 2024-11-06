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
  const { page = 1, limit = 5, status, entityType, description } = req.query;

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
  const processedReports = await Report.countDocuments({ status: { $in: ['Approved', 'Cancel'] } });

  const unprocessedReports = await Report.countDocuments({ status: 'Waiting' });

  res.status(200).json({
      totalReports,
      processedReports,
      unprocessedReports,
  });
});


exports.deactivateReportedPost = catchAsync(async (req, res, next) => {
    const { postId } = req.params;
    const { action } = req.body; // Nhận `action` từ frontend: 'Approved' hoặc 'Cancel'

    // Tìm tất cả các report liên quan đến postId
    const reports = await Report.find({ reportEntityId: postId, entityType: 'Post' });

    if (!reports || reports.length === 0) {
        return res.status(404).json({
            error: {
                status: 404,
                message: "No reports found for this post"
            }
        });
    }

    // Kiểm tra `action` để xác định xem cần cập nhật post hay chỉ các report
    if (action === 'Approved') {
        // Cập nhật isActive của Post thành false và cập nhật trạng thái của các report
        const updatedPost = await Post.findByIdAndUpdate(postId, { isActive: false }, { new: true });

        if (!updatedPost) {
            return res.status(404).json({
                error: {
                    status: 404,
                    message: "Post not found or already deactivated"
                }
            });
        }

        await Report.updateMany(
            { reportEntityId: postId, entityType: 'Post' },
            { status: 'Approved' }
        );

        res.status(200).json({
            message: "Post deactivated and reports approved successfully",
            post: updatedPost,
            reportsUpdated: reports.length
        });
    } else if (action === 'Cancel') {
        // Chỉ cập nhật trạng thái của các report mà không thay đổi isActive của post
        await Report.updateMany(
            { reportEntityId: postId, entityType: 'Post' },
            { status: 'Cancel' }
        );

        res.status(200).json({
            message: "Reports canceled successfully",
            reportsUpdated: reports.length
        });
    } else {
        res.status(400).json({
            error: {
                status: 400,
                message: "Invalid action. Action must be either 'Approved' or 'Cancel'."
            }
        });
    }
});
