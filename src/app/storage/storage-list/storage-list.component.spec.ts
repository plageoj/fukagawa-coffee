import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageListComponent } from './storage-list.component';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';

describe('StorageListComponent', () => {
  let component: StorageListComponent;
  let fixture: ComponentFixture<StorageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StorageListComponent, FirebaseTestingModule],
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
});
