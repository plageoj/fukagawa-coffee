import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemSelectorComponent } from './item-selector.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
    imports: [CommonModule, MatGridListModule, MatIconModule, ItemSelectorComponent],
    exports: [ItemSelectorComponent],
})
export class ItemSelectorModule {}
