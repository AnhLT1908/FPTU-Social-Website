const Community = require('../models/communityModel');
const Post = require('../models/postModel');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const subscriptionController = require('./subscriptionController');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
exports.isModerator = catchAsync(async (req, res, next) => {
  console.log(req.user.moderatorCommunities);
  const exists = req.user.moderatorCommunities.some((m) => m == req.params.id);
  if (!exists) {
    return next(
      new AppError('You do not have permission to perform this action', 403)
    );
  }
  next();
});
// CRUD
exports.getCommunityById = factoryGetOne(Community);
exports.createNewCommunity = factoryCreateOne(Community);
exports.getAllCommunities = factoryGetAll(Community);
exports.updateCommunity = factoryUpdateOne(Community);
exports.deleteCommunity = catchAsync(async (req, res, next) => {
  const community = Community.findById(req.params.id);
  if (!community) {
    return next(
      new AppError(`No document found with ID ${req.params.id}`, 404)
    );
  }
  if (community.memberCount === 1) {
    await Community.findByIdAndDelete(req.params.id);
    await Post.deleteMany({ communityId: req.params.id });
    res.status(204).json({
      message: 'success',
      data: null,
    });
  }
});
exports.searchCommunities = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      status: 'fail',
      message: 'Query parameter is required for searching',
    });
  }

  // Tìm kiếm theo name của community
  const searchFilter = { name: new RegExp(query, 'i') };

  const communities = await Community.find(searchFilter)
    .select('name description logo memberCount') // Chỉ lấy các trường cần thiết
    .limit(10); // Giới hạn số lượng kết quả trả về

  res.status(200).json({
    status: 'success',
    results: communities.length,
    data: communities,
  });
});
// Custom methods
exports.addUserById = subscriptionController.createNewSubscription;
