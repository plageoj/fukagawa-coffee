import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { AssociateItemComponent } from './associate-item.component';

describe('AssociateItemComponent', () => {
  let component: AssociateItemComponent;
  let fixture: ComponentFixture<AssociateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssociateItemComponent, MatDialogModule, FirebaseTestingModule],
      providers: [{ provide: MatDialogRef, useValue: {} }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
