import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer, CustomerDialogData } from 'src/models/customer.model';
import { AddCustomerComponent } from '../add-customer/add-customer.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
})
export class CustomerListComponent {
  customers: Observable<Customer[]>;

  constructor(private cs: CustomerService, private dialog: MatDialog) {
    this.customers = this.cs.list();
  }

  addCustomer() {
    this.dialog
      .open<AddCustomerComponent, CustomerDialogData, Customer>(
        AddCustomerComponent,
        {
          data: {
            type: '追加',
            customer: {},
          },
        }
      )
      .afterClosed()
      .subscribe((customer) => {
        if (customer) {
          this.cs.store(customer);
        }
      });
  }
}
