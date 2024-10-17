const Subscription = require('../models/subscriptionModel');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
  factoryCreateOne,
} = require('./handlerFactory');
// CRUD
exports.getSubscriptionById = factoryGetOne(Subscription);
exports.createNewSubscription = factoryCreateOne(Subscription);
exports.getAllSubscriptions = factoryGetAll(Subscription);
exports.updateSubscription = factoryUpdateOne(Subscription);
exports.deleteSubscription = factoryDeleteOne(Subscription);

// exports.getSubscriptionByUserId = catchAsync(async (req, res, next) => {
//   const communities = await Subscription.find({
//     userId: req.user.id,
//     role: 'member',
//   }).populate('communityId', 'name description logo'); // Adjust the fields as needed for community
//   const doc = communities.map((sub) => sub.communityId);
//   res.status(200).json(doc);
// });
