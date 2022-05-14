import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { NewOrderComponent } from './order/new-order/new-order.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/item',
        pathMatch: 'full',
      },
      {
        path: 'item',
        loadChildren: () =>
          import('./item/item.module').then((m) => m.ItemModule),
      },
      {
        path: 'customer',
        loadChildren: () =>
          import('./customer/customer.module').then((m) => m.CustomerModule),
      },
      {
        path: 'order',
        loadChildren: () =>
          import('./order/order.module').then((m) => m.OrderModule),
      },
      {
        path: 'storage',
        loadChildren: () =>
          import('./storage/storage.module').then((m) => m.StorageModule),
      },
      {
        path: 'member',
        loadChildren: () =>
          import('./member/member.module').then((m) => m.MemberModule),
      },
    ],
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectUnauthorizedTo('/login'),
    },
  },

  {
    path: 'order/:id/new',
    component: NewOrderComponent,
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
    canActivate: [AuthGuard],
    data: {
      authGuardPipe: () => redirectLoggedInTo('/'),
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
