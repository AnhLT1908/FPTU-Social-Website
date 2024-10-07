const mongoose = require('mongoose');
const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    voteEntityId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: 'entityType',
    },
    entityType: { type: String, required: true, enum: ['Post', 'Comment'] },
    isUpVote: Boolean,
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;
