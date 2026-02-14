import { InjectionToken } from '@angular/core';
import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from 'firebase/firestore';
import { getAuth, Auth, connectAuthEmulator } from 'firebase/auth';
import { environment } from '../../environments/environment';

let firebaseApp: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let emulatorsConnected = false;

function initializeFirebase(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = initializeApp(environment.firebase);
  }
  return firebaseApp;
}

function connectEmulators(): void {
  if (emulatorsConnected || environment.production) return;

  if (environment.firebaseEmulator.firestorePort && firestoreInstance) {
    connectFirestoreEmulator(
      firestoreInstance,
      'localhost',
      environment.firebaseEmulator.firestorePort,
    );
  }
  if (environment.firebaseEmulator.authUrl && authInstance) {
    connectAuthEmulator(authInstance, environment.firebaseEmulator.authUrl);
  }
  emulatorsConnected = true;
}

export function getFirestoreInstance(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(initializeFirebase());
  }
  if (!emulatorsConnected) {
    connectEmulators();
  }
  return firestoreInstance;
}

export function getAuthInstance(): Auth {
  if (!authInstance) {
    authInstance = getAuth(initializeFirebase());
  }
  if (!emulatorsConnected) {
    connectEmulators();
  }
  return authInstance;
}

// Injection tokens for Angular DI
export const FIRESTORE = new InjectionToken<Firestore>('Firestore');
export const AUTH = new InjectionToken<Auth>('Auth');
