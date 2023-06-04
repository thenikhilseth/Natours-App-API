const express = require('express');
const userHandler = require('../routeHandlers/userController');
const authHandler = require('./../routeHandlers/authController');
const userController = require('./../routeHandlers/userController');

//Router
const router = express.Router();

//############AUTHENTICATION AND AUTHORIZATION##########/////////

router.route('/signup').post(authHandler.signup);
router.route('/login').post(authHandler.login);
router.route('/forgotPassword').post(authHandler.forgotPassword);
router.route('/resetPassword/:token').patch(authHandler.resetPassword);
router
  .route('/updatePassword')
  .patch(authHandler.protectedRoute, authHandler.updatePassword);

////################## USER ROUTES#########//////////////////////////

router
  .route('/')
  .get(userHandler.getAllUsers)
  .post(userHandler.createUser);

router
  .route('/updateMe')
  .patch(authHandler.protectedRoute, userController.updateMe);

router
  .route('/deleteMe')
  .delete(authHandler.protectedRoute, userController.deleteMe);
router
  .route('/:id')
  .get(userHandler.getUser)
  .patch(userHandler.updateUser)
  .delete(userHandler.deleteUser);

module.exports = router;
