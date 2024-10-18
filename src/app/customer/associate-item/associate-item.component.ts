import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { Item } from 'src/models/item.model';
import { ItemSelectorComponent } from '../../components/item-selector/item-selector.component';

@Component({
  selector: 'app-associate-item',
  templateUrl: './associate-item.component.html',
  styleUrls: ['./associate-item.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    CdkScrollable,
    MatDialogContent,
    ItemSelectorComponent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatIcon,
  ],
})
export class AssociateItemComponent {
  constructor(private readonly ref: MatDialogRef<AssociateItemComponent>) {}

  associateItem(item: Item) {
    this.ref.close(item);
  }
}
