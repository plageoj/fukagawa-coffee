import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageListComponent } from './storage-list.component';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';
import { of } from 'rxjs';
import { Storage } from 'src/models/storage.model';

describe('StorageListComponent', () => {
  let component: StorageListComponent;
  let fixture: ComponentFixture<StorageListComponent>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let storage: jasmine.SpyObj<StorageService>;

  beforeEach(async () => {
    dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
    storage = jasmine.createSpyObj<StorageService>('StorageService', [
      'list',
      'store',
      'delete',
    ]);
    await TestBed.configureTestingModule({
      imports: [StorageListComponent, FirebaseTestingModule],
      providers: [
        { provide: MatDialog, useValue: dialog },
        { provide: StorageService, useValue: storage },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should store storage', () => {
    // @ts-expect-error returnValue intend to return storage data
    dialog.open.and.returnValue({
      afterClosed: () =>
        of({
          id: 'test',
          description: '',
          name: 'name',
        } as Storage),
    });
    component.editStorage();
    expect(storage.store).toHaveBeenCalled();
  });

  it('should delete storage', () => {
    component.deleteStorage({ id: 'test', name: '', description: '' });
    expect(storage.delete).toHaveBeenCalled();
  });
});
