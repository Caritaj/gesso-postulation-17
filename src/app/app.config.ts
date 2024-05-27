import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AlertDialogService } from './core/services/confirmation/alert.service';
import { MatNativeDateModule } from '@angular/material/core';
import { restInterceptor } from './core/interceptors/rest-interceptor.service';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideToastr({ timeOut: 1000, preventDuplicates: true }),
    provideHttpClient(withInterceptors([restInterceptor])),
    importProvidersFrom(MatNativeDateModule),
    provideAnimationsAsync(),
    AlertDialogService,
  ]
};
