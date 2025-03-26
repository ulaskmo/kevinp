import express from 'express';
import { getCustomers, createCustomer, updateCustomer, deleteCustomer } from '../controllers/customerController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// All customer routes require authentication
router.use(authenticateToken);

// Routes accessible to all authenticated users
router.get('/', getCustomers);

// Admin-only routes
router.post('/', requireAdmin, createCustomer);
router.put('/:id', requireAdmin, updateCustomer);
router.delete('/:id', requireAdmin, deleteCustomer);

export default router;
