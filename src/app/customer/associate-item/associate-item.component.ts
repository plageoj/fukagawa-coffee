import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { Item } from 'src/models/item.model';

@Component({
  selector: 'app-associate-item',
  templateUrl: './associate-item.component.html',
  styleUrls: ['./associate-item.component.scss'],
})
export class AssociateItemComponent {
  constructor(private ref: MatDialogRef<AssociateItemComponent>) {}

  associateItem(item: Item) {
    this.ref.close(item);
  }
}
