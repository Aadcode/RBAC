import express from 'express';
import { protect, authorize } from '../middleware/auth.middleware.js';
import {
  getUsers,
  updateUserRole,
  deleteUser,
} from '../controllers/user.controller.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers);

router.route('/:id')
  .patch(updateUserRole)
  .delete(deleteUser);

export default router;