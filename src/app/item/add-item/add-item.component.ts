import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, inject } from '@angular/core';
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
  ],
})
export class AddItemComponent {
  data = inject<ItemDialogData>(MAT_DIALOG_DATA);
  private readonly is = inject(ItemService);
  private readonly fb = inject(UntypedFormBuilder);

  item;

  constructor() {
    const data = this.data;

    this.item = this.fb.group({
      id: [this.is.id],
      name: [''],
      total: [0],
      storedCount: [{}],
      notifyCount: [0],
      notes: [''],
    });

    if (data.item.id !== undefined) {
      this.item.patchValue(data.item);
    }
  }
}
