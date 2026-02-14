import { Inject, Injectable } from '@angular/core';
import { Auth } from 'firebase/auth';
import {
  addDoc,
  collection,
  CollectionReference,
  DocumentData,
  Firestore,
  serverTimestamp,
  WithFieldValue,
} from 'firebase/firestore';
import { Item, ItemWithoutTimestamp } from 'src/models/item.model';
import { History } from '../../models/history.model';
import { AUTH, FIRESTORE } from './firebase.service';
import { FirestoreBase } from './firestoreBase';

@Injectable({
  providedIn: 'root',
})
export class ItemService extends FirestoreBase<Item> {
  constructor(
    @Inject(FIRESTORE) db: Firestore,
    @Inject(AUTH) private readonly auth: Auth,
  ) {
    super(db, 'items');
  }

  async store(item: WithFieldValue<ItemWithoutTimestamp> & { id: Item['id'] }) {
    const history = collection(
      this.db,
      'histories',
    ) as CollectionReference<History>;
    await addDoc<History, DocumentData>(history, {
      uid: this.auth.currentUser?.uid ?? '',
      date: serverTimestamp(),
      itemId: item.id,
      item: { ...item, updatedAt: serverTimestamp() },
    });

    return super.store({ ...item, updatedAt: serverTimestamp() });
  }
}
