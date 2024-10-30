const mongoose = require('mongoose');
const Community = require('../models/communityModel');
const Post = require('../models/postModel');
const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');

// CRUD factory methods
exports.getPostById = factoryGetOne(Post, 'communityId userId');
exports.createNewPost = factoryCreateOne(Post);
exports.getAllPosts = factoryGetAll(Post);
exports.updatePost = factoryUpdateOne(Post);
exports.deletePost = factoryDeleteOne(Post);

// Get feed for guest users
exports.getGuestFeed = catchAsync(async (req, res, next) => {
  const limit = Number(req.query.limit ?? 5);
  const communityIds = await Community.find({
    privacyType: { $in: ['public', 'restricted'] },
  }).distinct('_id');

  let filter = { communityId: { $in: communityIds } };
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

  const feed = await Post.find(filter).sort(sortBy).limit(limit).lean();
  const nextCursor = feed.length > 0 ? feed[feed.length - 1]._id : null;
  const hasMore = feed.length === limit;

  res.status(200).json({ feed, next: nextCursor, hasMore });
});

// Get personalized feed for authenticated users
exports.getMyFeed = catchAsync(async (req, res, next) => {
  const subscribedCommunityIds = await Subscription.find({
    userId: req.user.id,
  }).distinct('communityId');

  const communityIds = await Community.find({
    privacyType: { $in: ['public', 'restricted'] },
  }).distinct('_id');

  const mergedCommunityIds = [
    ...new Set([...subscribedCommunityIds, ...communityIds]),
  ];

  let filter = { communityId: { $in: mergedCommunityIds } };
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

  const feed = await Post.find(filter).sort(sortBy).limit(limit).lean();
  const nextCursor = feed.length > 0 ? feed[feed.length - 1]._id : null;
  const hasMore = feed.length === limit;

  res.status(200).json({ feed, next: nextCursor, hasMore });
});


exports.getPostByUserId = catchAsync(async (req, res, next) => {
  const userId = req.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return next(new AppError('Invalid user ID format', 400));
  }

  const listPost = await Post.find({ userId: userId })
    .populate('communityId')
    .populate('userId')
    .exec();

  if (!listPost.length) {
    return next(new AppError('No posts found for this user', 404));
  }

  res.status(200).json(listPost);
});

// Exporting the postController object
const postController = {
  getPostById: exports.getPostById,
  createNewPost: exports.createNewPost,
  getAllPosts: exports.getAllPosts,
  updatePost: exports.updatePost,
  deletePost: exports.deletePost,
  getGuestFeed: exports.getGuestFeed,
  getMyFeed: exports.getMyFeed,
  getPostByUserId: exports.getPostByUserId,
};

module.exports = postController;
