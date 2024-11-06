const mongoose = require('mongoose');
const Community = require('../models/communityModel');
const Post = require('../models/postModel');
const Subscription = require('../models/subscriptionModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');

// // Get feed for guest users
const Comment = require('../models/commentModel');
// CRUD
exports.getPostById = factoryGetOne(Post, 'communityId userId');
exports.createNewPost = factoryCreateOne(Post);
exports.getAllPosts = factoryGetAll(Post);
exports.updatePost = factoryUpdateOne(Post);
exports.deletePost = catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(
      new AppError(`No document found with ID ${req.params.id}`, 404)
    );
  }
  // Check if a document was found and deleted
  await Community.findByIdAndUpdate(doc.communityId, {
    $inc: { postCount: -1 },
  });
  await Comment.deleteMany({ postId: doc._id });
  // await Vote.deleteMany({
  //   entityType: 'Post',
  //   voteEntityId: doc._id,
  // });
  res.status(204).json({
    message: 'success',
    data: null,
  });
});
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

exports.getMyFeed = catchAsync(async (req, res, next) => {
  const limit = Number(req.query.limit) || 5;

  const subscribedCommunityIds = await Subscription.find({
    userId: req.user.id,
  }).distinct('communityId');
  const communityIds = await Community.find({
    privacyType: { $in: ['public', 'restricted'] },
  }).distinct('_id');
  const mergedCommunityIds = [
    ...new Set([...subscribedCommunityIds, ...communityIds]),
  ];

  const feed = await Post.aggregate([
    { $match: { communityId: { $in: mergedCommunityIds }, isActive: true } },
    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
      },
    },
    {
      $lookup: {
        from: 'communities',
        localField: 'communityId',
        foreignField: '_id',
        as: 'communityId',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userId',
      },
    },
    {
      $unwind: { path: '$communityId', preserveNullAndEmptyArrays: true },
    },
    {
      $unwind: { path: '$userId', preserveNullAndEmptyArrays: true },
    },
    {
      $project: {
        communityId: 1,
        userId: 1,
        title: 1,
        createdAt: 1,
        votes: 1,
        media: 1,
        commentsCount: { $size: '$comments' },
        hotnessScore: {
          $add: [
            {
              $size: {
                $filter: {
                  input: { $objectToArray: '$votes' },
                  as: 'vote',
                  cond: { $eq: ['$$vote.v', true] },
                },
              },
            }, // Count upvotes
            {
              $size: {
                $filter: {
                  input: { $objectToArray: '$votes' },
                  as: 'vote',
                  cond: { $eq: ['$$vote.v', false] },
                },
              },
            }, // Count downvotes
            { $size: '$comments' },
          ],
        },
      },
    },
    {
      $sort:
        req.query.sort === 'hot' ? { hotnessScore: -1 } : { createdAt: -1 },
    },
    { $limit: limit },
  ]);

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

exports.votePost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const post = await Post.findById(id);
  if (!post.votes) post.votes = new Map();
  if (req.body.vote == 'none') {
    post.votes.delete(req.user.id);
  } else {
    post.votes.set(req.user.id, req.body.vote);
  }
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    { votes: post.votes },
    { new: true }
  );
  res.status(200).json(updatedPost);
});

// Setup multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Middleware to handle multiple image uploads
exports.uploadPostPhotos = upload.array('images', 5);  // Adjust the number as needed

// Create new post with images
exports.createNewPostWithImages = async (req, res, next) => {
  try {
    const filenames = [];
    // Handle image processing
    for (const file of req.files) {
      const filename = `post-${req.user.id}-${Date.now()}-${file.originalname}`;
      const outputPath = path.join(__dirname, '../../frontend/public/images/postImages', filename);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });

      await sharp(file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(outputPath);
      
      filenames.push(`/images/postImages/${filename}`);
    }

    // Create post
    const newPost = await Post.create({
      userId: req.user.id,
      communityId: req.body.communityId,
      title: req.body.title,
      content: req.body.content,
      media: filenames,
    });

    res.status(201).json({
      status: 'success',
      message: 'Post created with images!',
      post: newPost,
    });
  } catch (error) {
    console.error('Error creating post with images:', error);
    res.status(500).json({ status: 'error', message: 'Failed to create post.' });
  }
};
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
  votePost: exports.votePost,
  uploadPostPhotos: exports.uploadPostPhotos,
  createNewPostWithImages: exports.createNewPostWithImages
};

module.exports = postController;
