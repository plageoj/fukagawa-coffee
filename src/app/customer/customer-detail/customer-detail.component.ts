import { Component, OnDestroy } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { ItemService } from 'src/app/services/item.service';
import { TitleService } from 'src/app/services/title.service';
import { Customer, CustomerDialogData } from 'src/models/customer.model';
import { Item } from 'src/models/item.model';
import { AddCustomerComponent } from '../add-customer/add-customer.component';
import { AssociateItemComponent } from '../associate-item/associate-item.component';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.scss'],
})
export class CustomerDetailComponent implements OnDestroy {
  customer: Customer | undefined;
  items: Item[] = [];
  private isUpdated = false;

  constructor(
    private cs: CustomerService,
    private dialog: MatDialog,
    private is: ItemService,
    private route: ActivatedRoute,
    private router: Router,
    private snack: MatSnackBar,
    private title: TitleService
  ) {
    this.cs
      .load(this.route.snapshot.paramMap.get('id') || '_')
      .pipe(take(1))
      .subscribe((customer) => {
        this.customer = customer;
        this.title.setTitle(customer.name, '取引先');

        const items = Object.keys(customer?.items || {});
        if (customer && items.length) {
          this.is.list(where('id', 'in', items)).subscribe((items) => {
            this.items = items;
          });
        }
      });
  }

  ngOnDestroy(): void {
    if (!this.customer || !this.isUpdated) return;
    this.cs.overwrite(this.customer);
  }

  associateItem() {
    this.dialog
      .open<AssociateItemComponent, never, Item>(AssociateItemComponent, {
        width: '98%',
      })
      .afterClosed()
      .subscribe((item) => {
        if (item && !this.customer?.items[item?.id || '']) {
          if (this.customer) this.customer.items[item.id] = true;
          this.items.unshift(item);
          this.isUpdated = true;
        }
      });
  }

  editCustomer() {
    if (!this.customer) return;
    this.dialog
      .open<AddCustomerComponent, CustomerDialogData, Customer>(
        AddCustomerComponent,
        {
          data: {
            type: '編集',
            customer: this.customer,
          },
        }
      )
      .afterClosed()
      .subscribe((customer) => {
        if (customer) this.isUpdated = true;
      });
  }

  deleteCustomer() {
    if (!this.customer) return;
    this.isUpdated = false;
    this.snack
      .open(`${this.customer.name}を削除しました`, '取り消し')
      .afterDismissed()
      .subscribe(({ dismissedByAction }) => {
        if (!dismissedByAction && this.customer) {
          this.cs.delete(this.customer.id);
        }
      });
    this.router.navigateByUrl('/customer');
  }

  deleteItem(id: Item['id']) {
    if (this.customer) delete this.customer.items[id];
    this.items = this.items.filter((item) => item.id !== id);
    this.isUpdated = true;
  }
}
