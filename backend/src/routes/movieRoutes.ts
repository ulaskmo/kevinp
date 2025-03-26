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

const router = express.Router();

// Basic CRUD operations
router.get('/', getMovies);
router.post('/', createMovie);
router.get('/:id', getMovieById);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);

// Special operations
router.delete('/last', deleteLastMovie);

// Analytics endpoints
router.get('/analytics/data', getMovieAnalytics);

// Rental tracking
router.post('/:id/rent', trackRental);

export default router;
