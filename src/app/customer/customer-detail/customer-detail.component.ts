import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { where } from 'firebase/firestore';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
  MatList,
  MatListItem,
  MatListItemLine,
  MatListItemMeta,
  MatListItemTitle,
} from '@angular/material/list';
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
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardActions,
    MatButton,
    MatIconButton,
    MatIcon,
    MatCardContent,
    MatList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    MatListItemMeta,
    MatIconButton,
    MatAnchor,
    RouterLink,
  ],
})
export class CustomerDetailComponent implements OnDestroy {
  private readonly cs = inject(CustomerService);
  private readonly dialog = inject(MatDialog);
  private readonly is = inject(ItemService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly snack = inject(MatSnackBar);
  private readonly title = inject(TitleService);

  private readonly destroyRef = inject(DestroyRef);
  customer = signal<Customer | undefined>(undefined);
  items = signal<Item[]>([]);
  private isUpdated = false;

  constructor() {
    this.cs
      .load(this.route.snapshot.paramMap.get('id') ?? '_')
      .pipe(take(1))
      .subscribe((customer) => {
        if (!customer) return;
        this.customer.set(customer);
        this.title.setTitle(customer.name, '取引先');

        const items = Object.keys(customer?.items ?? {});
        if (customer && items.length) {
          this.is
            .list(where('id', 'in', items))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((items) => {
              this.items.set(items);
            });
        }
      });
  }

  ngOnDestroy(): void {
    const customer = this.customer();
    if (!customer || !this.isUpdated) return;
    this.cs.overwrite(customer);
  }

  associateItem() {
    this.dialog
      .open<AssociateItemComponent, never, Item>(AssociateItemComponent, {
        width: '98%',
      })
      .afterClosed()
      .subscribe((item) => {
        const customer = this.customer();
        if (item && !customer?.items[item?.id || '']) {
          if (customer) customer.items[item.id] = true;
          this.items.update((items) => [item, ...items]);
          this.isUpdated = true;
        }
      });
  }

  editCustomer() {
    const customer = this.customer();
    if (!customer) return;
    this.dialog
      .open<AddCustomerComponent, CustomerDialogData, Customer>(
        AddCustomerComponent,
        {
          data: {
            type: '編集',
            customer,
          },
        },
      )
      .afterClosed()
      .subscribe((customer) => {
        if (customer) this.isUpdated = true;
      });
  }

  deleteCustomer() {
    const customer = this.customer();
    if (!customer) return;
    this.isUpdated = false;
    this.snack
      .open(`${customer.name}を削除しました`, '取り消し')
      .afterDismissed()
      .subscribe(({ dismissedByAction }) => {
        if (!dismissedByAction) {
          this.cs.delete(customer.id);
        }
      });
    this.router.navigateByUrl('/customer');
  }

  deleteItem(id: Item['id']) {
    const customer = this.customer();
    if (customer) delete customer.items[id];
    this.items.update((items) => items.filter((item) => item.id !== id));
    this.isUpdated = true;
  }
}
