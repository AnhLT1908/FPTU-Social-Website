const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Email = require('../utils/email');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const nodemailer = require('nodemailer');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const createSendToken = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  // Sending response back to client
  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role, // Include user role in the response
    },
  });
};

// Check if email already exists
exports.checkEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered. Please use a different email.', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Email is available.',
  });
});

// Check if student code already exists
exports.checkStudentCode = catchAsync(async (req, res, next) => {
  const { studentCode } = req.body;

  const existingStudentCode = await User.findOne({ studentCode });
  if (existingStudentCode) {
    return next(new AppError('Student code is already registered. Please use a different student code.', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Student Code is available.',
  });
});

// Signup function
exports.signup = catchAsync(async (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}/me;`
  // const randomBytes = await promisify(crypto.randomBytes)(12);
  const newUser = await User.create({
    ...req.body,
    passwordConfirm: req.body.password,
  });
  await new Email(newUser, url);
  createSendToken(newUser, 201, res);
});
// Check if email already exists
exports.checkEmail = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email is already registered. Please use a different email.', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Email is available.',
  });
});

exports.activateAccount = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new AppError('Invalid token or user not found', 400));
    }

    user.isActive = true;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Account activated successfully. You can now log in.',
    });
  } catch (error) {
    return next(new AppError('Activation link expired or invalid', 400));
  }
});


// New function to check if the username is taken
exports.checkUsername = catchAsync(async (req, res, next) => {
  const { username } = req.body;

  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return next(new AppError('Username is already taken. Please choose another.', 400));
  }

  res.status(200).json({
    status: 'success',
    message: 'Username is available.',
  });
});


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return next(new AppError('Vui lòng cung cấp tên người dùng/email và mật khẩu!', 400));
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: email }, { username: email }] // email could be email or username
  }).select('+password');

  // Check if user does not exist or password is incorrect
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Sai mật khẩu hoặc người dùng đã bị khóa', 401));
  }

  // If user found and password correct, create and send token
  createSendToken(user, 200, res);
});



exports.logout = (req, res) => {
  res.status(200).json({ status: 'success' });
};

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  console.log('here');

  if (req.body.jwt) {
    // 1) verify token
    console.log(req.body.jwt);

    const decoded = await promisify(jwt.verify)(
      req.body.jwt,
      process.env.JWT_SECRET
    );
    // 2) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(400).json({
        status: 'fail',
        loggedIn: false,
        message: "User haven't logged in!",
      });
    }

    // 3) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return res.status(400).json({
        status: 'fail',
        loggedIn: false,
        message: 'User had changed password recently!',
      });
    }

    // THERE IS A LOGGED IN USER
    return res.status(200).json({
      status: 'success',
      loggedIn: true,
      user: currentUser,
      token: req.body.jwt,
      message: 'User is already logged in!',
    });
  }
  return res.status(400).json({
    status: 'fail',
    loggedIn: false,
    message: "User haven't logged in!",
  });
});

//Login with google
exports.googleLogin = catchAsync(async (req, res, next) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  // Kiểm tra xem email có đuôi .edu hay không
  if (!payload.email.endsWith('@fpt.edu.vn')) {
    return next(new AppError('Only @fpt.edu.vn email addresses are allowed', 403));
  }

  // Tìm người dùng trong cơ sở dữ liệu
  let user = await User.findOne({ email: payload.email });

  // Tạo tài khoản mới nếu người dùng chưa tồn tại
  if (!user) {
    user = await User.create({
      email: payload.email,
      username: payload.name, // Hoặc bạn có thể xử lý để tạo username từ tên đầy đủ
      password: crypto.randomBytes(16).toString('hex'), // Mật khẩu ngẫu nhiên, vì người dùng sẽ đăng nhập bằng Google
      studentCode: 'auto-generated-or-placeholder', // Có thể tạo mã sinh viên tự động nếu cần
    });
  }

  // Check if user account is active
  if (!user.isActive) {
    return next(new AppError('Tài khoản của bạn đã bị vô hiệu hóa.', 403));
  }

  // Tạo và gửi token đến client
  createSendToken(user, 200, res);
});

exports.checkEmailForGoogleLogin = async (req, res) => {
  try {
    const { email } = req.body;

    // Kiểm tra xem email có được gửi lên không
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // Kiểm tra định dạng email
    if (!/^[\w.%+-]+@fpt\.edu\.vn$/.test(email)) {
      return res.status(400).json({ message: "Only emails with the domain @fpt.edu.vn are allowed." });
    }

    // Tìm người dùng theo email
    const user = await User.findOne({ email });

    if (user) {
      // Email đã tồn tại, trả về phản hồi thành công
      return res.status(200).json({ exists: true, message: "Email found. Proceed to login." });
    } else {
      // Email chưa tồn tại, trả về phản hồi không tìm thấy
      return res.status(200).json({ exists: false, message: "Email not found. Proceed to sign up." });
    }
  } catch (error) {
    console.error("Error checking email for Google login:", error);
    res.status(500).json({ message: "An error occurred while checking the email." });
  }
};


// Authentication
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError('The user belong to this token is no longer exist!', 401)
    );
  }
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }
  req.user = freshUser;
  next();
});
// Authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

const generateRandomPassword = (min = 6, max = 8) => {
  const length = Math.floor(Math.random() * (max - min + 1)) + min;
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return password;
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  // Generate a new random password
  const newPassword = generateRandomPassword();

  // Update user's password (assumes you have a method to hash the password in your model)
  user.password = newPassword;
  await user.save();

  try {
    // Send email with the new password
    await new Email(user, null).sendResetPassword(newPassword);

    res.status(200).json({
      status: 'success',
      message: 'A new password has been sent to your email.',
    });
  } catch (error) {
    return next(new AppError('There was an error sending the email. Try again later!', 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token is invalid or has expired!', 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return next(new AppError('User not found!', 404));
  }

  // Check if oldPassword is provided in the request
  if (!req.body.oldPassword) {
    return next(new AppError('Please provide your current password!', 400));
  }

  // Check if user has a password stored in the database
  if (!user.password) {
    return next(new AppError('Your current password is not set. Please contact support.', 500));
  }

  // Check if current password matches
  const isMatch = await user.correctPassword(req.body.oldPassword, user.password);
  if (!isMatch) {
    return next(new AppError('Your current password is wrong!', 401));
  }

  // Update to new password
  user.password = req.body.newPassword;
  await user.save();

  // Send new token
  createSendToken(user, 200, res);
});