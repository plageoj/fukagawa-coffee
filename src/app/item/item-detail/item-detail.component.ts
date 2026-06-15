import {
  Component,
  OnDestroy,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
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

import {
  MatAnchor,
  MatButton,
  MatMiniFabButton,
} from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatMiniFabButton,
    MatIcon,
    MatCardSubtitle,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatAnchor,
    RouterLink,
  ],
})
export class ItemDetailComponent implements OnDestroy {
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(UntypedFormBuilder);
  private readonly is = inject(ItemService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sb = inject(MatSnackBar);
  private readonly ss = inject(StorageService);
  private readonly title = inject(TitleService);

  item = signal<ItemWithoutTimestamp>({
    id: '',
    name: '読み込み中',
    total: 0,
    storedCount: {},
    notifyCount: 0,
    notes: '',
    createdAt: Timestamp.fromDate(new Date()),
  });

  storedCount = new UntypedFormGroup({});
  storages = signal<Storage[]>([]);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id') ?? '_';
    this.is
      .load(id)
      .pipe(take(1))
      .subscribe((item) => {
        if (!item) return;
        this.item.set(item);
        this.title.setTitle(item.name, '品目');

        this.ss
          .list()
          .pipe(take(1))
          .subscribe((storages) => {
            if (!storages) return;
            this.storages.set(storages);
            this.storedCount = this.fb.group(
              Object.fromEntries(
                storages.map((s) => [s.id, [item.storedCount[s.id] || 0]]),
              ),
            );
          });
      });
  }

  storageName(id: Storage['id']) {
    return this.storages().find((s) => s.id === id)?.name ?? '';
  }

  ngOnDestroy(): void {
    const item = this.item();
    if (!item.id) return;
    this.countTotal();
    this.is.store(this.item());
  }

  manipulate(id: Storage['id'], diff: number) {
    const control = this.storedCount.controls[id];
    if (control.value + diff < 0) return;
    this.item().total += diff;
    control.setValue(control.value + diff);
  }

  countTotal() {
    const item = this.item();
    item.storedCount = this.storedCount.value;
    item.total = Object.values(item.storedCount).reduce(
      (acc, cur) => acc + cur,
      0,
    );
  }

  editItem() {
    this.dialog
      .open<AddItemComponent, ItemDialogData, Item>(AddItemComponent, {
        data: {
          type: '編集',
          item: this.item(),
        },
      })
      .afterClosed()
      .subscribe((item) => {
        if (item) {
          this.item.set(item);
        }
      });
  }

  deleteItem() {
    this.sb
      .open('削除しました', '取り消し')
      .afterDismissed()
      .subscribe(({ dismissedByAction }) => {
        if (!dismissedByAction) {
          this.is.delete(this.item().id);
        }
      });
    this.router.navigateByUrl('/');
  }
}
