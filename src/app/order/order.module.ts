import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderRoutingModule } from './order-routing.module';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        OrderRoutingModule,
        MatListModule,
        MatIconModule,
        MatCardModule,
        MatInputModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatButtonModule,
        MatTooltipModule,
        OrderListComponent, OrderDetailComponent, NewOrderComponent,
    ],
})
export class OrderModule {}
