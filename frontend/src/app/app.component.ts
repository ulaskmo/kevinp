import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule], // Auth0 is configured in main.ts
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
