const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    communityId: { type: mongoose.Schema.ObjectId, ref: 'Community' },
    title: String,
    content: String,
    media: [],
    upVote: { type: Number, default: 0 },
    downVote: { type: Number, default: 0 },
    isEdited: Boolean,
    isActive: Boolean,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Post = mongoose.model('Post', postSchema);
module.exports = Post;
