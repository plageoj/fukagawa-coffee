import { Component } from '@angular/core';
import { where } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { take } from 'rxjs';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { Item } from 'src/models/item.model';
import { Order } from 'src/models/order.model';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { MatNavList, MatListItem } from '@angular/material/list';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from '@angular/material/card';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    imports: [
        MatCard,
        MatCardTitle,
        MatCardSubtitle,
        MatCardContent,
        MatNavList,
        NgFor,
        MatListItem,
        RouterLink,
        NgIf,
        MatCardActions,
        MatButton,
        MatIcon,
        DatePipe,
    ]
})
export class OrderDetailComponent {
  order: Order | undefined;
  itemList: { [key: string]: Item | undefined } = {};

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
        this.order = order;

        this.is
          .list(where('id', 'in', order?.items.map((item) => item.id) ?? []))
          .pipe(take(1))
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
    this.router.navigateByUrl('/order');
  }
}
