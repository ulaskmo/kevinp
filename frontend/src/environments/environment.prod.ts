export const environment = {
  production: true,
  // API Gateway URLs for Lambda backend (Option 1)
  apiUrl: 'https://api.yourdomain.com/api', // Replace with your API Gateway URL
  lambdaUrl: 'https://api.yourdomain.com/lambda', // Replace with your API Gateway URL for Lambda functions
  
  // CloudFront distribution URL
  cdnUrl: 'https://d123456abcdef.cloudfront.net', // Your CloudFront distribution URL
  
  auth0: {
    domain: 'dev-o7l5mm56crwbkx6d.us.auth0.com',
    clientId: 'No6VfOWvK3GpLqGDVsZq8tCH8sQlNRGV',
    redirectUri: window.location.origin
  }
};

/*
DEPLOYMENT INSTRUCTIONS FOR AWS LAMBDA + API GATEWAY (OPTION 1):

1. Backend Deployment:
   a. Create a new API in API Gateway
   b. Create Lambda functions for your API endpoints
   c. Set up routes in API Gateway to your Lambda functions
   d. Deploy the API to a stage (e.g., 'prod')
   e. Note the API Gateway URL (e.g., https://abc123def.execute-api.eu-west-1.amazonaws.com/prod)

2. Update this file:
   a. Replace 'https://api.yourdomain.com/api' with your actual API Gateway URL
   b. Replace 'https://api.yourdomain.com/lambda' with your API Gateway URL for Lambda functions

3. Frontend Deployment:
   a. Run the deployment script:
      cd frontend
      ./deploy-to-s3.sh

4. Your application will be available via CloudFront at:
   https://d123456abcdef.cloudfront.net (replace with your actual CloudFront URL)
*/
