import { Component, signal } from '@angular/core';
import { where } from 'firebase/firestore';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { Item } from 'src/models/item.model';
import { Order } from 'src/models/order.model';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { DatePipe } from '@angular/common';
import {
  MatNavList,
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
} from '@angular/material/list';
import {
  MatCard,
  MatCardTitle,
  MatCardSubtitle,
  MatCardContent,
  MatCardActions,
  MatCardHeader,
} from '@angular/material/card';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatNavList,
    MatListItem,
    MatListItemTitle,
    MatListItemLine,
    RouterLink,
    MatCardActions,
    MatButton,
    MatIcon,
    DatePipe,
  ],
})
export class OrderDetailComponent {
  order = signal<Order | undefined>(undefined);
  itemList = signal<{ [key: string]: Item | undefined }>({});

  constructor(
    private readonly os: OrderService,
    private readonly is: ItemService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {
    this.os
      .load(this.route.snapshot.paramMap.get('id') ?? '_')
      .pipe(take(1))
      .subscribe((order) => {
        this.order.set(order);

        this.is
          .list(where('id', 'in', order?.items.map((item) => item.id) ?? []))
          .pipe(take(1))
          .subscribe((items) => {
            const list: { [key: string]: Item | undefined } = {};
            for (const item of items) {
              list[item.id] = item;
            }
            this.itemList.set(list);
          });
      });
  }

  markAsDone() {
    const order = this.order();
    if (!order) return;
    order.isDone = true;
    this.os.store(order);
    this.router.navigateByUrl('/order');
  }
}
