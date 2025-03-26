import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecommendationService {
  private apiUrl = environment.lambdaUrl; // Lambda function URL from environment

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
  
  // Get trending movies (most viewed and rented)
  getTrendingMovies(limit: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/movies/trending?limit=${limit}`);
  }
  
  // Get personalized recommendations based on user's viewing history
  getPersonalizedRecommendations(userId: string, limit: number = 5): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/recommendations/personalized?userId=${userId}&limit=${limit}`);
  }
}
