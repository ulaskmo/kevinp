"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLastMovie = exports.getMovieById = exports.deleteMovie = exports.updateMovie = exports.createMovie = exports.getMovies = void 0;
const mongodb_1 = require("mongodb");
const database_1 = require("../database");
const getMovies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    // Extract query parameters with proper type casting
    const genre = req.query.genre;
    const year = req.query.year;
    const sortField = req.query.sortField;
    const sortOrder = req.query.sortOrder || 'asc';
    const fields = req.query.fields;
    // Create the filter object based on genre and year
    const filter = {};
    if (genre)
        filter.genre = genre;
    if (year)
        filter.year = Number(year); // Convert year to a number
    // Create the projection object for selected fields
    const projection = {};
    if (fields) {
        fields.split(',').forEach((field) => {
            projection[field] = 1;
        });
    }
    // Determine the sort order (1 for ascending, -1 for descending)
    const sort = {};
    if (sortField) {
        sort[sortField] = sortOrder === 'asc' ? 1 : -1;
    }
    try {
        // Find movies based on filter, projection, and sort
        const movies = yield db.collection('movies').find(filter, { projection }).sort(sort).toArray();
        res.json(movies);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve movies' });
    }
});
exports.getMovies = getMovies;
// Create a new movie
const createMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const { title, director, genre, year, rentalPrice, availableCopies } = req.body;
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
    try {
        const newMovie = { title, director, genre, year, rentalPrice, availableCopies };
        const result = yield db.collection('movies').insertOne(newMovie);
        res.status(201).json(result); // Send back success response
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create the movie." });
    }
});
exports.createMovie = createMovie;
// Update movie by ID
const updateMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const { id } = req.params;
    const updatedMovie = req.body;
    const result = yield db.collection('movies').updateOne({ _id: new mongodb_1.ObjectId(id) }, { $set: updatedMovie });
    res.json(result);
});
exports.updateMovie = updateMovie;
// Delete movie by ID
const deleteMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const { id } = req.params;
    const result = yield db.collection('movies').deleteOne({ _id: new mongodb_1.ObjectId(id) });
    res.json(result);
});
exports.deleteMovie = deleteMovie;
//get movie by id
const getMovieById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    const { id } = req.params;
    // Validate ObjectId format
    if (!mongodb_1.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid ID format' });
        return;
    }
    try {
        const movie = yield db.collection('movies').findOne({ _id: new mongodb_1.ObjectId(id) });
        if (!movie) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }
        res.json(movie);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to retrieve movie' });
    }
});
exports.getMovieById = getMovieById;
// Delete the most recently added movie
const deleteLastMovie = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const db = (0, database_1.getDb)();
    try {
        // Find the most recent movie by sorting by _id in descending order
        const lastMovie = yield db.collection('movies').findOne({}, { sort: { _id: -1 } });
        if (!lastMovie || !lastMovie._id) {
            res.status(404).json({ error: 'No movies found to delete.' });
            return;
        }
        // Validate the _id before using it
        const movieId = lastMovie._id;
        if (!mongodb_1.ObjectId.isValid(movieId)) {
            res.status(400).json({ error: 'Invalid movie ID format.' });
            return;
        }
        // Delete the most recent movie
        yield db.collection('movies').deleteOne({ _id: new mongodb_1.ObjectId(movieId) });
        res.json({ message: 'Last movie deleted successfully', movie: lastMovie });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete the last movie.' });
    }
});
exports.deleteLastMovie = deleteLastMovie;
