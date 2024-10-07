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
