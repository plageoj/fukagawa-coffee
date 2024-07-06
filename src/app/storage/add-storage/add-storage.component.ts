import { Component, Inject } from '@angular/core';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { Storage } from 'src/models/storage.model';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-add-storage',
    templateUrl: './add-storage.component.html',
    styleUrls: ['./add-storage.component.scss'],
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
        MatIcon,
        MatDialogClose,
    ],
})
export class AddStorageComponent {
  storage;

  constructor(
    private fb: UntypedFormBuilder,
    private ref: MatDialogRef<AddStorageComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Storage
  ) {
    this.storage = this.fb.group({
      id: [data?.id],
      name: [data?.name || ''],
      description: [data?.description || ''],
    });
  }

  save() {
    this.ref.close(this.storage.value);
  }
}
