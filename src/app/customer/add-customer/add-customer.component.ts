import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerDialogData } from 'src/models/customer.model';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { CdkScrollable } from '@angular/cdk/scrolling';

@Component({
    selector: 'app-add-customer',
    templateUrl: './add-customer.component.html',
    styleUrls: ['./add-customer.component.scss'],
    standalone: true,
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatFormField,
        MatLabel,
        MatInput,
        ReactiveFormsModule,
        FormsModule,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        MatIcon,
    ],
})
export class AddCustomerComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CustomerDialogData,
    private cs: CustomerService
  ) {
    if (typeof data.customer.id === 'undefined') {
      data.customer = {
        id: this.cs.id,
        name: '',
        address: '',
        items: {},
      };
    }
  }
}
