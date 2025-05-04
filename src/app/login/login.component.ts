import { AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginByEmailComponent } from './login-by-email/login-by-email.component';
import { LoginByPhoneComponent } from './login-by-phone/login-by-phone.component';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [
        MatCard,
        MatCardTitle,
        MatCardHeader,
        MatCardContent,
        MatTabGroup,
        MatTab,
        LoginByPhoneComponent,
        LoginByEmailComponent,
    ]
})
export class LoginComponent implements AfterViewInit {
  private readonly lastLoginMethodIndexKey = 'login.lastLoginMethodIndex';
  @ViewChild('tabGroup') tabGroup?: MatTabGroup;

  constructor(private readonly storage: LocalStorageService) {}

  ngAfterViewInit(): void {
    if (!this.tabGroup) return;

    const index = Number(
      this.storage.retrieve(this.lastLoginMethodIndexKey) ?? 0,
    );
    this.tabGroup.selectedIndex = index;
  }

  setLastLoginMethodIndex(index: number) {
    this.storage.store(this.lastLoginMethodIndexKey, index);
  }
}
