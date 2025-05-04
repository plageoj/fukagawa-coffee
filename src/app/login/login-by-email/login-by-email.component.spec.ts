import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { LoginService } from '../login.service';
import { LoginByEmailComponent } from './login-by-email.component';
import { FirebaseError } from '@angular/fire/app';
import { Auth, AuthErrorCodes } from '@angular/fire/auth';

describe('LoginByEmailComponent', () => {
  let component: LoginByEmailComponent;
  let fixture: ComponentFixture<LoginByEmailComponent>;
  let loader: HarnessLoader;
  let loginSrv: jasmine.SpyObj<LoginService>;
  let snack: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const login = jasmine.createSpyObj('LoginService', [
      'createAccountByEmail',
      'loginByEmail',
      'resetPassword',
    ]);
    snack = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [
        FirebaseTestingModule,
        LoginByEmailComponent,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: LoginService, useValue: login },
        { provide: MatSnackBar, useValue: snack },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginByEmailComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    loginSrv = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    fixture.detectChanges();
  });

  describe('create account', () => {
    it('should create an account', async () => {
      component.mode = 'register';
      const inputs = await loader.getAllHarnesses(MatInputHarness);
      await inputs[0].setValue('test@example.com');
      await inputs[1].setValue('test password');
      fixture.detectChanges();
      const registerButton = await loader.getHarness(
        MatButtonHarness.with({ text: /新規登録/ }),
      );
      await registerButton.click();

      expect(loginSrv.createAccountByEmail).toHaveBeenCalledOnceWith(
        'test@example.com',
        'test password',
      );
    });

    it('should re-enable form if error when creating user', async () => {
      loginSrv.createAccountByEmail.and.resolveTo('string');
      await component.createAccount();
      expect(component.credentials.enabled).toBeTrue();
    });

    it('should re-enable form if exception when creating user', async () => {
      loginSrv.createAccountByEmail.and.throwError('exception');
      await component.createAccount();
      expect(component.credentials.enabled).toBeTrue();
    });

    const params: { error: string | FirebaseError; message: string }[] = [
      { error: 'error', message: 'アカウントの作成に失敗しました' },
      {
        error: new FirebaseError(AuthErrorCodes.INVALID_PASSWORD, 'error'),
        message: 'メールアドレスまたはパスワードが間違っています',
      },
      {
        error: new FirebaseError(AuthErrorCodes.USER_MISMATCH, 'error'),
        message: 'メールアドレスまたはパスワードが間違っています',
      },
      {
        error: new FirebaseError(AuthErrorCodes.USER_DELETED, 'error'),
        message: 'メールアドレスまたはパスワードが間違っています',
      },
      {
        error: new FirebaseError(AuthErrorCodes.EMAIL_EXISTS, 'error'),
        message: 'このメールアドレスはすでに使用されています',
      },
      {
        error: new FirebaseError(AuthErrorCodes.WEAK_PASSWORD, 'error'),
        message: 'パスワードは6文字以上である必要があります',
      },
      {
        error: new FirebaseError(
          AuthErrorCodes.TOO_MANY_ATTEMPTS_TRY_LATER,
          'error',
        ),
        message: 'しばらく待ってから再度実行してください',
      },
      {
        error: new FirebaseError(AuthErrorCodes.USER_DISABLED, 'error'),
        message: 'アカウントは凍結されています',
      },
      {
        error: new FirebaseError(AuthErrorCodes.INTERNAL_ERROR, 'error'),
        message: '送信中にエラーが発生しました',
      },
      {
        error: new FirebaseError(AuthErrorCodes.INVALID_EMAIL, 'error'),
        message: 'メールアドレスが不正です',
      },
      {
        error: new FirebaseError('error', 'error'),
        message: 'アカウントの作成に失敗しました',
      },
    ];

    params.forEach(({ error, message }) => {
      it(`should show error message "${message}" if ${error} error when creating user`, async () => {
        loginSrv.createAccountByEmail.and.throwError(error);
        await component.createAccount();
        expect(snack.open).toHaveBeenCalledWith(message);
      });
    });
  });

  describe('login', async () => {
    it('should login the user', async () => {
      component.mode = 'login';
      const inputs = await loader.getAllHarnesses(MatInputHarness);
      const loginButton = await loader.getHarness(
        MatButtonHarness.with({ text: /ログイン/ }),
      );

      await inputs[0].setValue('test@example.com');
      await inputs[1].setValue('test password');
      fixture.detectChanges();
      await loginButton.click();

      expect(loginSrv.loginByEmail).toHaveBeenCalledOnceWith(
        'test@example.com',
        'test password',
      );
    });

    it('should show error message if login fails', async () => {
      loginSrv.loginByEmail.and.throwError('error');
      await component.login();
      expect(snack.open).toHaveBeenCalledWith('ログインできませんでした');
    });

    it('should show error message if login fails with FirebaseError', async () => {
      loginSrv.loginByEmail.and.throwError(
        new FirebaseError(AuthErrorCodes.INVALID_PASSWORD, 'error'),
      );
      await component.login();
      expect(snack.open).toHaveBeenCalledWith(
        'メールアドレスまたはパスワードが間違っています',
      );
    });
  });

  describe('reset password', () => {
    it('should reset password', async () => {
      component.mode = 'reset-password';
      const input = await loader.getHarness(
        MatInputHarness.with({ selector: '[name="email"]' }),
      );
      await input.setValue('test@example.com');
      fixture.detectChanges();

      const resetButton = await loader.getHarness(
        MatButtonHarness.with({ text: /パスワード再設定メールを送信/ }),
      );
      await resetButton.click();

      expect(loginSrv.resetPassword).toHaveBeenCalledOnceWith(
        'test@example.com',
      );
    });
  });
});
