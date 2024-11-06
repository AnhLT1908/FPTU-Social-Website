const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { register } = require('../controllers/userController');
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
  checkStudentCode,
  googleLogin,
  checkEmailForGoogleLogin,
  activateAccount
} = require('../controllers/authController');
const router = express.Router();
router.post('/signup', signup);
router.get('/activate/:token', activateAccount);
router.post('/check-email', checkEmail);
router.post('/check-email-for-google-login', checkEmailForGoogleLogin);
router.post('/check-student-code', checkStudentCode);
router.post('/check-username', checkUsername);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/logout', logout);
router.post('/is-logged-in', isLoggedIn);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.get('/list', userController.getAllUsersPaginate);
router.patch('/:id/toggle-active', userController.toggleUserActiveStatus);

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
router.patch(
  '/upload-image',  
  userController.uploadUserPhoto,
  userController.updateUserImage 
);

router.get('/search', userController.searchUsers);
router.delete('/delete-me', userController.deleteMe);
// Restrict To ADMIN Only

router.get('/:id', userController.getUserById);
router.use(restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = router;
