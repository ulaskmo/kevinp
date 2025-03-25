import express from 'express';
import dotenv from 'dotenv';
import { connectToDb } from './database';
import movieRoutes from './routes/movieRoutes';
import customerRoutes from './routes/customerRoutes';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/movies', movieRoutes);
app.use('/api/customers', customerRoutes);

const PORT = process.env.PORT || 3000;

connectToDb(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
