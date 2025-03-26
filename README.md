# Movie Management Application

A full-stack web application for managing a movie rental service, built with Angular and Node.js.

## Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **RESTful API**: Backend API for CRUD operations on movies and customers
- **NoSQL Database**: MongoDB integration for data storage
- **Serverless Functions**: Lambda functions for movie recommendations
- **External API Integration**: Search and import movies from external sources
- **Authentication**: User authentication with Auth0
- **Analytics**: Track and visualize user interactions
- **Containerization**: Docker and Docker Compose for easy deployment
- **Testing**: Unit and integration tests

## Technology Stack

### Frontend
- Angular 19
- Angular Material
- RxJS
- Auth0 for authentication
- Responsive CSS with Flexbox and Grid

### Backend
- Node.js with Express
- TypeScript
- MongoDB for database
- AWS Lambda for serverless functions
- RESTful API design

### DevOps
- Docker for containerization
- Docker Compose for multi-container deployment
- Jest for testing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (v6 or higher)
- Docker and Docker Compose (optional, for containerized deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/movie-management.git
cd movie-management
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory with the following variables:
```
PORT=3000
LAMBDA_PORT=3001
DB_CONN_STRING=mongodb://localhost:27017
DB_NAME=moviedb
NODE_ENV=development
```

5. Start the backend server:
```bash
cd ../backend
npm run dev
```

6. Start the frontend development server:
```bash
cd ../frontend
npm start
```

7. Open your browser and navigate to `http://localhost:4200`

### Docker Deployment

To run the application using Docker:

```bash
docker-compose up -d
```

This will start the MongoDB, backend, and frontend services in containers.

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/:id` - Get a movie by ID
- `POST /api/movies` - Create a new movie
- `PUT /api/movies/:id` - Update a movie
- `DELETE /api/movies/:id` - Delete a movie

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/:id` - Get a customer by ID
- `POST /api/customers` - Create a new customer
- `PUT /api/customers/:id` - Update a customer
- `DELETE /api/customers/:id` - Delete a customer

### Rentals
- `GET /api/rentals` - Get all rentals
- `GET /api/rentals/:id` - Get a rental by ID
- `POST /api/rentals` - Create a new rental
- `PUT /api/rentals/:id` - Update a rental
- `DELETE /api/rentals/:id` - Delete a rental

### Lambda Functions
- `GET /api/recommendations?genre=Action` - Get movie recommendations by genre
- `GET /api/movies/:id/similar` - Get similar movies based on a movie ID
- `GET /api/movies/top-rated` - Get top rated movies

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
