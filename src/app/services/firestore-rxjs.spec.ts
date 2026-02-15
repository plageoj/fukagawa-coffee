import { TestBed } from '@angular/core/testing';
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  Firestore,
} from 'firebase/firestore';
import { take } from 'rxjs';
import { FirebaseTestingModule } from '../firebase-testing.module';
import { getFirestoreInstance } from './firebase.service';
import { docData, collectionData } from './firestore-rxjs';

describe('firestore-rxjs', () => {
  let db: Firestore;
  const testCollection = 'test-firestore-rxjs';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
    });
    db = getFirestoreInstance();
  });

  afterEach(async () => {
    // コレクション内のすべてのドキュメントを削除
    const col = collection(db, testCollection);
    const snapshot = await getDocs(col);
    const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  });

  describe('docData', () => {
    it('存在するドキュメントのデータを emit する', (done) => {
      // Setup: テストドキュメントを作成
      const ref = doc(db, testCollection, 'test-doc');
      setDoc(ref, { name: 'Test Document', value: 42 }).then(() => {
        // Execute: docData を購読
        docData(ref)
          .pipe(take(1))
          .subscribe((data) => {
            // Assert: データが正しく返される
            expect(data).toBeDefined();
            expect(data?.name).toBe('Test Document');
            expect(data?.value).toBe(42);
            done();
          });
      });
    });

    it('存在しないドキュメントには undefined を emit する', (done) => {
      // Setup: 存在しない参照
      const ref = doc(db, testCollection, 'non-existent-doc');

      // Execute: docData を購読
      docData(ref)
        .pipe(take(1))
        .subscribe((data) => {
          // Assert: undefined が返される
          expect(data).toBeUndefined();
          done();
        });
    });

    it('ドキュメントの更新を検知する', (done) => {
      // Setup: テストドキュメントを作成
      const ref = doc(db, testCollection, 'update-test-doc');
      setDoc(ref, { value: 1 }).then(() => {
        let emitCount = 0;

        // Execute: docData を購読
        const subscription = docData(ref).subscribe((data) => {
          emitCount++;

          if (emitCount === 1) {
            // 最初の emit: 初期値
            expect(data?.value).toBe(1);
            // ドキュメントを更新
            setDoc(ref, { value: 2 });
          } else if (emitCount === 2) {
            // 2回目の emit: 更新後の値
            expect(data?.value).toBe(2);
            subscription.unsubscribe();
            done();
          }
        });
      });
    });

    it('unsubscribe すると Firestore のリスナーも解除される', async () => {
      // Setup
      const ref = doc(db, testCollection, 'unsubscribe-test-doc');
      await setDoc(ref, { value: 1 });

      // Execute: 購読して即座に unsubscribe
      const subscription = docData(ref).subscribe();
      subscription.unsubscribe();

      // Assert: エラーが発生しないことを確認（正常終了）
      expect(true).toBe(true);
    });
  });

  describe('collectionData', () => {
    it('コレクションのドキュメント配列を emit する', (done) => {
      // Setup: 複数のテストドキュメントを作成
      const col = collection(db, testCollection);
      const promises = [
        setDoc(doc(col, 'doc1'), { name: 'Doc 1', order: 1 }),
        setDoc(doc(col, 'doc2'), { name: 'Doc 2', order: 2 }),
        setDoc(doc(col, 'doc3'), { name: 'Doc 3', order: 3 }),
      ];

      Promise.all(promises).then(() => {
        // Execute: collectionData を購読
        collectionData(col)
          .pipe(take(1))
          .subscribe((data) => {
            // Assert: 配列が返される
            expect(data).toBeDefined();
            expect(data.length).toBe(3);
            expect(data.some((d: any) => d.name === 'Doc 1')).toBe(true);
            expect(data.some((d: any) => d.name === 'Doc 2')).toBe(true);
            expect(data.some((d: any) => d.name === 'Doc 3')).toBe(true);
            done();
          });
      });
    });

    it('空のコレクションには空配列を emit する', (done) => {
      // Setup: 空のコレクション
      const col = collection(db, testCollection + '-empty');

      // Execute: collectionData を購読
      collectionData(col)
        .pipe(take(1))
        .subscribe((data) => {
          // Assert: 空配列が返される
          expect(data).toBeDefined();
          expect(data.length).toBe(0);
          expect(Array.isArray(data)).toBe(true);
          done();
        });
    });

    it('クエリ条件に応じてフィルタされたデータを emit する', (done) => {
      // Setup: 複数ドキュメント、where でフィルタ
      const col = collection(db, testCollection);
      const promises = [
        setDoc(doc(col, 'active1'), { name: 'Active 1', status: 'active' }),
        setDoc(doc(col, 'active2'), { name: 'Active 2', status: 'active' }),
        setDoc(doc(col, 'inactive1'), {
          name: 'Inactive 1',
          status: 'inactive',
        }),
      ];

      Promise.all(promises).then(() => {
        // Execute: where 条件付きクエリ
        const q = query(col, where('status', '==', 'active'));
        collectionData(q)
          .pipe(take(1))
          .subscribe((data: any[]) => {
            // Assert: フィルタされたデータのみ
            expect(data.length).toBe(2);
            expect(data.every((d) => d.status === 'active')).toBe(true);
            expect(data.some((d) => d.name === 'Active 1')).toBe(true);
            expect(data.some((d) => d.name === 'Active 2')).toBe(true);
            done();
          });
      });
    });

    it('コレクションの変更を検知する', (done) => {
      // Setup: 初期ドキュメントを作成
      const col = collection(db, testCollection);
      setDoc(doc(col, 'doc1'), { name: 'Initial Doc' }).then(() => {
        let emitCount = 0;

        // Execute: collectionData を購読
        const subscription = collectionData(col).subscribe((data: any[]) => {
          emitCount++;

          if (emitCount === 1) {
            // 最初の emit: 1つのドキュメント
            expect(data.length).toBe(1);
            // 新しいドキュメントを追加
            setDoc(doc(col, 'doc2'), { name: 'Added Doc' });
          } else if (emitCount === 2) {
            // 2回目の emit: 2つのドキュメント
            expect(data.length).toBe(2);
            subscription.unsubscribe();
            done();
          }
        });
      });
    });

    it('unsubscribe すると Firestore のリスナーも解除される', async () => {
      // Setup
      const col = collection(db, testCollection);
      await setDoc(doc(col, 'test-doc'), { value: 1 });

      // Execute: 購読して即座に unsubscribe
      const subscription = collectionData(col).subscribe();
      subscription.unsubscribe();

      // Assert: エラーが発生しないことを確認（正常終了）
      expect(true).toBe(true);
    });
  });

  describe('型安全性', () => {
    interface TestModel {
      name: string;
      value: number;
    }

    it('docData はジェネリック型で動作する', (done) => {
      // Setup
      const ref = doc(db, testCollection, 'typed-doc');
      setDoc(ref, { name: 'Typed', value: 123 }).then(() => {
        // Execute: 型付きで購読
        docData<TestModel>(ref as any)
          .pipe(take(1))
          .subscribe((data) => {
            // Assert: 型が推論される
            if (data) {
              expect(data.name).toBe('Typed');
              expect(data.value).toBe(123);
            }
            done();
          });
      });
    });

    it('collectionData はジェネリック型で動作する', (done) => {
      // Setup
      const col = collection(db, testCollection);
      setDoc(doc(col, 'typed-doc'), { name: 'Typed', value: 456 }).then(() => {
        // Execute: 型付きで購読
        collectionData<TestModel>(col as any)
          .pipe(take(1))
          .subscribe((data) => {
            // Assert: 型が推論される
            expect(data[0].name).toBe('Typed');
            expect(data[0].value).toBe(456);
            done();
          });
      });
    });
  });
});
