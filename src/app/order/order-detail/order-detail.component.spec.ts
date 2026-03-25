import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
  Router,
} from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { of } from 'rxjs';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { Item } from 'src/models/item.model';
import { Order } from 'src/models/order.model';
import { OrderDetailComponent } from './order-detail.component';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;
  let orderService: jasmine.SpyObj<OrderService>;

  const testItemId = 'test-item-id';
  const testOrderId = 'test-order-id';

  const testItem: Item = {
    id: testItemId,
    name: 'Test Item',
    total: 100,
    storedCount: {},
    notifyCount: 10,
    notes: '',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const testOrder: Order = {
    id: testOrderId,
    customerId: 'test-customer-id',
    customerName: 'Test Customer',
    orderedAt: Timestamp.now(),
    items: [{ id: testItemId, name: 'Test Item', orderedCount: 2 }],
    notes: 'Test order',
    isDone: false,
  };

  beforeEach(async () => {
    const orderSpy = jasmine.createSpyObj('OrderService', ['load', 'store']);
    const itemSpy = jasmine.createSpyObj('ItemService', ['list']);

    orderSpy.load.and.returnValue(of(testOrder));
    itemSpy.list.and.returnValue(of([testItem]));

    await TestBed.configureTestingModule({
      imports: [FirebaseTestingModule, OrderDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: testOrderId }) },
          },
        },
        { provide: OrderService, useValue: orderSpy },
        { provide: ItemService, useValue: itemSpy },
      ],
    }).compileComponents();

    orderService = TestBed.inject(OrderService) as jasmine.SpyObj<OrderService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load order and item list', () => {
    expect(component.order()?.customerName).toBe('Test Customer');
    expect(component.itemList()[testItemId]?.name).toBe('Test Item');
  });

  it('markAsDone should store order and navigate', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    component.markAsDone();
    expect(orderService.store).toHaveBeenCalled();
    expect(component.order()?.isDone).toBeTrue();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/order');
  });

  it('markAsDone should do nothing when order is undefined', () => {
    component.order.set(undefined);
    component.markAsDone();
    expect(orderService.store).not.toHaveBeenCalled();
  });
});
