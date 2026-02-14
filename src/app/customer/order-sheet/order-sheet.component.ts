import { CurrencyPipe, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { where } from 'firebase/firestore';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAnchor, MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
        MatCardTitle,
        MatCardContent,
        MatCardActions,
        MatAnchor,
        RouterLink,
        MatIcon,
        MatButton,
        NgFor,
        ReactiveFormsModule,
        FormsModule,
        CurrencyPipe,
    ]
})
export class OrderSheetComponent implements OnInit {
  customer: Customer | undefined;
  items: Partial<Item & { price: string }>[] = [];

  orderAddress = '';

  qrCodeAddress = '';
  isNotReady = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly cs: CustomerService,
    private readonly is: ItemService,
    private readonly title: TitleService,
  ) {
    this.cs
      .load(this.route.snapshot.paramMap.get('id') ?? '_')
      .pipe(take(1))
      .subscribe((customer) => {
        if (!customer) return;
        this.customer = customer;
        this.title.setTitle(customer.name, '発注書');

        const items = Object.keys(customer?.items || {});
        if (customer && items.length) {
          this.orderAddress = `${location.origin}/order/${customer.id}/new`;
          this.qrCodeAddress =
            'https://api.qrserver.com/v1/create-qr-code/?format=svg&qzone=1&data=' +
            encodeURIComponent(this.orderAddress);
          this.is.list(where('id', 'in', items)).subscribe((items) => {
            this.items = items;
            this.items.push(...Array(10 - items.length).fill({}));
          });
        }
      });
  }

  ngOnInit(): void {
    document.getElementById('qrcode')?.addEventListener('load', () => {
      this.isNotReady = false;
    });
  }

  print() {
    window.print();
  }
}
