import request from 'supertest';
import express from 'express';
import { MongoClient, Db } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import movieRoutes from '../routes/movieRoutes';
import customerRoutes from '../routes/customerRoutes';

describe('API Integration Tests', () => {
  let app: express.Application;
  let mongoServer: MongoMemoryServer;
  let mongoClient: MongoClient;
  let db: Db;

  beforeAll(async () => {
    // Set up MongoDB Memory Server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    db = mongoClient.db('testdb');
    
    // Create Express app
    app = express();
    app.use(express.json());
    
    // Mock the getDb function
    jest.mock('../database', () => ({
      getDb: () => db
    }));
    
    // Set up routes
    app.use('/api/movies', movieRoutes);
    app.use('/api/customers', customerRoutes);
  });

  afterAll(async () => {
    await mongoClient.close();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear the database before each test
    await db.collection('movies').deleteMany({});
    await db.collection('customers').deleteMany({});
  });

  describe('Movie API', () => {
    it('should create a new movie', async () => {
      const newMovie = {
        title: 'Test Movie',
        director: 'Test Director',
        genre: 'Action',
        year: 2023,
        rentalPrice: 4.99,
        availableCopies: 5
      };

      const response = await request(app)
        .post('/api/movies')
        .send(newMovie)
        .expect(201);

      expect(response.body.insertedId).toBeDefined();
      
      // Verify the movie was created in the database
      const movie = await db.collection('movies').findOne({ title: 'Test Movie' });
      expect(movie).toBeDefined();
      expect(movie?.director).toBe('Test Director');
    });

    it('should get all movies', async () => {
      // Insert test movies
      await db.collection('movies').insertMany([
        {
          title: 'Movie 1',
          director: 'Director 1',
          genre: 'Action',
          year: 2020,
          rentalPrice: 4.99,
          availableCopies: 5
        },
        {
          title: 'Movie 2',
          director: 'Director 2',
          genre: 'Comedy',
          year: 2021,
          rentalPrice: 3.99,
          availableCopies: 3
        }
      ]);

      const response = await request(app)
        .get('/api/movies')
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0].title).toBe('Movie 1');
      expect(response.body[1].title).toBe('Movie 2');
    });

    it('should get a movie by ID', async () => {
      // Insert a test movie
      const result = await db.collection('movies').insertOne({
        title: 'Test Movie',
        director: 'Test Director',
        genre: 'Action',
        year: 2023,
        rentalPrice: 4.99,
        availableCopies: 5
      });

      const movieId = result.insertedId.toString();

      const response = await request(app)
        .get(`/api/movies/${movieId}`)
        .expect(200);

      expect(response.body.title).toBe('Test Movie');
      expect(response.body.director).toBe('Test Director');
    });

    it('should update a movie', async () => {
      // Insert a test movie
      const result = await db.collection('movies').insertOne({
        title: 'Original Title',
        director: 'Original Director',
        genre: 'Action',
        year: 2023,
        rentalPrice: 4.99,
        availableCopies: 5
      });

      const movieId = result.insertedId.toString();
      
      const updatedMovie = {
        title: 'Updated Title',
        director: 'Updated Director'
      };

      await request(app)
        .put(`/api/movies/${movieId}`)
        .send(updatedMovie)
        .expect(200);

      // Verify the movie was updated in the database
      const movie = await db.collection('movies').findOne({ _id: result.insertedId });
      expect(movie?.title).toBe('Updated Title');
      expect(movie?.director).toBe('Updated Director');
      // Other fields should remain unchanged
      expect(movie?.genre).toBe('Action');
    });

    it('should delete a movie', async () => {
      // Insert a test movie
      const result = await db.collection('movies').insertOne({
        title: 'Test Movie',
        director: 'Test Director',
        genre: 'Action',
        year: 2023,
        rentalPrice: 4.99,
        availableCopies: 5
      });

      const movieId = result.insertedId.toString();

      await request(app)
        .delete(`/api/movies/${movieId}`)
        .expect(200);

      // Verify the movie was deleted from the database
      const movie = await db.collection('movies').findOne({ _id: result.insertedId });
      expect(movie).toBeNull();
    });
  });
});
