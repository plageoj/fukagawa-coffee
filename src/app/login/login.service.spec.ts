import { TestBed } from '@angular/core/testing';

import { LoginService } from './login.service';
import { FirebaseTestingModule } from '../firebase-testing.module';
import { environment } from 'src/environments/environment';

describe('LoginService', () => {
  let service: LoginService;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
    });
    service = TestBed.inject(LoginService);

    // delete all users
    await fetch(
      `${environment.firebaseEmulator.authUrl}/emulator/v1/projects/fukagawa-coffee/accounts`,
      {
        method: 'delete',
        headers: {
          authorization: 'Barer owner',
        },
      },
    );
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should create user', async () => {
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
    expect(await service.createAccountByEmail('test@example.com', 'weak')).toBe(
      'パスワードが簡単すぎます。8文字以上のパスワードにしてください。',
    );
  });
});
