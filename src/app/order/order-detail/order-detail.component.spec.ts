import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  ActivatedRoute,
  convertToParamMap,
  provideRouter,
} from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { ItemService } from 'src/app/services/item.service';
import { OrderService } from 'src/app/services/order.service';
import { Item } from 'src/models/item.model';
import { Order } from 'src/models/order.model';
import { OrderDetailComponent } from './order-detail.component';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;
  let orderService: OrderService;
  let itemService: ItemService;
  let testOrderId: string;
  let testItemId: string;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirebaseTestingModule, OrderDetailComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: 'test-order-id' }) },
          },
        },
      ],
    }).compileComponents();

    orderService = TestBed.inject(OrderService);
    itemService = TestBed.inject(ItemService);

    // Create test item first
    testItemId = 'test-item-id';
    const testItem: Item = {
      id: testItemId,
      name: 'Test Item',
      total: 100,
      storedCount: {},
      notifyCount: 10,
      notes: 'Test item notes',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    await itemService.store(testItem);

    // Create test order that references the item
    testOrderId = 'test-order-id';
    const testOrder: Order = {
      id: testOrderId,
      customerId: 'test-customer-id',
      customerName: 'Test Customer',
      orderedAt: Timestamp.now(),
      items: [
        {
          id: testItemId,
          name: 'Test Item',
          orderedCount: 2,
        },
      ],
      notes: 'Test order notes',
      isDone: false,
    };
    await orderService.store(testOrder);

    // Update the ActivatedRoute mock with the real order ID
    const activatedRoute = TestBed.inject(ActivatedRoute);
    (activatedRoute.snapshot.paramMap as any) = convertToParamMap({
      id: testOrderId,
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(async () => {
    // Clean up test data from Firebase emulator
    if (testOrderId) {
      await orderService.delete(testOrderId);
    }
    if (testItemId) {
      await itemService.delete(testItemId);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
