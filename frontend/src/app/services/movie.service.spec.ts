import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MovieService } from './movie.service';

describe('MovieService', () => {
  let service: MovieService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MovieService]
    });
    service = TestBed.inject(MovieService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get movies', () => {
    const mockMovies = [
      { _id: '1', title: 'Movie 1', director: 'Director 1', genre: 'Action', year: 2020, rentalPrice: 4.99, availableCopies: 5 },
      { _id: '2', title: 'Movie 2', director: 'Director 2', genre: 'Comedy', year: 2021, rentalPrice: 3.99, availableCopies: 3 }
    ];

    service.getMovies().subscribe(movies => {
      expect(movies.length).toBe(2);
      expect(movies).toEqual(mockMovies);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/movies');
    expect(req.request.method).toBe('GET');
    req.flush(mockMovies);
  });

  it('should get movie by id', () => {
    const mockMovie = { _id: '1', title: 'Movie 1', director: 'Director 1', genre: 'Action', year: 2020, rentalPrice: 4.99, availableCopies: 5 };
    const movieId = '1';

    service.getMovieById(movieId).subscribe(movie => {
      expect(movie).toEqual(mockMovie);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/movies/${movieId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);
  });

  it('should add a movie', () => {
    const mockMovie = { title: 'New Movie', director: 'New Director', genre: 'Drama', year: 2022, rentalPrice: 5.99, availableCopies: 10 };
    const mockResponse = { _id: '3', ...mockMovie };

    service.addMovie(mockMovie).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/api/movies');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockMovie);
    req.flush(mockResponse);
  });

  it('should update a movie', () => {
    const movieId = '1';
    const mockMovie = { title: 'Updated Movie', director: 'Updated Director' };
    const mockResponse = { _id: movieId, ...mockMovie };

    service.updateMovie(movieId, mockMovie).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/movies/${movieId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockMovie);
    req.flush(mockResponse);
  });

  it('should delete a movie', () => {
    const movieId = '1';
    const mockResponse = { acknowledged: true, deletedCount: 1 };

    service.deleteMovie(movieId).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`http://localhost:3000/api/movies/${movieId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
