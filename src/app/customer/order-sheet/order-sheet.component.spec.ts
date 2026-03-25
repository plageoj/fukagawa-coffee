import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSheetComponent } from './order-sheet.component';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { CustomerService } from 'src/app/services/customer.service';
import { ItemService } from 'src/app/services/item.service';
import { Customer } from 'src/models/customer.model';
import { Item } from 'src/models/item.model';
import { Timestamp } from 'firebase/firestore';

describe('OrderSheetComponent', () => {
  let component: OrderSheetComponent;
  let fixture: ComponentFixture<OrderSheetComponent>;

  const testCustomerId = 'test-customer-id';
  const testItemId = 'test-item-1';

  const testCustomer: Customer = {
    id: testCustomerId,
    name: 'Test Customer',
    address: '123 Test St',
    items: { [testItemId]: true },
  };

  const testItems: Item[] = [
    {
      id: testItemId,
      name: 'Test Item',
      total: 10,
      storedCount: {},
      notifyCount: 5,
      notes: '',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  ];

  beforeEach(async () => {
    const customerSpy = jasmine.createSpyObj('CustomerService', ['load']);
    const itemSpy = jasmine.createSpyObj('ItemService', ['list']);

    customerSpy.load.and.returnValue(of(testCustomer));
    itemSpy.list.and.returnValue(of(testItems));

    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: convertToParamMap({ id: testCustomerId }) },
          },
        },
        { provide: CustomerService, useValue: customerSpy },
        { provide: ItemService, useValue: itemSpy },
      ],
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

  it('should load customer and items', () => {
    expect(component.customer()?.name).toBe('Test Customer');
    expect(component.items().length).toBe(10);
  });

  it('should set orderAddress and qrCodeAddress', () => {
    expect(component.orderAddress()).toContain(`/order/${testCustomerId}/new`);
    expect(component.qrCodeAddress()).toContain('api.qrserver.com');
  });

  it('should pad items to 10 entries', () => {
    expect(component.items().length).toBe(10);
    expect(component.items()[0].name).toBe('Test Item');
  });

  it('print should call window.print', () => {
    spyOn(window, 'print');
    component.print();
    expect(window.print).toHaveBeenCalled();
  });

  it('ngOnInit should set up qrcode load listener', () => {
    spyOn(document, 'getElementById').and.returnValue({
      addEventListener: jasmine.createSpy('addEventListener'),
    } as any);
    component.ngOnInit();
    expect(document.getElementById).toHaveBeenCalledWith('qrcode');
  });
});
