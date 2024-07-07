import { TestBed } from '@angular/core/testing';

import { ItemService } from './item.service';
import { FirebaseTestingModule } from '../firebase-testing.module';

describe('ItemService', () => {
  let service: ItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
    });
    service = TestBed.inject(ItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
