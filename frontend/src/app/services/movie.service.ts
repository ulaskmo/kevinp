import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    // Get API URL from environment configuration
    this.apiUrl = `${environment.apiUrl}/movies`;
    console.log('Movie Service API URL:', this.apiUrl);
  }

  getMovies(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getMovieById(movieId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${movieId}`);
  }

  addMovie(movie: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, movie);
  }

  updateMovie(movieId: string, movie: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${movieId}`, movie);
  }

  deleteMovie(movieId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${movieId}`);
  }
}
