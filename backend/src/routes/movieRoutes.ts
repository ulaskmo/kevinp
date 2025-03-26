import express from 'express';
import { 
    getMovies, 
    createMovie, 
    updateMovie, 
    deleteMovie, 
    getMovieById, 
    deleteLastMovie,
    trackRental,
    getMovieAnalytics
} from '../controllers/movieController';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes - accessible to all users
router.get('/', getMovies);
router.get('/:id', getMovieById);

// Protected routes - require authentication
router.use(authenticateToken);

// Routes accessible to authenticated users (both regular users and admins)
router.post('/:id/rent', trackRental);

// Admin-only routes
router.post('/', requireAdmin, createMovie);
router.put('/:id', requireAdmin, updateMovie);
router.delete('/:id', requireAdmin, deleteMovie);
router.delete('/last', requireAdmin, deleteLastMovie);

// Analytics endpoints - admin only
router.get('/analytics/data', requireAdmin, getMovieAnalytics);

export default router;
