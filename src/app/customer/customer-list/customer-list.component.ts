import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListItem, MatNavList } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer, CustomerDialogData } from 'src/models/customer.model';
import { AddCustomerComponent } from '../add-customer/add-customer.component';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
    imports: [
    MatNavList,
    MatListItem,
    RouterLink,
    MatIcon,
    MatFabButton,
    MatTooltip,
    AsyncPipe
]
})
export class CustomerListComponent {
  customers: Observable<Customer[]>;

  constructor(
    private readonly cs: CustomerService,
    private readonly dialog: MatDialog,
  ) {
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
        },
      )
      .afterClosed()
      .subscribe((customer) => {
        if (customer) {
          this.cs.store(customer);
        }
      });
  }
}
