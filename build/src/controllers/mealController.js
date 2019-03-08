"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _meals = _interopRequireDefault(require("../models/meals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MealController =
/*#__PURE__*/
function () {
  function MealController() {
    _classCallCheck(this, MealController);
  }

  _createClass(MealController, [{
    key: "createMeal",
    value: function () {
      var _createMeal = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var _req$body, name, price, quantity, image, imageUrl, meal;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _req$body = req.body, name = _req$body.name, price = _req$body.price, quantity = _req$body.quantity;
                image = req.files.image;
                imageUrl = "/api/src/images/".concat(image.name);
                _context.next = 6;
                return _meals.default.create({
                  name: name,
                  price: price,
                  quantity: quantity,
                  imageUrl: imageUrl,
                  adminId: req.admin.id
                });

              case 6:
                meal = _context.sent;
                image.mv(".".concat(imageUrl));
                return _context.abrupt("return", res.status(201).json({
                  status: true,
                  message: 'Meal Added Successfully',
                  addedMeal: {
                    id: meal.id,
                    name: meal.name,
                    price: meal.price,
                    quantity: meal.quantity,
                    imageUrl: meal.imageUrl
                  }
                }));

              case 11:
                _context.prev = 11;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", res.status(404).json({
                  status: false,
                  message: _context.t0.message
                }));

              case 14:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 11]]);
      }));

      function createMeal(_x, _x2) {
        return _createMeal.apply(this, arguments);
      }

      return createMeal;
    }()
  }, {
    key: "getAllMeals",
    value: function () {
      var _getAllMeals = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, res) {
        var meals;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _meals.default.findAll({
                  where: {
                    adminId: req.admin.id
                  }
                });

              case 3:
                meals = _context2.sent;
                return _context2.abrupt("return", res.status(200).json({
                  status: true,
                  message: 'Meals Retrieved Successfully!',
                  fetchData: meals
                }));

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", res.status(404).json({
                  status: false,
                  message: 'Failed to fetch Meals'
                }));

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }));

      function getAllMeals(_x3, _x4) {
        return _getAllMeals.apply(this, arguments);
      }

      return getAllMeals;
    }()
  }, {
    key: "updateMeal",
    value: function () {
      var _updateMeal = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(req, res) {
        var meal, name, price, mealUpdate, image, _imageUrl, _ref, imageUrl;

        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                _context3.next = 3;
                return _meals.default.findOne({
                  where: {
                    id: req.params.id
                  }
                });

              case 3:
                meal = _context3.sent;

                if (meal) {
                  _context3.next = 6;
                  break;
                }

                throw new Error("Meal with ID ".concat(req.params.id, " does not exist, please try another ID"));

              case 6:
                if (req.body.name) {
                  name = req.body.name;
                } else {
                  name = meal.name;
                }

                if (req.body.name) {
                  price = req.body.price;
                } else {
                  price = meal.name;
                }

                mealUpdate = {
                  name: name,
                  price: price
                };

                if (!(req.files !== null)) {
                  _context3.next = 18;
                  break;
                }

                image = req.files.image;
                _imageUrl = "/api/src/images/".concat(image.name);

                _fs.default.unlink(".".concat(meal.imageUrl), function (error) {
                  if (error) {
                    throw new Error(error.message);
                  }
                });

                mealUpdate.imageUrl;
                _context3.next = 16;
                return image.mv(".".concat(_imageUrl));

              case 16:
                _context3.next = 19;
                break;

              case 18:
                mealUpdate.imageUrl;

              case 19:
                _context3.next = 21;
                return mealUpdate;

              case 21:
                _ref = _context3.sent;
                imageUrl = _ref.imageUrl;
                _context3.next = 25;
                return _meals.default.update({
                  name: name,
                  price: price,
                  imageUrl: imageUrl
                }, {
                  where: {
                    id: req.params.id
                  }
                });

              case 25:
                return _context3.abrupt("return", res.status(200).json({
                  status: true,
                  message: 'Meal Updated Successfully!'
                }));

              case 28:
                _context3.prev = 28;
                _context3.t0 = _context3["catch"](0);
                return _context3.abrupt("return", res.status(500).json({
                  status: 'error',
                  message: "Update was Unsuccessfull!"
                }));

              case 31:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 28]]);
      }));

      function updateMeal(_x5, _x6) {
        return _updateMeal.apply(this, arguments);
      }

      return updateMeal;
    }()
  }, {
    key: "deleteMeal",
    value: function () {
      var _deleteMeal = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(req, res) {
        var id, meal;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                id = req.params.id;
                _context4.next = 4;
                return _meals.default.findOne({
                  where: {
                    id: id
                  }
                });

              case 4:
                meal = _context4.sent;

                _fs.default.unlink(".".concat(meal.imageUrl), function (error) {
                  if (error) throw new Error(error.message);
                });

                _context4.next = 8;
                return meal.destroy();

              case 8:
                return _context4.abrupt("return", res.status(200).json({
                  status: true,
                  message: 'Meal Deleted Successfully!'
                }));

              case 11:
                _context4.prev = 11;
                _context4.t0 = _context4["catch"](0);
                return _context4.abrupt("return", res.status(500).json({
                  status: false,
                  message: "Meal with that ".concat(req.params.id, " was unable to be deleted")
                }));

              case 14:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 11]]);
      }));

      function deleteMeal(_x7, _x8) {
        return _deleteMeal.apply(this, arguments);
      }

      return deleteMeal;
    }()
  }]);

  return MealController;
}();

var MealsController = new MealController();
var _default = MealsController;
exports.default = _default;
//# sourceMappingURL=mealController.js.map