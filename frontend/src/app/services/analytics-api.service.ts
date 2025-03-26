import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsApiService {
  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  /**
   * Get movie analytics data from the API
   * @returns Observable with analytics data
   */
  getMovieAnalytics(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movies/analytics/data`);
  }

  /**
   * Track a movie rental
   * @param movieId The ID of the movie being rented
   * @param customerId The ID of the customer renting the movie
   * @param rentalDuration The duration of the rental in days
   * @returns Observable with the rental information
   */
  trackMovieRental(movieId: string, customerId: string, rentalDuration: number): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/movies/${movieId}/rent`, {
      customerId,
      rentalDuration
    });
  }

  /**
   * Get analytics data for a specific time period
   * @param startDate The start date for the analytics period
   * @param endDate The end date for the analytics period
   * @returns Observable with the filtered analytics data
   */
  getAnalyticsForPeriod(startDate: Date, endDate: Date): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movies/analytics/data`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  /**
   * Get analytics data for a specific genre
   * @param genre The genre to filter analytics by
   * @returns Observable with the filtered analytics data
   */
  getAnalyticsForGenre(genre: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/movies/analytics/data`, {
      params: {
        genre
      }
    });
  }

  /**
   * Get rental history for a specific movie
   * @param movieId The ID of the movie
   * @returns Observable with the rental history
   */
  getMovieRentalHistory(movieId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rentals/movie/${movieId}`);
  }

  /**
   * Get rental history for a specific customer
   * @param customerId The ID of the customer
   * @returns Observable with the rental history
   */
  getCustomerRentalHistory(customerId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/rentals/customer/${customerId}`);
  }
}
