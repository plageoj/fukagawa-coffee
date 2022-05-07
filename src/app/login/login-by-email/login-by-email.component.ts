import { Component } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from '@angular/fire/auth';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-by-email',
  templateUrl: './login-by-email.component.html',
  styleUrls: ['./login-by-email.component.scss'],
})
export class LoginByEmailComponent {
  register = false;
  credentials;

  constructor(
    private auth: Auth,
    private fb: FormBuilder,
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
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);
      this.router.navigateByUrl('/');
    } catch (e) {
      console.error(e);
      this.snack.open('新規登録ができませんでした');
    }
  }

  async login() {
    const { email, password } = this.credentials.value;
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigateByUrl('/');
    } catch (e) {
      console.error(e);
      this.snack.open('ログインに失敗しました');
    }
  }
}
