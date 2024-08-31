import { TestBed } from '@angular/core/testing';

import { environment } from 'src/environments/environment';
import { FirebaseTestingModule } from '../firebase-testing.module';
import { LoginService } from './login.service';

const deleteAllUsers = async () => {
  await fetch(
    `${environment.firebaseEmulator.authUrl}/emulator/v1/projects/fukagawa-coffee/accounts`,
    {
      method: 'delete',
      headers: {
        authorization: 'Bearer owner',
      },
    },
  );
};

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
      providers: [LoginService],
    });
    service = TestBed.inject(LoginService);
  });

  describe('create user', () => {
    beforeEach(async () => {
      await deleteAllUsers();
    });

    it('should create user only once', async () => {
      expect(
        typeof (await service.createAccountByEmail(
          'test@example.com',
          'test password',
        )),
      ).toBe('object');

      expect(
        await service.createAccountByEmail('test@example.com', 'test password'),
      ).toBe('新規登録ができませんでした');
    });

    it('should validate email address', async () => {
      expect(
        await service.createAccountByEmail('invalid email', 'test password'),
      ).toBe('メールアドレスが不正です');
    });

    it('should validate weak password', async () => {
      expect(
        await service.createAccountByEmail('test@example.com', 'weak'),
      ).toBe('パスワードが簡単すぎます。8文字以上のパスワードにしてください');
    });
  });

  describe('login by email', () => {
    beforeEach(async () => {
      await deleteAllUsers();
      await service.createAccountByEmail('test@example.com', 'test password');
    });

    it('should login with correct cred', async () => {
      expect(
        typeof (await service.loginByEmail(
          'test@example.com',
          'test password',
        )),
      ).toBe('object');
    });

    it("shouldn't login with wrong email", async () => {
      expect(
        await service.loginByEmail('wrong@example.com', 'test password'),
      ).toBe('メールアドレスまたはパスワードが間違っています');
    });

    it("shouldn't login with wrong password", async () => {
      expect(
        await service.loginByEmail('test@example.com', 'wrong password'),
      ).toBe('メールアドレスまたはパスワードが間違っています');
    });

    afterAll(async () => {
      await deleteAllUsers();
    });
  });

  describe('password reset', () => {
    it('resets password', async () => {
      await service.createAccountByEmail('test@example.com', 'test password');
      expect(await service.resetPassword('test@example.com')).toBe(
        'パスワードリセットメールを送信しました',
      );
      await deleteAllUsers();
    });

    it('resets password (no user)', async () => {
      expect(await service.resetPassword('test@example.com')).toBe(
        'パスワードリセットメールを送信しました',
      );
    });
  });
});
