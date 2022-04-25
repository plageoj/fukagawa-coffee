import { Component } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { Item } from 'src/models/item.model';
import { Order } from 'src/models/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent {
  order: Order | undefined;
  itemList: { [key: string]: Item } = {};

  constructor(
    private os: OrderService,
    private is: ItemService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.os
      .load(this.route.snapshot.paramMap.get('id') || '_')
      .subscribe((order) => {
        this.order = order;

        this.is
          .list(where('id', 'in', order?.items.map((item) => item.id) || []))
          .subscribe((items) => {
            for (const item of items) {
              this.itemList[item.id] = item;
            }
          });
      });
  }

  markAsDone() {
    if (!this.order) return;
    this.order.isDone = true;
    this.os.store(this.order);
    this.router.navigateByUrl('../');
  }
}
