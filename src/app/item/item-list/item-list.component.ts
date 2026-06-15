import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { Item, ItemDialogData } from 'src/models/item.model';
import { AddItemComponent } from '../add-item/add-item.component';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFabButton } from '@angular/material/button';
import { ItemSelectorComponent } from '../../components/item-selector/item-selector.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [ItemSelectorComponent, MatFabButton, MatTooltip, MatIcon],
})
export class ItemListComponent {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly is = inject(ItemService);

  addItem() {
    this.dialog
      .open<AddItemComponent, ItemDialogData, Item>(AddItemComponent, {
        data: {
          type: '追加',
          item: {},
        },
      })
      .afterClosed()
      .subscribe((item) => {
        if (item) {
          this.is.store(item);
        }
      });
  }

  linkToDetail(item: Item) {
    this.router.navigateByUrl(`/item/${item.id}`);
  }
}
