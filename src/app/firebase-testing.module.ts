import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';

const initialized = { firestore: false, auth: false };

@NgModule({
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => {
      const fire = getFirestore();
      if (
        !environment.production &&
        environment.firebaseEmulator.firestorePort &&
        !initialized.firestore
      ) {
        connectFirestoreEmulator(
          fire,
          'localhost',
          environment.firebaseEmulator.firestorePort,
        );
        initialized.firestore = true;
      }
      return fire;
    }),
    provideAuth(() => {
      const auth = getAuth();
      auth.useDeviceLanguage();
      if (
        !environment.production &&
        environment.firebaseEmulator.authUrl &&
        !initialized.auth
      ) {
        connectAuthEmulator(auth, environment.firebaseEmulator.authUrl, {
          disableWarnings: true,
        });
        initialized.auth = true;
        auth.settings.appVerificationDisabledForTesting = true;
      }
      return auth;
    }),
  ],
  imports: [CommonModule],
})
export class FirebaseTestingModule {}
