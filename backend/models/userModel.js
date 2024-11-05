const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'An user must have an username'],
    },
    displayName: {
      type: String,
    },
    bio: String,
    email: {
      type: String,
      unique: true,
      required: [true, 'An user must have an email'],
      lowercase: true,
      validate: [validator.isEmail, 'Email is invalid'],
    },
    avatar: {
      type: String,
      default: 'default.jpg',
    },
    background: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    password: {
      type: String,
      required: [true, 'An user must have a password'],
      minlength: 1,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    isNoticed: Boolean,
    studentCode: { type: String, unique: true },
    followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    followings: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.ObjectId, ref: 'Post' }],
    moderatorCommunities: [
      { type: mongoose.Schema.ObjectId, ref: 'Community' },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  // this.passwordConfirm = undefined;
  next();
});
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchema.pre(/^find/, function (next) {
  // Apply filtering only if noIsActiveFilter is not set to true
  if (!this.getOptions().noIsActiveFilter) {
    this.find({ isActive: { $ne: false } });
  }
  next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changeTimeStamp;
  }
  return false;
};
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model('User', userSchema);
module.exports = User;
