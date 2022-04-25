import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ItemService } from 'src/app/services/item.service';
import { ItemDialogData } from 'src/models/item.model';
import { StorageList } from 'src/models/store.model';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent {
  storeList = StorageList;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ItemDialogData,
    private item: ItemService
  ) {
    if (typeof data.item.id === 'undefined') {
      data.item = {
        id: this.item.id,
        name: '',
        count: 0,
        storage: StorageList[0],
        notifyCount: 0,
        notes: '',
      };
    }
  }
}
