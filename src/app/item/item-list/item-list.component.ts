import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { Item, ItemDialogData } from 'src/models/item.model';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent {
  constructor(
    private dialog: MatDialog,
    private router: Router,
    private is: ItemService
  ) {}

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
