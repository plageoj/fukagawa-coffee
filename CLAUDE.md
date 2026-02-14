# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stock and order manager for Fukagawa Coffee Co.,Ltd. - an Angular 20 application with Firebase backend (Firestore database and Firebase Authentication). Uses Angular Material for UI components and SCSS for styling.

## Development Commands

### Development Server

- `npm start` - Start dev server with Firebase local emulator suite (localhost:4200)
- `npm run serve:prod` - Connect to production environment
- Firebase emulators: Auth (9099), Firestore (8080), Hosting (5000)

### Building

- `npm run build` - Development build
- `npm run build:prod` - Production build with optimizations and environment replacement

### Testing

- `npm test` or `ng test` - Run unit tests via Karma (ChromeHeadless)
- Tests include code coverage enabled by default
- `ng test --include='**/path/to/test.spec.ts'` - Run specific test file (glob pattern required)
- Test utilities in src/app/: `firebase-testing.module.ts` (Firebase/Firestore mocks) and `ngx-webstorage-testing.module.ts` (storage mocks)

### Linting

- `npm run lint` or `ng lint` - Lint TypeScript and HTML files
- Uses ESLint with Angular-specific rules and Prettier integration
- Component selector prefix: `app`, style: kebab-case
- Directive selector prefix: `app`, style: camelCase

### Deployment

- Automatic deployment to Firebase Hosting on merge to `master` branch
- Manual deployment via `npm run deploy` (requires firebase-tools)

### Code Generation

- `ng generate component component-name` - Generate new component
- Also available: directive, pipe, service, class, guard, interface, enum, module

## Architecture

### Service Layer Pattern

All Firestore data access services extend `FirestoreBase<T>` (src/app/services/firestoreBase.ts) which provides:

- `list(where?)` - Query collection with optional constraints
- `load(id)` - Get single document as Observable
- `store(data)` - Merge document data
- `overwrite(data)` - Replace document completely
- `delete(id)` - Delete document
- `id` - Generate new document ID

Data services: ItemService, CustomerService, OrderService, StorageService, StickerService
Other services: TitleService (browser tab title management)

### Module Organization

- `src/app/item/` - Item management (list, detail, add)
- `src/app/customer/` - Customer management (list, detail, add, associate items, order sheets)
- `src/app/order/` - Order management (list, detail, new order)
- `src/app/storage/` - Storage/inventory management
- `src/app/member/` - Member management
- `src/app/login/` - Authentication (email and phone login)
- `src/app/components/` - Shared components (e.g., item-selector)
- `src/app/services/` - Business logic and data access
- `src/app/strategies/` - Angular strategy implementations (e.g., TitleStrategy)
- `src/models/` - TypeScript interfaces/models

### Firebase Integration

- Uses @angular/fire v20
- Environment-based configuration (src/environments/)
- Production build replaces environment.ts with environment.prod.ts
- Authentication via Firebase Auth with signOut and onAuthStateChanged
- AppComponent handles auth state and navigation

### Routing

- Lazy-loaded feature modules (see src/app/app-routing.ts)
- Auth guard: Most routes require authentication; `/order` route is publicly accessible (for customer order submission)
- Login route redirects authenticated users to home
- Custom TitleStrategy for page titles (src/app/strategies/)

## Commit Conventions

Optional but recommended prefixes:

- `add:` - New features, components, modules
- `del:` - Delete something
- `fix:` - Bug fixes and issue resolution
- `doc:` - Documentation updates
- `dep:` - Dependency updates
- `chore:` - Other non-source changes

## Requirements

- Node.js ^20.11.1
- npm >= 9.0.0
- Optional: @angular/cli ^20, firebase-tools (for deployment)
- VSCode users: Install angular.ng-template extension for template type-hinting

## SonarQube Integration

Project is configured with SonarCloud:

- Project key: plageoj_fukagawa-coffee
- Quality gates and coverage tracking enabled
- Configuration in sonar-project.properties
