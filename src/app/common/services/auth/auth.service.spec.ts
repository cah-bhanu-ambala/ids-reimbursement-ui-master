import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AuthService} from './auth.service';
import {OktaAuthService} from '@okta/okta-angular';
import {OktaAuth, UserClaims} from '@okta/okta-auth-js';
import {RCM_TOKEN, TOKEN_EXPIRED} from './auth.constants';
import {TOKEN_NAME} from '../apigee/apigee.constants';
import {ApigeeService} from '../apigee/apigee.service';

class MockOktaService {
  isAuthenticated = () => {
    return Promise.resolve(true);
  }
  getUser = () => {
    return Promise.resolve(<UserClaims> {
      given_name: 'first',
      family_name: 'last',
      email: 'test@test.com',
      preferred_username: 'first last'
    });
  }
  getAccessToken = () => {
    return 'TEST_ACCESS_TOKEN';
  }
  getIdToken = () => {
    return 'TEST_ID_TOKEN';
  }
}

describe('AuthService', () => {
  let authService: AuthService;
  let mockOktaService: MockOktaService;
  let apigeeServiceSpy: jasmine.SpyObj<ApigeeService>;
  let httpTestingController:HttpTestingController;
  let authClientSpy: jasmine.SpyObj<OktaAuth>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers:[AuthService, {provide: OktaAuthService, useClass: MockOktaService}]
    });
    authService = TestBed.inject(AuthService);
    mockOktaService = TestBed.inject(OktaAuthService);
    httpTestingController=TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('isAuthenticated is called', async () => {
    mockOktaService.isAuthenticated().then(res => {
      expect(res).toBeTrue();
    });
  });

  it('it should set user', async () => {
    const claims = await authService.setUser();
    expect(claims.given_name).toEqual('first');
    expect(sessionStorage.getItem(RCM_TOKEN)).toBeTruthy();
    expect(JSON.parse(sessionStorage.getItem(RCM_TOKEN)).firstName).toEqual('first');
  });

  it('it should return set user asynchronously', async () => {
    await authService.setUser();
    const user = await authService.getUserAsync();
    expect(user.firstName).toEqual('first');
  });

  it('it should set user if user does not exist asynchronously', async () => {
    sessionStorage.clear();
    const user = await authService.getUserAsync();
    expect(user.firstName).toEqual('first');
  });

  it('it should return set user', async () => {
    await authService.setUser();
    const user = authService.getStoredUser();
    expect(user.firstName).toEqual('first');
  });

  it('it should return null if no user exists in session storage', async () => {
    sessionStorage.clear();
    const user = authService.getStoredUser();
    expect(user).toBeNull();
  });

  it('it should return ACCESS TOKEN', async () => {
    const accessToken = authService.getAccessToken();
    expect(accessToken).toEqual('TEST_ACCESS_TOKEN');
  });

  it('it should return ID TOKEN', async () => {
    const accessToken = authService.getIdToken();
    expect(accessToken).toEqual('TEST_ID_TOKEN');
  });

  it('it should set Token to expired', async () => {
    sessionStorage.setItem(TOKEN_EXPIRED, 'false');
    authService.setTokenExpired();
    expect(sessionStorage.getItem(TOKEN_EXPIRED)).toEqual('true');
  });

  it('it should return token expired value', async () => {
    sessionStorage.setItem(TOKEN_EXPIRED, 'false');
    expect(authService.hasTokenExpired()).toBeFalse();
    authService.setTokenExpired();
    expect(authService.hasTokenExpired()).toBeTrue();
  });

  it('it should rotate apigee token', async () => {
    sessionStorage.setItem(TOKEN_NAME, 'testToken');
    authService.rotateApigeeToken('accessToken');
    expect(sessionStorage.getItem(TOKEN_NAME)).toEqual('testToken');
  });

  it('it should rotate okta tokens', async () => {
    authService.rotateOktaToken(50000000);
    expect(sessionStorage.getItem(TOKEN_NAME)).toEqual('testToken');
  });
});
