import {
  HttpRequest,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Get the auth token from the service
  const token = authService.getToken();

  // Skip adding auth headers for external API requests
  const isExternalRequest = request.url.includes('omdbapi.com') || 
                           !request.url.includes(window.location.hostname);
  
  // Clone the request and add the authorization header if token exists and it's not an external request
  if (token && !isExternalRequest) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Handle the request and catch any authentication errors
  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      // Handle 401 Unauthorized or 403 Forbidden errors
      if (error.status === 401 || error.status === 403) {
        // If the request was not for login or register, redirect to login
        if (!request.url.includes('/auth/login') && !request.url.includes('/auth/register')) {
          authService.logout();
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
