import { Component } from '@angular/core';
import { MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Item } from 'src/models/item.model';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ItemSelectorComponent } from '../../components/item-selector/item-selector.component';
import { CdkScrollable } from '@angular/cdk/scrolling';

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
  constructor(private ref: MatDialogRef<AssociateItemComponent>) {}

  associateItem(item: Item) {
    this.ref.close(item);
  }
}
