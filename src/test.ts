// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';
import { initializeTestFirebase, signInForTest } from './app/firebase-testing.module';

// Configure the testing environment to provide Firebase services globally
// This ensures Angular Fire functions have proper injection context during tests
getTestBed().initTestEnvironment(
  BrowserTestingModule,
  platformBrowserTesting(),
  {
    teardown: { destroyAfterEach: false },
  },
);

// Increase timeout for tests that involve Firebase
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

// Global Firebase setup: initialize emulators and sign in for Firestore rules
beforeAll(async () => {
  await initializeTestFirebase();
});

// Ensure auth is active before each test (some tests sign out)
beforeEach(async () => {
  await signInForTest();
});

// Ensure proper cleanup after each test
afterEach((done) => {
  // Allow Firebase operations to complete before cleanup
  setTimeout(() => {
    TestBed.resetTestingModule();
    done();
  }, 100);
});
