import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import serverless from 'serverless-http';
import express, { Request, Response } from 'express';
import cors from 'cors';
import { getDb } from '../database';
import { ObjectId } from 'mongodb';

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Get movie recommendations based on genre
app.get('/api/recommendations', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { genre, limit = 5 } = req.query;
    
    if (!genre) {
      return res.status(400).json({ error: 'Genre parameter is required' });
    }
    
    // Find movies with the specified genre, limit the results
    const recommendations = await db.collection('movies')
      .find({ genre: genre as string })
      .limit(Number(limit))
      .toArray();
    
    res.json({
      genre,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Get similar movies based on movie ID
app.get('/api/movies/:id/similar', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid ID format' });
    }
    
    // Find the movie by ID
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });
    
    if (!movie) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    // Find similar movies based on genre, excluding the current movie
    const similarMovies = await db.collection('movies')
      .find({ 
        genre: movie.genre,
        _id: { $ne: new ObjectId(id) }
      })
      .limit(3)
      .toArray();
    
    res.json({
      movieId: id,
      movieTitle: movie.title,
      genre: movie.genre,
      similarMovies
    });
  } catch (error) {
    console.error('Error getting similar movies:', error);
    res.status(500).json({ error: 'Failed to get similar movies' });
  }
});

// Get top rated movies
app.get('/api/movies/top-rated', async (req: Request, res: Response) => {
  try {
    const db = getDb();
    const { limit = 5 } = req.query;
    
    // Simulate top rated movies (in a real app, you would have a rating field)
    // Here we're just sorting by year as a placeholder
    const topRatedMovies = await db.collection('movies')
      .find({})
      .sort({ year: -1 })
      .limit(Number(limit))
      .toArray();
    
    res.json({
      count: topRatedMovies.length,
      topRatedMovies
    });
  } catch (error) {
    console.error('Error getting top rated movies:', error);
    res.status(500).json({ error: 'Failed to get top rated movies' });
  }
});

// Lambda handler
export const handler = serverless(app);

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.LAMBDA_PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Lambda functions running locally on port ${PORT}`);
  });
}
