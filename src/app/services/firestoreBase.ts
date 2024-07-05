import {
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  query,
  setDoc,
} from '@angular/fire/firestore';
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  QueryConstraint,
  WithFieldValue,
} from 'firebase/firestore';
import { Observable } from 'rxjs';

export class FirestoreBase<T> {
  constructor(protected db: Firestore, protected path: string) {}

  private col = collection(this.db, this.path) as CollectionReference<T>;

  list(where?: QueryConstraint): Observable<T[]> {
    return collectionData<T>(
      where ? query<T, DocumentData>(this.col, where) : this.col
    );
  }

  private ref(id: string) {
    return doc(this.db, `${this.path}/${id}`) as DocumentReference<T>;
  }

  get id(): string {
    return doc(this.col).id;
  }

  load(id: string) {
    return docData<T>(this.ref(id));
  }

  overwrite(data: WithFieldValue<T> & { id: string }): Promise<void> {
    return setDoc(this.ref(data.id), data);
  }

  store(data: WithFieldValue<T> & { id: string }): Promise<void> {
    return setDoc(this.ref(data.id), data, { merge: true });
  }

  delete(id: string): Promise<void> {
    return deleteDoc(this.ref(id));
  }
}
