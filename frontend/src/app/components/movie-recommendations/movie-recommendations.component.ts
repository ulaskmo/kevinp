import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecommendationService } from '../../services/recommendation.service';

@Component({
  selector: 'app-movie-recommendations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-recommendations.component.html',
  styleUrls: ['./movie-recommendations.component.css']
})
export class MovieRecommendationsComponent implements OnInit {
  @Input() movieId: string | null = null;
  @Input() genre: string | null = null;
  
  similarMovies: any[] = [];
  recommendedMovies: any[] = [];
  topRatedMovies: any[] = [];
  
  loading = {
    similar: false,
    recommended: false,
    topRated: false
  };
  
  error = {
    similar: null as string | null,
    recommended: null as string | null,
    topRated: null as string | null
  };

  constructor(private recommendationService: RecommendationService) {}

  ngOnInit(): void {
    this.loadRecommendations();
  }

  loadRecommendations(): void {
    // Load similar movies if movieId is provided
    if (this.movieId) {
      this.loading.similar = true;
      this.recommendationService.getSimilarMovies(this.movieId).subscribe({
        next: (data) => {
          this.similarMovies = data.similarMovies;
          this.loading.similar = false;
        },
        error: (err) => {
          console.error('Error fetching similar movies:', err);
          this.error.similar = 'Failed to load similar movies';
          this.loading.similar = false;
        }
      });
    }
    
    // Load genre recommendations if genre is provided
    if (this.genre) {
      this.loading.recommended = true;
      this.recommendationService.getRecommendationsByGenre(this.genre).subscribe({
        next: (data) => {
          this.recommendedMovies = data.recommendations;
          this.loading.recommended = false;
        },
        error: (err) => {
          console.error('Error fetching recommendations:', err);
          this.error.recommended = 'Failed to load recommendations';
          this.loading.recommended = false;
        }
      });
    }
    
    // Load top rated movies
    this.loading.topRated = true;
    this.recommendationService.getTopRatedMovies().subscribe({
      next: (data) => {
        this.topRatedMovies = data.topRatedMovies;
        this.loading.topRated = false;
      },
      error: (err) => {
        console.error('Error fetching top rated movies:', err);
        this.error.topRated = 'Failed to load top rated movies';
        this.loading.topRated = false;
      }
    });
  }
}
