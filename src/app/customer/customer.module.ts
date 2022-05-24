import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ItemSelectorModule } from '../components/item-selector/item-selector.module';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { AssociateItemComponent } from './associate-item/associate-item.component';
import { CustomerDetailComponent } from './customer-detail/customer-detail.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { CustomerRoutingModule } from './customer-routing.module';
import { OrderSheetComponent } from './order-sheet/order-sheet.component';

@NgModule({
  declarations: [
    CustomerListComponent,
    AddCustomerComponent,
    CustomerDetailComponent,
    AssociateItemComponent,
    OrderSheetComponent,
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ItemSelectorModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatInputModule,
  ],
})
export class CustomerModule {}
