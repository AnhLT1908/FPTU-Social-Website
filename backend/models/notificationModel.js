const mongoose = require('mongoose');
const { sendNotification } = require('../socket');
const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    resourceId: String,
    notifType: { String, enum: ['communityNewPost', 'Tag'] },
    title: String,
    description: String,
    seen: Boolean,
    createdAt: Date,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

notificationSchema.post('save', async function (doc, next) {
  try {
    sendNotification({ recipientId: doc.userId, notification: doc });
    next();
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
});
const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
