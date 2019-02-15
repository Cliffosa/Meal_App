import express from 'express';
import mealController from '../controllers/mealController';

const router = express.Router();

router.get('/api/v1/todos', mealController.getAllTodos);
router.get('/api/v1/todos/:id', mealController.getTodo);
router.post('/api/v1/todos', mealController.createTodo);
router.put('/api/v1/todos/:id', mealController.updateTodo);
router.delete('/api/v1/todos/:id', mealController.deleteTodo);

export default router;
