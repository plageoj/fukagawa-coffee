import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { UserCredential } from '@angular/fire/auth';
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
    private fb: UntypedFormBuilder,
    private snack: MatSnackBar,
    private router: Router,
    private loginSv: LoginService,
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
      console.error(e);
      this.credentials.enable();
    }
  }

  async login() {
    const { email, password } = this.credentials.value;
    this.credentials.disable();
    try {
      const loginResult = await this.loginSv.loginByEmail(email, password);
      this.checkResult(loginResult);
    } catch (e) {
      console.error(e);
      this.credentials.enable();
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
