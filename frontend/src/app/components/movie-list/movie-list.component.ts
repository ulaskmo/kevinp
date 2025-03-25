import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css'],
})
export class MovieListComponent implements OnInit {
  movies: any[] = [];
  filteredMovies: any[] = [];
  selectedMovie: any | null = null;
  searchQuery: string = '';

  constructor(private movieService: MovieService, private router: Router) {}

  ngOnInit(): void {
    this.fetchMovies();
  }

  fetchMovies(): void {
    this.movieService.getMovies().subscribe({
      next: (data) => {
        this.movies = data;
        this.filteredMovies = data;
      },
      error: (err) => console.error('Error fetching movies: ', err),
    });
  }

  searchMovies(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredMovies = this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(query)
    );
  }

  showMovieDetails(movie: any): void {
    this.selectedMovie = movie;
  }

  hideMovieDetails(): void {
    this.selectedMovie = null;
  }

  editMovie(id: string): void {
    this.router.navigate(['/movies/edit', id]);
  }

  deleteMovie(id: string): void {
    this.movieService.deleteMovie(id).subscribe({
      next: () => {
        this.fetchMovies();
        if (this.selectedMovie && this.selectedMovie._id === id) {
          this.hideMovieDetails();
        }
      },
      error: (err) => console.error('Error deleting movie: ', err),
    });
  }

  // New Method: Navigate to the Add Movie Form
  navigateToAddMovie(): void {
    this.router.navigate(['/movies/add']);
  }
}
