import { TestBed } from '@angular/core/testing';
import {
  collection,
  getDocs,
  deleteDoc,
  where,
  Firestore,
} from 'firebase/firestore';
import { take, firstValueFrom } from 'rxjs';
import { FirebaseTestingModule } from '../firebase-testing.module';
import { getFirestoreInstance } from './firebase.service';
import { FirestoreBase } from './firestoreBase';

interface TestModel {
  id: string;
  name: string;
  status?: string;
  value?: number;
}

describe('FirestoreBase', () => {
  let db: Firestore;
  let service: FirestoreBase<TestModel>;
  const testPath = 'test-firestore-base';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
    });
    db = getFirestoreInstance();
    service = new FirestoreBase<TestModel>(db, testPath);
  });

  afterEach(async () => {
    // コレクション内のすべてのドキュメントを削除
    const col = collection(db, testPath);
    const snapshot = await getDocs(col);
    const deletePromises = snapshot.docs.map((d) => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  });

  describe('list', () => {
    it('制約なしですべてのドキュメントを返す', async () => {
      // Setup: 複数ドキュメント作成
      await service.store({ id: '1', name: 'Item 1' });
      await service.store({ id: '2', name: 'Item 2' });
      await service.store({ id: '3', name: 'Item 3' });

      // Execute
      const items = await firstValueFrom(service.list().pipe(take(1)));

      // Assert
      expect(items.length).toBe(3);
      expect(items.some((item) => item.name === 'Item 1')).toBe(true);
      expect(items.some((item) => item.name === 'Item 2')).toBe(true);
      expect(items.some((item) => item.name === 'Item 3')).toBe(true);
    });

    it('where 制約でフィルタされたドキュメントを返す', async () => {
      // Setup
      await service.store({ id: '1', name: 'Item 1', status: 'active' });
      await service.store({ id: '2', name: 'Item 2', status: 'active' });
      await service.store({ id: '3', name: 'Item 3', status: 'inactive' });

      // Execute: where 制約を指定
      const items = await firstValueFrom(
        service.list(where('status', '==', 'active')).pipe(take(1)),
      );

      // Assert
      expect(items.length).toBe(2);
      expect(items.every((item) => item.status === 'active')).toBe(true);
      expect(items.some((item) => item.name === 'Item 1')).toBe(true);
      expect(items.some((item) => item.name === 'Item 2')).toBe(true);
    });

    it('空のコレクションには空配列を返す', async () => {
      // Execute: 何もデータがない状態で呼び出し
      const items = await firstValueFrom(service.list().pipe(take(1)));

      // Assert
      expect(items).toEqual([]);
      expect(items.length).toBe(0);
    });

    it('リアルタイムで変更を検知する', (done) => {
      // Setup: 初期ドキュメントを作成
      service.store({ id: 'initial', name: 'Initial' }).then(() => {
        let emitCount = 0;

        // Execute: list を購読
        const subscription = service.list().subscribe((items) => {
          emitCount++;

          if (emitCount === 1) {
            // 最初の emit: 1つのアイテム
            expect(items.length).toBe(1);
            // 新しいドキュメントを追加
            service.store({ id: 'added', name: 'Added' });
          } else if (emitCount === 2) {
            // 2回目の emit: 2つのアイテム
            expect(items.length).toBe(2);
            subscription.unsubscribe();
            done();
          }
        });
      });
    });
  });

  describe('load', () => {
    it('指定した ID のドキュメントを返す', async () => {
      // Setup
      await service.store({ id: 'test-id', name: 'Test Item', value: 42 });

      // Execute
      const item = await firstValueFrom(service.load('test-id').pipe(take(1)));

      // Assert
      expect(item).toBeDefined();
      expect(item?.name).toBe('Test Item');
      expect(item?.value).toBe(42);
    });

    it('存在しない ID には undefined を返す', async () => {
      // Execute
      const item = await firstValueFrom(
        service.load('non-existent').pipe(take(1)),
      );

      // Assert
      expect(item).toBeUndefined();
    });

    it('リアルタイムで更新を検知する', (done) => {
      // Setup
      service.store({ id: 'update-test', name: 'Original', value: 1 }).then(() => {
        let emitCount = 0;

        // Execute: load を購読
        const subscription = service.load('update-test').subscribe((item) => {
          emitCount++;

          if (emitCount === 1) {
            // 最初の emit: 元の値
            expect(item?.value).toBe(1);
            // ドキュメントを更新
            service.store({ id: 'update-test', name: 'Updated', value: 2 });
          } else if (emitCount === 2) {
            // 2回目の emit: 更新後の値
            expect(item?.value).toBe(2);
            subscription.unsubscribe();
            done();
          }
        });
      });
    });
  });

  describe('store', () => {
    it('新しいドキュメントを作成する', async () => {
      // Execute
      await service.store({ id: 'new-id', name: 'New Item' });

      // Assert: 作成されたことを確認
      const item = await firstValueFrom(service.load('new-id').pipe(take(1)));
      expect(item?.name).toBe('New Item');
    });

    it('既存のドキュメントをマージする', async () => {
      // Setup
      await service.store({
        id: 'merge-id',
        name: 'Original',
        status: 'active',
        value: 100,
      });

      // Execute: name と value だけを更新
      await service.store({ id: 'merge-id', name: 'Updated', value: 200 });

      // Assert: status はそのまま残る（マージ動作）
      const item = await firstValueFrom(service.load('merge-id').pipe(take(1)));
      expect(item?.name).toBe('Updated');
      expect(item?.value).toBe(200);
      expect(item?.status).toBe('active'); // マージなので残る
    });

    it('Promise を返して完了を待てる', async () => {
      // Execute: await できる
      await service.store({ id: 'promise-test', name: 'Promise Test' });

      // Assert: ドキュメントが作成されていることを確認
      const item = await firstValueFrom(
        service.load('promise-test').pipe(take(1)),
      );
      expect(item?.name).toBe('Promise Test');
    });
  });

  describe('overwrite', () => {
    it('ドキュメント全体を置き換える', async () => {
      // Setup
      await service.store({
        id: 'overwrite-id',
        name: 'Original',
        status: 'active',
        value: 100,
      });

      // Execute: name だけで上書き
      await service.overwrite({ id: 'overwrite-id', name: 'Replaced' });

      // Assert: status と value は削除される（上書き動作）
      const item = await firstValueFrom(
        service.load('overwrite-id').pipe(take(1)),
      );
      expect(item?.name).toBe('Replaced');
      expect(item?.status).toBeUndefined(); // 上書きなので消える
      expect(item?.value).toBeUndefined(); // 上書きなので消える
    });

    it('store との違いを確認する', async () => {
      // Setup: 同じ初期データ
      await service.store({ id: 'test-store', name: 'A', status: 'active' });
      await service.store({
        id: 'test-overwrite',
        name: 'B',
        status: 'active',
      });

      // Execute: store でマージ、overwrite で上書き
      await service.store({ id: 'test-store', name: 'A Updated' });
      await service.overwrite({ id: 'test-overwrite', name: 'B Updated' });

      // Assert: 違いを確認
      const storeItem = await firstValueFrom(
        service.load('test-store').pipe(take(1)),
      );
      const overwriteItem = await firstValueFrom(
        service.load('test-overwrite').pipe(take(1)),
      );

      expect(storeItem?.status).toBe('active'); // store: status が残る
      expect(overwriteItem?.status).toBeUndefined(); // overwrite: status が消える
    });
  });

  describe('delete', () => {
    it('指定した ID のドキュメントを削除する', async () => {
      // Setup
      await service.store({ id: 'delete-id', name: 'To Delete' });
      const beforeDelete = await firstValueFrom(
        service.load('delete-id').pipe(take(1)),
      );
      expect(beforeDelete).toBeDefined();

      // Execute
      await service.delete('delete-id');

      // Assert: 削除されたことを確認
      const afterDelete = await firstValueFrom(
        service.load('delete-id').pipe(take(1)),
      );
      expect(afterDelete).toBeUndefined();
    });

    it('存在しないドキュメントを削除してもエラーにならない', async () => {
      // Execute: エラーが発生しない
      await service.delete('non-existent-id');

      // Assert: 正常終了
      expect(true).toBe(true);
    });

    it('Promise を返して完了を待てる', async () => {
      // Setup
      await service.store({ id: 'delete-promise-test', name: 'Test' });

      // Execute: await できる
      await service.delete('delete-promise-test');

      // Assert: ドキュメントが削除されている
      const item = await firstValueFrom(
        service.load('delete-promise-test').pipe(take(1)),
      );
      expect(item).toBeUndefined();
    });
  });

  describe('id', () => {
    it('新しいドキュメント ID を生成する', () => {
      // Execute
      const id1 = service.id;
      const id2 = service.id;
      const id3 = service.id;

      // Assert: 異なる ID が生成される
      expect(id1).toBeTruthy();
      expect(id2).toBeTruthy();
      expect(id3).toBeTruthy();
      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    it('生成された ID は文字列である', () => {
      // Execute
      const id = service.id;

      // Assert
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });

    it('生成された ID をドキュメント作成に使用できる', async () => {
      // Execute
      const newId = service.id;
      await service.store({ id: newId, name: 'Generated ID Test' });

      // Assert: ドキュメントが作成されている
      const item = await firstValueFrom(service.load(newId).pipe(take(1)));
      expect(item).toBeDefined();
      expect(item?.name).toBe('Generated ID Test');
    });
  });

  describe('統合テスト', () => {
    it('CRUD 操作のフルサイクル', async () => {
      // Create
      const newId = service.id;
      await service.store({ id: newId, name: 'Full Cycle', value: 1 });

      // Read
      let item = await firstValueFrom(service.load(newId).pipe(take(1)));
      expect(item?.name).toBe('Full Cycle');
      expect(item?.value).toBe(1);

      // Update (store - merge)
      await service.store({ id: newId, value: 2 } as any);
      item = await firstValueFrom(service.load(newId).pipe(take(1)));
      expect(item?.name).toBe('Full Cycle'); // name は残る
      expect(item?.value).toBe(2);

      // Update (overwrite)
      await service.overwrite({ id: newId, name: 'Overwritten' });
      item = await firstValueFrom(service.load(newId).pipe(take(1)));
      expect(item?.name).toBe('Overwritten');
      expect(item?.value).toBeUndefined(); // value は消える

      // Delete
      await service.delete(newId);
      item = await firstValueFrom(service.load(newId).pipe(take(1)));
      expect(item).toBeUndefined();
    });

    it('複数のドキュメントを同時に操作できる', async () => {
      // Setup: 複数のドキュメントを作成
      const promises = [
        service.store({ id: '1', name: 'Item 1' }),
        service.store({ id: '2', name: 'Item 2' }),
        service.store({ id: '3', name: 'Item 3' }),
      ];
      await Promise.all(promises);

      // Execute: リストを取得
      const items = await firstValueFrom(service.list().pipe(take(1)));

      // Assert
      expect(items.length).toBe(3);
    });
  });
});
