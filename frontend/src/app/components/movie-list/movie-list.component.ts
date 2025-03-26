import { Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../services/state.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  // Local component state
  searchQuery = signal<string>('');
  
  // Computed values from signals
  movies;
  loading;
  error;
  filteredMovies;
  selectedMovie;

  constructor(
    private stateService: StateService, 
    private router: Router,
    private analyticsService: AnalyticsService
  ) {
    // Initialize computed values from signals
    this.movies = this.stateService.movies;
    this.loading = this.stateService.loading;
    this.error = this.stateService.error;
    
    // Computed filtered movies based on search query
    this.filteredMovies = computed(() => {
      const query = this.searchQuery().toLowerCase();
      if (!query) return this.movies();
      
      return this.movies().filter((movie) =>
        movie.title.toLowerCase().includes(query)
      );
    });
    
    // Selected movie from state
    this.selectedMovie = computed(() => {
      const selectedId = this.stateService.selectedMovieId();
      if (!selectedId) return null;
      
      return this.movies().find(movie => movie._id === selectedId);
    });
  }

  ngOnInit(): void {
    // Track page view for analytics
    this.analyticsService.trackPageView('Movie List');
    
    // Load movies from state service
    this.stateService.loadMovies();
  }

  updateSearchQuery(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
    
    // Track search event for analytics
    if (input.value) {
      this.analyticsService.trackEvent('Search', 'Movie Search', input.value);
    }
  }

  showMovieDetails(movie: any): void {
    this.stateService.selectMovie(movie._id);
    
    // Track movie selection for analytics
    this.analyticsService.trackEvent('Movie', 'View Details', movie.title);
  }

  hideMovieDetails(): void {
    this.stateService.selectMovie(null);
  }

  editMovie(id: string): void {
    // Track edit action for analytics
    const movie = this.movies().find(m => m._id === id);
    if (movie) {
      this.analyticsService.trackEvent('Movie', 'Edit', movie.title);
    }
    
    this.router.navigate(['/movies/edit', id]);
  }

  deleteMovie(id: string): void {
    // Track delete action for analytics
    const movie = this.movies().find(m => m._id === id);
    if (movie) {
      this.analyticsService.trackEvent('Movie', 'Delete', movie.title);
    }
    
    if (confirm('Are you sure you want to delete this movie?')) {
      this.stateService.deleteMovie(id);
      
      // If the deleted movie is currently selected, hide details
      if (this.selectedMovie() && this.selectedMovie()._id === id) {
        this.hideMovieDetails();
      }
    }
  }

  // Navigate to the Add Movie Form
  navigateToAddMovie(): void {
    this.analyticsService.trackEvent('Movie', 'Navigate to Add');
    this.router.navigate(['/movies/add']);
  }
}
