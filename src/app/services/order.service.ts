import { Injectable, inject } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { Order } from 'src/models/order.model';
import { FIRESTORE } from './firebase.service';
import { FirestoreBase } from './firestoreBase';

@Injectable({
  providedIn: 'root',
})
export class OrderService extends FirestoreBase<Order> {
  constructor() {
    const db = inject<Firestore>(FIRESTORE);

    super(db, 'orders');
  }
}
