import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { connectToDb } from './database';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import movieRoutes from './routes/movieRoutes';
import customerRoutes from './routes/customerRoutes';
import authRoutes from './routes/authRoutes';
import { createInitialAdminUser } from './controllers/authController';
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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/customers', customerRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
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
        connectToDb(async () => {
          // Create initial admin and user accounts if they don't exist
          await createInitialAdminUser();
          dbInitialized = true;
          resolve();
        });
      });
      console.log('Database connection initialized');
    } catch (error) {
      console.error('Error initializing database connection:', error);
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
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
    console.error('Error handling request:', error);
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
