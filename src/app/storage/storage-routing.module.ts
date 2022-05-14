import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StorageListComponent } from './storage-list/storage-list.component';

const routes: Routes = [
  {
    path: '',
    component: StorageListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StorageRoutingModule {}
