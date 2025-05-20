import { Router } from 'express';
import { body } from 'express-validator';
import { createUser, getUsers, getUserById } from '../controllers/user.controller';
import { validate } from '../middleware/validate';

const router = Router();

router.post(
  '/',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('role').isIn(['ADMIN', 'HR', 'JOB_SEEKER']),
    validate
  ],
  createUser
);

router.get('/', getUsers);
router.get('/:id', getUserById);

export default router; 