import express from 'express';
import mealController from '../controllers/mealController';

const router = express.Router();

router.get('/api/v1/meals', mealController.getAllMeals);
router.get('/api/v1/meals/:id', mealController.getMeal);
router.post('/api/v1/meals', mealController.createMeal);
router.put('/api/v1/meals/:id', mealController.updateMeal);
router.delete('/api/v1/meals/:id', mealController.deleteMeal);

export default router;
