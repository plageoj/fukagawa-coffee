import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginByPhoneComponent } from './login-by-phone.component';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginByPhoneComponent', () => {
  let component: LoginByPhoneComponent;
  let fixture: ComponentFixture<LoginByPhoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginByPhoneComponent,
        FirebaseTestingModule,
        NoopAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginByPhoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
