import { Injectable, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MovieService } from './movie.service';
import { RecommendationService } from './recommendation.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  // State signals
  private moviesSignal = signal<any[]>([]);
  private selectedMovieIdSignal = signal<string | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  // Computed values
  public movies = computed(() => this.moviesSignal());
  public selectedMovieId = computed(() => this.selectedMovieIdSignal());
  public loading = computed(() => this.loadingSignal());
  public error = computed(() => this.errorSignal());
  
  // Computed value for selected movie
  public selectedMovie = computed(() => {
    const id = this.selectedMovieIdSignal();
    if (!id) return null;
    
    const movies = this.moviesSignal();
    return movies.find(movie => movie._id === id) || null;
  });
  
  // Computed value for filtered movies by genre
  public moviesByGenre = (genre: string) => computed(() => {
    return this.moviesSignal().filter(movie => movie.genre === genre);
  });

  constructor(
    private movieService: MovieService,
    private recommendationService: RecommendationService
  ) {
    // Initialize state by loading movies
    this.loadMovies();
  }

  // Actions
  loadMovies(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.movieService.getMovies().subscribe({
      next: (movies) => {
        this.moviesSignal.set(movies);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error loading movies:', err);
        this.errorSignal.set('Failed to load movies');
        this.loadingSignal.set(false);
      }
    });
  }
  
  selectMovie(id: string | null): void {
    this.selectedMovieIdSignal.set(id);
  }
  
  addMovie(movie: any): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.movieService.addMovie(movie).subscribe({
      next: (response) => {
        // Reload movies to get the updated list
        this.loadMovies();
      },
      error: (err) => {
        console.error('Error adding movie:', err);
        this.errorSignal.set('Failed to add movie');
        this.loadingSignal.set(false);
      }
    });
  }
  
  updateMovie(id: string, movie: any): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.movieService.updateMovie(id, movie).subscribe({
      next: (response) => {
        // Update the movie in the local state
        const movies = this.moviesSignal();
        const updatedMovies = movies.map(m => 
          m._id === id ? { ...m, ...movie } : m
        );
        this.moviesSignal.set(updatedMovies);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error updating movie:', err);
        this.errorSignal.set('Failed to update movie');
        this.loadingSignal.set(false);
      }
    });
  }
  
  deleteMovie(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);
    
    this.movieService.deleteMovie(id).subscribe({
      next: (response) => {
        // Remove the movie from the local state
        const movies = this.moviesSignal();
        const updatedMovies = movies.filter(m => m._id !== id);
        this.moviesSignal.set(updatedMovies);
        this.loadingSignal.set(false);
      },
      error: (err) => {
        console.error('Error deleting movie:', err);
        this.errorSignal.set('Failed to delete movie');
        this.loadingSignal.set(false);
      }
    });
  }
}
