import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { MovieRecommendationsComponent } from '../movie-recommendations/movie-recommendations.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MovieRecommendationsComponent],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css'],
})
export class MovieDetailsComponent implements OnInit {
  movie: any;
  movieId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.movieId = this.route.snapshot.paramMap.get('id');
    if (this.movieId) {
      this.loadMovieDetails();
    }
  }

  loadMovieDetails(): void {
    if (!this.movieId) return;
    
    this.movieService.getMovieById(this.movieId).subscribe({
      next: (movie) => {
        this.movie = movie;
        console.log('Movie found:', this.movie);
      },
      error: (err) => console.error('Error fetching movie details:', err),
    });
  }

  editMovie(): void {
    if (this.movieId) {
      this.router.navigate(['/movies/edit', this.movieId]);
    }
  }

  deleteMovie(): void {
    if (!this.movieId) return;

    if (confirm('Are you sure you want to delete this movie?')) {
      this.movieService.deleteMovie(this.movieId).subscribe({
        next: () => {
          console.log('Movie deleted successfully');
          this.router.navigate(['/movies']);
        },
        error: (err) => console.error('Error deleting movie:', err),
      });
    }
  }
}
