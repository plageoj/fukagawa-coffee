import { Component, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemService } from 'src/app/services/item.service';
import { Item } from 'src/models/item.model';

@Component({
  selector: 'app-item-selector',
  templateUrl: './item-selector.component.html',
  styleUrls: ['./item-selector.component.scss'],
})
export class ItemSelectorComponent {
  columns = Math.floor(window.innerWidth / 200).toString();
  items: Observable<Item[]>;

  @Output() choose = new EventEmitter<Item>();

  constructor(private is: ItemService) {
    this.items = this.is.list();
  }

  selectItem(item: Item) {
    this.choose.emit(item);
  }
}
