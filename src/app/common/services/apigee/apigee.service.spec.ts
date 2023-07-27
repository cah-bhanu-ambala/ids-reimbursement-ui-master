import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ApigeeService } from './apigee.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ApigeeToken } from '../../../models/interfaces/apigee-token';
import { TOKEN_NAME } from './apigee.constants';

describe('ApigeeService', () => {
  let service: ApigeeService;
  let client: HttpClient;
  let httpTestingController: HttpTestingController;
  let store = {};
  let token: ApigeeToken;
  const mockStorage = {
    getItem: (key: string): string => key in store ? store[key] : null,
    setItem: (key: string, value: string) => store[key] = `${value}`,
    removeItem: (key: string) => delete store[key],
    clear: () => store = {}
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ApigeeService);
    client = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    store = {};

    spyOn(window.Storage.prototype, 'getItem').and.callFake(mockStorage.getItem);
    spyOn(window.Storage.prototype, 'setItem').and.callFake(mockStorage.setItem);
    spyOn(window.Storage.prototype, 'removeItem').and.callFake(mockStorage.removeItem);
    spyOn(window.Storage.prototype, 'clear').and.callFake(mockStorage.clear);

    Object.defineProperty(window, 'sessionStorage', {
      value: mockStorage,
    });

    token = {
      issued_at: jasmine.anything() as any,
      scope: jasmine.anything() as any,
      application_name: jasmine.anything() as any,
      refresh_token_issued_at: jasmine.anything() as any,
      status: jasmine.anything() as any,
      refresh_token_status: jasmine.anything() as any,
      api_product_list: jasmine.anything() as any,
      expires_in: jasmine.anything() as any,
      'developer.email': jasmine.anything() as any,
      organization_id: jasmine.anything() as any,
      token_type: jasmine.anything() as any,
      refresh_token: jasmine.anything() as any,
      client_id: jasmine.anything() as any,
      access_token: jasmine.anything() as any,
      organization_name: jasmine.anything() as any,
      refresh_token_expires_in: jasmine.anything() as any,
      refresh_count: jasmine.anything() as any
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should post to generate an apigee token', fakeAsync(() => {
    spyOn(client, 'post').and.returnValue(of({}));
    const tokenGen = service.generateApigeeToken(`oktaAccessToken`, `oktaIdToken`);
    tick();

    expect(tokenGen).toBeTruthy();
  }));

  it('should set the apigee token in session storage', () => {
    spyOn(mockStorage, 'removeItem');
    spyOn(mockStorage, 'setItem');

    service.setApigeeToken(token);

    expect(mockStorage.removeItem).toHaveBeenCalledWith(TOKEN_NAME);
    expect(mockStorage.setItem).toHaveBeenCalledWith(TOKEN_NAME, token.access_token);
  });


  it('should retrieve the apigee token in session storage', () => {
    spyOn(mockStorage, 'getItem').and.returnValue(`someValue`);
    const token = service.getApigeeToken();

    expect(token).toEqual(`someValue`);
  });
});
