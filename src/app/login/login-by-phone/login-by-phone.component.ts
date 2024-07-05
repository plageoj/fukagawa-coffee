import { Component } from '@angular/core';
import {
  Auth,
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login-by-phone',
  templateUrl: './login-by-phone.component.html',
  styleUrls: ['./login-by-phone.component.scss'],
})
export class LoginByPhoneComponent {
  phoneNumber = '';
  confirmationCode = '';
  isSent = false;
  codeReady = false;

  private authResult?: ConfirmationResult;

  constructor(private auth: Auth, private sb: MatSnackBar) {}

  sendConfirmation() {
    const verifier = new RecaptchaVerifier(this.auth, 'send-confirmation', {
      size: 'invisible',
    });

    this.isSent = true;
    const phoneNumber = this.phoneNumber.startsWith('+')
      ? this.phoneNumber
      : '+81' + this.phoneNumber;

    signInWithPhoneNumber(this.auth, phoneNumber, verifier).then(
      (result) => {
        this.codeReady = true;

        this.sb
          .open('確認コードを送信しました。')
          .afterDismissed()
          .subscribe(() => {
            this.isSent = false;
          });

        this.authResult = result;
      },
      () => {
        this.isSent = false;
        verifier.clear();
        this.sb.open(
          '確認コードを送信できませんでした。電話番号を確認してください。'
        );
      }
    );
  }

  confirmCode() {
    if (this.authResult) {
      this.isSent = true;
      this.authResult.confirm(this.confirmationCode.toString()).then(
        () => {
          location.reload();
        },
        () => {
          this.isSent = false;
          this.codeReady = false;
          this.sb.open('ログインに失敗しました。');
        }
      );
    }
  }
}
