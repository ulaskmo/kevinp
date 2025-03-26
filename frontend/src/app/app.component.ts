import { Component } from '@angular/core';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterLink, RouterLinkActive, CommonModule], // Auth0 is configured in app.config.ts
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'movie-management';

  constructor(public auth: AuthService) {}

  login(): void {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({
      openUrl: (url: string) => {
        window.location.replace(url); // Handle logout redirect manually
      },
    });
    window.location.reload(); // Optional: Refresh the page after logout
  }
}
