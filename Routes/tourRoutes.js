const express = require('express');
const authController = require('./../routeHandlers/authController');
const reviewController = require('./../routeHandlers/reviewController');
const reviewRouter = require('./reviewRoutes');
const {
  getAllTours,
  getOneTour,
  createTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStatus
} = require('./../routeHandlers/tourController');
//Another way of writing the functions we imported

//Creating Router
const router = express.Router();

// router.param('id');

router.route('/five-cheapest-tours').get(aliasTopTours, getAllTours);
router.route('/get-tour-status').get(getTourStatus);

router
  .route('/')
  .get(authController.protectedRoute, getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(
    authController.protectedRoute,
    authController.permission('admin', 'lead-guide'),
    deleteTour
  );

// router
//   .route('/:tourId/reviews')
//   .post(
//     authController.protectedRoute,
//     authController.permission('user'),
//     reviewController.createReview
//   );

router.use('/:tourId/reviews', reviewRouter); //router is also a middleware, so we can use use method on router.
//like we did app.use(url, router) in app file.
module.exports = router;
