import { Component, OnDestroy } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { ItemService } from 'src/app/services/item.service';
import { StorageService } from 'src/app/services/storage.service';
import { TitleService } from 'src/app/services/title.service';
import {
  Item,
  ItemDialogData,
  ItemWithoutTimestamp,
} from 'src/models/item.model';
import { Storage } from 'src/models/storage.model';
import { AddItemComponent } from '../add-item/add-item.component';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnDestroy {
  item: ItemWithoutTimestamp = {
    id: '',
    name: '読み込み中',
    total: 0,
    storedCount: {},
    notifyCount: 0,
    notes: '',
    createdAt: Timestamp.fromDate(new Date()),
  };

  storedCount = new UntypedFormGroup({});
  storages: Storage[] = [];

  constructor(
    private dialog: MatDialog,
    private fb: UntypedFormBuilder,
    private is: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private sb: MatSnackBar,
    private ss: StorageService,
    private title: TitleService
  ) {
    const id = this.route.snapshot.paramMap.get('id') ?? '_';
    this.is
      .load(id)
      .pipe(take(1))
      .subscribe((item) => {
        if (!item) return;
        this.item = item;
        this.title.setTitle(this.item.name, '品目');

        this.ss
          .list()
          .pipe(take(1))
          .subscribe((storages) => {
            if (!storages) return;
            this.storages = storages;
            this.storedCount = this.fb.group(
              Object.fromEntries(
                storages.map((s) => [s.id, [item.storedCount[s.id] || 0]])
              )
            );
          });
      });
  }

  storageName(id: Storage['id']) {
    return this.storages.find((s) => s.id === id)?.name ?? '';
  }

  ngOnDestroy(): void {
    this.countTotal();
    this.is.store(this.item);
  }

  manipulate(id: Storage['id'], diff: number) {
    const control = this.storedCount.controls[id];
    if (control.value < 0) return;
    this.item.total += diff;
    control.setValue(control.value + diff);
  }

  countTotal() {
    this.item.storedCount = this.storedCount.value;
    this.item.total = Object.values(this.item.storedCount).reduce(
      (acc, cur) => acc + cur,
      0
    );
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
          this.item = item;
        }
      });
  }

  deleteItem() {
    this.sb
      .open('削除しました', '取り消し')
      .afterDismissed()
      .subscribe(({ dismissedByAction }) => {
        if (!dismissedByAction) {
          this.is.delete(this.item.id);
        }
      });
    this.router.navigateByUrl('/');
  }
}
