import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      map((isAuthenticated) => {
        if (!isAuthenticated) {
          alert('You need to log in to perform this action!');
          this.router.navigate(['/movies']);
          return false;
        }
        return true;
      })
    );
  }
}
