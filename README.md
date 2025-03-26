# Movie Management Application

A full-stack web application for movie management with Angular frontend, Node.js backend, MongoDB database, and serverless functions.

## Features

- **Angular Frontend**: Responsive UI with Angular Signals for state management
- **RESTful API**: Node.js backend with Express
- **NoSQL Database**: MongoDB for data storage
- **Serverless Functions**: Lambda functions for recommendations and analytics
- **Authentication**: Auth0 integration for secure access
- **Analytics**: Comprehensive analytics dashboard
- **Deployment**: AWS S3 deployment for frontend, multiple options for backend

## Project Structure

- **frontend/**: Angular application
- **backend/**: Node.js API server
- **docker-compose.yml**: Docker configuration for local development

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB
- Docker (optional)

### Local Development

1. Clone the repository
2. Install dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Start the backend server:

```bash
cd backend
npm run dev
```

4. Start the frontend development server:

```bash
cd frontend
npm run start
```

5. Access the application at http://localhost:4200

### Using Docker

You can also use Docker to run the entire application:

```bash
docker-compose up
```

This will start:
- MongoDB on port 27017
- Backend on port 3000
- Lambda functions on port 3001
- Frontend on port 4200

## Deployment

### Frontend Deployment to AWS S3

1. Update the API URLs in `frontend/src/environments/environment.prod.ts` to point to your deployed backend services.

2. Run the deployment script:

```bash
cd frontend
./deploy-to-s3.sh
```

3. Your frontend will be available at: http://kevinprojectmybucket.s3-website-eu-west-1.amazonaws.com

### Backend Deployment Options

#### Option 1: AWS Lambda + API Gateway

1. Create Lambda functions for your API endpoints
2. Set up API Gateway to route requests to your Lambda functions
3. Configure CORS to allow requests from your S3 bucket

#### Option 2: EC2 Instance

1. Launch an EC2 instance
2. Install Node.js and MongoDB
3. Clone your repository and run the backend server
4. Configure security groups to allow traffic on port 3000

#### Option 3: Docker on ECS/EKS

1. Build Docker images for your backend and frontend
2. Push the images to ECR
3. Create ECS/EKS cluster and deploy your containers

## Environment Variables

### Backend

- `PORT`: Port for the backend server (default: 3000)
- `LAMBDA_PORT`: Port for Lambda functions (default: 3001)
- `DB_CONN_STRING`: MongoDB connection string
- `DB_NAME`: MongoDB database name
- `NODE_ENV`: Environment (development/production)

### Frontend

- `apiUrl`: URL for the backend API
- `lambdaUrl`: URL for Lambda functions
- `auth0.domain`: Auth0 domain
- `auth0.clientId`: Auth0 client ID

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
