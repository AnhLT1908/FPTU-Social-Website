var mongoose = require('mongoose');
const Community = require('../models/communityModel');
const Post = require('../models/postModel');
const catchAsync = require('../utils/catchAsync');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
// CRUD
exports.getPostById = factoryGetOne(Post);
exports.createNewPost = factoryCreateOne(Post);
exports.getAllPosts = factoryGetAll(Post);
exports.updatePost = factoryUpdateOne(Post);
exports.deletePost = factoryDeleteOne(Post);
exports.getGuestFeed = catchAsync(async (req, res, next) => {
  const limit = Number(req.query.limit ?? 5);
  const communityIds = await Community.find({
    privacyType: { $in: ['public', 'restricted'] },
  }).distinct('_id');
  let filter = {};
  filter.communityId = { $in: communityIds };
  let sortBy = '-_id';
  if (req.query.sort) {
    sortBy += ` ${req.query.sort.split(',').join(' ')}`;
  }
  if (req.query.next) {
    if (!mongoose.Types.ObjectId.isValid(req.query.next)) {
      return next(new AppError('Invalid ID format', 400));
    }
    const nextId = mongoose.Types.ObjectId(req.query.next);
    filter._id = { $lt: nextId };
  }
  const feed = Post.find(filter).sort(sortBy).limit(limit).lean();
  const nextCursor = feed.length > 0 ? feed[feed.length - 1]._id : null;
  const hasMore = feed.length === limit;
  res.status(200).json({ feed, next: nextCursor, hasMore });
});
exports.getMyFeed = catchAsync(async (req, res, next) => {
  let subscribedCommunityIds = await Subscription.find({
    userId: req.user.id,
  }).distinct('communityId');
  const communityIds = await Community.find({
    privacyType: { $in: ['public', 'restricted'] },
  }).distinct('_id');
  const mergedCommunityIds = [
    ...new Set([...subscribedCommunityIds, ...communityIds]),
  ];
  let filter = {};
  filter.communityId = { $in: mergedCommunityIds };
  let sortBy = '-_id';
  if (req.query.sort) {
    sortBy += ` ${req.query.sort.split(',').join(' ')}`;
  }
  if (req.query.next) {
    if (!mongoose.Types.ObjectId.isValid(req.query.next)) {
      return next(new AppError('Invalid ID format', 400));
    }
    const nextId = mongoose.Types.ObjectId(req.query.next);
    filter._id = { $lt: nextId };
  }
  const feed = Post.find(filter).sort(sortBy).limit(limit).lean();
  const nextCursor = feed.length > 0 ? feed[feed.length - 1]._id : null;
  const hasMore = feed.length === limit;
  res.status(200).json({ feed, next: nextCursor, hasMore });
});
