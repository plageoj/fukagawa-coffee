import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Storage } from 'src/models/storage.model';

@Component({
  selector: 'app-add-storage',
  templateUrl: './add-storage.component.html',
  styleUrls: ['./add-storage.component.scss'],
})
export class AddStorageComponent {
  storage;

  constructor(
    private fb: FormBuilder,
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
