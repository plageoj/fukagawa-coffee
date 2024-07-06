import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginByEmailComponent } from './login-by-email.component';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';

describe('LoginByEmailComponent', () => {
  let component: LoginByEmailComponent;
  let fixture: ComponentFixture<LoginByEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginByEmailComponent],
      imports: [FirebaseTestingModule],
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
