import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './movie-form.component.html',
  styleUrls: ['./movie-form.component.css'],
})
export class MovieFormComponent implements OnInit {
  movieForm!: FormGroup; // Form group for the form controls
  movieId: string | null = null; // ID to determine if editing or adding

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    // Retrieve the movie ID from the route parameters
    this.movieId = this.route.snapshot.paramMap.get('id');
    this.initializeForm();

    // If editing, load the movie data into the form
    if (this.movieId) {
      this.loadMovieData();
    }
  }

  // Initialize the form controls with default values and validation
  initializeForm(): void {
    this.movieForm = this.fb.group({
      title: ['', Validators.required],
      director: ['', Validators.required],
      genre: ['', Validators.required],
      year: [null, [Validators.required, Validators.min(1900)]],
      rentalPrice: [null, Validators.required],
      availableCopies: [null, [Validators.required, Validators.min(1)]],
    });
  }

  // Load movie data for editing
  loadMovieData(): void {
    this.movieService.getMovies().subscribe((movies) => {
      const movie = movies.find((m) => m._id === this.movieId);
      if (movie) {
        this.movieForm.patchValue(movie); // Populate the form with movie data
      }
    });
  }

  // Handle form submission for adding or editing
  onSubmit(): void {
    if (this.movieForm.valid) {
      const movie = this.movieForm.value;

      if (this.movieId) {
        // Update an existing movie
        this.movieService.updateMovie(this.movieId, movie).subscribe(() => {
          this.router.navigate(['/movies']); // Navigate back to movie list
        });
      } else {
        // Add a new movie
        this.movieService.addMovie(movie).subscribe(() => {
          this.router.navigate(['/movies']); // Navigate back to movie list
        });
      }
    }
  }
}
