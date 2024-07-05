// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyASUOA5ZDELlnmWzkhZWwWrT0t6nZ35T4c',
    authDomain: 'fukagawa-coffee.firebaseapp.com',
    projectId: 'fukagawa-coffee',
    storageBucket: 'fukagawa-coffee.appspot.com',
    messagingSenderId: '181401267491',
    appId: '1:181401267491:web:056876b247f14bd7d47096',
    measurementId: 'G-STXP3NJ5QY',
  },
  firebaseEmulator: {
    authUrl: 'http://localhost:9099',
    firestorePort: 8080,
  },
  siteName: '深川珈琲 在庫管理',
};
