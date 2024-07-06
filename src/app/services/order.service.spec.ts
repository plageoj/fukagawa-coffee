import { TestBed } from '@angular/core/testing';

import { OrderService } from './order.service';
import { FirebaseTestingModule } from '../firebase-testing.module';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
    });
    service = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
