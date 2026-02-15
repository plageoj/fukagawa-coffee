import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, UrlTree } from '@angular/router';
import { provideRouter } from '@angular/router';
import { signInAnonymously, signOut } from 'firebase/auth';
import { firstValueFrom } from 'rxjs';
import { FirebaseTestingModule } from '../firebase-testing.module';
import { getAuthInstance } from '../services/firebase.service';
import {
  authGuard,
  redirectUnauthorizedTo,
  redirectLoggedInTo,
} from './auth.guard';

describe('authGuard', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
      providers: [provideRouter([])],
    });
    router = TestBed.inject(Router);
  });

  afterEach(async () => {
    const auth = getAuthInstance();
    await signOut(auth);
  });

  describe('default behavior (no authGuardPipe)', () => {
    it('認証済みユーザーは true を返す', async () => {
      // Setup: ユーザーをサインイン
      const auth = getAuthInstance();
      await signInAnonymously(auth);

      // Execute: authGuard を呼び出し
      const route = { data: {} } as unknown as ActivatedRouteSnapshot;
      const result = await TestBed.runInInjectionContext(async () => {
        const guardResult = authGuard(route, {} as any);
        return await firstValueFrom(guardResult as any);
      });

      // Assert: true が返される
      expect(result).toBe(true);
    });

    it('未認証ユーザーは false を返す', async () => {
      // Setup: ユーザーをサインアウト（初期状態）
      const auth = getAuthInstance();
      await signOut(auth);

      // Execute: authGuard を呼び出し
      const route = { data: {} } as unknown as ActivatedRouteSnapshot;
      const result = await TestBed.runInInjectionContext(async () => {
        const guardResult = authGuard(route, {} as any);
        return await firstValueFrom(guardResult as any);
      });

      // Assert: false が返される
      expect(result).toBe(false);
    });
  });

  describe('with authGuardPipe', () => {
    it('authGuardPipe が指定された場合はカスタムロジックが実行される（認証済み）', async () => {
      // Setup: カスタム authGuardPipe を作成
      const customPipe = () => (user: any) => {
        return user ? true : false;
      };

      // ユーザーをサインイン
      const auth = getAuthInstance();
      await signInAnonymously(auth);

      // Execute: authGuard を呼び出し
      const route = {
        data: { authGuardPipe: customPipe },
      } as unknown as ActivatedRouteSnapshot;
      const result = await TestBed.runInInjectionContext(async () => {
        const guardResult = authGuard(route, {} as any);
        return await firstValueFrom(guardResult as any);
      });

      // Assert: カスタムロジックの結果が返される
      expect(result).toBe(true);
    });

    it('authGuardPipe が指定された場合はカスタムロジックが実行される（未認証）', async () => {
      // Setup: カスタム authGuardPipe を作成
      const customPipe = () => (user: any) => {
        return user ? true : false;
      };

      // ユーザーをサインアウト
      const auth = getAuthInstance();
      await signOut(auth);

      // Execute: authGuard を呼び出し
      const route = {
        data: { authGuardPipe: customPipe },
      } as unknown as ActivatedRouteSnapshot;
      const result = await TestBed.runInInjectionContext(async () => {
        const guardResult = authGuard(route, {} as any);
        return await firstValueFrom(guardResult as any);
      });

      // Assert: カスタムロジックの結果が返される
      expect(result).toBe(false);
    });

    it('authGuardPipe が UrlTree を返す場合は正しく処理される', async () => {
      // Setup: UrlTree を返す authGuardPipe を作成
      const customPipe = () => (user: any) => {
        if (user) return true;
        return router.createUrlTree(['/custom-redirect']);
      };

      // ユーザーをサインアウト
      const auth = getAuthInstance();
      await signOut(auth);

      // Execute: authGuard を呼び出し
      const route = {
        data: { authGuardPipe: customPipe },
      } as unknown as ActivatedRouteSnapshot;
      const result = await TestBed.runInInjectionContext(async () => {
        const guardResult = authGuard(route, {} as any);
        return await firstValueFrom(guardResult as any);
      });

      // Assert: UrlTree が返される
      expect(result).toBeInstanceOf(UrlTree);
      expect((result as UrlTree).toString()).toBe('/custom-redirect');
    });
  });

  describe('Observable behavior', () => {
    it('Observable は complete される', (done) => {
      // Setup
      const auth = getAuthInstance();
      signOut(auth).then(() => {
        TestBed.runInInjectionContext(() => {
          const route = { data: {} } as unknown as ActivatedRouteSnapshot;
          const guardResult = authGuard(route, {} as any);

          // Execute & Assert: complete が呼ばれることを確認
          (guardResult as any).subscribe({
            next: () => {},
            complete: () => {
              expect(true).toBe(true);
              done();
            },
          });
        });
      });
    });

    it('unsubscribe しても問題なく動作する', async () => {
      // Setup
      const auth = getAuthInstance();
      await signOut(auth);

      TestBed.runInInjectionContext(() => {
        const route = { data: {} } as unknown as ActivatedRouteSnapshot;
        const guardResult = authGuard(route, {} as any);

        // Execute: すぐに unsubscribe
        const subscription = (guardResult as any).subscribe();
        subscription.unsubscribe();

        // Assert: エラーが発生しないことを確認（正常終了）
        expect(true).toBe(true);
      });
    });
  });
});

