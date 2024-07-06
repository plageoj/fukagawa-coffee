import { TestBed } from '@angular/core/testing';

import { CustomerService } from './customer.service';
import { FirebaseTestingModule } from '../firebase-testing.module';

describe('CustomerService', () => {
  let service: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
    });
    service = TestBed.inject(CustomerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
