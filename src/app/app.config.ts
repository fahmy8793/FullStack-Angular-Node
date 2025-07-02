import { ApplicationConfig, importProvidersFrom  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';


export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(),

    importProvidersFrom(BrowserAnimationsModule),
    provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
    })
      ]
};
