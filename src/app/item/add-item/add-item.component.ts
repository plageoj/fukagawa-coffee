import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { ItemService } from 'src/app/services/item.service';
import { ItemDialogData } from 'src/models/item.model';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-add-item',
    templateUrl: './add-item.component.html',
    styleUrls: ['./add-item.component.scss'],
    standalone: true,
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
