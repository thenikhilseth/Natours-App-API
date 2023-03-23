const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const app = express();
const tourRouter = require('./Routes/tourRoutes.js');
const userRouter = require('./Routes/userRoutes.js');
const appError = require('./Util/appError');
const errorMiddleware = require('./routeHandlers/errorController');

//MIDDLEWARES

app.use(express.json());

console.log(process.env.NODE_ENV); //Print environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //3rd party middleware
}

app.use(express.static(`${__dirname}/public`)); //To display static files

app.use((req, res, next) => {
  console.log('Hello from the Middleware');
  next();
});

//Get the time of request
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.requestTime);
  next();
});

//ROUTERS MIDDLEWARES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

//HANDLING UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`
  // });

  next(new appError(`Can't find ${req.originalUrl} on this server`));
});

//Sending Error Message (Error Middleware)
app.use(errorMiddleware);

//EXPORTING APP TO SERVER TO START IT
module.exports = app;
