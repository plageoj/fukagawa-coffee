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

@NgModule({
  providers: [
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
          environment.firebaseEmulator.firestorePort,
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
  ],
  imports: [CommonModule],
})
export class FirebaseTestingModule {}
