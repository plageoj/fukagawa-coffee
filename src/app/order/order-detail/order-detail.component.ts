import { DatePipe } from '@angular/common';
import {
  Component,
  signal,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import {
  MatListItem,
  MatListItemLine,
  MatListItemTitle,
  MatNavList,
} from '@angular/material/list';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { where } from 'firebase/firestore';
import { take } from 'rxjs';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { Item } from 'src/models/item.model';
import { Order } from 'src/models/order.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private readonly os = inject(OrderService);
  private readonly is = inject(ItemService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  order = signal<Order | undefined>(undefined);
  itemList = signal<{ [key: string]: Item | undefined }>({});

  constructor() {
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
