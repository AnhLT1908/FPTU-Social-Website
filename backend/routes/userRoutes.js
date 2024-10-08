const express = require('express');
const userController = require('../controllers/userController');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
  restrictTo,
  isLoggedIn,
  logout,
} = require('../controllers/authController');
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/is-logged-in', isLoggedIn);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
// Protect All From This Point
router.use(protect);
router.patch('/change-password/', updatePassword);
router.get('/me', userController.getMe, userController.getUserById);
router.patch(
  '/update-me',
  // userController.uploadUserPhoto,
  // userController.resizeUserPhoto,
  userController.updateMe
);
router.delete('/delete-me', userController.deleteMe);
// Restrict To ADMIN Only
router.use(restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUserById)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
