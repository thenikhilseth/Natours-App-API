const express = require('express');
const userHandler = require('../routeHandlers/userController');

//Router
const router = express.Router();

router.route('/').get(userHandler.getAllUsers).post(userHandler.createUser);
router
  .route('/:id')
  .get(userHandler.getUser)
  .patch(userHandler.updateUser)
  .delete(userHandler.deleteUser);

module.exports = router;
