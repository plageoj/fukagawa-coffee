import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { LocalStorageService } from 'ngx-webstorage';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements AfterViewInit {
  private lastLoginMethodIndexKey = 'login.lastLoginMethodIndex';
  @ViewChild('tabGroup') tabGroup?: MatTabGroup;

  constructor(private storage: LocalStorageService) {}

  ngAfterViewInit(): void {
    if (!this.tabGroup) return;

    const index = Number(
      this.storage.retrieve(this.lastLoginMethodIndexKey) ?? 0
    );
    this.tabGroup.selectedIndex = index;
  }

  setLastLoginMethodIndex(index: number) {
    this.storage.store(this.lastLoginMethodIndexKey, index);
  }
}
