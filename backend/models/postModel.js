const mongoose = require('mongoose');
const Community = require('./communityModel');
const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    communityId: { type: mongoose.Schema.ObjectId, ref: 'Community' },
    title: String,
    content: String,
    media: [
      {
        type: String,
      },
    ],
    commentCount: { type: Number, default: 0 },
    votes: { type: Map, of: Boolean, default: {} },
    isEdited: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
// MIDDLEWARES
postSchema.pre(/^find/, function (next) {
  this.find({ isActive: { $ne: false } });
  next();
});
// After create a new post
postSchema.post('save', async function (doc, next) {
  try {
    // Increment postCount in the associated Community document
    await Community.findByIdAndUpdate(doc.communityId, {
      $inc: { postCount: 1 },
    });
    next(); // Call next middleware
  } catch (err) {
    next(err); // Handle any errors
  }
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
