import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { Item, ItemDialogData } from 'src/models/item.model';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnDestroy {
  item: Item = {
    id: '',
    name: '読み込み中',
    count: 0,
    notifyCount: 0,
    storage: '',
    notes: '',
  };

  private isUpdated = false;

  constructor(
    private is: ItemService,
    private sb: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) {
    const id = this.route.snapshot.paramMap.get('id') || '_';
    this.is.load(id).subscribe((item) => {
      this.item = item as Item;
    });
  }

  ngOnDestroy(): void {
    if (this.isUpdated) this.is.store(this.item);
  }

  changeValue(diff: number) {
    if (this.item.count + diff > 0) {
      this.item.count += diff;
      this.isUpdated = true;
    }
  }

  editItem() {
    this.dialog
      .open<AddItemComponent, ItemDialogData, Item>(AddItemComponent, {
        data: {
          type: '編集',
          item: this.item,
        },
      })
      .afterClosed()
      .subscribe((item) => {
        if (item) {
          this.isUpdated = true;
        }
      });
  }

  deleteItem() {
    this.sb
      .open('削除しました', '取り消し', {
        duration: 3000,
      })
      .afterDismissed()
      .subscribe(({ dismissedByAction }) => {
        if (!dismissedByAction) {
          this.is.delete(this.item.id);
        }
      });
    this.router.navigateByUrl('/');
  }
}
