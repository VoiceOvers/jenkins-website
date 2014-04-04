'use strict';

var app = require('../app'),
  _ = require('lodash');

exports.impl = {};
exports.impl.getDashData = function *(user) {
  var body = {};

  //Retrieve our user.
  user = yield app.models.User.findById(user._id).exec();

  //Find what access the user has;
  var training = yield app.models.TrainingAccess.find({})
    .where('_id').in(user.training.access)
    .populate('content')
    .lean()
    .exec();

  //Only populate if subCategories exist
  training = yield app.models.TrainingAccess.populate(training, {path: 'content.subCategories', model: 'WrappedSubCategory', options: { lean: true }});
  training = yield app.models.TrainingAccess.populate(training, {path: 'content.subCategories.content', model: 'SubCategory', select: '_id name', options: { lean: true }});

  //Get our stats for every training course the user has access to.
  body.courses = yield _.map(training, function (item) {
    var data =  {
      end: item.end,
      exercises: {
        nonStructured: app.models.Exercise.find({})
          .where('progress.completed').ne(null)
          .where('user').equals(user._id)
          .where('training').equals(item.content._id)
          .where('type').in(['Practice'])
          .populate('subCategory')
          .lean()
          .exec(),
        structured: app.models.Exercise.find({})
          .where('progress.completed').ne(null)
          .where('user').equals(user._id)
          .where('training').equals(item.content._id)
          .where('type').in(['Exam Prep'])
          .lean()
          .exec(),
        inProgress: app.models.Exercise.find({})
          .where('progress.completed').equals(null)
          .where('user').equals(user._id)
          .where('training').equals(item.content._id)
          .populate('subCategory')
          .lean()
          .exec()
      },
      start: item.start,
      stats: app.controllers.statistics.impl.trainingStats(item.content._id, user),
      training: item.content
    };

    return data;
  });
  body.courses = yield app.models.TrainingAccess.populate(body.courses, {path: 'exercises.nonStructured.subCategory.content', model: 'SubCategory', options: {lean: true}});
  body.courses = yield app.models.TrainingAccess.populate(body.courses, {path: 'exercises.inProgress.subCategory.content', model: 'SubCategory', options: {lean: true}});

  return body;
};

exports.getDashData = function *(next) {
  try {
    this.body = yield exports.impl.getDashData(this.req.user);
    this.status = 200;
  } catch (e) {
    console.log(e);
    this.body = 'Error Retrieving Data.';
    this.status = 500;
  }
  yield next;
};