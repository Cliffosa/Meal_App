"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _mealController = _interopRequireDefault(require("../controllers/mealController"));

var _menuController = _interopRequireDefault(require("../controllers/menuController"));

var _orderController = _interopRequireDefault(require("../controllers/orderController"));

var _userController = _interopRequireDefault(require("../controllers/userController"));

var _adminController = _interopRequireDefault(require("../controllers/adminController"));

var _auth = _interopRequireDefault(require("../controllers/auth"));

var _adminMiddleware = _interopRequireDefault(require("../policies/adminMiddleware"));

var _mealMiddleware = _interopRequireDefault(require("../policies/mealMiddleware"));

var _orderMiddleware = _interopRequireDefault(require("../policies/orderMiddleware"));

var _userMiddleware = _interopRequireDefault(require("../policies/userMiddleware"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// set router
var router = _express.default.Router(); //user auth route


router.post('/api/v1/auth/signup', _userMiddleware.default.validateRegister, _userController.default.registerUser);
router.post('/api/v1/auth/login', _userMiddleware.default.validateLogin, _userController.default.loginUser); //admin auth route

router.post('/api/v1/auth/admin/signup', _adminMiddleware.default.validateRegister, _adminController.default.registerAdmin);
router.post('/api/v1/auth/admin/login', _adminMiddleware.default.validateLogin, _adminController.default.loginAdmin); // meal router

router.post('/api/v1/meals', _auth.default.verifyAdminTokenKey, _mealMiddleware.default.validateAddMeal, _mealController.default.createMeal);
router.get('/api/v1/meals', _auth.default.verifyAdminTokenKey, _mealController.default.getAllMeals);
router.put('/api/v1/meals/:id', _auth.default.verifyAdminTokenKey, _mealMiddleware.default.validateUpdateMeal, _mealController.default.updateMeal);
router.delete('/api/v1/meals/:id', _auth.default.verifyAdminTokenKey, _mealController.default.deleteMeal); // Menu routes

router.get('/api/v1/menu/', _auth.default.verifyUserTokenKey, _menuController.default.getTodayMenu);
router.get('/api/v1/menu/admin', _auth.default.verifyAdminTokenKey, _menuController.default.getSingleMenu);
router.post('/api/v1/menu/', _auth.default.verifyAdminTokenKey, _mealMiddleware.default.validateAddMealToMenu, _menuController.default.addMealToMenu); //  order routes

router.get('/api/v1/orders', _auth.default.verifyAdminTokenKey, _orderController.default.getOrders);
router.get('/api/v1/orders/user', _auth.default.verifyUserTokenKey, _orderController.default.getOrderItems);
router.post('/api/v1/orders', _auth.default.verifyUserTokenKey, _orderMiddleware.default.validateAddToOrder, _orderController.default.addMealToOder);
router.post('/api/v1/checkout', _auth.default.verifyUserTokenKey, _orderMiddleware.default.validateOrdeCheckout, _orderController.default.checkoutOrder);
router.put('/api/v1/orders/:id', _auth.default.verifyUserTokenKey, _orderMiddleware.default.validateModifyOrder, _orderController.default.updateOrder);
var _default = router;
exports.default = _default;
//# sourceMappingURL=index.js.map