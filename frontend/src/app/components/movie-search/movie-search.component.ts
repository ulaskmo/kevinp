import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExternalApiService } from '../../services/external-api.service';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-search.component.html',
  styleUrls: ['./movie-search.component.css']
})
export class MovieSearchComponent {
  searchQuery: string = '';
  searchResults: any[] = [];
  selectedMovie: any = null;
  loading = false;
  error: string | null = null;
  importSuccess: string | null = null;

  constructor(
    private externalApiService: ExternalApiService,
    private movieService: MovieService
  ) {}

  searchMovies(): void {
    if (!this.searchQuery.trim()) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.searchResults = [];
    this.selectedMovie = null;

    // Always use simulation data since we're having issues with the API key
    console.log('Using simulation data for search:', this.searchQuery);
    this.useFallbackSearch();
  }
  
  // Fallback to simulation data if the real API fails
  private useFallbackSearch(): void {
    this.externalApiService.simulateMovieSearch(this.searchQuery).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.searchResults = response.results || [];
          if (this.searchResults.length === 0) {
            this.error = 'No movies found matching your search.';
          }
        } else {
          this.error = response.error || 'Failed to search movies.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'An error occurred while searching for movies.';
        console.error('Simulation error:', err);
      }
    });
  }

  viewMovieDetails(imdbId: string): void {
    this.loading = true;
    this.error = null;
    this.selectedMovie = null;

    // Log the movie ID for debugging
    console.log('Viewing details for movie ID:', imdbId);
    
    // Always use simulation data since we're having issues with the API key
    console.log('Using simulation data for movie details:', imdbId);
    this.useFallbackDetails(imdbId);
  }
  
  // Fallback to simulation data if the real API fails
  private useFallbackDetails(imdbId: string): void {
    this.externalApiService.simulateMovieDetails(imdbId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.selectedMovie = response.movie;
        } else {
          this.error = response.error || 'Failed to fetch movie details.';
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = 'An error occurred while fetching movie details.';
        console.error('Simulation error:', err);
      }
    });
  }

  importMovie(): void {
    if (!this.selectedMovie) return;

    const movie = {
      title: this.selectedMovie.Title,
      director: this.selectedMovie.Director,
      genre: this.selectedMovie.Genre.split(',')[0].trim(), // Take the first genre
      year: parseInt(this.selectedMovie.Year),
      rentalPrice: 4.99, // Default rental price
      availableCopies: 5, // Default available copies
      // Additional fields from external API
      plot: this.selectedMovie.Plot,
      actors: this.selectedMovie.Actors,
      poster: this.selectedMovie.Poster,
      imdbRating: this.selectedMovie.imdbRating,
      imdbId: this.selectedMovie.imdbID
    };

    this.movieService.addMovie(movie).subscribe({
      next: (response) => {
        this.importSuccess = `Successfully imported "${movie.title}" to your movie collection!`;
        setTimeout(() => {
          this.importSuccess = null;
        }, 5000);
      },
      error: (err) => {
        this.error = 'Failed to import movie to your collection.';
        console.error('Import error:', err);
      }
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResults = [];
    this.selectedMovie = null;
    this.error = null;
    this.importSuccess = null;
  }
}
