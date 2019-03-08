"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _orders = _interopRequireDefault(require("../models/orders"));

var _orderItems = _interopRequireDefault(require("../models/orderItems"));

var _meals = _interopRequireDefault(require("../models/meals"));

var _menu = _interopRequireDefault(require("../models/menu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var OrderController =
/*#__PURE__*/
function () {
  function OrderController() {
    _classCallCheck(this, OrderController);
  }

  _createClass(OrderController, [{
    key: "addMealToOder",
    value: function () {
      var _addMealToOder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res) {
        var _req$body, mealId, quantity, orderItem, result, newOrderItem;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                _req$body = req.body, mealId = _req$body.mealId, quantity = _req$body.quantity;
                _context.next = 4;
                return _orderItems.default.findOne({
                  where: {
                    mealId: mealId,
                    userId: req.user.id
                  }
                });

              case 4:
                orderItem = _context.sent;
                result = {}; // check order exist

                if (!orderItem) {
                  _context.next = 10;
                  break;
                }

                result.body = {
                  status: false,
                  message: 'Orders Already Exist!!!'
                };
                _context.next = 14;
                break;

              case 10:
                _context.next = 12;
                return _orderItems.default.create({
                  mealId: mealId,
                  quantity: quantity,
                  userId: req.user.id
                });

              case 12:
                newOrderItem = _context.sent;
                result.body = {
                  status: true,
                  message: 'Order Sucessfully Added!',
                  createdOrder: newOrderItem
                };

              case 14:
                return _context.abrupt("return", res.status(201).json(result.body));

              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", res.status(500).json({
                  status: 'error creating order',
                  message: _context.t0.message
                }));

              case 20:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[0, 17]]);
      }));

      function addMealToOder(_x, _x2) {
        return _addMealToOder.apply(this, arguments);
      }

      return addMealToOder;
    }()
  }, {
    key: "getOrders",
    value: function () {
      var _getOrders = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, res) {
        var orders;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                _context2.next = 3;
                return _orders.default.findAll({
                  where: {
                    adminId: req.admin.id
                  }
                });

              case 3:
                orders = _context2.sent;
                return _context2.abrupt("return", res.status(200).json({
                  status: true,
                  message: 'Orders Retrieved Successfully!',
                  fetchData: orders
                }));

              case 7:
                _context2.prev = 7;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", res.status(500).json({
                  status: 'error fetching orders',
                  message: _context2.t0.message
                }));

              case 10:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, null, [[0, 7]]);
      }));

      function getOrders(_x3, _x4) {
        return _getOrders.apply(this, arguments);
      }

      return getOrders;
    }()
  }, {
    key: "updateOrder",
    value: function () {
      var _updateOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3(req, res) {
        var orderId, action, orderItem;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.prev = 0;
                orderId = req.params.orderId;
                action = req.body.action;
                _context3.next = 5;
                return _orderItems.default.findOne({
                  where: {
                    id: orderId,
                    userId: req.user.id
                  },
                  include: [_meals.default]
                });

              case 5:
                orderItem = _context3.sent;

                if (!(action === 'increase')) {
                  _context3.next = 13;
                  break;
                }

                orderItem.quantity++;

                if (!(orderItem.quantity > orderItem.meal.quantity)) {
                  _context3.next = 10;
                  break;
                }

                throw new Error("We only have ".concat(orderItem.meal.quantity, " of ").concat(orderItem.meal.name, " is available"));

              case 10:
                _orderItems.default.update({
                  quantity: orderItem.quantity
                }, {
                  where: {
                    id: orderItem.id
                  }
                });

                _context3.next = 14;
                break;

              case 13:
                if (action === 'decrease') {
                  orderItem.quantity--;

                  if (orderItem.quantity === 0) {
                    _orderItems.default.destroy({
                      where: {
                        id: orderItem.id
                      }
                    });
                  } else {
                    _orderItems.default.update({
                      quantity: orderItem.quantity
                    }, {
                      where: {
                        id: orderItem.id
                      }
                    });
                  }
                } else if (action === 'delete') {
                  _orderItems.default.destroy({
                    where: {
                      id: orderItem.id
                    }
                  });
                }

              case 14:
                return _context3.abrupt("return", res.status(200).json({
                  status: true,
                  message: 'Order Updated Successfully'
                }));

              case 17:
                _context3.prev = 17;
                _context3.t0 = _context3["catch"](0);
                return _context3.abrupt("return", res.status(500).json({
                  status: flase,
                  message: _context3.t0.message
                }));

              case 20:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, null, [[0, 17]]);
      }));

      function updateOrder(_x5, _x6) {
        return _updateOrder.apply(this, arguments);
      }

      return updateOrder;
    }()
  }, {
    key: "getOrderItems",
    value: function () {
      var _getOrderItems = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(req, res) {
        var orderItems, meals, total, order;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.prev = 0;
                _context4.next = 3;
                return _orderItems.default.findAll({
                  where: {
                    userId: req.user.id
                  },
                  include: [_meals.default]
                });

              case 3:
                orderItems = _context4.sent;

                if (orderItems) {
                  _context4.next = 6;
                  break;
                }

                throw new Error('No order for this user!');

              case 6:
                meals = [];
                total = 0;
                orderItems.map(function (orderItem) {
                  //@todo forEach
                  var orderMeal = _objectSpread({}, orderItem);

                  orderMeal.meal.quantity = orderItem.quantity;
                  meals.push(orderMeal.meal);
                  var resultOrder = orderItem.quantity * orderMeal.meal.price;
                  total += resultOrder;
                });
                order = {
                  meals: meals,
                  total: total
                };
                return _context4.abrupt("return", res.status(200).json({
                  status: true,
                  message: 'Orders Retrieved Successfully',
                  fetchData: order
                }));

              case 13:
                _context4.prev = 13;
                _context4.t0 = _context4["catch"](0);
                return _context4.abrupt("return", res.status(500).json({
                  status: 'error fetching order',
                  message: _context4.t0.message
                }));

              case 16:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, null, [[0, 13]]);
      }));

      function getOrderItems(_x7, _x8) {
        return _getOrderItems.apply(this, arguments);
      }

      return getOrderItems;
    }()
  }, {
    key: "checkoutOrder",
    value: function () {
      var _checkoutOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5(req, res) {
        var orderItems, meals, admins;
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                _context5.prev = 0;
                _context5.next = 3;
                return _orderItems.default.findAll({
                  where: {
                    userId: req.user.id
                  },
                  include: [_meals.default]
                });

              case 3:
                orderItems = _context5.sent;
                meals = [];
                admins = new Set();
                orderItems.map(function (orderItem) {
                  //@todo forEach
                  var orderMeal = _objectSpread({}, orderItem);

                  orderMeal.meal.quantity = orderItem.quantity;
                  meals.push(orderMeal.meal);
                  admins.add(orderMeal.meal.adminId);
                });
                ordersController.reduceQuantity(meals);
                _context5.next = 10;
                return _orderItems.default.destroy({
                  where: {
                    userId: req.user.id
                  }
                });

              case 10:
                ordersController.createOrders(admins, meals, req.body.delivery_address, req.user.id);
                return _context5.abrupt("return", res.status(201).json({
                  status: 'success',
                  message: 'Order Made'
                }));

              case 14:
                _context5.prev = 14;
                _context5.t0 = _context5["catch"](0);
                return _context5.abrupt("return", res.status(500).json({
                  status: 'error',
                  message: _context5.t0.message
                }));

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, null, [[0, 14]]);
      }));

      function checkoutOrder(_x9, _x10) {
        return _checkoutOrder.apply(this, arguments);
      }

      return checkoutOrder;
    }()
  }, {
    key: "decreaseQuantity",
    value: function () {
      var _decreaseQuantity = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(meals) {
        var meal;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.prev = 0;
                meal = meals[0];
                _context6.next = 4;
                return _meals.default.findOne({
                  where: {
                    id: meal.id
                  }
                }).then(function (dbMeal) {
                  return dbMeal.update({
                    quantity: dbMeal.quantity - meal.quantity
                  }, {
                    where: {
                      id: meal.id
                    }
                  });
                }).then(function () {
                  return _menu.default.findOne({
                    where: {
                      adminId: meal.adminId
                    }
                  });
                }).then(function (menu) {
                  var menuMeals = JSON.parse(menu.meals);
                  var updatedMenuMeals = menuMeals.map(function (menuMeal) {
                    var updatedMenuMeal = _objectSpread({}, menuMeal);

                    if (menuMeal.id === meal.id) {
                      updatedMenuMeal.quantity -= meal.quantity;
                    }

                    return updatedMenuMeal;
                  });
                  return menu.update({
                    meals: JSON.stringify(updatedMenuMeals)
                  }, {
                    where: {
                      id: menu.id
                    }
                  });
                }).then(function () {
                  meals.shift();

                  if (meals.length !== 0) {
                    ordersController.decreaseQuantity(meals);
                  } else {
                    return true;
                  }
                });

              case 4:
                _context6.next = 9;
                break;

              case 6:
                _context6.prev = 6;
                _context6.t0 = _context6["catch"](0);
                throw new Error(_context6.t0.message);

              case 9:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, null, [[0, 6]]);
      }));

      function decreaseQuantity(_x11) {
        return _decreaseQuantity.apply(this, arguments);
      }

      return decreaseQuantity;
    }()
  }, {
    key: "createOrder",
    value: function () {
      var _createOrder = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee7(admins, meals, delivery_address, userId) {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                _context7.prev = 0;
                admins.map(function (admin) {
                  var adminTotal = 0;
                  var adminMeals = meals.filter(function (meal) {
                    return meal.adminId === admin;
                  });
                  adminMeals.map(function (adminMeal) {
                    adminTotal += adminMeal.quantity * adminMeal.price;
                  });

                  _orders.default.create({
                    order: JSON.stringify(adminMeals),
                    total: adminTotal,
                    delivery_address: delivery_address,
                    adminId: admin,
                    userId: userId,
                    status: 0
                  });
                });
                _context7.next = 7;
                break;

              case 4:
                _context7.prev = 4;
                _context7.t0 = _context7["catch"](0);
                throw new Error(_context7.t0.message);

              case 7:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, null, [[0, 4]]);
      }));

      function createOrder(_x12, _x13, _x14, _x15) {
        return _createOrder.apply(this, arguments);
      }

      return createOrder;
    }()
  }]);

  return OrderController;
}();

var OrdersController = new OrderController();
var _default = OrdersController;
exports.default = _default;
//# sourceMappingURL=orderController.js.map