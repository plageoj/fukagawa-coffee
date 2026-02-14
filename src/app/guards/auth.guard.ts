import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Observable } from 'rxjs';
import { getAuthInstance } from '../services/firebase.service';

export type AuthPipeGenerator = () => (user: User | null) => UrlTree | boolean;

/**
 * Custom auth guard replacing @angular/fire's AuthGuard
 */
export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  return new Observable<boolean | UrlTree>((subscriber) => {
    const auth = getAuthInstance();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const authGuardPipe = route.data['authGuardPipe'] as
        | AuthPipeGenerator
        | undefined;

      if (authGuardPipe) {
        const result = authGuardPipe()(user);
        subscriber.next(result);
      } else {
        subscriber.next(!!user);
      }
      subscriber.complete();
      unsubscribe();
    });
  });
};

/**
 * Helper to create redirect for unauthorized users
 * Replaces @angular/fire's redirectUnauthorizedTo
 */
export function redirectUnauthorizedTo(
  redirectPath: string,
): AuthPipeGenerator {
  return () => (user) => {
    if (user) return true;
    const router = inject(Router);
    return router.createUrlTree([redirectPath]);
  };
}

/**
 * Helper to redirect logged-in users
 * Replaces @angular/fire's redirectLoggedInTo
 */
export function redirectLoggedInTo(redirectPath: string): AuthPipeGenerator {
  return () => (user) => {
    if (!user) return true;
    const router = inject(Router);
    return router.createUrlTree([redirectPath]);
  };
}
