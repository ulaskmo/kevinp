import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { connectToDb } from '../database';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import serverless from 'serverless-http';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse JSON bodies
app.use(express.json());

// Recommendation endpoint
app.get('/lambda/recommendations', (req, res) => {
  const userId = req.query.userId;
  const genre = req.query.genre;
  
  // Mock recommendation logic
  const recommendations = [
    {
      id: '1',
      title: 'The Shawshank Redemption',
      genre: 'Drama',
      rating: 9.3,
      reason: 'Based on your viewing history'
    },
    {
      id: '2',
      title: 'The Godfather',
      genre: 'Crime',
      rating: 9.2,
      reason: 'Popular in your area'
    },
    {
      id: '3',
      title: 'The Dark Knight',
      genre: 'Action',
      rating: 9.0,
      reason: 'You might like this'
    }
  ];
  
  // Filter by genre if provided
  const filteredRecommendations = genre 
    ? recommendations.filter(r => r.genre.toLowerCase() === String(genre).toLowerCase())
    : recommendations;
  
  res.json({
    userId,
    recommendations: filteredRecommendations,
    timestamp: new Date().toISOString()
  });
});

// Analytics endpoint
app.get('/lambda/analytics', (req, res) => {
  // Mock analytics data
  const analytics = {
    totalViews: 1245,
    uniqueUsers: 328,
    topGenres: [
      { genre: 'Action', count: 456 },
      { genre: 'Drama', count: 312 },
      { genre: 'Comedy', count: 289 }
    ],
    topMovies: [
      { id: '1', title: 'The Shawshank Redemption', views: 89 },
      { id: '2', title: 'The Godfather', views: 76 },
      { id: '3', title: 'The Dark Knight', views: 65 }
    ],
    timeDistribution: {
      morning: 245,
      afternoon: 389,
      evening: 456,
      night: 155
    },
    timestamp: new Date().toISOString()
  };
  
  res.json(analytics);
});

// Health check endpoint
app.get('/lambda/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'lambda',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Create serverless handler
const serverlessHandler = serverless(app);

// Initialize database connection
let dbInitialized = false;

// Lambda handler
export const handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  // Initialize database connection if not already done
  if (!dbInitialized) {
    try {
      await new Promise<void>((resolve) => {
        connectToDb(() => {
          dbInitialized = true;
          resolve();
        });
      });
      console.log('Lambda: Database connection initialized');
    } catch (error) {
      console.error('Lambda: Error initializing database connection:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': 'true',
        },
        body: JSON.stringify({ message: 'Database connection error' })
      };
    }
  }

  // Keep the connection alive
  context.callbackWaitsForEmptyEventLoop = false;

  // Handle the request
  try {
    const result = await serverlessHandler(event, context);
    return result as APIGatewayProxyResult;
  } catch (error) {
    console.error('Lambda: Error handling request:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
      },
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};
