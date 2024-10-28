const mongoose = require('mongoose');
const Community = require('./communityModel');
const Comment = require('./commentModel');
const Vote = require('./voteModel');
const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    communityId: { type: mongoose.Schema.ObjectId, ref: 'Community' },
    title: String,
    content: String,
    media: [],
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
postSchema.virtual('hotnessScore').get(function () {
  return this.upVotes + this.downVotes + this.commentCount;
});
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
// After delete a post
postSchema.post('findOneAndDelete', async function (doc, next) {
  try {
    if (doc) {
      // Check if a document was found and deleted
      await Community.findByIdAndUpdate(doc.communityId, {
        $inc: { postCount: -1 },
      });
      await Comment.deleteMany({ postId: doc._id });
      await Vote.deleteMany({
        entityType: 'Post',
        voteEntityId: doc._id,
      });
    }
    next();
  } catch (err) {
    next(err);
  }
});
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
