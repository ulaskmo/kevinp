import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import Movie from '../models/movie';
import { getDb } from '../database';

export const getMovies = async (req: Request, res: Response): Promise<void> => {
    const db = getDb();

    // Extract query parameters with proper type casting
    const genre = req.query.genre as string;
    const year = req.query.year as string;
    const sortField = req.query.sortField as string;
    const sortOrder = (req.query.sortOrder as string) || 'asc';
    const fields = req.query.fields as string;

    // Create the filter object based on genre and year
    const filter: any = {};
    if (genre) filter.genre = genre;
    if (year) filter.year = Number(year);  // Convert year to a number

    // Create the projection object for selected fields
    const projection: any = {};
    if (fields) {
        fields.split(',').forEach((field: string) => {
            projection[field] = 1;
        });
    }

    // Determine the sort order (1 for ascending, -1 for descending)
    const sort: any = {};
    if (sortField) {
        sort[sortField] = sortOrder === 'asc' ? 1 : -1;
    }

    try {
        // Find movies based on filter, projection, and sort
        const movies = await db.collection('movies').find(filter, { projection }).sort(sort).toArray();
        res.json(movies);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve movies' });
    }
};

// Create a new movie
export const createMovie = async (req: Request, res: Response): Promise<void> => {
    const db = getDb();
    const { 
        title, director, genre, year, rentalPrice, availableCopies,
        poster, plot, runtime, rating, actors, language, releaseDate,
        tags, trailerUrl
    } = req.body;

    // Validate the presence of required fields
    if (!title || !director || !genre || !year || !rentalPrice || !availableCopies) {
        res.status(400).json({ error: "All fields (title, director, genre, year, rentalPrice, availableCopies) are required." });
        return;
    }

    // Additional validation (e.g., checking data types)
    if (typeof year !== 'number' || typeof rentalPrice !== 'number' || typeof availableCopies !== 'number') {
        res.status(400).json({ error: "Year, rentalPrice, and availableCopies must be numbers." });
        return;
    }

    // Optional field validation
    if (runtime !== undefined && typeof runtime !== 'number') {
        res.status(400).json({ error: "Runtime must be a number." });
        return;
    }

    if (rating !== undefined && (typeof rating !== 'number' || rating < 0 || rating > 5)) {
        res.status(400).json({ error: "Rating must be a number between 0 and 5." });
        return;
    }

    if (actors !== undefined && !Array.isArray(actors)) {
        res.status(400).json({ error: "Actors must be an array of strings." });
        return;
    }

    if (tags !== undefined && !Array.isArray(tags)) {
        res.status(400).json({ error: "Tags must be an array of strings." });
        return;
    }

    try {
        // Create the new movie object with all fields
        const newMovie: Movie = { 
            title, 
            director, 
            genre, 
            year, 
            rentalPrice, 
            availableCopies,
            // Add optional fields if they exist
            ...(poster && { poster }),
            ...(plot && { plot }),
            ...(runtime && { runtime }),
            ...(rating && { rating }),
            ...(actors && { actors }),
            ...(language && { language }),
            ...(releaseDate && { releaseDate: new Date(releaseDate) }),
            ...(tags && { tags }),
            ...(trailerUrl && { trailerUrl }),
            // Add tracking fields
            viewCount: 0,
            rentCount: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('movies').insertOne(newMovie);
        res.status(201).json(result);  // Send back success response
    } catch (error) {
        console.error('Error creating movie:', error);
        res.status(500).json({ error: "Failed to create the movie." });
    }
};


// Update movie by ID
export const updateMovie = async (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    
    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid ID format' });
        return;
    }
    
    try {
        // Get the movie data from the request body
        const movieData = req.body;
        
        // Add updatedAt timestamp
        const updatedMovie: Partial<Movie> = {
            ...movieData,
            updatedAt: new Date()
        };
        
        // Handle date fields if they exist as strings
        if (updatedMovie.releaseDate && typeof updatedMovie.releaseDate === 'string') {
            updatedMovie.releaseDate = new Date(updatedMovie.releaseDate);
        }
        
        if (updatedMovie.lastRented && typeof updatedMovie.lastRented === 'string') {
            updatedMovie.lastRented = new Date(updatedMovie.lastRented);
        }
        
        // Update the movie in the database
        const result = await db.collection('movies').updateOne(
            { _id: new ObjectId(id) }, 
            { $set: updatedMovie }
        );
        
        if (result.matchedCount === 0) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        
        res.json({ 
            message: 'Movie updated successfully',
            result 
        });
    } catch (error) {
        console.error('Error updating movie:', error);
        res.status(500).json({ error: 'Failed to update movie' });
    }
};

// Delete movie by ID
export const deleteMovie = async (req: Request, res: Response) => {
    const db = getDb();
    const { id } = req.params;
    const result = await db.collection('movies').deleteOne({ _id: new ObjectId(id) });
    res.json(result);
};

