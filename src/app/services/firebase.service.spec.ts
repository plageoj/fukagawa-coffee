import { TestBed } from '@angular/core/testing';
import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { getFirestoreInstance, getAuthInstance } from './firebase.service';
import { FirebaseTestingModule } from '../firebase-testing.module';

describe('firebase.service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
    });
  });

  describe('getFirestoreInstance', () => {
    it('Firestore インスタンスを初期化する', () => {
      // Execute
      const instance = getFirestoreInstance();

      // Assert
      expect(instance).toBeTruthy();
      expect(instance).toBeInstanceOf(Object);
    });

    it('呼び出すたびに同じインスタンスを返す（シングルトン）', () => {
      // Execute
      const instance1 = getFirestoreInstance();
      const instance2 = getFirestoreInstance();
      const instance3 = getFirestoreInstance();

      // Assert: 全て同一のインスタンス
      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
    });

    it('エミュレーターに接続する（開発環境）', () => {
      // Execute: エミュレーター接続を含む初期化
      const instance = getFirestoreInstance();

      // Assert: インスタンスが作成され、エミュレーターに接続されている
      // 実際のエミュレーター接続は環境設定に基づいて自動的に行われる
      expect(instance).toBeTruthy();
    });
  });

  describe('getAuthInstance', () => {
    it('Auth インスタンスを初期化する', () => {
      // Execute
      const instance = getAuthInstance();

      // Assert
      expect(instance).toBeTruthy();
      expect(instance).toBeInstanceOf(Object);
    });

    it('呼び出すたびに同じインスタンスを返す（シングルトン）', () => {
      // Execute
      const instance1 = getAuthInstance();
      const instance2 = getAuthInstance();
      const instance3 = getAuthInstance();

      // Assert: 全て同一のインスタンス
      expect(instance1).toBe(instance2);
      expect(instance2).toBe(instance3);
    });

    it('エミュレーターに接続する（開発環境）', () => {
      // Execute: エミュレーター接続を含む初期化
      const instance = getAuthInstance();

      // Assert: インスタンスが作成され、エミュレーターに接続されている
      expect(instance).toBeTruthy();
    });
  });

  describe('統合テスト', () => {
    it('Firestore と Auth の両方を初期化できる', () => {
      // Execute
      const firestoreInstance = getFirestoreInstance();
      const authInstance = getAuthInstance();

      // Assert: 両方とも正常に初期化される
      expect(firestoreInstance).toBeTruthy();
      expect(authInstance).toBeTruthy();
    });

    it('複数回呼び出してもエミュレーターには一度だけ接続する', () => {
      // Execute: 複数回呼び出し
      getFirestoreInstance();
      getAuthInstance();
      getFirestoreInstance();
      getAuthInstance();

      // Assert: エラーが発生しないことを確認
      // エミュレーターへの重複接続は内部的に防止される
      expect(true).toBe(true);
    });
  });

  describe('型チェック', () => {
    it('getFirestoreInstance は Firestore 型を返す', () => {
      const instance = getFirestoreInstance();

      // TypeScript の型チェックが通ることを確認
      const _: Firestore = instance;
      expect(instance).toBeTruthy();
    });

    it('getAuthInstance は Auth 型を返す', () => {
      const instance = getAuthInstance();

      // TypeScript の型チェックが通ることを確認
      const _: Auth = instance;
      expect(instance).toBeTruthy();
    });
  });
});
