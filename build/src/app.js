"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _index = _interopRequireDefault(require("../src/routes/index"));

var _cors = _interopRequireDefault(require("cors"));

var _db = _interopRequireDefault(require("./util/db"));

var _dotenv = require("dotenv");

var _pg = require("pg");

var _user = _interopRequireDefault(require("./models/user"));

var _admin = _interopRequireDefault(require("./models/admin"));

var _meals = _interopRequireDefault(require("./models/meals"));

var _menu = _interopRequireDefault(require("./models/menu"));

var _orders = _interopRequireDefault(require("./models/orders"));

var _orderItems = _interopRequireDefault(require("./models/orderItems"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _swagger = _interopRequireDefault(require("./swagger.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();
var PORT = process.env.PORT || 8000; // config();
// const client = new Client({
//   connectionString: process.env.DATABASE_URL,
//   ssl: true
// });
// client.connect();

app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use((0, _cors.default)());
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swagger.default));
app.use(_index.default);
app.get('/', function (req, res) {
  return res.status(200).send({
    message: "Welcome To Book-A-Meal-App Book-A-Meal is an application that allows customers to make food orders and helps the food vendor know what the customers want to eat."
  });
}); // relationship

_user.default.hasMany(_orders.default, {
  constraints: true,
  onDelete: 'CASCADE'
});

_user.default.hasMany(_orderItems.default, {
  constraints: true,
  onDelete: 'CASCADE'
});

_orders.default.belongsTo(_admin.default, {
  constraints: true,
  onDelete: 'CASCADE'
});

_meals.default.belongsTo(_admin.default, {
  constraints: true,
  onDelete: 'CASCADE'
});

_menu.default.belongsTo(_admin.default, {
  constraints: true,
  onDelete: 'CASCADE'
});

_orderItems.default.belongsTo(_meals.default, {
  constraints: true,
  onDelete: 'CASCADE'
});

_db.default.sync().then(function () {
  app.listen(PORT, function () {
    console.log("App listening to port ".concat(PORT));
    console.log('Connection has been established successfully.');
    app.emit('dbConnected');
  });
}).catch(function (err) {
  console.error('Unable to connect to the database:', err);
});

var _default = app;
exports.default = _default;
//# sourceMappingURL=app.js.map