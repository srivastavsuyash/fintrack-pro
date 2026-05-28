import express from 'express';
import {
  getSavingsGoals,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal
} from '../controllers/savingsController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getSavingsGoals);
router.post('/', createSavingsGoal);
router.put('/:id', updateSavingsGoal);
router.delete('/:id', deleteSavingsGoal);

export default router;