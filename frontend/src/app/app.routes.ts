import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' }, // Redirect to /movies as default
  
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'unauthorized', component: UnauthorizedComponent },
  
  // Public movie routes
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/details/:id', component: MovieDetailsComponent },
  
  // Protected routes - require authentication
  { path: 'movies/search', component: MovieSearchComponent, canActivate: [AuthGuard] },
  
  // Admin-only routes
  { 
    path: 'movies/add', 
    component: MovieFormComponent, 
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  { 
    path: 'movies/edit/:id', 
    component: MovieFormComponent, 
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  { 
    path: 'analytics', 
    component: AnalyticsDashboardComponent, 
    canActivate: [AuthGuard],
    data: { requiresAdmin: true }
  },
  
  // Wildcard route for 404
  { path: '**', redirectTo: 'movies' }
];
