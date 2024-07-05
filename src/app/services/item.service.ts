import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  addDoc,
  collection,
  CollectionReference,
  Firestore,
  serverTimestamp,
  WithFieldValue,
} from '@angular/fire/firestore';
import { Item, ItemWithoutTimestamp } from 'src/models/item.model';
import { History } from '../../models/history.model';
import { FirestoreBase } from './firestoreBase';
import { DocumentData } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ItemService extends FirestoreBase<Item> {
  constructor(db: Firestore, private auth: Auth) {
    super(db, 'items');
  }

  async store(item: WithFieldValue<ItemWithoutTimestamp> & { id: Item['id'] }) {
    const history = collection(
      this.db,
      'histories'
    ) as CollectionReference<History>;
    await addDoc<History, DocumentData>(history, {
      uid: this.auth.currentUser?.uid || '',
      date: serverTimestamp(),
      itemId: item.id,
      item: { ...item, updatedAt: serverTimestamp() },
    });

    return super.store({ ...item, updatedAt: serverTimestamp() });
  }
}
