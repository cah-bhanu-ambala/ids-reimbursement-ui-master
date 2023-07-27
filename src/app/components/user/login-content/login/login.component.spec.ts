import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/common/services/auth/auth.service';
// import { UserService } from 'src/app/common/services/user/user.service';
import { LoginService } from 'src/app/common/services/login/login.service';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
// import { PRACTICE_USER, SETUP_ADMIN, SUPPORT_ADMIN } from '../../../../common/services/user/user.constants';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
// import { PracticeService } from '../../../../common/services/practice/practice.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const cookieService = jasmine.createSpyObj('CookieService', [
    'check',
    'get',
    'set'
  ]);
  const loginService = jasmine.createSpyObj('LoginService', [
    'toggle'
  ]);
  const userIdleService = {
    startWatching: () => ({}),
    onTimerStart: () => ({ subscribe: () => ({}) }),
    onTimeout: () => ({ subscribe: () => ({}) }),
    resetTimer: () => ({}),
    stopWatching: () => ({})
  };
  const authService = jasmine.createSpyObj('AuthService', [
    'generateApigeeToken',
    'isAuthenticated',
    'setUser',
    'login',
    'hasTokenExpired',
    'clearTokenExpiration',
    'setTokenExpired'
  ]);
  const userService = jasmine.createSpyObj('UserService', [
    'getUserRoles',
    'reApplyRoles',
    'setUser',
    'getUser'
  ]);
  const router = { navigate: jasmine.createSpy('navigate') };
  const practiceService = jasmine.createSpyObj('PracticeService', [
    'getSupportAdminStore'
  ]);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ReactiveFormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: CookieService, useValue: cookieService },
        { provide: LoginService, useValue: loginService },
        { provide: AuthService, useValue: authService },
        // { provide: UserService, useValue: userService },
        { provide: UserIdleService, useValue: userIdleService },
        { provide: Router, useValue: router },
        // { provide: PracticeService, useValue: practiceService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    authService.hasTokenExpired.and.returnValue(true);
  });

  afterEach(() => {
    router.navigate.calls.reset();
  });

//   it('isAuthenticated should be false', () => {
//     cookieService.check.and.returnValue(false);
//     authService.isAuthenticated.and.returnValue(false);
//     spyOn<LoginComponent, any>(component, 'routeUser');
//     expect(component['routeUser']).toHaveBeenCalledTimes(0);
//   });

//   it('should not login', () => {
//     cookieService.check.and.returnValue(true);
//     cookieService.set.and.callFake(() => { });
//     cookieService.get.and.returnValue('yes');
//     authService.isAuthenticated.and.returnValue(false);
//     component.login();
//     expect(component).toBeTruthy();
//   });

//   it('message should be "Invalid username, Password required"', () => {
//     cookieService.check.and.returnValue(true);
//     cookieService.set.and.callFake(() => { });
//     cookieService.get.and.returnValue('no');
//     authService.isAuthenticated.and.returnValue(false);
//     const username = component.loginForm.get('username');
//     username.setValue('test');
//     component.login();
//     expect(component.message).toEqual('Invalid username, Password required');
//   });

//   it('message should be "Password required"', () => {
//     cookieService.check.and.returnValue(false);
//     cookieService.set.and.callFake(() => { });
//     authService.isAuthenticated.and.returnValue(false);
//     const username = component.loginForm.get('username');
//     username.setValue('test@test.com');
//     component.login();
//     expect(component.message).toEqual('Password required');
//   });

//   it('message should be "Username required"', () => {
//     cookieService.check.and.returnValue(false);
//     cookieService.set.and.callFake(() => { });
//     authService.isAuthenticated.and.returnValue(false);
//     const pass = component.loginForm.get('password');
//     pass.setValue('test');
//     component.login();
//     expect(component.message).toEqual('Username required');
//   });

//   it('login should call routeUser, case 1', () => {
//     cookieService.check.and.returnValue(false);
//     cookieService.set.and.callFake(() => { });
//     authService.isAuthenticated.and.returnValue(false);
//     authService.login.and.returnValue(Promise.resolve({ status: 'success' }));
//     spyOn<LoginComponent, any>(component, 'routeUser').and.callFake(() => { });

//     component.loginForm.patchValue({
//       username: 'test@test.com',
//       password: 'test',
//       rememberMe: true
//     });

//     component.login();
//     expect(component).toBeTruthy();
//   });

//   it('login should call routeUser, case 2', () => {
//     cookieService.check.and.returnValue(false);
//     cookieService.set.and.callFake(() => { });
//     authService.isAuthenticated.and.returnValue(false);
//     authService.login.and.returnValue(Promise.resolve({ status: 'success' }));
//     spyOn<LoginComponent, any>(component, 'routeUser').and.callFake(() => { });

//     component.loginForm.patchValue({
//       username: 'test@test.com',
//       password: 'test'
//     });

