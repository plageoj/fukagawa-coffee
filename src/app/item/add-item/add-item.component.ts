import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { ItemService } from 'src/app/services/item.service';
import { ItemDialogData } from 'src/models/item.model';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent {
  item;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ItemDialogData,
    private is: ItemService,
    private fb: UntypedFormBuilder
  ) {
    this.item = this.fb.group({
      id: [this.is.id],
      name: [''],
      total: [0],
      storedCount: [{}],
      notifyCount: [0],
      notes: [''],
    });

    if (typeof data.item.id !== 'undefined') {
      this.item.patchValue(data.item);
    }
  }
}
