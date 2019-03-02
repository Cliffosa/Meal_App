"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _orders = _interopRequireDefault(require("../models/orders"));

var _menu = _interopRequireDefault(require("../models/menu"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var ordersController =
/*#__PURE__*/
function () {
  function ordersController() {
    _classCallCheck(this, ordersController);
  }

  _createClass(ordersController, [{
    key: "getAllOrders",
    value: function getAllOrders(req, res) {
      return res.status(200).send({
        success: true,
        message: 'orders retrieved successfully',
        meals: _orders.default
      });
    }
  }, {
    key: "createOrder",
    value: function createOrder(req, res) {
      if (!req.body.name) {
        return res.status(400).send({
          success: false,
          message: 'name is required'
        });
      } else if (!req.body.price) {
        return res.status(400).send({
          success: false,
          message: 'quantity is required'
        });
      } else if (!req.body.quantity) {
        return res.status(400).send({
          success: false,
          message: 'price is required'
        });
      }

      var order = {
        id: _orders.default.length + 1,
        name: req.body.name,
        price: req.body.price,
        quantity: req.body.quantity
      };

      _orders.default.push(order);

      return res.status(200).send({
        success: true,
        message: 'order  sucessfully created.',
        meals: order
      });
    } // get a single order

  }, {
    key: "getOrder",
    value: function getOrder(req, res) {
      var found = false;
      var id = parseInt(req.params.id, 10);

      _orders.default.map(function (order) {
        if (order.id === id) {
          found = true;
          return res.status(200).send({
            success: true,
            message: 'order retrieved successfully',
            order: order
          });
        }
      });

      if (!found) {
        return res.status(404).send({
          success: false,
          message: 'Order does not exist'
        });
      } // check for invalid meal id and return false

    } // update a meal

  }, {
    key: "updateOrder",
    value: function updateOrder(req, res) {
      var id = parseInt(req.params.id, 10);
      var orderFound;
      var itemIndex;

      _orders.default.map(function (order, index) {
        if (order.id === id) {
          orderFound = order;
          itemIndex = index;
        }
      });

      if (!orderFound) {
        return res.status(404).send({
          success: false,
          message: 'meal not found'
        });
      } // validate body


      if (!req.body.name) {
        return res.status(400).send({
          success: false,
          message: 'name is required'
        });
      } else if (!req.body.quantity) {
        return res.status(400).send({
          success: false,
          message: 'quantity is required'
        });
      } else if (!req.body.price) {
        return res.status(400).send({
          success: 'false',
          message: 'price is required'
        });
      }

      var newOrder = {
        id: orderFound.id,
        name: req.body.name || orderFound.name,
        quantity: req.body.quantity || orderFound.quantity,
        price: req.body.price || orderFound.price
      };

      _orders.default.splice(itemIndex, 1, newOrder);

      return res.status(201).send({
        success: true,
        message: 'order updated successfully',
        createOrder: {
          data: newOrder
        }
      });
    } // delete a meal

  }, {
    key: "deleteOrder",
    value: function deleteOrder(req, res) {
      var id = parseInt(req.params.id, 10);
      var orderFound;
      var itemIndex;

      _orders.default.map(function (order, index) {
        if (order.id === id) {
          orderFound = order;
          itemIndex = index;
        }
      });

      if (!orderFound) {
        return res.status(404).send({
          success: false,
          message: 'order not found'
        });
      }

      _orders.default.splice(itemIndex, 1);

      return res.status(200).send({
        success: true,
        message: 'order deleted successfuly'
      });
    }
  }]);

  return ordersController;
}(); // create an instance of the class and export it


var orderController = new ordersController();
var _default = orderController;
exports.default = _default;
//# sourceMappingURL=orderController.js.map