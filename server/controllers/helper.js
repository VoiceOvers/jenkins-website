var app = require('../app');

// exports.tester = function *(next) {
//   var question = yield app.models.Question.findById('51e0afd45790ab0000000004').exec();
//   console.log(question);
//   question.training = '530ff8a24ac910354537d9dc';
//   question.save();
//   yield next;
// };

exports.tester = function *(next) {

  yield next;
};
// exports.tester = function *(next) {
//   console.log('here');
//   var product = yield app.controllers.products.impl.postOne({
//     category: "51e0245bfcae470000000002",
//     company: "523092ec9fed3b90c7000003",
//     flags: ['Virtual']
//   });
//   console.log(product);
//   this.body = product;
//   yield next;
// };