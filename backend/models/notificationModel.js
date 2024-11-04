const mongoose = require('mongoose');
const { sendNotification } = require('../socket');
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    resourceId: String,
    notifType: { type: String, enum: ['communityNewPost', 'Tag'] },
    title: String,
    description: String,
    seen: { type: Boolean, default: false },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
