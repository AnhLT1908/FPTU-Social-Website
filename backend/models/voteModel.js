const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Post = require('./postModel');
const Comment = require('./commentModel');
const Community = require('./communityModel');
const voteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    voteEntityId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: 'entityType',
    },
    entityType: { type: String, required: true, enum: ['Post', 'Comment'] },
    isUpVote: { type: Boolean, required: true },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// MIDDLEWARES
// Middleware to handle vote update
voteSchema.pre('findOneAndUpdate', async function (next) {
  const update = this.getUpdate();
  // New role
  const newisUpVote = update.isUpVote;
  // Get the current subscription document
  const vote = await this.model.findOne(this.getQuery());
  if (vote) {
    const { entityType, voteEntityId, isUpVote } = vote;
    // Handle role change
    const Model = entityType === 'Post' ? Post : Comment;
    if (newisUpVote !== vote && newisUpVote) {
      // Add user to community's moderators and user's moderatorCommunities
      await Model.findByIdAndUpdate(voteEntityId, {
        $inc: { upVotes: 1, downVotes: -1 },
      });
    } else if (newisUpVote !== vote && !newisUpVote) {
      // Remove user from community's moderators and user's moderatorCommunities
      await Community.findByIdAndUpdate(voteEntityId, {
        $inc: { upVotes: -1, downVotes: 1 },
      });
    }
  }
  next();
});
// When vote is created
voteSchema.post('save', async function (doc, next) {
  try {
    const Model = this.entityType === 'Post' ? Post : Comment;
    // Update voteCount in the community document
    if (this.isUpVote) {
      await Model.findByIdAndUpdate(doc.voteEntityId, {
        $inc: { upVotes: 1 },
      });
    } else {
      await Model.findByIdAndUpdate(doc.voteEntityId, {
        $inc: { downVotes: 1 },
      });
    }

    next();
  } catch (err) {
    next(err);
  }
});

// When a subscription is removed (user leaves a community)
voteSchema.post('findOneAndDelete', async function (doc, next) {
  if (doc) {
    const Model = doc.entityType === 'Post' ? Post : Comment;
    try {
      // Update memberCount in the community document
      if (doc.isUpVote) {
        await Model.findByIdAndUpdate(doc.voteEntityId, {
          $inc: { upVotes: -1 },
        });
      } else {
        await Model.findByIdAndUpdate(doc.voteEntityId, {
          $inc: { downVotes: -1 },
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  }
});

//==============//
const Vote = mongoose.model('Vote', voteSchema);
module.exports = Vote;
