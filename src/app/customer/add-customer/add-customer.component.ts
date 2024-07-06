import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerDialogData } from 'src/models/customer.model';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
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
    private cs: CustomerService,
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
