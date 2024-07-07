import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { LocalStorageService } from 'ngx-webstorage';
import { LoginByEmailComponent } from './login-by-email/login-by-email.component';
import { LoginByPhoneComponent } from './login-by-phone/login-by-phone.component';
import { MatCard, MatCardTitle, MatCardContent } from '@angular/material/card';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: true,
    imports: [
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatTabGroup,
        MatTab,
        LoginByPhoneComponent,
        LoginByEmailComponent,
    ],
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
