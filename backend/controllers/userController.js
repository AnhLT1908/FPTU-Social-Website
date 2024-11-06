const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Post = require('../models/postModel');
const APIFeatures = require('../utils/apiFeatures');
const mongoose = require('mongoose');
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
const multerStorage = multer.memoryStorage();

// Bộ lọc chỉ cho phép upload ảnh
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload images only.', 400), false);
  }
};

// Khởi tạo upload với cấu hình trên
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

// Middleware để upload ảnh
exports.uploadUserPhoto = upload.single('image');

// Hàm để resize ảnh và cập nhật trường avatar hoặc background
exports.updateUserImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('Please upload an image file.', 400));
  }

  // Đặt tên file cho ảnh đã xử lý
  const filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Đường dẫn lưu ảnh vào thư mục src/images/userImage
  const outputPath = path.join(
    __dirname,
    '../../frontend/public/images/userImage',
    filename
  );
  console.log('Path', outputPath);
  // Kiểm tra nếu thư mục chưa tồn tại, tạo thư mục
  const dirPath = path.dirname(outputPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Resize ảnh và lưu vào đường dẫn mới
  await sharp(req.file.buffer)
    .resize(500, 500) // Tùy chỉnh kích thước ảnh
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(outputPath);

  // Cập nhật ảnh vào trường avatar hoặc background tùy theo yêu cầu từ client
  const updateField = req.body.type === 'background' ? 'background' : 'avatar';
  const updateData = { [updateField]: `/images/userImage/${filename}` };

  // Cập nhật thông tin người dùng trong cơ sở dữ liệu
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updateData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    message: `${updateField} updated successfully!`,
    user: updatedUser,
  });
});
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
  res.status(200).json({ message: 'Hello' });
};
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
    user: updatedUser,
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
exports.getUserById = factoryGetOne(User, {
  path: 'bookmarks',
  populate: [{ path: 'communityId' }, { path: 'userId' }],
});
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
  const activeUsersCount = await User.countDocuments({
    ...filter,
    isActive: true,
  });
  const inactiveUsersCount = await User.countDocuments({
    ...filter,
    isActive: false,
  });

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
    message: `User status has been updated to ${
      user.isActive ? 'active' : 'inactive'
    }.`,
    data: {
      user,
    },
  });
});
exports.searchUsers = catchAsync(async (req, res, next) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      status: 'fail',
      message: 'Query parameter is required for searching',
    });
  }

  // Tìm kiếm theo displayName
  const searchFilter = { username: new RegExp(query, 'i') };

  const users = await User.find(searchFilter)
    .select('username displayName email avatar') // Chỉ lấy các trường cần thiết
    .limit(10);

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: users,
  });
});
exports.getPostUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log('user id', id);
    const posts = await Post.find({ userId: mongoose.Types.ObjectId(id) })
      .populate('communityId')
      .populate('userId')
      .exec();

    if (posts) {
      res.status(200).json(posts);
      console.log('Post found', posts);
    } else {
      res.status(404).json({ message: 'No posts found for this user' });
    }
  } catch (error) {
    next(error);
  }
};
