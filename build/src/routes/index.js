"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _mealController = _interopRequireDefault(require("../controllers/mealController"));

var _menuController = _interopRequireDefault(require("../controllers/menuController"));

var _orderController = _interopRequireDefault(require("../controllers/orderController"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// set router
var router = _express.default.Router(); // meal router


router.get('/api/v1/meals', _mealController.default.getAllMeals);
router.get('/api/v1/meals/:id', _mealController.default.getMeal);
router.post('/api/v1/meals', _mealController.default.createMeal);
router.put('/api/v1/meals/:id', _mealController.default.updateMeal);
router.delete('/api/v1/meals/:id', _mealController.default.deleteMeal); // Menu routes

router.get('/api/v1/menu/:day', _menuController.default.getTodayMenu);
router.post('/api/v1/menu', _menuController.default.createMenu); // order routes

router.get('/api/v1/orders', _orderController.default.getAllOrders);
router.post('/api/v1/orders', _orderController.default.createOrder);
router.get('/api/v1/orders/:id', _orderController.default.getOrder);
router.put('/api/v1/orders/:id', _orderController.default.updateOrder);
router.delete('/api/v1/orders/:id', _orderController.default.deleteOrder);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map