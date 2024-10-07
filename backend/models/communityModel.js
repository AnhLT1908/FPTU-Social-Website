const mongoose = require('mongoose');
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
    memberCount: Number,
    postCount: Number,
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
const Community = mongoose.model('Community', communitySchema);
module.exports = Community;
