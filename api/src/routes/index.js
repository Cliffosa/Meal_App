import express from 'express';
import mealController from '../controllers/mealController';
import menuController from '../controllers/menuController';
import orderController from '../controllers/orderController';

// set router
const router = express.Router();

// meal router
router.get('/api/v1/meals', mealController.getAllMeals);
router.get('/api/v1/meals/:id', mealController.getMeal);
router.post('/api/v1/meals', mealController.createMeal);
router.put('/api/v1/meals/:id', mealController.updateMeal);
router.delete('/api/v1/meals/:id', mealController.deleteMeal);

// Menu routes

router.get('/api/v1/menu/:day', menuController.getAllMenu);
router.post('/api/v1/menu', menuController.createMenu);

// order routes

router.get('/api/v1/order', orderController.getAllOrders);
router.get('/api/v1/order/:id', orderController.getOrder);
router.post('/api/v1/order', orderController.createOrder);

export default router;
