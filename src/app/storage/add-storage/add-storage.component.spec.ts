import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStorageComponent } from './add-storage.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

describe('AddStorageComponent', () => {
  let component: AddStorageComponent;
  let fixture: ComponentFixture<AddStorageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStorageComponent, MatDialogModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: MatDialogRef, useValue: {} },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStorageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
