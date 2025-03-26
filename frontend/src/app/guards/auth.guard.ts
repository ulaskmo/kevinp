import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isLoggedIn$.pipe(
      take(1),
      map(isLoggedIn => {
        // If the user is logged in, allow access
        if (isLoggedIn) {
          // Check if the route requires admin role
          const requiresAdmin = route.data['requiresAdmin'];
          
          if (requiresAdmin) {
            // If admin role is required, check if the user is an admin
            return this.authService.isAdmin() || this.router.createUrlTree(['/unauthorized']);
          }
          
          return true;
        }
        
        // If not logged in, redirect to login page with the return url
        return this.router.createUrlTree(['/login'], { 
          queryParams: { returnUrl: state.url }
        });
      })
    );
  }
}
