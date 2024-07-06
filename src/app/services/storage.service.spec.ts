import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { FirebaseTestingModule } from '../firebase-testing.module';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
    });
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
