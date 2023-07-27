import {SpinnerService} from '../services/spinner/spinner.service';
import {ApigeeService} from '../services/apigee/apigee.service';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './auth.interceptor';
import {environment} from '../../../environments/environment';
import {HttpService} from '../services/http/http.service';

describe(`AuthHttpInterceptor`, () => {
  let service: HttpService;
  let apigeeService: ApigeeService;
  let spinnerService: SpinnerService;

  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpService,
        ApigeeService,
        SpinnerService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    service = TestBed.inject(HttpService);
    apigeeService = TestBed.inject(ApigeeService);
    spinnerService = TestBed.inject(SpinnerService);
    httpMock = TestBed.inject(HttpTestingController);
    spyOn(spinnerService, 'setSpinner');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not add an Authorization header for generating APIGEE tokens', async () => {
    apigeeService.generateApigeeToken('TEST_ACCESS_TOKEN', 'TEST_ID_TOKEN').then(res => {
      expect(res).toBeTruthy();
    });
    const httpRequest = httpMock.expectOne(`${environment.resourceServer.oauthUrl}`);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toEqual('Bearer TEST_ID_TOKEN, Bearer TEST_ACCESS_TOKEN');
    expect(spinnerService.setSpinner).toHaveBeenCalledWith(true);
  });

  it('should add apigee token as Authorization header for all api calls', async () => {
    spyOn(apigeeService, 'getApigeeToken').and.returnValue('TEST_APIGEE_TOKEN');
    service.get('/users/getAllUsers').subscribe(res => {
      expect(res).toBeTruthy();
    })
    const httpRequest = httpMock.expectOne(`${environment.serviceUrl}/users/getAllUsers`);
    expect(httpRequest.request.headers.has('Authorization')).toEqual(true);
    expect(httpRequest.request.headers.get('Authorization')).toEqual('Bearer TEST_APIGEE_TOKEN');
    expect(spinnerService.setSpinner).toHaveBeenCalledWith(true);
  });
});
