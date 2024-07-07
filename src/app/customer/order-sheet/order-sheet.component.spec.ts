import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSheetComponent } from './order-sheet.component';
import { provideRouter } from '@angular/router';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';

describe('OrderSheetComponent', () => {
  let component: OrderSheetComponent;
  let fixture: ComponentFixture<OrderSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [OrderSheetComponent, FirebaseTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
