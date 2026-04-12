import { AsyncPipe, NgClass } from '@angular/common';
import { Component, EventEmitter, Output, inject } from '@angular/core';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatIcon } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/models/item.model';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss'],
  imports: [MatGridList, MatGridTile, NgClass, MatIcon, AsyncPipe],
})
export class ItemSelectorComponent {
  private readonly is = inject(ItemService);

  columns = Math.floor(window.innerWidth / 170).toString();
  items: Observable<Item[]>;

  @Output() choose = new EventEmitter<Item>();

  constructor() {
    this.items = this.is.list();
  }

  selectItem(item: Item) {
    this.choose.emit(item);
  }
}