//     component.login();
//     expect(component).toBeTruthy();
//   });

//   it('login should throw error', done => {
//     cookieService.check.and.returnValue(false);
//     cookieService.set.and.callFake(() => { });
//     authService.isAuthenticated.and.returnValue(false);
//     authService.login.and.returnValue(Promise.reject({ errorMessage: 'error' }));
//     spyOn<LoginComponent, any>(component, 'routeUser').and.callFake(() => { });

//     component.loginForm.patchValue({
//       username: 'test@test.com',
//       password: 'test'
//     });

//     component.login();
//     setTimeout(() => {
//       expect(component.message).toEqual('error');
//       done();
//     }, 100);
//   });

//   describe(`when a user is remembered`, () => {
//     beforeEach(async () => {
//       const testUsername = `jeff@lebowksi.com`;
//       cookieService.check.and.returnValue(true);
//       cookieService.get
//         .withArgs(`remember`).and.returnValue(`yes`)
//         .withArgs(`username`).and.returnValue(testUsername);

//       component.ngOnInit();

//       await fixture.whenStable();
//     });

//     it(`if set should fill in login form`, () => {
//       const testUsername = `jeff@lebowksi.com`;
//       const user = component.loginForm.get('username').value;

//       expect(user).toEqual(testUsername);
//     });
//   });

//   describe(`when a practice user logs in`, () => {
//     it(`route the user to the dashboard`, (done) => {
//       authService.isAuthenticated.and.returnValue(false);
//       authService.login.and.returnValue(Promise.resolve({ status: 'success' }));
//     //   userService.setUser.and.returnValue(Promise.resolve({ status: 'success' }));
//     //   userService.getUser.and.returnValue({ roles: [PRACTICE_USER] });

//       component.loginForm.patchValue({
//         invalid: false,
//         username: 'test@test.com',
//         password: 'test',
//         rememberMe: true
//       });

//       component.login();
//       setTimeout(() => {
//         expect(router.navigate).toHaveBeenCalledWith([`/tracker/dashboard`]);
//         done();
//       }, 100);
//     });
//   });

//   describe(`when a setup admin logs in`, () => {
//     it(`route the user to the practice management`, (done) => {
//       authService.isAuthenticated.and.returnValue(false);
//       authService.login.and.returnValue(Promise.resolve({ status: 'success' }));
//       userService.setUser.and.returnValue(Promise.resolve({ status: 'success' }));
//     //   userService.getUser.and.returnValue({ roles: [{ roleId: SETUP_ADMIN }] });

//       component.loginForm.patchValue({
//         invalid: false,
//         username: 'test@test.com',
//         password: 'test',
//         rememberMe: true
//       });

//       component.login();
//       setTimeout(() => {
//         expect(router.navigate).toHaveBeenCalledWith([`/tracker/dashboard/practice-management`]);
//         done();
//       }, 100);
//     });
//   });

//   describe(`when a support admin logs in`, () => {
//     describe('without a practice saved', () => {
//       it(`route the user to the practice management`, (done) => {
//         authService.isAuthenticated.and.returnValue(false);
//         authService.login.and.returnValue(Promise.resolve({ status: 'success' }));
//         // userService.setUser.and.returnValue(Promise.resolve({ status: 'success' }));
//         // userService.getUser.and.returnValue({ roles: [{ roleId: SUPPORT_ADMIN }] });

//         component.loginForm.patchValue({
//           invalid: false,
//           username: 'test@test.com',
//           password: 'test',
//           rememberMe: true
//         });

//         component.login();
//         setTimeout(() => {
//           expect(router.navigate).toHaveBeenCalledWith([`/tracker/dashboard/practice-management`]);
//           done();
//         }, 100);
//       });
//     });

//     describe('with a practice saved', () => {
//       it(`route the user to the practice dashboard`, (done) => {
//         practiceService.getSupportAdminStore.and.returnValue(jasmine.anything());
//         authService.isAuthenticated.and.returnValue(false);
//         authService.login.and.returnValue(Promise.resolve({ status: 'success' }));
//         // userService.setUser.and.returnValue(Promise.resolve({ status: 'success' }));
//         // userService.getUser.and.returnValue({ roles: [{ roleId: SUPPORT_ADMIN }] });

//         component.loginForm.patchValue({
//           invalid: false,
//           username: 'test@test.com',
//           password: 'test',
//           rememberMe: true
//         });

//         component.login();
//         setTimeout(() => {
//           expect(router.navigate).toHaveBeenCalledWith([`/tracker/dashboard`]);
//           done();
//         }, 100);
//       });
//     });
//   });

//   it('loginHelp should call toggle', () => {
//     cookieService.check.and.returnValue(false);
//     authService.isAuthenticated.and.returnValue(false);
//     component.loginHelp();
//     expect(loginService.toggle).toHaveBeenCalled();
//   });


});
