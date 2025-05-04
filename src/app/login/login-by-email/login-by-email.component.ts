import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { AuthErrorCodes, UserCredential } from '@angular/fire/auth';
import { ReactiveFormsModule, UntypedFormBuilder } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-login-by-email',
  templateUrl: './login-by-email.component.html',
  styleUrls: ['./login-by-email.component.scss'],
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
  ],
})
export class LoginByEmailComponent {
  mode: 'register' | 'login' | 'reset-password' = 'login';
  credentials;

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly snack: MatSnackBar,
    private readonly router: Router,
    private readonly loginSv: LoginService,
  ) {
    this.credentials = this.fb.group({
      email: [''],
      password: [''],
    });
  }

  async createAccount() {
    const { email, password } = this.credentials.value;
    this.credentials.disable();
    try {
      const createResult = await this.loginSv.createAccountByEmail(
        email,
        password,
      );
      this.checkResult(createResult);
    } catch (e) {
      this.credentials.enable();
      if (!(e instanceof FirebaseError)) {
        this.snack.open('アカウントの作成に失敗しました');
        return;
      }
      this.snack.open(
        this.mapErrorCodeToMessage(e.code, 'アカウントの作成に失敗しました'),
      );
    }
  }

  async login() {
    const { email, password } = this.credentials.value;
    this.credentials.disable();
    try {
      const loginResult = await this.loginSv.loginByEmail(email, password);
      this.checkResult(loginResult);
    } catch (e) {
      this.credentials.enable();
      if (!(e instanceof FirebaseError)) {
        this.snack.open('ログインできませんでした');
        return;
      }
      this.snack.open(
        this.mapErrorCodeToMessage(e.code, 'ログインできませんでした'),
      );
    }
  }

  private mapErrorCodeToMessage(
    code: string,
    defaultMessage = 'ログインできませんでした',
  ) {
    switch (code) {
      case AuthErrorCodes.INVALID_PASSWORD:
      case AuthErrorCodes.USER_MISMATCH:
      case AuthErrorCodes.USER_DELETED:
        return 'メールアドレスまたはパスワードが間違っています';
      case AuthErrorCodes.EMAIL_EXISTS:
        return 'このメールアドレスはすでに使用されています';
      case AuthErrorCodes.WEAK_PASSWORD:
        return 'パスワードは6文字以上である必要があります';
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        return 'しばらく待ってから再度実行してください';
      case AuthErrorCodes.USER_DISABLED:
        return 'アカウントは凍結されています';
      case AuthErrorCodes.INTERNAL_ERROR:
        return '送信中にエラーが発生しました';
      case AuthErrorCodes.INVALID_EMAIL:
        return 'メールアドレスが不正です';
      default:
        return defaultMessage;
    }
  }

  async resetPassword() {
    const { email } = this.credentials.value;
    this.credentials.disable();
    const message = await this.loginSv.resetPassword(email);
    this.snack.open(message);
    this.mode = 'login';
    this.credentials.enable();
  }

  private async checkResult(result: UserCredential | string) {
    if (typeof result === 'string') {
      this.credentials.enable();
      this.snack.open(result);
      return;
    }
    await this.router.navigateByUrl('/');
  }
}
