import { Injectable, inject } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { Customer } from 'src/models/customer.model';
import { FIRESTORE } from './firebase.service';
import { FirestoreBase } from './firestoreBase';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends FirestoreBase<Customer> {
  constructor() {
    const db = inject<Firestore>(FIRESTORE);

    super(db, 'customers');
  }
}
