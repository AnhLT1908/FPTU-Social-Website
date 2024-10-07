const mongoose = require('mongoose');
const subscriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    communityId: { type: mongoose.Schema.ObjectId, ref: 'Community' },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Subscription = mongoose.model('Subscription', subscriptionSchema);
module.exports = Subscription;
