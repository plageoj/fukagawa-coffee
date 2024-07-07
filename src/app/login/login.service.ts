import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  Auth,
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  UserCredential,
} from '@angular/fire/auth';

type ErrorCodes = (typeof AuthErrorCodes)[keyof typeof AuthErrorCodes];

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private auth: Auth) {}

  async createAccountByEmail(
    email: string,
    password: string,
  ): Promise<UserCredential | string> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      if (!(e instanceof FirebaseError)) throw e;
      switch (e.code as ErrorCodes) {
        case 'auth/email-already-in-use':
          return '新規登録ができませんでした';
        case 'auth/invalid-email':
          return 'メールアドレスが不正です';
        case 'auth/too-many-requests':
          return '新規登録は制限されています。しばらく待ってから再度行ってください';
        case 'auth/weak-password':
          return 'パスワードが簡単すぎます。8文字以上のパスワードにしてください。';
        default:
          return '新規登録ができませんでした';
      }
    }
  }

  async loginByEmail(
    email: string,
    password: string,
  ): Promise<UserCredential | string> {
    try {
      return await signInWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      if (!(e instanceof FirebaseError)) throw e;
      switch (e.code as ErrorCodes) {
        case 'auth/user-not-found':
          return 'メールアドレスまたはパスワードが間違っています';
        case 'auth/wrong-password':
          return 'メールアドレスまたはパスワードが間違っています';
        case 'auth/too-many-requests':
          return 'ログインは制限されています。しばらく待ってから再度行ってください';
        case 'auth/user-disabled':
          return 'アカウントは凍結されています';
        default:
          return 'ログインに失敗しました';
      }
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return 'パスワードリセットメールを送信しました';
    } catch (e) {
      if (!(e instanceof FirebaseError)) throw e;
      switch (e.code as ErrorCodes) {
        case 'auth/user-not-found':
          return 'パスワードリセットメールを送信しました';
        case 'auth/internal-error':
          return '送信中にエラーが発生しました';
        default:
          return 'パスワードをリセットできませんでした';
      }
    }
  }
}
