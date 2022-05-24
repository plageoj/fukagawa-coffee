import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { NewOrderComponent } from './new-order/new-order.component';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [OrderListComponent, OrderDetailComponent, NewOrderComponent],
  imports: [
    CommonModule,
    FormsModule,
    OrderRoutingModule,
    MatListModule,
    MatIconModule,
    MatCardModule,
    MatInputModule,
    MatSnackBarModule,
  ],
})
export class OrderModule {}
