import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptor } from './app/services/jwt-interceptor'; // ajuste o caminho

// adiciona o interceptor dentro do appConfig.providers
const configWithInterceptor = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []), // mantém o que já tinha
    provideHttpClient(withInterceptorsFromDi()), // habilita interceptors
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true } // registra JWT
  ]
};

bootstrapApplication(App, configWithInterceptor)
  .catch((err) => console.error(err));
