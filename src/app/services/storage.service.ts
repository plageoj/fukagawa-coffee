import { Inject, Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { Storage } from 'src/models/storage.model';
import { FIRESTORE } from './firebase.service';
import { FirestoreBase } from './firestoreBase';

@Injectable({
  providedIn: 'root',
})
export class StorageService extends FirestoreBase<Storage> {
  constructor(@Inject(FIRESTORE) protected db: Firestore) {
    super(db, 'storages');
  }
}
