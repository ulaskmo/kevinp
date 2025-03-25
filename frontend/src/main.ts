import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAuth0({
      domain: 'dev-o7l5mm56crwbkx6d.us.auth0.com', // Auth0 domain
      clientId: 'No6VfOWvK3GpLqGDVsZq8tCH8sQlNRGV', // Auth0 client ID
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    }),
  ],
}).catch((err) => console.error(err));
