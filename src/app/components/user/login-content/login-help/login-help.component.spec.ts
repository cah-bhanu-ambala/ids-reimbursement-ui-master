import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { asyncScheduler, scheduled, throwError } from 'rxjs';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { LoginService } from 'src/app/common/services/login/login.service';

import { LoginHelpComponent } from './login-help.component';

describe('LoginHelpComponent', () => {
  let component: LoginHelpComponent;
  let fixture: ComponentFixture<LoginHelpComponent>;
  const authService = jasmine.createSpyObj('AuthService', [
    'requestPassReset'
  ]);
  const loginService = jasmine.createSpyObj('LoginService', [
    'toggle'
  ]);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginHelpComponent ],
      imports: [ReactiveFormsModule],
      providers: [
        {provide: AuthService, useValue: authService },
        {provide: LoginService, useValue: loginService }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onSubmit should keep success false', () => {
    component.onSubmit();
    expect(component.success).toBeFalsy();
  });

  it('onSubmit, message should be "Invalid Email"', () => {
    const cntrl = component.loginHelpForm.get('email');
    cntrl.setValue('test');
    component.onSubmit();
    expect(component.message).toEqual('Invalid Email');
  });

  it('valid email should call requestPassReset', () => {
    authService.requestPassReset.and.returnValue(scheduled([{}], asyncScheduler));
    const cntrl = component.loginHelpForm.get('email');
    cntrl.setValue('test@test.com');
    component.onSubmit();
    expect(authService.requestPassReset).toHaveBeenCalled();
  });

  it('requestPassReset should throw error', done => {
    authService.requestPassReset.and.returnValue(throwError({ errorMessage: 'error' }));
    const cntrl = component.loginHelpForm.get('email');
    cntrl.setValue('test@test.com');
    component.onSubmit();
    setTimeout(() => {
      expect(component.message).toEqual('error');
      done();
    }, 100);
  });

  it('onCancelClose should call toggle', () => {
    component.onCancelClose();
    expect(loginService.toggle).toHaveBeenCalled();
  });
});
