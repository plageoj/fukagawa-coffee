import { InjectionToken } from "@angular/core";
import { initializeApp, FirebaseApp } from "firebase/app";
import {
  getFirestore,
  Firestore,
  connectFirestoreEmulator,
} from "firebase/firestore";
import { getAuth, Auth, connectAuthEmulator } from "firebase/auth";
import { environment } from "../../environments/environment";

let firebaseApp: FirebaseApp | null = null;
let firestoreInstance: Firestore | null = null;
let authInstance: Auth | null = null;
let firestoreEmulatorConnected = false;
let authEmulatorConnected = false;

function initializeFirebase(): FirebaseApp {
  if (!firebaseApp) {
    firebaseApp = initializeApp(environment.firebase);
  }
  return firebaseApp;
}

export function getFirestoreInstance(): Firestore {
  if (!firestoreInstance) {
    firestoreInstance = getFirestore(initializeFirebase());
  }
  if (
    !firestoreEmulatorConnected &&
    !environment.production &&
    environment.firebaseEmulator.firestorePort
  ) {
    connectFirestoreEmulator(
      firestoreInstance,
      "localhost",
      environment.firebaseEmulator.firestorePort,
    );
    firestoreEmulatorConnected = true;
  }
  return firestoreInstance;
}

export function getAuthInstance(): Auth {
  if (!authInstance) {
    authInstance = getAuth(initializeFirebase());
  }
  if (
    !authEmulatorConnected &&
    !environment.production &&
    environment.firebaseEmulator.authUrl
  ) {
    connectAuthEmulator(authInstance, environment.firebaseEmulator.authUrl);
    authEmulatorConnected = true;
  }
  return authInstance;
}

// Injection tokens for Angular DI
export const FIRESTORE = new InjectionToken<Firestore>("Firestore");
export const AUTH = new InjectionToken<Auth>("Auth");
