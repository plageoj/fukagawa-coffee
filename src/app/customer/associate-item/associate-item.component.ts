import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Item } from 'src/models/item.model';

@Component({
  selector: 'app-associate-item',
  templateUrl: './associate-item.component.html',
  styleUrls: ['./associate-item.component.scss'],
})
export class AssociateItemComponent implements OnInit {
  constructor(private ref: MatDialogRef<AssociateItemComponent>) {}

  ngOnInit(): void {}

  associateItem(item: Item) {
    this.ref.close(item);
  }
}
