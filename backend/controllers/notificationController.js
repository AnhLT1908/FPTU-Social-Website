const Notification = require('../models/notificationModel');
const { sendNotification } = require('../socket');
const catchAsync = require('../utils/catchAsync');
const {
  factoryUpdateOne,
  factoryDeleteOne,
  factoryCreateOne,
} = require('./handlerFactory');

// CRUD
exports.getMyNotifications = catchAsync(async (req, res, next) => {
  const notifications = await Notification.find({ userId: req.user.id })
    .sort({ createAt: -1 })
    .limit(20)
    .lean();
  res.status(200).json(notifications);
});
exports.createNewNotification = factoryCreateOne(Notification);
exports.updateNotification = factoryUpdateOne(Notification);
exports.deleteNotification = factoryDeleteOne(Notification);
