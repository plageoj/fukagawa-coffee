import { Injectable, inject } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { Storage } from 'src/models/storage.model';
import { FIRESTORE } from './firebase.service';
import { FirestoreBase } from './firestoreBase';

@Injectable({
  providedIn: 'root',
})
export class StorageService extends FirestoreBase<Storage> {
  protected db: Firestore;

  constructor() {
    const db = inject<Firestore>(FIRESTORE);

    super(db, 'storages');

    this.db = db;
  }
}
