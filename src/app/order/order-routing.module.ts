import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  authGuard,
  redirectUnauthorizedTo,
} from '../guards/auth.guard';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent,
    canActivate: [authGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo('/login'),
    },
    title: '注文',
  },
  {
    path: ':id',
    component: OrderDetailComponent,
    canActivate: [authGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo('/login'),
    },
    title: '注文',
  },
  {
    path: ':id/new',
    component: NewOrderComponent,
    title: '注文入力',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
