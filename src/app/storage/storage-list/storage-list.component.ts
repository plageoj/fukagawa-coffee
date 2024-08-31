import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';
import { Storage } from 'src/models/storage.model';
import { AddStorageComponent } from '../add-storage/add-storage.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatIconButton, MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';

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
    private ss: StorageService,
    private dialog: MatDialog,
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
