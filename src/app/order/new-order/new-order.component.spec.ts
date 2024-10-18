import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { OrderService } from 'src/app/services/order.service';
import { NewOrderComponent } from './new-order.component';
import { CustomerService } from 'src/app/services/customer.service';
import { cold } from 'jasmine-marbles';

describe('NewOrderComponent', () => {
  let component: NewOrderComponent;
  let fixture: ComponentFixture<NewOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewOrderComponent, FirebaseTestingModule, NoopAnimationsModule],
      providers: [provideRouter([])],
    }).compileComponents();

    spyOn(TestBed.inject(CustomerService), 'load').and.returnValue(
      cold('c|', { c: { items: { test: true } } }),
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('add item', () => {
    component.addItem();
    expect(component.items.length).toBe(1);
  });

  it('send order', async () => {
    component.items = [{ name: 'test' }];
    const store = spyOn(TestBed.inject(OrderService), 'store').and.resolveTo();
    component.sendOrder();
    expect(store).toHaveBeenCalled();
  });
});
