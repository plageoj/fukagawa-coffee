import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSheetComponent } from './order-sheet.component';

describe('OrderSheetComponent', () => {
  let component: OrderSheetComponent;
  let fixture: ComponentFixture<OrderSheetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [OrderSheetComponent]
})
    .compileComponents();
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
