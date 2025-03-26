import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './database';
import movieRoutes from './routes/movieRoutes';
import customerRoutes from './routes/customerRoutes';

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow all origins for now, restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Connect to database
connectToDatabase()
  .then(() => console.log('Connected to MongoDB'))
  .catch((err: Error) => console.error('Failed to connect to MongoDB:', err));

// API Routes
app.use('/api/movies', movieRoutes);
app.use('/api/customers', customerRoutes);

// Check if rental routes exist and use them
try {
  const rentalRoutes = require('./routes/rentalRoutes').default;
  app.use('/api/rentals', rentalRoutes);
  console.log('Rental routes loaded successfully');
} catch (error) {
  console.warn('Rental routes not available:', error);
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'api',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('API Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`API Server running on port ${PORT}`);
  });
}

// Export the serverless handler
export const handler = serverless(app);
