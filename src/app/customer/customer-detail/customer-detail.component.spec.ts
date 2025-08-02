import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatButtonHarness } from '@angular/material/button/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { cold } from 'jasmine-marbles';
import { of } from 'rxjs';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { CustomerService } from 'src/app/services/customer.service';
import { ItemService } from 'src/app/services/item.service';
import { Customer } from 'src/models/customer.model';
import { Item } from 'src/models/item.model';
import { CustomerDetailComponent } from './customer-detail.component';

describe('CustomerDetailComponent', () => {
  let component: CustomerDetailComponent;
  let fixture: ComponentFixture<CustomerDetailComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FirebaseTestingModule,
        CustomerDetailComponent,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'customer', component: CustomerDetailComponent }
        ]),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: 'test-id',
              }),
            },
          },
        },
      ],
    }).compileComponents();

    const customerService = TestBed.inject(CustomerService);
    spyOn(customerService, 'load').and.returnValue(
      cold('c|', {
        c: {
          id: 'test-id',
          name: 'Test Customer',
          address: '123 Main Street',
          items: {
            test: true,
          },
        } as Customer,
      }),
    );

    const itemService = TestBed.inject(ItemService);
    spyOn(itemService, 'list').and.returnValue(
      cold('i|', {
        i: [
          {
            id: 'test',
            name: 'Test Item',
          } as Item,
        ],
      }),
    );
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerDetailComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('associate item', async () => {
    const dialogSpy = (
      spyOn(TestBed.inject(MatDialog), 'open') as jasmine.Spy
    ).and.returnValue({
      afterClosed: () =>
        of({
          id: 'test',
          name: 'Test Item',
        }),
    });
    const button = await loader.getHarness(
      MatButtonHarness.with({ text: /品目を追加する/ }),
    );
    await button.click();

    expect(dialogSpy).toHaveBeenCalled();
  });

  it('edit customer', async () => {
    const dialogSpy = spyOn(
      TestBed.inject(MatDialog),
      'open',
    ).and.callThrough();
    const button = await loader.getHarness(
      MatButtonHarness.with({ text: /編集/ }),
    );
    await button.click();

    expect(dialogSpy).not.toHaveBeenCalled();

    component.customer = {
      id: 'test-id',
      name: 'Test Customer',
      address: '123 Main Street',
      items: {
        test: true,
      },
    };

    fixture.detectChanges();
    await button.click();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('delete customer', async () => {
    const dialogSpy = (
      spyOn(TestBed.inject(MatSnackBar), 'open') as jasmine.Spy
    ).and.returnValue({
      afterDismissed: () => of({ dismissedByAction: false }),
    });
    const button = await loader.getHarness(
      MatButtonHarness.with({ text: /削除/ }),
    );
    await button.click();
    expect(dialogSpy).not.toHaveBeenCalled();
    component.customer = {
      id: 'test-id',
      name: 'Test Customer',
      address: '123 Main Street',
      items: {
        test: true,
      },
    };
    fixture.detectChanges();
    await button.click();
    expect(dialogSpy).toHaveBeenCalled();
  });

  it('delete item', () => {
    component.customer = {
      id: 'test-id',
      name: 'Test Customer',
      address: '123 Main Street',
      items: {
        test: true,
      },
    };
    component.deleteItem('test');
    expect(component.customer?.items).toEqual({});
  });
});
