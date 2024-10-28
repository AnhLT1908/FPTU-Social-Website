const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    postId: { type: mongoose.Schema.ObjectId, ref: 'Post' },
    parentId: { type: mongoose.Schema.ObjectId, ref: 'Comment' },
    content: String,
    isEdited: Boolean,
    childrens: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
commentSchema.post('save', async function (doc, next) {
  try {
    if (doc.parentId) {
      await Comment.findByIdAndUpdate(doc.parentId, {
        $addToSet: { childrens: doc._id },
      });
    }
    next();
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
});
commentSchema.post('findOneAndDelete', async function (doc, next) {
  try {
    if (doc.childrens.length > 0) {
      const deleteChildren = async (commentId) => {
        const childrenComments = await Comment.find({ parentId: commentId });

        for (let child of childrenComments) {
          await deleteChildren(child._id);
          await Comment.findByIdAndDelete(child._id);
        }
      };

      await deleteChildren(doc._id);
    }
    next();
  } catch (err) {
    next(err); // Pass the error to the next middleware
  }
});
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
