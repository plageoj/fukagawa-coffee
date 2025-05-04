import { Component, OnDestroy } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';
import { UntypedFormBuilder, UntypedFormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { NgFor } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatAnchor } from '@angular/material/button';
import { MatCard, MatCardTitle, MatCardContent, MatCardActions, MatCardSubtitle } from '@angular/material/card';

@Component({
    selector: 'app-item-detail',
    templateUrl: './item-detail.component.html',
    styleUrls: ['./item-detail.component.scss'],
    imports: [
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatCardActions,
        MatButton,
        MatIcon,
        MatCardSubtitle,
        ReactiveFormsModule,
        NgFor,
        MatFormField,
        MatLabel,
        MatInput,
        MatAnchor,
        RouterLink,
    ]
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
    private readonly dialog: MatDialog,
    private readonly fb: UntypedFormBuilder,
    private readonly is: ItemService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly sb: MatSnackBar,
    private readonly ss: StorageService,
    private readonly title: TitleService,
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
                storages.map((s) => [s.id, [item.storedCount[s.id] || 0]]),
              ),
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
      0,
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
