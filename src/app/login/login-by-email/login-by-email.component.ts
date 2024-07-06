import { Component } from '@angular/core';
import {
  Auth,
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { UntypedFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseError } from 'firebase/app';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-login-by-email',
    templateUrl: './login-by-email.component.html',
    styleUrls: ['./login-by-email.component.scss'],
    standalone: true,
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
    private auth: Auth,
    private fb: UntypedFormBuilder,
    private snack: MatSnackBar,
    private router: Router
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
      await createUserWithEmailAndPassword(this.auth, email, password);
      await this.router.navigateByUrl('/');
    } catch (e) {
      console.error(e);
      this.credentials.enable();
      if (!(e instanceof FirebaseError)) return;
      switch (e.code as typeof AuthErrorCodes[keyof typeof AuthErrorCodes]) {
        case 'auth/email-already-in-use':
          this.snack.open('新規登録ができませんでした');
          break;
        case 'auth/invalid-email':
          this.snack.open('メールアドレスが不正です');
          break;
        case 'auth/too-many-requests':
          this.snack.open(
            '新規登録は制限されています。しばらく待ってから再度行ってください'
          );
          break;
        default:
          this.snack.open('新規登録ができませんでした');
      }
    }
  }

  async login() {
    const { email, password } = this.credentials.value;
    this.credentials.disable();
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      await this.router.navigateByUrl('/');
    } catch (e) {
      console.error(e);
      this.credentials.enable();
      if (!(e instanceof FirebaseError)) return;
      switch (e.code as typeof AuthErrorCodes[keyof typeof AuthErrorCodes]) {
        case 'auth/user-not-found':
          this.snack.open('メールアドレスまたはパスワードが間違っています');
          break;
        case 'auth/wrong-password':
          this.snack.open('メールアドレスまたはパスワードが間違っています');
          break;
        case 'auth/too-many-requests':
          this.snack.open(
            'ログインは制限されています。しばらく待ってから再度行ってください'
          );
          break;
        case 'auth/user-disabled':
          this.snack.open('アカウントは凍結されています');
          break;
        default:
          this.snack.open('ログインに失敗しました');
      }
    }
  }

  async resetPassword() {
    const { email } = this.credentials.value;
    this.credentials.disable();
    try {
      await sendPasswordResetEmail(this.auth, email);
      this.snack.open('パスワードリセットメールを送信しました');
      this.mode = 'login';
    } catch (e) {
      console.error(e);
      if (!(e instanceof FirebaseError)) return;
    }
    this.credentials.enable();
  }
}
