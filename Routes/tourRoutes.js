const express = require('express');
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
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getOneTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
