import { AsyncPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { where } from 'firebase/firestore';
import {
  MatListItem,
  MatListItemLine,
  MatNavList,
} from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  imports: [
    MatNavList,
    NgFor,
    MatListItem,
    RouterLink,
    MatListItemLine,
    NgIf,
    AsyncPipe,
    DatePipe,
  ],
})
export class OrderListComponent {
  orders: Observable<Order[]>;

  constructor(private readonly os: OrderService) {
    this.orders = this.os.list(where('isDone', '==', false));
  }
}
