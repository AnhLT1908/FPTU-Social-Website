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
const { json } = require('body-parser');
const { getIo } = require('../socket');
const Notification = require('../models/notificationModel');
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
exports.createNewCommunity = catchAsync(async (req, res, next) => {
  req.body.memberCount = 1;
  const newCommunity = await Community.create(req.body);
  res.status(201).json(newCommunity);
});
exports.getAllCommunities = factoryGetAll(Community);
exports.updateCommunity = factoryUpdateOne(Community);
exports.deleteCommunity = catchAsync(async (req, res, next) => {
  const community = Community.findById(req.params.id);
  if (!community) {
    return next(
      new AppError(`No document found with ID ${req.params.id}`, 404)
    );
  } else {
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
exports.getPostInCommunity = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log('community id', id);
    const posts = await Post.find({ communityId: mongoose.Types.ObjectId(id) })
      .populate('communityId')
      .populate('userId')
      .exec();

    if (posts) {
      res.status(200).json(posts);
      console.log('Post found', posts);
    } else {
      res.status(404).json({ message: 'No posts found for this community' });
    }
  } catch (error) {
    next(error);
  }
};
exports.getUserInCommunity = async (req, res, next) => {
  try {
    const id = req.params.id;
    const sub = await Subscription.find({ communityId: id });
    if (sub.length > 0) {
      res.status(200).json(sub);
    }
  } catch (error) {
    next(error);
  }
};
exports.deleteUserFromCommunity = async (req, res, next) => {
  try {
    const cId = req.body.communityId;
    const uid = req.body.userId;

    // Cập nhật các trường cần thiết về null
    await Subscription.updateMany(
      { userId: uid, communityId: cId },
      { $set: { userId: null, communityId: null } }
    );

    res.status(204).json({
      message: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
exports.accessRequest = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rIds = req.body.ids; // Giả sử rIds là một mảng chứa các _id của joinRequests cần xử lý

    const community = await Community.findById(id);

    if (community) {
      const subs = community.joinRequests
        .filter((item) => rIds.includes(item._id.toString())) // Chỉ chọn các yêu cầu có _id nằm trong mảng rIds
        .map((item) => ({
          userId: item.userId,
          access: true,
          communityId: id,
          role: 'member',
        }));

      if (subs.length > 0) {
        // Tạo nhiều Subscription cùng lúc
        const newSubs = await Subscription.insertMany(subs);

        // Sử dụng $pull để xóa các joinRequest đã xử lý khỏi community
        await Community.findByIdAndUpdate(id, {
          $pull: { joinRequests: { _id: { $in: rIds } } }, // Loại bỏ các joinRequests có _id nằm trong mảng rIds
        });
        const io = getIo();
        community.joinRequests
          .filter((item) => rIds.includes(item._id.toString())) // Chỉ chọn các yêu cầu có _id nằm trong mảng rIds
          .map(async (item) => {
            const notification = await Notification.create({
              userId: item.userId,
              resourceId: `community/${id}`,
              notifType: 'Joined',
              title: 'Request Accepted',
              description: `You are now a member of ${community.name}. Explore ${community.name}'s posts `,
            });
            console.log(notification);
            io.emit('newNotification', notification);
          });
        rIds.map(async (r) => {});
        // Trả về kết quả
        res.status(201).json(newSubs);
      } else {
        res
          .status(404)
          .json({ message: 'No valid requests found or access not allowed' });
      }
    } else {
      res.status(404).json({ message: 'Community not found' });
    }
  } catch (error) {
    next(error);
  }
};

exports.addRequest = catchAsync(async (req, res, next) => {
  const update = {
    $addToSet: { joinRequests: { $each: req.body.joinRequests } },
  }; // Thay "arrayField" bằng tên trường mảng thực tế

  const doc = await Community.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });

  if (!doc) {
    return next(
      new AppError(`No document found with ID ${req.params.id}`, 404)
    );
  }

  res.status(200).json(doc);
});
exports.getUserCommunites = catchAsync(async (req, res, next) => {
  const queryObj = { ...req.query };
  const excludedFields = ['page', 'sort', 'limit', 'fields', '_extend'];
  excludedFields.forEach((el) => delete queryObj[el]);
  // 1) Filtering
  let queryStr = JSON.stringify(queryObj);
  queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
  let parseQuery = JSON.parse(queryStr);
  const userSubscriptions = await Subscription.find({
    ...parseQuery,
    userId: req.user.id,
  })
    .select('communityId -_id role')
    .populate('communityId');
  const userCommuities = userSubscriptions.map((s) => {
    return s.communityId;
  });
  res.status(200).json(userCommuities);
});
