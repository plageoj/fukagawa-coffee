import { Component} from '@angular/core';
import {
  serverTimestamp,
  where,
  WithFieldValue,
} from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private route: ActivatedRoute,
    private cs: CustomerService,
    private is: ItemService,
    private os: OrderService,
    private sb: MatSnackBar
  ) {
    this.cs
      .load(this.route.snapshot.paramMap.get('id') || '_')
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
        id: item.id || '',
        name: item.name || '',
        orderedCount: item.orderedCount || 0,
      }))
      .filter((item) => item.orderedCount);
    this.os.store(Object.assign({ id: this.os.id }, this.order)).then(
      () => {
        this.sb.open('注文を送信しました', undefined, {
          duration: 3000,
        });
      },
      () => {
        this.sending = false;
      }
    );
  }
}
