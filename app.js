const express = require('express');
const fs = require('fs');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const app = express();
const tourRouter = require('./Routes/tourRoutes.js');
const userRouter = require('./Routes/userRoutes.js');
const reviewRouter = require('./Routes/reviewRoutes.js');
const appError = require('./Util/appError');
const errorMiddleware = require('./routeHandlers/errorController');
const ExpressMongoSanitize = require('express-mongo-sanitize');

//Global MIDDLEWARES

//Set Security HTTP Headers
app.use(helmet());

app.use(express.json());
console.log(process.env.NODE_ENV); //Print environment

//Development Logging Middleware

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); //3rd party middleware
}

//Body parse, reading data from body to req.body- convert JSON to js object, here we set the maximum size of file
// our middleware can parse to 20kb
app.use(express.json({ limit: '20kb' }));

//Display static files middleware
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

//RATE LIMITER Middleware
const limiter = rateLimit({
  max: 5,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests! Please try again after 1 hour'
});
app.use('/api', limiter);

//NoSQL Query Injection
app.use(mongoSanitize());

//Data Sanitization using xss
app.use(xss());

// //Prevent Parameter Pollution using hpp
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  })
);

//ROUTERS MIDDLEWARES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

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
