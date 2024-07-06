import {
  AuthGuard,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';
import { Routes } from '@angular/router';

export const routes: Routes = [
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
    path: 'order',
    loadChildren: () =>
      import('./order/order.module').then((m) => m.OrderModule),
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
