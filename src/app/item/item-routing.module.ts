import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { ItemListComponent } from './item-list/item-list.component';

const routes: Routes = [
  {
    path: '',
    component: ItemListComponent,
    title: '品目',
  },
  {
    path: ':id',
    component: ItemDetailComponent,
    title: '品目',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemRoutingModule {}
