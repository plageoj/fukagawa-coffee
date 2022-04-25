import { Component } from '@angular/core';
import {
  Auth,
  ConfirmationResult,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from '@angular/fire/auth';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  phoneNumber = '';
  confirmationCode = '';
  isSent = false;
  codeReady = false;

  private authResult?: ConfirmationResult;

  constructor(private auth: Auth, private sb: MatSnackBar) {}

  sendConfirmation() {
    const verifier = new RecaptchaVerifier(
      'send-confirmation',
      {
        size: 'invisible',
      },
      this.auth
    );

    this.isSent = true;
    const phoneNumber = this.phoneNumber.startsWith('+')
      ? this.phoneNumber
      : '+81' + this.phoneNumber;

    signInWithPhoneNumber(this.auth, phoneNumber, verifier).then(
      (result) => {
        this.codeReady = true;

        this.sb
          .open('確認コードを送信しました。', undefined, {
            duration: 2000,
          })
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
          '確認コードを送信できませんでした。電話番号を確認してください。',
          undefined,
          {
            duration: 2000,
          }
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
          this.sb.open('ログインに失敗しました。', undefined, {
            duration: 2000,
          });
        }
      );
    }
  }
}
