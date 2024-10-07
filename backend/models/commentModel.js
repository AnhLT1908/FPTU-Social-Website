const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    postId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    parentId: { type: mongoose.Schema.ObjectId, ref: 'Comment' },
    hasParent: Boolean,
    content: String,
    isEdited: Boolean,
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
