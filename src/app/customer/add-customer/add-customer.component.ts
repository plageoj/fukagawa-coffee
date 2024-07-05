import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CustomerService } from 'src/app/services/customer.service';
import { CustomerDialogData } from 'src/models/customer.model';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.scss'],
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
