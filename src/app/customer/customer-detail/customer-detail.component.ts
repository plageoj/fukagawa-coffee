import { NgFor } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
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
    imports: [
        MatCard,
        MatCardTitle,
        MatCardSubtitle,
        MatCardActions,
        MatButton,
        MatIcon,
        MatCardContent,
        MatList,
        NgFor,
        MatListItem,
        MatIconButton,
        MatAnchor,
        RouterLink,
    ]
})
export class CustomerDetailComponent implements OnDestroy {
  customer: Customer | undefined;
  items: Item[] = [];
  private isUpdated = false;

  constructor(
    private readonly cs: CustomerService,
    private readonly dialog: MatDialog,
    private readonly is: ItemService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly snack: MatSnackBar,
    private readonly title: TitleService,
  ) {
    this.cs
      .load(this.route.snapshot.paramMap.get('id') ?? '_')
      .pipe(take(1))
      .subscribe((customer) => {
        if (!customer) return;
        this.customer = customer;
        this.title.setTitle(customer.name, '取引先');

        const items = Object.keys(customer?.items ?? {});
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
        },
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
