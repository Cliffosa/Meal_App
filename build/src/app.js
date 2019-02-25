"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _index = _interopRequireDefault(require("../src/routes/index"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// DATABASE;
// import db from './util/db';
// //TEST DB
// db.authenticate()
//   .then(() => {
//     console.log('Connection has been established successfully.');
//   })
//   .catch(err => {
//     console.error('Unable to connect to the database:', err);
//   });
// initialize express
var app = (0, _express.default)(); //configure bodyParser for incoming requests data

app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: false
})); // use router

app.use(_index.default);
app.get('/', function (req, res) {
  return res.status(200).send({
    message: "Welcome To Book-A-Meal-App Book-A-Meal is an application that allows customers to make food orders and helps the foodvendor know what the customers want to eat."
  });
}); // assigned port variable

var PORT = process.env.PORT || 5000; // call app to listen to the port

app.listen(PORT, function () {
  console.log("App listening to port ".concat(PORT));
});
var _default = app;
exports.default = _default;
//# sourceMappingURL=app.js.map