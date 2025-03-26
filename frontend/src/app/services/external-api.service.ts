import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExternalApiService {
  // OMDb API URLs - Using HTTPS for security
  private apiUrl = 'https://www.omdbapi.com/';
  private imgApiUrl = 'https://img.omdbapi.com/';
  private apiKey = 'f9d3c74f'; // OMDb API key - using a different key

  constructor(private http: HttpClient) {}

  // Search for movies by title
  searchMovies(title: string): Observable<any> {
    // Use the exact URL format as provided in the OMDb API documentation
    const url = `${this.apiUrl}?s=${encodeURIComponent(title)}&apikey=${this.apiKey}`;
    console.log('Search URL:', url); // For debugging
    
    return this.http
      .get(url)
      .pipe(
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

  // Get detailed movie information by IMDb ID
  getMovieDetails(imdbId: string): Observable<any> {
    // Use the exact URL format as provided in the OMDb API documentation
    const url = `${this.apiUrl}?i=${imdbId}&plot=full&apikey=${this.apiKey}`;
    console.log('Details URL:', url); // For debugging
    
    return this.http
      .get(url)
      .pipe(
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

  // Simulate API response for development (when API key is not available)
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
      },
      {
        Title: 'The Matrix',
        Year: '1999',
        imdbID: 'tt0133093',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
      },
      {
        Title: 'The Matrix Reloaded',
        Year: '2003',
        imdbID: 'tt0234215',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BODE0MzZhZTgtYzkwYi00YmI5LThlZWYtOWRmNWE5ODk0NzMxXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
      },
      {
        Title: 'The Matrix Revolutions',
        Year: '2003',
        imdbID: 'tt0242653',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNzNlZTZjMDctZjYwNi00NzljLWIwN2QtZWZmYmJiYzQ0MTk2XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg',
      },
      {
        Title: 'Goodfellas',
        Year: '1990',
        imdbID: 'tt0099685',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BY2NkZjEzMDgtN2RjYy00YzM1LWI4ZmQtMjIwYjFjNmI3ZGEwXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      },
      {
        Title: 'Star Wars: Episode IV - A New Hope',
        Year: '1977',
        imdbID: 'tt0076759',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg',
      },
      {
        Title: 'Star Wars: Episode V - The Empire Strikes Back',
        Year: '1980',
        imdbID: 'tt0080684',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BYmU1NDRjNDgtMzhiMi00NjZmLTg5NGItZDNiZjU5NTU4OTE0XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
      },
      {
        Title: 'Star Wars: Episode VI - Return of the Jedi',
        Year: '1983',
        imdbID: 'tt0086190',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BOWZlMjFiYzgtMTUzNC00Y2IzLTk1NTMtZmNhMTczNTk0ODk1XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg',
      },
      {
        Title: 'Star Wars: Episode I - The Phantom Menace',
        Year: '1999',
        imdbID: 'tt0120915',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BYTRhNjcwNWQtMGJmMi00NmQyLWE2YzItODVmMTdjNWI0ZDA2XkEyXkFqcGdeQXVyNTAyODkwOQ@@._V1_SX300.jpg',
      },
      {
        Title: 'Star Wars: Episode II - Attack of the Clones',
        Year: '2002',
        imdbID: 'tt0121765',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMDAzM2M0Y2UtZjRmZi00MzVlLTg4MjEtOTE3NzU5ZDVlMTU5XkEyXkFqcGdeQXVyNDUyOTg3Njg@._V1_SX300.jpg',
      },
      {
        Title: 'Star Wars: Episode III - Revenge of the Sith',
        Year: '2005',
        imdbID: 'tt0121766',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNTc4MTc3NTQ5OF5BMl5BanBnXkFtZTcwOTg0NjI4NA@@._V1_SX300.jpg',
      },
      {
        Title: 'Deadpool',
        Year: '2016',
        imdbID: 'tt1431045',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BYzE5MjY1ZDgtMTkyNC00MTMyLThhMjAtZGI5OTE1NzFlZGJjXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
      },
      {
        Title: 'Deadpool 2',
        Year: '2018',
        imdbID: 'tt5463162',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BODQ0NDhjYWItYTMxZi00NTk2LWIzNDEtOWZiYWYxZjc2MTgxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
      },
      {
        Title: 'Inception',
        Year: '2010',
        imdbID: 'tt1375666',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
      },
      {
        Title: 'Interstellar',
        Year: '2014',
        imdbID: 'tt0816692',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      },
      {
        Title: 'The Avengers',
        Year: '2012',
        imdbID: 'tt0848228',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNDYxNjQyMjAtNTdiOS00NGYwLWFmNTAtNThmYjU5ZGI2YTI1XkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_SX300.jpg',
      },
      {
        Title: 'Avengers: Age of Ultron',
        Year: '2015',
        imdbID: 'tt2395427',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMTM4OGJmNWMtOTM4Ni00NTE3LTg3MDItZmQxYjc4N2JhNmUxXkEyXkFqcGdeQXVyNTgzMDMzMTg@._V1_SX300.jpg',
      },
      {
        Title: 'Avengers: Infinity War',
        Year: '2018',
        imdbID: 'tt4154756',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMjMxNjY2MDU1OV5BMl5BanBnXkFtZTgwNzY1MTUwNTM@._V1_SX300.jpg',
      },
      {
        Title: 'Avengers: Endgame',
        Year: '2019',
        imdbID: 'tt4154796',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg',
      },
      {
        Title: 'Batman Begins',
        Year: '2005',
        imdbID: 'tt0372784',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BOTY4YjI2N2MtYmFlMC00ZjcyLTg3YjEtMDQyM2ZjYzQ5YWFkXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
      },
      {
        Title: 'The Dark Knight Rises',
        Year: '2012',
        imdbID: 'tt1345836',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMTk4ODQzNDY3Ml5BMl5BanBnXkFtZTcwODA0NTM4Nw@@._V1_SX300.jpg',
      },
      {
        Title: 'Jurassic Park',
        Year: '1993',
        imdbID: 'tt0107290',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMjM2MDgxMDg0Nl5BMl5BanBnXkFtZTgwNTM2OTM5NDE@._V1_SX300.jpg',
      },
      {
        Title: 'Titanic',
        Year: '1997',
        imdbID: 'tt0120338',
        Type: 'movie',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMDdmZGU3NDQtY2E5My00ZTliLWIzOTUtMTY4ZGI1YjdiNjk3XkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_SX300.jpg',
      }
    ];

    // Filter movies based on search query - more flexible search
    const searchTerms = title.toLowerCase().split(' ');
    
    // If no search terms, return all movies
    if (searchTerms.length === 0 || (searchTerms.length === 1 && searchTerms[0] === '')) {
      console.log('No search terms, returning all movies');
      return of({
        success: true,
        results: mockResults,
        totalResults: mockResults.length,
      }).pipe(delay(300));
    }
    
    // Filter movies based on search terms
    const filteredResults = mockResults.filter(movie => {
      const movieTitle = movie.Title.toLowerCase();
      // Match if any search term is included in the title
      return searchTerms.some(term => {
        if (term.length < 2) return false; // Skip very short terms
        return movieTitle.includes(term);
      });
    });

    console.log('Found', filteredResults.length, 'mock results');

    // Simulate network delay
    return of({
      success: true,
      results: filteredResults,
      totalResults: filteredResults.length,
    }).pipe(delay(300)); // Add a small delay to simulate network request
  }

  // Simulate getting movie details (when API key is not available)
  simulateMovieDetails(imdbId: string): Observable<any> {
    console.log('Simulating movie details for ID:', imdbId);
    
    // Collection of mock movie details
    const mockMovieDetailsCollection: { [key: string]: any } = {
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
        Country: 'United States',
        Awards: 'Nominated for 7 Oscars. 21 wins & 43 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BNDE3ODcxYzMtY2YzZC00NmNlLWJiNDMtZDViZWM2MzIxZDYwXkEyXkFqcGdeQXVyNjAwNDUxODI@._V1_SX300.jpg',
        imdbRating: '9.3',
        imdbVotes: '2,651,216',
        imdbID: 'tt0111161',
        Type: 'movie',
      },
      'tt0068646': {
        Title: 'The Godfather',
        Year: '1972',
        Rated: 'R',
        Released: '24 Mar 1972',
        Runtime: '175 min',
        Genre: 'Crime, Drama',
        Director: 'Francis Ford Coppola',
        Writer: 'Mario Puzo, Francis Ford Coppola',
        Actors: 'Marlon Brando, Al Pacino, James Caan',
        Plot: 'The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.',
        Language: 'English, Italian, Latin',
        Country: 'United States',
        Awards: 'Won 3 Oscars. 31 wins & 30 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SX300.jpg',
        imdbRating: '9.2',
        imdbVotes: '1,860,471',
        imdbID: 'tt0068646',
        Type: 'movie',
      },
      'tt0468569': {
        Title: 'The Dark Knight',
        Year: '2008',
        Rated: 'PG-13',
        Released: '18 Jul 2008',
        Runtime: '152 min',
        Genre: 'Action, Crime, Drama',
        Director: 'Christopher Nolan',
        Writer: 'Jonathan Nolan, Christopher Nolan, David S. Goyer',
        Actors: 'Christian Bale, Heath Ledger, Aaron Eckhart',
        Plot: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
        Language: 'English, Mandarin',
        Country: 'United States, United Kingdom',
        Awards: 'Won 2 Oscars. 159 wins & 163 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_SX300.jpg',
        imdbRating: '9.0',
        imdbVotes: '2,606,691',
        imdbID: 'tt0468569',
        Type: 'movie',
      },
      'tt0076759': {
        Title: 'Star Wars: Episode IV - A New Hope',
        Year: '1977',
        Rated: 'PG',
        Released: '25 May 1977',
        Runtime: '121 min',
        Genre: 'Action, Adventure, Fantasy',
        Director: 'George Lucas',
        Writer: 'George Lucas',
        Actors: 'Mark Hamill, Harrison Ford, Carrie Fisher',
        Plot: 'Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee and two droids to save the galaxy from the Empire\'s world-destroying battle station, while also attempting to rescue Princess Leia from the mysterious Darth Vader.',
        Language: 'English',
        Country: 'United States',
        Awards: 'Won 6 Oscars. 63 wins & 29 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BOTA5NjhiOTAtZWM0ZC00MWNhLThiMzEtZDFkOTk2OTU1ZDJkXkEyXkFqcGdeQXVyMTA4NDI1NTQx._V1_SX300.jpg',
        imdbRating: '8.6',
        imdbVotes: '1,315,613',
        imdbID: 'tt0076759',
        Type: 'movie',
      },
      'tt1431045': {
        Title: 'Deadpool',
        Year: '2016',
        Rated: 'R',
        Released: '12 Feb 2016',
        Runtime: '108 min',
        Genre: 'Action, Adventure, Comedy',
        Director: 'Tim Miller',
        Writer: 'Rhett Reese, Paul Wernick',
        Actors: 'Ryan Reynolds, Morena Baccarin, T.J. Miller',
        Plot: 'A wisecracking mercenary gets experimented on and becomes immortal but ugly, and sets out to track down the man who ruined his looks.',
        Language: 'English',
        Country: 'United States',
        Awards: 'Nominated for 2 Golden Globes. 29 wins & 78 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BYzE5MjY1ZDgtMTkyNC00MTMyLThhMjAtZGI5OTE1NzFlZGJjXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg',
        imdbRating: '8.0',
        imdbVotes: '1,010,139',
        imdbID: 'tt1431045',
        Type: 'movie',
      },
      'tt5463162': {
        Title: 'Deadpool 2',
        Year: '2018',
        Rated: 'R',
        Released: '18 May 2018',
        Runtime: '119 min',
        Genre: 'Action, Adventure, Comedy',
        Director: 'David Leitch',
        Writer: 'Rhett Reese, Paul Wernick, Ryan Reynolds',
        Actors: 'Ryan Reynolds, Josh Brolin, Morena Baccarin',
        Plot: 'Foul-mouthed mutant mercenary Wade Wilson (a.k.a. Deadpool) assembles a team of fellow mutant rogues to protect a young boy with supernatural abilities from the brutal, time-traveling cyborg Cable.',
        Language: 'English, Cantonese, Spanish, Russian',
        Country: 'United States',
        Awards: '7 wins & 37 nominations',
        Poster: 'https://m.media-amazon.com/images/M/MV5BODQ0NDhjYWItYTMxZi00NTk2LWIzNDEtOWZiYWYxZjc2MTgxXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg',
        imdbRating: '7.7',
        imdbVotes: '547,189',
        imdbID: 'tt5463162',
        Type: 'movie',
      },
      'tt1375666': {
        Title: 'Inception',
        Year: '2010',
        Rated: 'PG-13',
        Released: '16 Jul 2010',
        Runtime: '148 min',
        Genre: 'Action, Adventure, Sci-Fi',
        Director: 'Christopher Nolan',
        Writer: 'Christopher Nolan',
        Actors: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page',
        Plot: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O., but his tragic past may doom the project and his team to disaster.',
        Language: 'English, Japanese, French',
        Country: 'United States, United Kingdom',
        Awards: 'Won 4 Oscars. 157 wins & 220 nominations total',
        Poster: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg',
        imdbRating: '8.8',
        imdbVotes: '2,262,090',
        imdbID: 'tt1375666',
        Type: 'movie',
      }
    };
    
    // Default to Shawshank Redemption if ID not found
    const mockMovieDetails = mockMovieDetailsCollection[imdbId] || mockMovieDetailsCollection['tt0111161'];
    
    // Simulate network delay
    return of({
      success: true,
      movie: mockMovieDetails,
    }).pipe(delay(500)); // Add a small delay to simulate network request
  }
}
