import express from 'express';
import mealController from '../controllers/mealController';

const router = express.Router();

router.get('/api/v1/meals', mealController.getAllTodos);
router.get('/api/v1/meals/:id', mealController.getTodo);
router.post('/api/v1/meals', mealController.createTodo);
router.put('/api/v1/meals/:id', mealController.updateTodo);
router.delete('/api/v1/meals/:id', mealController.deleteTodo);

export default router;
