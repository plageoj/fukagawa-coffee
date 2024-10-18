import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { StorageService } from 'src/app/services/storage.service';
import { Storage } from 'src/models/storage.model';
import { AddStorageComponent } from '../add-storage/add-storage.component';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    MatList,
    NgFor,
    MatListItem,
    MatIcon,
    MatIconButton,
    MatTooltip,
    MatFabButton,
    AsyncPipe,
  ],
})
export class StorageListComponent {
  storages;

  constructor(
    private readonly ss: StorageService,
    private readonly dialog: MatDialog,
  ) {
    this.storages = this.ss.list();
  }

  editStorage(data?: Storage) {
    this.dialog
      .open<AddStorageComponent, Storage, Storage>(AddStorageComponent, {
        data,
      })
      .afterClosed()
      .subscribe((data) => {
        if (!data) return;
        if (!data.id) data.id = this.ss.id;
        this.ss.store(data);
      });
  }

  deleteStorage({ id }: Storage) {
    this.ss.delete(id);
  }
}
