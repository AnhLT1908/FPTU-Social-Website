const Community = require('../models/communityModel');
const Post = require('../models/postModel');
const Subscription = require('../models/subscriptionModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
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
// Custom methods
