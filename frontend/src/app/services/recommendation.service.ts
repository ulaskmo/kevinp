import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private apiUrl = 'http://localhost:3001'; // Lambda function URL (local development)

  constructor(private http: HttpClient) {}

  // Get movie recommendations by genre
  getRecommendationsByGenre(genre: string, limit: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/recommendations?genre=${genre}&limit=${limit}`);
  }

  // Get similar movies based on a movie ID
  getSimilarMovies(movieId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/movies/${movieId}/similar`);
  }

  // Get top rated movies
  getTopRatedMovies(limit: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/movies/top-rated?limit=${limit}`);
  }
}
