import { NgModule } from '@angular/core';
import { AuthGuard, redirectUnauthorizedTo } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import { NewOrderComponent } from './new-order/new-order.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';

const routes: Routes = [
  {
    path: '',
    component: OrderListComponent,
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo('/login'),
    },
    title: '注文',
  },
  {
    path: ':id',
    component: OrderDetailComponent,
    canActivate: [AuthGuard],
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
