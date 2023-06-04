const express = require('express');
const authController = require('./../routeHandlers/authController');
const reviewController = require('./../routeHandlers/reviewController');
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .post(
    authController.protectedRoute,
    authController.permission('user'),
    reviewController.createReview
  )
  .get(authController.protectedRoute, reviewController.getAllReviews);
//Only Users can post reviews, hense using permission middleware.

module.exports = router;
