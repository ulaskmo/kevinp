import { Routes } from '@angular/router';
import { MovieListComponent } from './components/movie-list/movie-list.component';
import { MovieFormComponent } from './components/movie-form/movie-form.component';
import { MovieDetailsComponent } from './components/movie-details/movie-details.component';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { AnalyticsDashboardComponent } from './components/analytics-dashboard/analytics-dashboard.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' }, // Redirect to /movies as default
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/add', component: MovieFormComponent, canActivate: [AuthGuard] },
  { path: 'movies/edit/:id', component: MovieFormComponent, canActivate: [AuthGuard] },
  { path: 'movies/details/:id', component: MovieDetailsComponent, canActivate: [AuthGuard] },
  { path: 'movies/search', component: MovieSearchComponent, canActivate: [AuthGuard] },
  { path: 'analytics', component: AnalyticsDashboardComponent, canActivate: [AuthGuard] },
];
