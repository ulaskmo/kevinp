import express from 'express';
import { getMovies, createMovie, updateMovie, deleteMovie, getMovieById, deleteLastMovie } from '../controllers/movieController';

const router = express.Router();

router.get('/', getMovies);
router.get('/:id', getMovieById);  // Correct usage here
router.post('/', createMovie);
router.put('/:id', updateMovie);
router.delete('/:id', deleteMovie);
router.delete('/last', deleteLastMovie);  // New route to delete the last added movie

export default router;
