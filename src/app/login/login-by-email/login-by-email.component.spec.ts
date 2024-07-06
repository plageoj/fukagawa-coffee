import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginByEmailComponent } from './login-by-email.component';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginByEmailComponent', () => {
  let component: LoginByEmailComponent;
  let fixture: ComponentFixture<LoginByEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FirebaseTestingModule,
        LoginByEmailComponent,
        NoopAnimationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginByEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
