import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalApiService {
  private apiUrl = 'https://www.omdbapi.com/';
  private apiKey = '8317bd37'; // ✅ Your working OMDb API key

  constructor(private http: HttpClient) {}

  // 🔍 Search for movies using the real OMDb API
  searchMovies(title: string): Observable<any> {
    const url = `${this.apiUrl}?s=${encodeURIComponent(title)}&apikey=${this.apiKey}`;
    console.log('Search URL:', url);

    return this.http.get(url).pipe(
      map((response: any) => {
        if (response.Response === 'True') {
          return {
            success: true,
            results: response.Search,
            totalResults: response.totalResults,
          };
        } else {
          return {
            success: false,
            error: response.Error,
          };
        }
      }),
      catchError((error) => {
        console.error('Error searching movies:', error);
        return of({
          success: false,
          error: 'Failed to search movies. Please try again later.',
        });
      })
    );
  }

  // 🎬 Get detailed movie info using the real OMDb API
  getMovieDetails(imdbId: string): Observable<any> {
    const url = `${this.apiUrl}?i=${imdbId}&plot=full&apikey=${this.apiKey}`;
    console.log('Details URL:', url);

    return this.http.get(url).pipe(
      map((response: any) => {
        if (response.Response === 'True') {
          return {
            success: true,
            movie: response,
          };
        } else {
          return {
            success: false,
            error: response.Error,
          };
        }
      }),
      catchError((error) => {
        console.error('Error fetching movie details:', error);
        return of({
          success: false,
          error: 'Failed to fetch movie details. Please try again later.',
        });
      })
    );
  }

  // 🧪 Simulated search method (used as fallback or for testing)
  simulateMovieSearch(title: string): Observable<any> {
    console.log('Simulating search for:', title);

    const mockResults = [
      {
        Title: 'The Shawshank Redemption',
        Year: '1994',
        imdbID: 'tt0111161',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
      },
      {
        Title: 'The Godfather',
        Year: '1972',
        imdbID: 'tt0068646',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      },
      {
        Title: 'The Dark Knight',
        Year: '2008',
        imdbID: 'tt0468569',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
      },
      {
        Title: 'Pulp Fiction',
        Year: '1994',
        imdbID: 'tt0110912',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      }
    ];

    const searchTerms = title.toLowerCase().split(' ');
    const filteredResults = mockResults.filter(movie => {
      const movieTitle = movie.Title.toLowerCase();
      return searchTerms.some(term => term.length >= 2 && movieTitle.includes(term));
    });

    return of({
      success: true,
      results: filteredResults,
      totalResults: filteredResults.length,
    }).pipe(delay(300));
  }

  // 🧪 Simulated detail method (used as fallback or for testing)
  simulateMovieDetails(imdbId: string): Observable<any> {
    console.log('Simulating movie details for ID:', imdbId);

    const mockMovieDetails: { [key: string]: any } = {
      'tt0111161': {
        Title: 'The Shawshank Redemption',
        Year: '1994',
        Rated: 'R',
        Released: '14 Oct 1994',
        Runtime: '142 min',
        Genre: 'Drama',
        Director: 'Frank Darabont',
        Writer: 'Stephen King, Frank Darabont',
        Actors: 'Tim Robbins, Morgan Freeman, Bob Gunton',
        Plot: 'Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.',
        Language: 'English',
        Country: 'USA',
        Awards: 'Nominated for 7 Oscars. 21 wins & 43 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
        imdbRating: '9.3',
        imdbVotes: '2,600,000',
        imdbID: 'tt0111161',
        Type: 'movie'
      }
    };

    const fallback = mockMovieDetails[imdbId] || mockMovieDetails['tt0111161'];

    return of({
      success: true,
      movie: fallback,
    }).pipe(delay(500));
  }
}
