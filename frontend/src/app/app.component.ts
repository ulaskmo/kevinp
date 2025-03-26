import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'movie-management';

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    // Check if user is already logged in (from localStorage)
    this.authService.getCurrentUser().subscribe();
  }

  logout(): void {
    this.authService.logout();
  }
}
