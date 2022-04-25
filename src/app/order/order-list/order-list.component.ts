import { Component } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/models/order.model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
})
export class OrderListComponent {
  orders: Observable<Order[]>;

  constructor(private os: OrderService) {
    this.orders = this.os.list(where('isDone', '==', false));
  }
}
