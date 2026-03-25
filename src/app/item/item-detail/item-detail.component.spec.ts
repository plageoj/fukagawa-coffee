import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
  Router,
} from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { ItemService } from 'src/app/services/item.service';
import { StorageService } from 'src/app/services/storage.service';
import { ItemDetailComponent } from './item-detail.component';
import { Item } from 'src/models/item.model';
import { Storage } from 'src/models/storage.model';

describe('ItemDetailComponent', () => {
  let component: ItemDetailComponent;
  let fixture: ComponentFixture<ItemDetailComponent>;
  let itemService: jasmine.SpyObj<ItemService>;
  let storageService: jasmine.SpyObj<StorageService>;

  const testStorageId = 'storage-1';
  const testItemId = 'test-item-id';

  const testItem: Item = {
    id: testItemId,
    name: 'Test Item',
    total: 5,
    storedCount: { [testStorageId]: 5 },
    notifyCount: 2,
    notes: 'some notes',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const testStorages: Storage[] = [
    { id: testStorageId, name: 'Test Storage', description: 'desc' },
  ];

  beforeEach(async () => {
    const itemSpy = jasmine.createSpyObj('ItemService', ['load', 'store', 'delete']);
    const storageSpy = jasmine.createSpyObj('StorageService', ['list']);

    itemSpy.load.and.returnValue(of(testItem));
    storageSpy.list.and.returnValue(of(testStorages));

    await TestBed.configureTestingModule({
      imports: [FirebaseTestingModule, ItemDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: testItemId }) },
          },
        },
        { provide: ItemService, useValue: itemSpy },
        { provide: StorageService, useValue: storageSpy },
      ],
    }).compileComponents();

    itemService = TestBed.inject(ItemService) as jasmine.SpyObj<ItemService>;
    storageService = TestBed.inject(StorageService) as jasmine.SpyObj<StorageService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Prevent ngOnDestroy from calling store
    component.item().id = '';
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load item and storages', () => {
    expect(component.item().name).toBe('Test Item');
    expect(component.storages().length).toBe(1);
  });

  it('storageName should return storage name for known id', () => {
    expect(component.storageName(testStorageId)).toBe('Test Storage');
  });

  it('storageName should return empty string for unknown id', () => {
    expect(component.storageName('unknown')).toBe('');
  });

  it('manipulate should increment stored count and total', () => {
    const totalBefore = component.item().total;
    const controlBefore = component.storedCount.controls[testStorageId].value;
    component.manipulate(testStorageId, 1);
    expect(component.item().total).toBe(totalBefore + 1);
    expect(component.storedCount.controls[testStorageId].value).toBe(controlBefore + 1);
  });

  it('manipulate should not change when control value is negative', () => {
    component.storedCount.controls[testStorageId].setValue(-1);
    const totalBefore = component.item().total;
    component.manipulate(testStorageId, 1);
    expect(component.item().total).toBe(totalBefore);
  });

  it('countTotal should recalculate total from storedCount', () => {
    component.storedCount.controls[testStorageId].setValue(10);
    component.countTotal();
    expect(component.item().total).toBe(10);
  });

  it('ngOnDestroy should store item when id is present', () => {
    component.item().id = testItemId;
    component.ngOnDestroy();
    expect(itemService.store).toHaveBeenCalled();
  });

  it('ngOnDestroy should not store item when id is empty', () => {
    component.item().id = '';
    component.ngOnDestroy();
    expect(itemService.store).not.toHaveBeenCalled();
  });

  it('deleteItem should navigate away', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    component.deleteItem();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });

  it('editItem should open a dialog', () => {
    const dialog = TestBed.inject(MatDialog);
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(undefined),
    } as any);
    component.editItem();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('editItem should update item when dialog returns a value', () => {
    const dialog = TestBed.inject(MatDialog);
    const updatedItem = { ...testItem, name: 'Updated Item' };
    spyOn(dialog, 'open').and.returnValue({
      afterClosed: () => of(updatedItem),
    } as any);
    component.editItem();
    expect(component.item().name).toBe('Updated Item');
  });
});
