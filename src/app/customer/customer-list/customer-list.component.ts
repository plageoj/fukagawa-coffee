import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { Customer, CustomerDialogData } from 'src/models/customer.model';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { MatNavList, MatListItem } from '@angular/material/list';

@Component({
    selector: 'app-customer-list',
    templateUrl: './customer-list.component.html',
    styleUrls: ['./customer-list.component.scss'],
    standalone: true,
    imports: [
        MatNavList,
        NgFor,
        MatListItem,
        RouterLink,
        NgIf,
        MatIcon,
        MatFabButton,
        MatTooltip,
        AsyncPipe,
    ],
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
