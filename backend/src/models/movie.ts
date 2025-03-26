import { ObjectId } from 'mongodb';

export default interface Movie {
  _id?: ObjectId;
  title: string;
  director: string;
  genre: string;
  year: number;
  rentalPrice: number;
  availableCopies: number;
  
  // Additional fields for enhanced functionality
  poster?: string;           // URL to movie poster image
  plot?: string;             // Movie plot/description
  runtime?: number;          // Movie runtime in minutes
  rating?: number;           // Movie rating (e.g., 1-5 stars)
  actors?: string[];         // List of actors
  language?: string;         // Movie language
  releaseDate?: Date;        // Precise release date
  tags?: string[];           // Additional categorization tags
  trailerUrl?: string;       // URL to movie trailer
  
  // Analytics and tracking fields
  viewCount?: number;        // Number of times the movie details were viewed
  rentCount?: number;        // Number of times the movie was rented
  lastRented?: Date;         // Date the movie was last rented
  createdAt?: Date;          // When the movie was added to the database
  updatedAt?: Date;          // When the movie was last updated
}
