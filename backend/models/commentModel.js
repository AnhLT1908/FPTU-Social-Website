const mongoose = require('mongoose');
const Post = require('./postModel');
const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    postId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    parentId: { type: mongoose.Schema.ObjectId, ref: 'Comment' },
    hasParent: { type: Boolean, default: false },
    childrens: [{ type: mongoose.Schema.ObjectId, ref: 'Comment' }],
    content: String,
    isEdited: { type: Boolean, default: false },
    tagInfo: {
      userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
      tagName: String,
    },
    votes: { type: Map, of: Boolean },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
