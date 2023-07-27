import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let httpTestingController: HttpTestingController;
  let baseUrl = environment.serviceUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthenticationService]
    });
    service = TestBed.inject(AuthenticationService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(AuthenticationService).toBeTruthy();
  });

  it('should get user details', async(() => {
    const userEmail=''
    service.getUserDetails(userEmail).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + `/user/getUserDetails/${userEmail}`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should check user is logged in', (()=>{
    expect(service.isLoggedIn).toBeTruthy();

  }));

});
