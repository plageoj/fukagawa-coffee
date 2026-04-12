import { CurrencyPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { where } from 'firebase/firestore';
import { take } from 'rxjs';
import { CustomerService } from 'src/app/services/customer.service';
import { ItemService } from 'src/app/services/item.service';
import { TitleService } from 'src/app/services/title.service';
import { Customer } from 'src/models/customer.model';
import { Item } from 'src/models/item.model';

@Component({
  selector: 'app-order-sheet',
  templateUrl: './order-sheet.component.html',
  styleUrls: ['./order-sheet.component.scss'],
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardActions,
    MatAnchor,
    RouterLink,
    MatIcon,
    MatButton,
    ReactiveFormsModule,
    FormsModule,
    CurrencyPipe,
  ],
})
export class OrderSheetComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly cs = inject(CustomerService);
  private readonly is = inject(ItemService);
  private readonly title = inject(TitleService);

  private readonly destroyRef = inject(DestroyRef);
  customer = signal<Customer | undefined>(undefined);
  items = signal<Partial<Item & { price: string }>[]>([]);

  orderAddress = signal('');

  qrCodeAddress = signal('');
  isNotReady = signal(true);

  constructor() {
    this.cs
      .load(this.route.snapshot.paramMap.get('id') ?? '_')
      .pipe(take(1))
      .subscribe((customer) => {
        if (!customer) return;
        this.customer.set(customer);
        this.title.setTitle(customer.name, '発注書');

        const items = Object.keys(customer?.items || {});
        const orderAddress = `${location.origin}/order/${customer.id}/new`;
        this.orderAddress.set(orderAddress);
        this.qrCodeAddress.set(
          'https://api.qrserver.com/v1/create-qr-code/?format=svg&qzone=1&data=' +
            encodeURIComponent(orderAddress),
        );
        this.is
          .list(where('id', 'in', items))
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((items) => {
            this.items.set([
              ...items,
              ...new Array(Math.max(0, 10 - items.length))
                .fill(1)
                .map((_, i) => ({
                id: i.toString(),
                name: '',
                price: '',
              })),
            ]);
          });
      });
  }

  ngOnInit(): void {
    document.getElementById('qrcode')?.addEventListener('load', () => {
      this.isNotReady.set(false);
    });
  }

  print() {
    globalThis.print();
  }
}
