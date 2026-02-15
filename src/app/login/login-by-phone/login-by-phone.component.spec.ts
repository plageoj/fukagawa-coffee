import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { FirebaseTestingModule } from 'src/app/firebase-testing.module';
import { LoginByPhoneComponent } from './login-by-phone.component';

describe('LoginByPhoneComponent', () => {
  let component: LoginByPhoneComponent;
  let fixture: ComponentFixture<LoginByPhoneComponent>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
    await TestBed.configureTestingModule({
      imports: [
        LoginByPhoneComponent,
        FirebaseTestingModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: MatSnackBar, useValue: snackBar }],
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

  it('should send confirmation code', async () => {
    component.confirmCode();

    // @ts-expect-error just mock a part of return value
    snackBar.open.and.returnValue({
      afterDismissed: jasmine.createSpy().and.returnValue(of(1)),
    });
    component.phoneNumber = '03123456789';
    await component.sendConfirmation();
    await fixture.whenStable();

    expect(snackBar.open).toHaveBeenCalledWith('確認コードを送信しました。');

    // wrong confirmation code, it should fail.
    // as local emulator does not support acquiring confirmation code...
    component.confirmationCode = 'ABCDEF';

    await expectAsync(component.confirmCode()).toBeRejected();
  });

  it('should catch error when wrong phone number is given', async () => {
    component.phoneNumber = '*';
    await expectAsync(component.sendConfirmation()).toBeRejected();
  });
});
