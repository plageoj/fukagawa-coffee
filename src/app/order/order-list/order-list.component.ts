import { Component } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/models/order.model';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, AsyncPipe, DatePipe } from '@angular/common';
import { MatNavList, MatListItem, MatListItemLine } from '@angular/material/list';

@Component({
    selector: 'app-order-list',
    templateUrl: './order-list.component.html',
    styleUrls: ['./order-list.component.scss'],
    standalone: true,
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

  constructor(private os: OrderService) {
    this.orders = this.os.list(where('isDone', '==', false));
  }
}
