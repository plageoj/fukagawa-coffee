import { TestBed } from '@angular/core/testing';

import { StickerService } from './sticker.service';
import { FirebaseTestingModule } from '../firebase-testing.module';

describe('StickerService', () => {
  let service: StickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseTestingModule],
    });
    service = TestBed.inject(StickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
