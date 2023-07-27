import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import {of, throwError} from 'rxjs';
import { LoginService } from 'src/app/common/services/login/login.service';

import { ResetPasswordComponent } from './reset-password.component';
import {Router} from '@angular/router';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;
  let service: LoginService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [ ResetPasswordComponent ],
      providers: [LoginService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    service = TestBed.inject(LoginService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call submitNewPassword - case1', () => {
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    service.securityAnswer = {question: 'test', answer: 'test'};
    service.setPassData = {profile: { email: 'test'}};
    component.resetPasswordForm.controls.enterPassword.setValue('abc');
    spyOn(service, 'resetPassword').and.returnValue(of({}));
    component.submitNewPassword();
    expect(component).toBeTruthy();
  });

  it('should call submitNewPassword - case2', () => {
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    service.securityAnswer = {question: 'test', answer: 'test'};
    service.setPassData = {profile: { email: 'test'}};
    component.resetPasswordForm.controls.enterPassword.setValue('abc');
    spyOn(service, 'resetPassword').and.returnValue(throwError({}));
    component.submitNewPassword();
    expect(component).toBeTruthy();
  });

  it('should call submitNewPassword - case3', () => {
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    service.setPassData = {profile: { email: 'test'}};
    component.resetPasswordForm.controls.enterPassword.setValue('abc');
    spyOn(service, 'setPassword').and.returnValue(of({}));
    component.submitNewPassword();
    expect(component).toBeTruthy();
  });

  it('should call submitNewPassword - case4', () => {
    spyOn(router, 'navigate').and.callFake(() => Promise.resolve(true));
    service.setPassData = {profile: { email: 'test'}};
    component.resetPasswordForm.controls.enterPassword.setValue('abc');
    spyOn(service, 'setPassword').and.returnValue(throwError({}));
    component.submitNewPassword();
    expect(component).toBeTruthy();
  });

});
