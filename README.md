# fukagawa-coffee

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=plageoj_fukagawa-coffee&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=plageoj_fukagawa-coffee)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=plageoj_fukagawa-coffee&metric=coverage)](https://sonarcloud.io/summary/new_code?id=plageoj_fukagawa-coffee)

Stock and order manager for Fukagawa Coffee Co.,Ltd. (and others)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.2 and is currently running Angular 20.

## Requirements

### Required

| package | version |
|---|---|
| node.js | ^20.11.1 |
| npm | >= 9.0.0 |

### Optional npm global packages

| package | version |
|---|---|
| @angular/cli | ^20 |
| firebase-tools | latest |

If you have not installed `@angular/cli` globally, you may use `npx ng` instead of `ng` commands below.

### For VSCode users

Install [angular.ng-template](https://marketplace.visualstudio.com/items?itemName=Angular.ng-template) extension for type-hinting and code completion in HTML templates.

## Installation

```bash
git clone git@github.com:plageoj/fukagawa-coffee.git
cd fukagawa-coffee
npm install
```

## Development server

Run `npm start` for a dev server with Firebase local emulator suite. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

If you need to connect to the production environment, run `npm run serve:prod`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Coding Style

Refer <https://angular.io/guide/styleguide> for coding style. Run `ng lint` or `npm run lint` for linting.

## Commit prefix

Adding commit prefix is optional but recommended as it helps review process. Choose one from below:

- add: Add some features, components, modules, etc.
- del: Delete something.
- fix: Fix bugs and issues.
- doc: Documentation updates.
- dep: Updating dependencies.
- chore: Other changes that don't modify source files.

## Build

Run `ng build` or `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-c production` flag or run `npm run build:prod` for a production build.

## Deploy

This application is hosted on Firebase hosting. Merging any pull requests into `master` branch will trigger an automatic deployment.

Manual deployment is also available for approved firebase project members only, via `ng deploy` or `npm run deploy` (requires global firebase-tools installation) command.

## Running unit tests

Run `ng test` or `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` or `npm run e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
