import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Storage } from 'src/models/storage.model';
import { FirestoreBase } from './firestoreBase';

@Injectable({
  providedIn: 'root',
})
export class StorageService extends FirestoreBase<Storage> {
  constructor(protected db: Firestore) {
    super(db, 'storages');
  }
}
