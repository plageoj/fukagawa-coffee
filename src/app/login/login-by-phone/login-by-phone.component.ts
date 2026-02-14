import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { ConfirmationResult } from 'firebase/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../login.service';

@Component({
    selector: 'app-login-by-phone',
    templateUrl: './login-by-phone.component.html',
    styleUrls: ['./login-by-phone.component.scss'],
    imports: [
        NgIf,
        MatFormField,
        MatLabel,
        MatInput,
        ReactiveFormsModule,
        FormsModule,
        MatButton,
        MatIcon,
    ]
})
export class LoginByPhoneComponent {
  phoneNumber = '';
  confirmationCode = '';
  isSent = false;
  codeReady = false;

  private authResult?: ConfirmationResult;

  constructor(
    private readonly login: LoginService,
    private readonly sb: MatSnackBar,
  ) {}

  async sendConfirmation() {
    this.isSent = true;
    const verifier = this.login.createVerifier();

    try {
      const result = await this.login.loginByPhone(this.phoneNumber, verifier);
      this.codeReady = true;

      this.sb
        .open('確認コードを送信しました。')
        .afterDismissed()
        .subscribe(() => {
          this.isSent = false;
        });

      this.authResult = result;
    } catch (error) {
      this.isSent = false;
      verifier.clear();
      if (typeof error === 'string') this.sb.open(error);
      else {
        this.sb.open('ログインできませんでした。電話番号を確認してください');
        throw error;
      }
    }
  }

  async confirmCode() {
    if (!this.authResult) return;

    this.isSent = true;
    try {
      await this.authResult.confirm(this.confirmationCode);
      location.reload();
    } catch (error) {
      this.isSent = false;
      this.codeReady = false;
      this.sb.open('ログインに失敗しました。');
      throw error;
    }
  }
}
