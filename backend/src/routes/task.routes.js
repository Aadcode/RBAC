import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from '../controllers/task.controller.js';

const router = express.Router();

router.use(protect);

router
  .route('/')
  .post(authorize('admin', 'manager'), createTask)
  .get(getTasks);

router
  .route('/:id')
  .put(authorize('admin', 'manager', 'employee'), updateTask)
  .delete(authorize('admin', 'manager'), deleteTask);

export default router;