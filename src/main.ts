import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { App } from './app/app';
import { routes } from './app/app.routes';
import { tokenInterceptor } from './app/services/token-interceptor';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(withInterceptors([tokenInterceptor])), 
    provideRouter(routes),
  ]
}).catch(err => console.error(err));