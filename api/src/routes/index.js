import express from 'express';
import MealsController from '../controllers/mealController';
import MenuControllers from '../controllers/menuController';
import OrdersController from '../controllers/orderController';
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
  AdminController.registerAdmin
);

router.post('/api/v1/auth/admin/login', AdminMiddleware.validateLogin, AdminController.loginAdmin);

// meal router
router.get('/api/v1/meals', AuthController.verifyAdminTokenKey, MealsController.getAllMeals);
router.post(
  '/api/v1/meals',
  AuthController.verifyAdminTokenKey,
  MealMiddleware.validateAddMeal,
  MealsController.createMeal
);
router.put(
  '/api/v1/meals/:id',
  AuthController.verifyAdminTokenKey,
  MealMiddleware.validateUpdateMeal,
  MealsController.updateMeal
);
router.delete('/api/v1/meals/:id', AuthController.verifyAdminTokenKey, MealsController.deleteMeal);

// Menu routes

router.get('/api/v1/menu/', AuthController.verifyUserTokenKey, MenuControllers.getTodayMenu);

router.get('/api/v1/menu/admin', AuthController.verifyAdminTokenKey, MenuControllers.getSingleMenu);

router.post(
  '/api/v1/menu/',
  AuthController.verifyAdminTokenKey,
  MealMiddleware.validateAddMealToMenu,
  MenuControllers.addMealToMenu
);

//  order routes

router.get('/api/v1/orders', AuthController.verifyAdminTokenKey, OrdersController.getOrders);

router.get(
  '/api/v1/orders/user',
  AuthController.verifyUserTokenKey,
  OrdersController.getOrderItems
);

router.post(
  '/api/v1/orders',
  AuthController.verifyUserTokenKey,
  OrderMiddleware.validateAddToOrder,
  OrdersController.addMealToOder
);
router.post(
  '/api/v1/checkout',
  AuthController.verifyUserTokenKey,
  OrderMiddleware.validateOrdeCheckout,
  OrdersController.checkoutOrder
);

router.put(
  '/api/v1/orders/:id',
  AuthController.verifyUserTokenKey,
  OrderMiddleware.validateModifyOrder,
  OrdersController.updateOrder
);

export default router;
