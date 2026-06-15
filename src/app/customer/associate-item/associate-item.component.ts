import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
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
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private readonly ref =
    inject<MatDialogRef<AssociateItemComponent>>(MatDialogRef);

  associateItem(item: Item) {
    this.ref.close(item);
  }
}
