
import { Component } from '@angular/core';
import { serverTimestamp, where, WithFieldValue } from 'firebase/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatList, MatListItem } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from 'src/app/services/customer.service';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { Customer } from 'src/models/customer.model';
import { Item } from 'src/models/item.model';
import { Order } from 'src/models/order.model';

@Component({
    selector: 'app-new-order',
    templateUrl: './new-order.component.html',
    styleUrls: ['./new-order.component.scss'],
    imports: [
    MatCard,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatList,
    MatListItem,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
    MatTooltip,
    MatDivider,
    MatButton,
    MatIcon,
    MatCardActions
]
})
export class NewOrderComponent {
  customer: Customer | undefined;
  items: Partial<Item & { orderedCount: number }>[] = [];
  order: WithFieldValue<Omit<Order, 'id'>> = {
    orderedAt: serverTimestamp(),
    customerId: '',
    customerName: '',
    items: [],
    notes: '',
    isDone: false,
  };
  sending = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cs: CustomerService,
    private readonly is: ItemService,
    private readonly os: OrderService,
    private readonly sb: MatSnackBar,
  ) {
    this.cs
      .load(this.route.snapshot.paramMap.get('id') ?? '_')
      .subscribe((customer) => {
        this.customer = customer;

        if (!customer) return;
        this.order.customerId = customer.id;
        this.order.customerName = customer.name;
        const items = Object.keys(customer.items || {});
        if (items.length) {
          this.is.list(where('id', 'in', items)).subscribe((items) => {
            this.items = items;
          });
        }
      });
  }

  addItem() {
    this.items.push({
      orderedCount: 1,
      name: '',
    });
  }

  sendOrder() {
    this.sending = true;
    this.order.orderedAt = serverTimestamp();
    this.order.items = this.items
      .map((item) => ({
        id: item.id ?? '',
        name: item.name ?? '',
        orderedCount: item.orderedCount ?? 0,
      }))
      .filter((item) => item.orderedCount);
    this.os.store({ id: this.os.id, ...this.order }).then(
      () => {
        this.sb.open('注文を送信しました');
      },
      () => {
        this.sending = false;
      },
    );
  }
}
