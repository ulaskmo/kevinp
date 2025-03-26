import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectToDb } from './database';
import movieRoutes from './routes/movieRoutes';
import customerRoutes from './routes/customerRoutes';

dotenv.config();

const app = express();

// Enable CORS for all routes
app.use(cors());

app.use(express.json());

// API routes
app.use('/api/movies', movieRoutes);
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 3000;

connectToDb(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
