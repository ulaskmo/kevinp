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
    if (!this.searchQuery.trim()) return;

    this.loading = true;
    this.error = null;
    this.searchResults = [];
    this.selectedMovie = null;

    this.externalApiService.searchMovies(this.searchQuery).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.searchResults = response.results || [];
          if (this.searchResults.length === 0) {
            this.error = 'No movies found matching your search.';
          }
        } else {
          console.warn('Real API failed, falling back to mock:', response.error);
          this.useFallbackSearch(); // fallback if OMDb fails
        }
      },
      error: (err) => {
        console.error('OMDb API error, falling back to simulation:', err);
        this.loading = false;
        this.useFallbackSearch(); // fallback on error
      }
    });
  }

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

    this.externalApiService.getMovieDetails(imdbId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.selectedMovie = response.movie;
        } else {
          console.warn('Fallback to simulation for details:', response.error);
          this.useFallbackDetails(imdbId);
        }
      },
      error: (err) => {
        console.error('OMDb detail fetch failed, fallback:', err);
        this.loading = false;
        this.useFallbackDetails(imdbId);
      }
    });
  }

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
      genre: this.selectedMovie.Genre.split(',')[0].trim(),
      year: parseInt(this.selectedMovie.Year),
      rentalPrice: 4.99,
      availableCopies: 5,
      plot: this.selectedMovie.Plot,
      actors: this.selectedMovie.Actors,
      poster: this.selectedMovie.Poster,
      imdbRating: this.selectedMovie.imdbRating,
      imdbId: this.selectedMovie.imdbID
    };

    this.movieService.addMovie(movie).subscribe({
      next: () => {
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
