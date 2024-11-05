const mongoose = require('mongoose');

const User = require('./userModel');
const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'An user must have an username'],
    },
    description: String,
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    moderators: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    logo: {
      type: String,
      default: 'default.jpg',
    },
    background: {
      type: String,
      default: 'default.jpg',
    },
    privacyType: {
      type: String,
      enum: ['private', 'restricted', 'public'],
      default: 'public',
    },
    memberCount: { type: Number, default: 1 },
    postCount: { type: Number, default: 0 },
    joinRequests: [
      {
        userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
        reason: { type: String },
        access: { type: Boolean, default: false },
      },
    ],
    communityRule: String,
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// MIDDLEWARES
communitySchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});
communitySchema.post('save', async function (doc, next) {
  try {
    await User.findByIdAndUpdate(doc.createdBy, {
      $push: { moderatorCommunities: doc._id },
    });
    const Subscription = require('./subscriptionModel');
    await Subscription.create({
      userId: doc.createdBy,
      communityId: doc._id,
      role: 'moderator',
    });
    next();
  } catch (err) {
    next(err);
  }
});
const Community = mongoose.model('Community', communitySchema);
module.exports = Community;
