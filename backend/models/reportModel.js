const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: 'User' },
    reportEntityId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      refPath: 'entityType',
    },
    entityType: {
      type: String,
      required: true,
      enum: ['Post', 'Comment', 'User'],
    },
    description: String,
    status: { type: String, enum: ['Waiting', 'Approved', 'Cancel'] },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
