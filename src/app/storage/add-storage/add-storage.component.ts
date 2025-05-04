import { CdkScrollable } from '@angular/cdk/scrolling';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Storage } from 'src/models/storage.model';

@Component({
    selector: 'app-add-storage',
    templateUrl: './add-storage.component.html',
    styleUrls: ['./add-storage.component.scss'],
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
    ]
})
export class AddStorageComponent {
  storage;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly ref: MatDialogRef<AddStorageComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: Storage,
  ) {
    this.storage = this.fb.group({
      id: [data?.id],
      name: [data?.name ?? ''],
      description: [data?.description ?? ''],
    });
  }

  save() {
    this.ref.close(this.storage.value);
  }
}
