import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatInputHarness } from '@angular/material/input/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { LoginByEmailComponent } from './login-by-email.component';
import { LoginService } from '../login.service';

describe('LoginByEmailComponent', () => {
  let component: LoginByEmailComponent;
  let fixture: ComponentFixture<LoginByEmailComponent>;
  let loader: HarnessLoader;
  let loginSrv: jasmine.SpyObj<LoginService>;

  beforeEach(async () => {
    const login = jasmine.createSpyObj('LoginService', [
      'createAccountByEmail',
      'loginByEmail',
      'resetPassword',
    ]);

    await TestBed.configureTestingModule({
      imports: [
        FirebaseTestingModule,
        LoginByEmailComponent,
        NoopAnimationsModule,
      ],
      providers: [{ provide: LoginService, useValue: login }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginByEmailComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    component = fixture.componentInstance;
    loginSrv = TestBed.inject(LoginService) as jasmine.SpyObj<LoginService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
  });

  describe('login', () => {
    it('should login the user', async () => {
      component.mode = 'login';
      const inputs = await loader.getAllHarnesses(MatInputHarness);
      await inputs[0].setValue('test@example.com');
      await inputs[1].setValue('test password');
      fixture.detectChanges();
      const registerButton = await loader.getHarness(
        MatButtonHarness.with({ text: /ログイン/ }),
      );
      await registerButton.click();

      expect(loginSrv.loginByEmail).toHaveBeenCalledOnceWith(
        'test@example.com',
        'test password',
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
