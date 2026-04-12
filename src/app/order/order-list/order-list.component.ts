import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { where } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  imports: [
    MatNavList,
    MatListItem,
    MatListItemTitle,
    RouterLink,
    MatListItemLine,
    AsyncPipe,
    DatePipe,
  ],
})
export class OrderListComponent {
  private readonly os = inject(OrderService);

  orders: Observable<Order[]>;

  constructor() {
    this.orders = this.os.list(where('isDone', '==', false));
  }
}
