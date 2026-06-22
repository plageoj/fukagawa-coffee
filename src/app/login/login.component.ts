import {
  AfterViewInit,
  Component,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { LoginByEmailComponent } from './login-by-email/login-by-email.component';
import { LoginByPhoneComponent } from './login-by-phone/login-by-phone.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    MatCard,
    MatCardTitle,
    MatCardHeader,
    MatCardContent,
    MatTabGroup,
    MatTab,
    LoginByPhoneComponent,
    LoginByEmailComponent,
  ],
})
export class LoginComponent implements AfterViewInit {
  private readonly lastLoginMethodIndexKey =
    'fukagawa-coffee.login.lastLoginMethodIndex';
  @ViewChild('tabGroup') tabGroup?: MatTabGroup;

  ngAfterViewInit(): void {
    if (!this.tabGroup) return;

    const index = Number(
      localStorage.getItem(this.lastLoginMethodIndexKey) ?? 0,
    );
    this.tabGroup.selectedIndex = index;
  }

  setLastLoginMethodIndex(index: number) {
    localStorage.setItem(this.lastLoginMethodIndexKey, String(index));
  }
}
