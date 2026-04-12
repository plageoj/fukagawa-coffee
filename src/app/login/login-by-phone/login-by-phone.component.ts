import { Component, signal, inject } from '@angular/core';
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
    MatFormField,
    MatLabel,
    MatInput,
    ReactiveFormsModule,
    FormsModule,
    MatButton,
    MatIcon,
  ],
})
export class LoginByPhoneComponent {
  private readonly login = inject(LoginService);
  private readonly sb = inject(MatSnackBar);

  phoneNumber = '';
  confirmationCode = '';
  isSent = signal(false);
  codeReady = signal(false);

  private authResult?: ConfirmationResult;

  async sendConfirmation() {
    this.isSent.set(true);
    const verifier = this.login.createVerifier();

    try {
      const result = await this.login.loginByPhone(this.phoneNumber, verifier);
      this.codeReady.set(true);

      this.sb
        .open('確認コードを送信しました。')
        .afterDismissed()
        .subscribe(() => {
          this.isSent.set(false);
        });

      this.authResult = result;
    } catch (error) {
      this.isSent.set(false);
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

    this.isSent.set(true);
    try {
      await this.authResult.confirm(this.confirmationCode);
      location.reload();
    } catch (error) {
      this.isSent.set(false);
      this.codeReady.set(false);
      this.sb.open('ログインに失敗しました。');
      throw error;
    }
  }
}
