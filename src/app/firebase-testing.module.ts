import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, Auth } from 'firebase/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  Firestore,
} from 'firebase/firestore';
import { environment } from 'src/environments/environment';
import { AUTH, FIRESTORE } from './services/firebase.service';

const initialized = { firestore: false, auth: false };
let testApp: FirebaseApp | null = null;
let testFirestore: Firestore | null = null;
let testAuth: Auth | null = null;

function getTestApp(): FirebaseApp {
  if (!testApp) {
    testApp = initializeApp(environment.firebase, 'test-app');
  }
  return testApp;
}

function getTestFirestore(): Firestore {
  if (!testFirestore) {
    testFirestore = getFirestore(getTestApp());
    if (
      !environment.production &&
      environment.firebaseEmulator.firestorePort &&
      !initialized.firestore
    ) {
      connectFirestoreEmulator(
        testFirestore,
        'localhost',
        environment.firebaseEmulator.firestorePort,
      );
      initialized.firestore = true;
    }
  }
  return testFirestore;
}

function getTestAuth(): Auth {
  if (!testAuth) {
    testAuth = getAuth(getTestApp());
    testAuth.useDeviceLanguage();
    if (
      !environment.production &&
      environment.firebaseEmulator.authUrl &&
      !initialized.auth
    ) {
      connectAuthEmulator(testAuth, environment.firebaseEmulator.authUrl, {
        disableWarnings: true,
      });
      initialized.auth = true;
      testAuth.settings.appVerificationDisabledForTesting = true;
    }
  }
  return testAuth;
}

@NgModule({
  providers: [
    { provide: FIRESTORE, useFactory: getTestFirestore },
    { provide: AUTH, useFactory: getTestAuth },
  ],
  imports: [CommonModule],
})
export class FirebaseTestingModule {}
