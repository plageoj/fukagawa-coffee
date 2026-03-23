import { inject } from "@angular/core";
import { CanActivateFn, Router, UrlTree } from "@angular/router";
import { onAuthStateChanged, User } from "firebase/auth";
import { Observable } from "rxjs";
import { AUTH } from "../services/firebase.service";

export type AuthPipeFn = (
  router: Router,
) => (user: User | null) => UrlTree | boolean;

/**
 * Custom auth guard replacing @angular/fire's AuthGuard
 */
export const authGuard: CanActivateFn = (route) => {
  const auth = inject(AUTH);
  const router = inject(Router);

  const authGuardPipe = route.data["authGuardPipe"] as AuthPipeFn | undefined;
  const pipeFn = authGuardPipe?.(router);

  return new Observable<boolean | UrlTree>((subscriber) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // Ensure the ID token is ready for Firestore before allowing navigation
      if (user) {
        await user.getIdToken();
      }
      if (pipeFn) {
        subscriber.next(pipeFn(user));
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
export function redirectUnauthorizedTo(redirectPath: string): AuthPipeFn {
  return (router) => (user) => {
    if (user) return true;
    return router.createUrlTree([redirectPath]);
  };
}

/**
 * Helper to redirect logged-in users
 * Replaces @angular/fire's redirectLoggedInTo
 */
export function redirectLoggedInTo(redirectPath: string): AuthPipeFn {
  return (router) => (user) => {
    if (!user) return true;
    return router.createUrlTree([redirectPath]);
  };
}
