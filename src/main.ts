import { enableProdMode, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';

import { MatButtonModule } from '@angular/material/button';
import {
  AUTH,
  FIRESTORE,
  getAuthInstance,
  getFirestoreInstance,
} from './app/services/firebase.service';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
} from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import {
  provideNgxWebstorage,
  withLocalStorage,
  withNgxWebstorageConfig,
  withSessionStorage,
} from 'ngx-webstorage';
import { routes } from './app/app-routing';
import { AppComponent } from './app/app.component';
import { PageTitleStrategy } from './app/strategies/title-strategy';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideZoneChangeDetection(),importProvidersFrom(
      BrowserModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
      }),
      MatButtonModule,
      MatIconModule,
      MatListModule,
      MatSidenavModule,
      MatToolbarModule,
    ),
    provideNgxWebstorage(
      withNgxWebstorageConfig({
        prefix: 'fukagawa-coffee',
        separator: '.',
        caseSensitive: true,
      }),
      withLocalStorage(),
      withSessionStorage(),
    ),
    { provide: FIRESTORE, useFactory: getFirestoreInstance },
    { provide: AUTH, useFactory: getAuthInstance },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'fill',
      },
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
      },
    },
    {
      provide: TitleStrategy,
      useClass: PageTitleStrategy,
    },
    provideAnimations(),
    provideRouter(routes, withComponentInputBinding()),
  ],
}).catch((err) => console.error(err));
