import { Component } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { StorageService } from 'src/app/services/storage.service';
import { Storage } from 'src/models/storage.model';
import { AddStorageComponent } from '../add-storage/add-storage.component';

@Component({
  selector: 'app-storage-list',
  templateUrl: './storage-list.component.html',
  styleUrls: ['./storage-list.component.scss'],
})
export class StorageListComponent {
  storages;

  constructor(private ss: StorageService, private dialog: MatDialog) {
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
