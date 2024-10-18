import { Injectable } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  ApplicationVerifier,
  Auth,
  AuthErrorCodes,
  createUserWithEmailAndPassword,
  RecaptchaVerifier,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  UserCredential,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(private readonly auth: Auth) {}

  async createAccountByEmail(
    email: string,
    password: string,
  ): Promise<UserCredential | string> {
    try {
      return await createUserWithEmailAndPassword(this.auth, email, password);
    } catch (e) {
      if (!(e instanceof FirebaseError)) throw e;
      return this.mapSignUpErrorMessage(e);
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
      return this.mapLoginErrorMessage(e);
    }
  }

  createVerifier() {
    return new RecaptchaVerifier(this.auth, 'send-confirmation', {
      size: 'invisible',
    });
  }

  async loginByPhone(phoneNumber: string, verifier: ApplicationVerifier) {
    const intlPhoneNumber = phoneNumber.startsWith('+')
      ? phoneNumber
      : '+81' + phoneNumber;

    try {
      return await signInWithPhoneNumber(this.auth, intlPhoneNumber, verifier);
    } catch (e) {
      if (!(e instanceof FirebaseError)) throw e;
      throw this.mapLoginErrorMessage(e);
    }
  }

  async resetPassword(email: string) {
    try {
      await sendPasswordResetEmail(this.auth, email);
      return 'パスワードリセットメールを送信しました';
    } catch (e) {
      if (!(e instanceof FirebaseError)) throw e;
      return this.mapPasswordResetErrorMessage(e);
    }
  }

  private mapSignUpErrorMessage(e: FirebaseError): string {
    switch (e.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        return '新規登録ができませんでした';
      case AuthErrorCodes.INVALID_EMAIL:
        return 'メールアドレスが不正です';
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        return '新規登録が制限されています。しばらく待ってから再度行ってください';
      case AuthErrorCodes.WEAK_PASSWORD:
        return 'パスワードが簡単すぎます。8文字以上のパスワードにしてください';
      default:
        return '新規登録ができませんでした';
    }
  }

  private mapLoginErrorMessage(e: FirebaseError): string {
    switch (e.code) {
      case AuthErrorCodes.USER_DELETED:
      case AuthErrorCodes.INVALID_PASSWORD:
        return 'メールアドレスまたはパスワードが間違っています';
      case AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER:
        return 'ログインが制限されています。しばらく待ってから再度行ってください';
      case AuthErrorCodes.USER_DISABLED:
        return 'アカウントは凍結されています';
      default:
        return 'ログインできませんでした';
    }
  }

  private mapPasswordResetErrorMessage(e: FirebaseError): string {
    switch (e.code) {
      case AuthErrorCodes.USER_DELETED:
        return 'パスワードリセットメールを送信しました';
      case AuthErrorCodes.USER_DISABLED:
        return 'アカウントは凍結されています';
      case AuthErrorCodes.INTERNAL_ERROR:
        return '送信中にエラーが発生しました';
      default:
        return 'パスワードをリセットできませんでした';
    }
  }
}
