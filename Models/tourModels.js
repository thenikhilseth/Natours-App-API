const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal then 40 characters'],
      minlength: [10, 'A tour name must have more or equal then 10 characters'],
      validate: {
        validator: function(val) {
          return validator.isAlpha(val.replace(/ /g, ''));
        },
        message: 'A tour name must only contain letters'
        // validate: [validator.isAlpha, "A tour name must only contain letters"]
      }
    },
    nameInCapital: {
      type: String
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'hard'],
        message: 'Difficulty must be either easy, medium or hard'
      }
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1.0, 'Ratings must be above 1.0'],
      max: [5.0, 'Ratings must be below 5.0']
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          if (val > this.price) return false;
        },
        message: 'Discount ({VALUE}) cannot be greater than cost price'
      }
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    secretTour: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false //it vl hide this field to client.
    },
    startDates: [Date]
  },
  {
    toJSON: { virtuals: true }, //Because we are sending JSON response to client and we do virtuals for clients only
    toObject: { virtuals: true }
  }
);

//Virtual Properties to add the durationWeek field in the response
tourSchema.virtual('durationWeeks').get(function() {
  if (this.duration) {
    return this.duration / 7;
  }
});

//DOCUMENT MIDDLEWARE
//Before document get saved

tourSchema.pre('save', function(next) {
  this.nameInCapital = slugify(this.name, { lower: true });
  next();
});

tourSchema.post('save', function(doc, next) {
  // console.log(doc);
  console.log('Document Saved');
  next();
});

//QUERY MIDDLEWARE

tourSchema.pre(/^find/, function(next) {
  //vl work for all find such as findById, findOne, find etc
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
