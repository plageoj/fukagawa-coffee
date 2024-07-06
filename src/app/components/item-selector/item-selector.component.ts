import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/models/item.model';
import { MatIcon } from '@angular/material/icon';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { NgIf, NgFor, NgClass, AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-item-selector',
    templateUrl: './item-selector.component.html',
    styleUrls: ['./item-selector.component.scss'],
    standalone: true,
    imports: [
        NgIf,
        MatGridList,
        NgFor,
        MatGridTile,
        NgClass,
        MatIcon,
        AsyncPipe,
    ],
})
export class ItemSelectorComponent {
  columns = Math.floor(window.innerWidth / 170).toString();
  items: Observable<Item[]>;

  @Output() choose = new EventEmitter<Item>();

  constructor(private is: ItemService) {
    this.items = this.is.list();
  }

  selectItem(item: Item) {
    this.choose.emit(item);
  }
}
