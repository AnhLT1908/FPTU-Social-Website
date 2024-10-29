const express = require('express');
const userController = require('../controllers/userController');
const {register} = require('../controllers/userController');
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
  checkUsername,
  getAllUsersPaginate,
  checkEmail,
  checkStudentCode

} = require('../controllers/authController');
const router = express.Router();
router.post('/signup', signup);
router.post('/check-email', checkEmail);
router.post('/check-student-code', checkStudentCode);
router.post('/check-username', checkUsername);
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
router.get('/list',userController.getAllUsersPaginate)
router.patch('/:id/toggle-active', userController.toggleUserActiveStatus);
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
