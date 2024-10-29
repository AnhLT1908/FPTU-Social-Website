const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');
const {
  factoryDeleteOne,
  factoryUpdateOne,
  factoryGetOne,
  factoryGetAll,
} = require('./handlerFactory');

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const filterObj = (obj, ...excluded) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!excluded.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
// const multerStorage = multer.memoryStorage();
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an images! Please upload images only.', 400), false);
//   }
// };
// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });
// exports.uploadUserPhoto = upload.single('photo');

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();
//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`public/img/users/${req.file.filename}`);
//   next();
// });
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
exports.register = (req, res, next) => {
  res.status(200).json({message: 'Hello'});
}
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password update!', 400));
  }
  const filterBody = filterObj(req.body, 'isActive');
  if (req.file) filterBody.avatar = req.file.name;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use sign up instead.',
  });
};
// CRUD
exports.getUserById = factoryGetOne(User);
exports.getAllUsers = factoryGetAll(User);
exports.updateUser = factoryUpdateOne(User);
exports.deleteUser = factoryDeleteOne(User);
// Hàm lấy tất cả user với phân trang và lọc theo điều kiện
exports.getAllUsersPaginate = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, email, username } = req.query;

  // Define filter criteria based on query parameters
  let filter = {};
  if (status) filter.status = status;
  if (email) filter.email = email;
  if (username) filter.username = new RegExp(username, 'i');

  // Apply filters and explicitly set the noIsActiveFilter flag to bypass isActive filtering
  const features = new APIFeatures(
    User.find(filter)
      .setOptions({ noIsActiveFilter: true }) // Disable isActive filtering
      .select('username email role studentCode isActive'),
    req.query
  )
    .sort()
    .paginate();

  // Execute the query for paginated users
  const users = await features.query;

  // Get the total number of matching documents
  const totalUsers = await User.countDocuments(filter);

  // Get the count of active and inactive users
  const activeUsersCount = await User.countDocuments({ ...filter, isActive: true });
  const inactiveUsersCount = await User.countDocuments({ ...filter, isActive: false });

  // Send response
  res.status(200).json({
    results: users.length,
    total: totalUsers,
    activeUsersCount,
    inactiveUsersCount,
    totalPages: Math.ceil(totalUsers / limit),
    data: users,
  });
});

exports.toggleUserActiveStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Find the user by ID, bypassing the `isActive` filter and selecting it explicitly
  const user = await User.findOne({ _id: id })
    .setOptions({ noIsActiveFilter: true })
    .select('+isActive');

  if (!user) {
    return next(new AppError(`No user found with ID ${id}`, 404));
  }

  // Toggle the `isActive` status
  user.isActive = !user.isActive;
  await user.save();

  // Response after successful update
  res.status(200).json({
    status: 'success',
    message: `User status has been updated to ${user.isActive ? 'active' : 'inactive'}.`,
    data: {
      user,
    },
  });
});






