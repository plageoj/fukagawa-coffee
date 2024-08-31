import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { routes } from './app-routing';
import { FirebaseTestingModule } from './firebase-testing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxWebstorageTestingModule } from './ngx-webstorage-testing.module';

describe('app-routing', () => {
  let harness: RouterTestingHarness;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
      imports: [
        FirebaseTestingModule,
        NgxWebstorageTestingModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();

    harness = await RouterTestingHarness.create();
  });

  it('guards item', async () => {
    await expectAsync(harness.navigateByUrl('item/1')).toBeResolved();
  });

  it('guards customer', async () => {
    await expectAsync(harness.navigateByUrl('customer/1')).toBeResolved();
  });

  it('guards storage', async () => {
    await expectAsync(harness.navigateByUrl('storage')).toBeResolved();
  });

  it('guards member', async () => {
    await expectAsync(harness.navigateByUrl('member')).toBeResolved();
  });

  it('allows order', async () => {
    await expectAsync(harness.navigateByUrl('order/a/new')).toBeResolved();
  });

  it('allows login', async () => {
    await expectAsync(harness.navigateByUrl('login')).toBeResolved();
  });
});
