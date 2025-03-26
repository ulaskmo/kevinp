export const environment = {
  production: true,
  // For local development with backend running on localhost:3000
  apiUrl: 'http://localhost:3000/api',
  lambdaUrl: 'http://localhost:3000/lambda'
};

/*
DEPLOYMENT INSTRUCTIONS:

1. For local development:
   - The current settings work with a local backend running on port 3000

2. For production deployment with API Gateway:
   - Update the URLs to point to your API Gateway:
     apiUrl: 'https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/api',
     lambdaUrl: 'https://your-api-gateway-url.execute-api.region.amazonaws.com/prod/lambda'

3. Frontend Deployment:
   a. Build the frontend:
      cd frontend
      npm run build
   
   b. Deploy to S3:
      ./deploy-to-s3.sh
*/
