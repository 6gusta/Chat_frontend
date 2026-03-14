import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './app/services/auth-interceptor';

const configWithInterceptor = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideHttpClient(withInterceptorsFromDi()), // habilita interceptors
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true } // registra seu interceptor
  ]
};

bootstrapApplication(App, configWithInterceptor)
  .catch(err => console.error(err));