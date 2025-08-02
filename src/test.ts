// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Increase timeout for tests that involve Firebase
jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;

// Ensure proper cleanup after each test
afterEach((done) => {
  // Allow Firebase operations to complete before cleanup
  setTimeout(() => {
    TestBed.resetTestingModule();
    done();
  }, 100);
});
