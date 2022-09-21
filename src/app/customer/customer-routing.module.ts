import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { OrderSheetComponent } from './order-sheet/order-sheet.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent,
    title: '取引先',
  },
  {
    path: ':id',
    component: CustomerDetailComponent,
    title: '取引先',
  },
  {
    path: ':id/order-sheet',
    component: OrderSheetComponent,
    title: '発注書',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule {}
