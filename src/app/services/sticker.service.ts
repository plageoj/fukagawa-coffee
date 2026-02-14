import { Inject, Injectable } from '@angular/core';
import { Firestore } from 'firebase/firestore';
import { Sticker } from 'src/models/sticker.model';
import { FIRESTORE } from './firebase.service';
import { FirestoreBase } from './firestoreBase';

@Injectable({
  providedIn: 'root',
})
export class StickerService extends FirestoreBase<Sticker> {
  constructor(@Inject(FIRESTORE) db: Firestore) {
    super(db, 'stickers');
  }
}
