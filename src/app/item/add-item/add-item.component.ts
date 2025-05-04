import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { ItemService } from 'src/app/services/item.service';
import { ItemDialogData } from 'src/models/item.model';

@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss'],
    imports: [
        MatDialogTitle,
        ReactiveFormsModule,
        CdkScrollable,
        MatDialogContent,
        MatFormField,
        MatLabel,
        MatInput,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatIcon,
    ]
})
export class AddItemComponent {
  item;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ItemDialogData,
    private readonly is: ItemService,
    private readonly fb: UntypedFormBuilder,
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
