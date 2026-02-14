import { Observable } from 'rxjs';
import {
  DocumentReference,
  CollectionReference,
  Query,
  onSnapshot,
  DocumentData,
} from 'firebase/firestore';

/**
 * Converts a Firestore document reference to an Observable
 * Replaces @angular/fire's docData
 */
export function docData<T>(
  ref: DocumentReference<T>,
): Observable<T | undefined> {
  return new Observable<T | undefined>((subscriber) => {
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        subscriber.next(snapshot.exists() ? snapshot.data() : undefined);
      },
      (error) => subscriber.error(error),
    );
    return () => unsubscribe();
  });
}

/**
 * Converts a Firestore collection/query reference to an Observable
 * Replaces @angular/fire's collectionData
 */
export function collectionData<T>(
  ref: CollectionReference<T> | Query<T, DocumentData>,
): Observable<T[]> {
  return new Observable<T[]>((subscriber) => {
    const unsubscribe = onSnapshot(
      ref,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        subscriber.next(data);
      },
      (error) => subscriber.error(error),
    );
    return () => unsubscribe();
  });
}
