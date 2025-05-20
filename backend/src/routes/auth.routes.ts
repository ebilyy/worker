import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, logout, getSession } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';

const router = Router();
const userRoles = ['JOB_SEEKER', 'HR', 'ADMIN'];

// Public routes
router.post(
  '/register',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('role').isIn(userRoles),
    validate
  ],
  register
);

router.post(
  '/login',
  [
    body('email').isEmail(),
    body('password').exists(),
    validate
  ],
  login
);

// Protected routes
router.post('/logout', authenticate, logout);
router.get('/session', authenticate, getSession);

export default router; 