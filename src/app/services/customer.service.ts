import { Inject, Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { Customer } from 'src/models/customer.model';
import { FIRESTORE } from './firebase.service';
import { FirestoreBase } from './firestoreBase';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends FirestoreBase<Customer> {
  constructor(@Inject(FIRESTORE) db: Firestore) {
    super(db, 'customers');
  }
}
