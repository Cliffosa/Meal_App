import express from 'express';
import MealController from '../controllers/mealController';
import MenuController from '../controllers/menuController';
import OrderController from '../controllers/orderController';
import UserController from '../controllers/userController';
import AdminController from '../controllers/adminController';
import AuthController from '../controllers/auth';
import AdminMiddleware from '../policies/adminMiddleware';
import MealMiddleware from '../policies/mealMiddleware';
import OrderMiddleware from '../policies/orderMiddleware';
import UserMiddleware from '../policies/userMiddleware';

// set router
const router = express.Router();

//auth route
router.post('/api/v1/auth/signup', UserMiddleware.validateRegister, UserController.registerUser);
router.post('/api/v1/auth/login', UserMiddleware.validateLogin, UserController.loginUser);

router.post(
  '/api/v1/auth/admin/signup',
  AdminMiddleware.validateRegister,
  AdminController.registerUser
);

router.post('/api/v1/auth/admin/login', AdminMiddleware.validateLogin, AdminController.loginAdmin);

// meal router
router.get('/api/v1/meals', AuthController.verifyAdminTokenKey, MealController.getAllMeals);
router.post(
  '/api/v1/meals',
  AdminController.verifyAdminTokenKey,
  MealMiddleware.validateAddMeal,
  MealController.createMeal
);
router.put(
  '/api/v1/meals/:id',
  AdminController.verifyAdminTokenKey,
  MealMiddleware.validateUpdateMeal,
  MealController.updateMeal
);
router.delete('/api/v1/meals/:id', AdminController.verifyAdminTokenKey, MealController.deleteMeal);

// Menu routes

router.get('/api/v1/menu/', AuthController.verifyUserTokenKey, MenuController.getTodayMenu);
router.get('/api/v1/menu/admin', AuthController.verifyAdminTokenKey, MenuController.getSingleMenu);
router.post(
  '/api/v1/menu/',
  AuthController.verifyAdminTokenKey,
  MealMiddleware.validateAddMealToMenu,
  MenuController.addMealToMenu
);

//  order routes

router.get('/api/v1/orders', AuthController.verifyAdminTokenKey, OrderController.getOrders);

router.get('/api/v1/orders/user', AuthController.verifyUserToken, OrderController.getOrderItems);

router.post(
  '/api/v1/orders',
  AuthController.verifyUserTokenKey,
  OrderMiddleware.validateAddToOrder,
  OrderController.addMealToOder
);
router.post(
  '/api/v1/checkout',
  AuthController.verifyUserTokenKey,
  OrderMiddleware.validateOrdeCheckout,
  OrderController.checkoutOrder
);

router.put(
  '/api/v1/orders/:id',
  AuthController.verifyUserTokenKey,
  OrderMiddleware.validateModifyOrder,
  OrderController.updateOrder
);

export default router;
// module.exports = router;
