"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _menu = _interopRequireDefault(require("../models/menu"));

var _meals = _interopRequireDefault(require("../models/meals"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var MenusControllers =
/*#__PURE__*/
function () {
  function MenusControllers() {
    _classCallCheck(this, MenusControllers);
  }

  _createClass(MenusControllers, [{
    key: "generateDate",
    value: function generateDate() {
      var today = new Date();
      var date = today.getDate();
      var month = today.getMonth() + 1; //January is 0!

      var year = today.getFullYear();

      if (date < 10) {
        date = "0".concat(date);
      }

      if (month < 10) {
        month = "0".concat(month);
      }

      today = "".concat(month, "-").concat(date, "-").concat(year);
      return today;
    }
  }, {
    key: "getTodayMenu",
    value: function () {
      var _getTodayMenu = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var today, menus;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                today = MenuControllers.generateDate();
                _context.next = 4;
                return _menu.default.findAll({
                  where: {
                    createdAt: today
                  }
                });

              case 4:
                menus = _context.sent;
                return _context.abrupt("return", res.status(200).json({
                  success: true,
                  message: 'menu for the day retrieved successfully',
                  fetchData: menus
                }));

              case 8:
                _context.prev = 8;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", res.status(404).json({
                  status: false,
                  message: _context.t0.message
                }));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 8]]);
      }));

      function getTodayMenu(_x, _x2) {
        return _getTodayMenu.apply(this, arguments);
      }

      return getTodayMenu;
    }()
  }, {
    key: "addMealToMenu",
    value: function () {
      var _addMealToMenu = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, res) {
        var _req$body, mealId, quantity, meal, _meal$dataValues, createdAt, updatedAt, ordinaryMeal, today, menu, menuMeals, mealIndex;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _req$body = req.body, mealId = _req$body.mealId, quantity = _req$body.quantity;
                _context2.next = 4;
                return _meals.default.findOne({
                  where: {
                    id: mealId,
                    adminId: req.admin.id
                  }
                });

              case 4:
                meal = _context2.sent;

                if (meal) {
                  _context2.next = 7;
                  break;
                }

                throw new Error("Meal with that ID does not exist");

              case 7:
                _meal$dataValues = meal.dataValues, createdAt = _meal$dataValues.createdAt, updatedAt = _meal$dataValues.updatedAt, ordinaryMeal = _objectWithoutProperties(_meal$dataValues, ["createdAt", "updatedAt"]);
                ordinaryMeal.quantity = Number(quantity);
                today = MenuControllers.generateDate();
                _context2.next = 12;
                return _menu.default.findAll({
                  where: {
                    adminId: req.admin.id,
                    createdAt: today
                  }
                });

              case 12:
                menu = _context2.sent;
                menuMeals = [];

                if (!(menu.length === 0)) {
                  _context2.next = 21;
                  break;
                }

                menuMeals.push(ordinaryMeal);

                _menu.default.create({
                  meals: JSON.stringify(menuMeals),
                  adminId: req.admin.id
                });

                _context2.next = 19;
                return _meals.default.update({
                  quantity: quantity
                }, {
                  where: {
                    id: mealId
                  }
                });

              case 19:
                _context2.next = 28;
                break;

              case 21:
                menuMeals = MenuControllers.updateMeals(menu[0], ordinaryMeal, mealId, quantity);

                _menu.default.update({
                  meals: JSON.stringify(menuMeals)
                }, {
                  where: {
                    adminId: req.admin.id,
                    createdAt: today
                  }
                });

                _context2.next = 25;
                return menuMeals.findIndex(function (menuMeal) {
                  return menuMeal.id === Number(mealId);
                });

              case 25:
                mealIndex = _context2.sent;
                _context2.next = 28;
                return _meals.default.update({
                  quantity: menuMeals[mealIndex].quantity
                }, {
                  where: {
                    id: mealId
                  }
                });

              case 28:
                return _context2.abrupt("return", res.status(200).json({
                  status: true,
                  message: "menu added to today's menu successfully",
                  addMenu: menuMeals
                }));

              case 31:
                _context2.prev = 31;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", res.status(404).json({
                  status: false,
                  message: _context2.t0.message
                }));

              case 34:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 31]]);
      }));

      function addMealToMenu(_x3, _x4) {
        return _addMealToMenu.apply(this, arguments);
      }

      return addMealToMenu;
    }()
  }, {
    key: "getSingleMenu",
    value: function () {
      var _getSingleMenu = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(req, res) {
        var today, menu;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                today = MenuControllers.generateDate();
                _context3.next = 4;
                return _menu.default.findOne({
                  where: {
                    createdAt: today,
                    adminId: req.admin.id
                  }
                });

              case 4:
                menu = _context3.sent;
                return _context3.abrupt("return", res.status(200).json({
                  status: true,
                  message: 'Menu Retrieved Successfully',
                  FetchData: menu
                }));

              case 8:
                _context3.prev = 8;
                _context3.t0 = _context3["catch"](0);
                return _context3.abrupt("return", res.status(404).json({
                  status: false,
                  message: _context3.t0.message
                }));

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 8]]);
      }));

      function getSingleMenu(_x5, _x6) {
        return _getSingleMenu.apply(this, arguments);
      }

      return getSingleMenu;
    }()
  }, {
    key: "updateMeals",
    value: function () {
      var _updateMeals = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(menu, ordinaryMeal, mealId, quantity) {
        var meals, updatedMenuMeals, mealIndex;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                meals = menu.dataValues.meals;
                updatedMenuMeals = JSON.parse(meals);
                _context4.next = 5;
                return updatedMenuMeals.findIndex(function (menuMeal) {
                  return menuMeal.id === Number(mealId);
                });

              case 5:
                mealIndex = _context4.sent;

                if (mealIndex < 0) {
                  updatedMenuMeals.push(ordinaryMeal);
                } else {
                  updatedMenuMeals[mealIndex].quantity += Number(quantity);
                }

                return _context4.abrupt("return", updatedMenuMeals);

              case 10:
                _context4.prev = 10;
                _context4.t0 = _context4["catch"](0);
                return _context4.abrupt("return", res.status(404).json({
                  status: false,
                  message: _context4.t0.message
                }));

              case 13:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 10]]);
      }));

      function updateMeals(_x7, _x8, _x9, _x10) {
        return _updateMeals.apply(this, arguments);
      }

      return updateMeals;
    }()
  }]);

  return MenusControllers;
}();

var MenuControllers = new MenusControllers();
var _default = MenuControllers;
exports.default = _default;
//# sourceMappingURL=menuController.js.map