import {
  Component,
  DestroyRef,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { serverTimestamp, where, WithFieldValue } from 'firebase/firestore';
import { CustomerService } from 'src/app/services/customer.service';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { Customer } from 'src/models/customer.model';
import { Item } from 'src/models/item.model';
import { Order } from 'src/models/order.model';

@Component({
  selector: 'app-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardSubtitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
    MatTooltip,
    MatButton,
    MatIcon,
    MatCardActions,
  ],
})
export class NewOrderComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly cs = inject(CustomerService);
  private readonly is = inject(ItemService);
  private readonly os = inject(OrderService);
  private readonly sb = inject(MatSnackBar);

  private readonly destroyRef = inject(DestroyRef);
  customer = signal<Customer | undefined>(undefined);
  items = signal<Partial<Item & { orderedCount: number }>[]>([]);
  order: WithFieldValue<Omit<Order, 'id'>> = {
    orderedAt: serverTimestamp(),
    customerId: '',
    customerName: '',
    items: [],
    notes: '',
    isDone: false,
  };
  sending = signal(false);

  constructor() {
    this.cs
      .load(this.route.snapshot.paramMap.get('id') ?? '_')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((customer) => {
        this.customer.set(customer);

        if (!customer) return;
        this.order.customerId = customer.id;
        this.order.customerName = customer.name;
        const items = Object.keys(customer.items || {});
        if (items.length) {
          this.is
            .list(where('id', 'in', items))
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((items) => {
              this.items.set(items);
            });
        }
      });
  }

  addItem() {
    this.items.update((items) => [...items, { orderedCount: 1, name: '' }]);
  }

  sendOrder() {
    this.sending.set(true);
    this.order.orderedAt = serverTimestamp();
    this.order.items = this.items()
      .map((item) => ({
        id: item.id ?? '',
        name: item.name ?? '',
        orderedCount: item.orderedCount ?? 0,
      }))
      .filter((item) => item.orderedCount);
    this.os.store({ id: this.os.id, ...this.order }).then(
      () => {
        this.sb.open('注文を送信しました');
      },
      () => {
        this.sending.set(false);
      },
    );
  }
}