describe('redirectUnauthorizedTo', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
      providers: [provideRouter([])],
    });
    router = TestBed.inject(Router);
  });

  it('認証済みユーザーは true を返す', () => {
    // Setup: ユーザー情報をモック
    const mockUser = { uid: 'test-uid' } as any;

    // Execute: redirectUnauthorizedTo を呼び出し
    const result = TestBed.runInInjectionContext(() => {
      const pipeGenerator = redirectUnauthorizedTo('/login');
      const pipe = pipeGenerator();
      return pipe(mockUser);
    });

    // Assert: true が返される
    expect(result).toBe(true);
  });

  it('未認証ユーザーは指定パスへの UrlTree を返す', () => {
    // Setup: ユーザー null
    const mockUser = null;

    // Execute: redirectUnauthorizedTo を呼び出し
    const result = TestBed.runInInjectionContext(() => {
      const pipeGenerator = redirectUnauthorizedTo('/login');
      const pipe = pipeGenerator();
      return pipe(mockUser);
    });

    // Assert: UrlTree が返される
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/login');
  });

  it('異なるリダイレクトパスを指定できる', () => {
    // Setup: ユーザー null
    const mockUser = null;

    // Execute: カスタムパスを指定
    const result = TestBed.runInInjectionContext(() => {
      const pipeGenerator = redirectUnauthorizedTo('/custom-login');
      const pipe = pipeGenerator();
      return pipe(mockUser);
    });

    // Assert: 指定したパスの UrlTree が返される
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/custom-login');
  });
});

describe('redirectLoggedInTo', () => {
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
      providers: [provideRouter([])],
    });
    router = TestBed.inject(Router);
  });

  it('未認証ユーザーは true を返す', () => {
    // Setup: ユーザー null
    const mockUser = null;

    // Execute: redirectLoggedInTo を呼び出し
    const result = TestBed.runInInjectionContext(() => {
      const pipeGenerator = redirectLoggedInTo('/');
      const pipe = pipeGenerator();
      return pipe(mockUser);
    });

    // Assert: true が返される
    expect(result).toBe(true);
  });

  it('認証済みユーザーは指定パスへの UrlTree を返す', () => {
    // Setup: ユーザー情報をモック
    const mockUser = { uid: 'test-uid' } as any;

    // Execute: redirectLoggedInTo を呼び出し
    const result = TestBed.runInInjectionContext(() => {
      const pipeGenerator = redirectLoggedInTo('/');
      const pipe = pipeGenerator();
      return pipe(mockUser);
    });

    // Assert: UrlTree が返される
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/');
  });

  it('異なるリダイレクトパスを指定できる', () => {
    // Setup: ユーザー情報をモック
    const mockUser = { uid: 'test-uid' } as any;

    // Execute: カスタムパスを指定
    const result = TestBed.runInInjectionContext(() => {
      const pipeGenerator = redirectLoggedInTo('/dashboard');
      const pipe = pipeGenerator();
      return pipe(mockUser);
    });

    // Assert: 指定したパスの UrlTree が返される
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/dashboard');
  });
});
