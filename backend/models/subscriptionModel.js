const mongoose = require('mongoose');
const Community = require('./communityModel');
const User = require('./userModel');
const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    communityId: { type: mongoose.Schema.ObjectId, ref: 'Community' },
    role: { type: String, enum: ['member', 'moderator'] },
    access:{type:Boolean, default: true}
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// MIDDLEWARE
// When subcription is updated (user change role)
subscriptionSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  // New role
  const newRole = update.role;
  // Get the current subscription document
  const subscription = await this.model.findOne(this.getQuery());
  if (subscription) {
    const { userId, communityId, role } = subscription;
    // Handle role change
    if (role === 'member' && newRole === 'moderator') {
      // Add user to community's moderators and user's moderatorCommunities
      await Community.findByIdAndUpdate(communityId, {
        $addToSet: { moderators: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $addToSet: { moderatorCommunities: communityId },
      });
    } else if (role === 'moderator' && newRole === 'member') {
      // Remove user from community's moderators and user's moderatorCommunities
      await Community.findByIdAndUpdate(communityId, {
        $pull: { moderators: userId },
      });
      await User.findByIdAndUpdate(userId, {
        $pull: { moderatorCommunities: communityId },
      });
    }
  }

  next();
});
// When a subscription is created (user joins a community)
subscriptionSchema.post('save', async function (doc, next) {
  try {
    if (doc.role === 'member')
      // Update memberCount in the community document
      await Community.findByIdAndUpdate(doc.communityId, {
        $inc: { memberCount: 1 },
      });
    next();
  } catch (err) {
    next(err);
  }
});
// When a subscription is removed (user leaves a community)
subscriptionSchema.post('findOneAndDelete', async function (doc, next) {
  if (doc) {
    try {
      // Update memberCount in the community document
      await Community.findByIdAndUpdate(doc.communityId, {
        $inc: { memberCount: -1 },
      });

      // If the user was a moderator, also remove them from the moderators list
      if (doc.role === 'moderator') {
        await Community.findByIdAndUpdate(doc.communityId, {
          $pull: { moderators: doc.userId },
        });
        await User.findByIdAndUpdate(doc.userId, {
          $pull: { moderatorCommunities: doc.communityId },
        });
      }

      next();
    } catch (err) {
      next(err);
    }
  }
});
const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
