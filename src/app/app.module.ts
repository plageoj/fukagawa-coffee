import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TitleStrategy } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageTitleStrategy } from './strategies/title-strategy';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const fire = getFirestore();
      if (
        !environment.production &&
        environment.firebaseEmulator.firestorePort
      ) {
        connectFirestoreEmulator(
          fire,
          'localhost',
          environment.firebaseEmulator.firestorePort
        );
      }
      return fire;
    }),
    provideAuth(() => {
      const auth = getAuth();
      if (!environment.production && environment.firebaseEmulator.authUrl) {
        connectAuthEmulator(auth, environment.firebaseEmulator.authUrl);
      }
      return auth;
    }),
    AppRoutingModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    NgxWebstorageModule.forRoot({
      prefix: 'fukagawa-coffee',
      separator: '.',
      caseSensitive: false,
    }),
  ],
  providers: [
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
