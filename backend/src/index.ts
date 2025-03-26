import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDb, connectToDatabase } from './database';
import movieRoutes from './routes/movieRoutes';
import customerRoutes from './routes/customerRoutes';
import authRoutes from './routes/authRoutes';
import { createInitialAdminUser } from './controllers/authController';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*', // In production, restrict to your domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

const PORT = process.env.PORT || 3000;

// Connect to database and start server
connectToDb(async () => {
    // Create initial admin and user accounts if they don't exist
    await createInitialAdminUser();
    
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Default users created: admin/admin123 (ADMIN) and user/user123 (USER)`);
    });
});
