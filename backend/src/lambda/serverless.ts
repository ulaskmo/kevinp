import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from '../database';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

// Import the Lambda function handlers
import { handler as movieRecommendationsHandler } from './movieRecommendations';

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectToDatabase()
  .then(() => console.log('Connected to MongoDB for Lambda functions'))
  .catch(err => console.error('Failed to connect to MongoDB for Lambda functions:', err));

// Forward requests to the appropriate Lambda function
app.use('/api/recommendations', async (req, res) => {
  try {
    // Create a mock event for the Lambda function
    const event: APIGatewayProxyEvent = {
      path: req.path,
      httpMethod: req.method,
      headers: req.headers as { [name: string]: string },
      queryStringParameters: req.query as { [name: string]: string },
      body: JSON.stringify(req.body),
      isBase64Encoded: false,
      pathParameters: {},
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      stageVariables: {},
      requestContext: {} as any,
      resource: '',
    };

    // Call the Lambda function
    const result = await movieRecommendationsHandler(event, {} as any) as APIGatewayProxyResult;

    // Send the response
    res.status(result.statusCode).set(result.headers || {}).send(result.body);
  } catch (error) {
    console.error('Error forwarding request to Lambda function:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'lambda', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Lambda Error:', err);
  res.status(500).json({ error: 'Internal Server Error in Lambda function' });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.LAMBDA_PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Lambda functions running on port ${PORT}`);
  });
}

// Export the serverless handler
export const handler = serverless(app);
