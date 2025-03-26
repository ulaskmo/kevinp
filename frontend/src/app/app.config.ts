import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimationsAsync(),
    provideAuth0({
      domain: 'dev-o7l5mm56crwbkx6d.us.auth0.com',
      clientId: 'No6VfOWvK3GpLqGDVsZq8tCH8sQlNRGV',
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    })
  ]
};