// Get movie by ID
export const getMovieById = async (req: Request, res: Response): Promise<void> => {
    const db = getDb();
    const { id } = req.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid ID format' });
        return;
    }

    try {
        // First, find the movie
        const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });
        
        if (!movie) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        
        // Increment the view count
        await db.collection('movies').updateOne(
            { _id: new ObjectId(id) },
            { 
                $inc: { viewCount: 1 },
                $set: { updatedAt: new Date() }
            }
        );
        
        // Return the movie with the updated view count
        movie.viewCount = (movie.viewCount || 0) + 1;
        movie.updatedAt = new Date();
        
        res.json(movie);
    } catch (error) {
        console.error('Error retrieving movie:', error);
        res.status(500).json({ error: 'Failed to retrieve movie' });
    }
};

// Delete the most recently added movie
export const deleteLastMovie = async (req: Request, res: Response): Promise<void> => {
    const db = getDb();

    try {
        // Find the most recent movie by sorting by _id in descending order
        const lastMovie = await db.collection('movies').findOne({}, { sort: { _id: -1 } });

        if (!lastMovie || !lastMovie._id) {
            res.status(404).json({ error: 'No movies found to delete.' });
            return;
        }

        // Validate the _id before using it
        const movieId = lastMovie._id;
        if (!ObjectId.isValid(movieId)) {
            res.status(400).json({ error: 'Invalid movie ID format.' });
            return;
        }

        // Delete the most recent movie
        await db.collection('movies').deleteOne({ _id: new ObjectId(movieId) });

        res.json({ message: 'Last movie deleted successfully', movie: lastMovie });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete the last movie.' });
    }
};

// Track movie rental
export const trackRental = async (req: Request, res: Response): Promise<void> => {
    const db = getDb();
    const { id } = req.params;
    const { customerId, rentalDuration } = req.body;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid movie ID format' });
        return;
    }

    if (!customerId) {
        res.status(400).json({ error: 'Customer ID is required' });
        return;
    }

    if (!ObjectId.isValid(customerId)) {
        res.status(400).json({ error: 'Invalid customer ID format' });
        return;
    }

    if (!rentalDuration || typeof rentalDuration !== 'number' || rentalDuration <= 0) {
        res.status(400).json({ error: 'Valid rental duration is required' });
        return;
    }

    try {
        // Find the movie
        const movie = await db.collection('movies').findOne({ _id: new ObjectId(id) });
        
        if (!movie) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }

        // Check if there are available copies
        if (movie.availableCopies <= 0) {
            res.status(400).json({ error: 'No copies available for rental' });
            return;
        }

        // Update movie with rental information
        const result = await db.collection('movies').updateOne(
            { _id: new ObjectId(id) },
            { 
                $inc: { 
                    rentCount: 1,
                    availableCopies: -1
                },
                $set: { 
                    lastRented: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        // Create rental record
        const rental = {
            movieId: new ObjectId(id),
            customerId: new ObjectId(customerId),
            rentalDate: new Date(),
            returnDate: null,
            dueDate: new Date(Date.now() + rentalDuration * 24 * 60 * 60 * 1000), // Convert days to milliseconds
            rentalPrice: movie.rentalPrice,
            status: 'active'
        };

        await db.collection('rentals').insertOne(rental);

        res.json({ 
            message: 'Movie rental tracked successfully',
            movie: {
                ...movie,
                rentCount: (movie.rentCount || 0) + 1,
                availableCopies: movie.availableCopies - 1,
                lastRented: new Date()
            },
            rental
        });
    } catch (error) {
        console.error('Error tracking movie rental:', error);
        res.status(500).json({ error: 'Failed to track movie rental' });
    }
};

// Get movie analytics
export const getMovieAnalytics = async (req: Request, res: Response): Promise<void> => {
    const db = getDb();

    try {
        // Get top viewed movies
        const topViewed = await db.collection('movies')
            .find({})
            .sort({ viewCount: -1 })
            .limit(5)
            .toArray();

        // Get top rented movies
        const topRented = await db.collection('movies')
            .find({})
            .sort({ rentCount: -1 })
            .limit(5)
            .toArray();

        // Get recently added movies
        const recentlyAdded = await db.collection('movies')
            .find({})
            .sort({ createdAt: -1 })
            .limit(5)
            .toArray();

        // Get genre distribution
        const genreDistribution = await db.collection('movies').aggregate([
            { $group: { _id: "$genre", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]).toArray();

        // Get total movies count
        const totalMovies = await db.collection('movies').countDocuments();

        // Get total rentals count
        const totalRentals = await db.collection('rentals').countDocuments();

        res.json({
            topViewed,
            topRented,
            recentlyAdded,
            genreDistribution,
            totalMovies,
            totalRentals
        });
    } catch (error) {
        console.error('Error getting movie analytics:', error);
        res.status(500).json({ error: 'Failed to get movie analytics' });
    }
};
