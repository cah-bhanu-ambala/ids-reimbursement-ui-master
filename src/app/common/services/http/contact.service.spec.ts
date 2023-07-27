import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;
  let httpTestingController: HttpTestingController;
  let baseUrl = environment.serviceUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService]
    });
    service = TestBed.inject(ContactService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('[searchContact] should get searched contact Data', async(() => {
    const contactName ='ABC';
    service.searchContact(contactName).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +
      '/contact/getByContactName?contactName='+contactName);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getAllContacts] should get searched contact Data', async(() => {
    service.getAllContacts().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/contactType/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should update contact', async(() => {
    const body={};
    service.updateContact(body).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/contact/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should create contact', async(() => {
    const body={};
    service.createContact(body).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/contact/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('[createContact] should throw error', async(() => {
    const body={};
    service.createContact(body).subscribe((res) => {
    }, (error) => {
      expect(error).not.toBeNull();
    });

    const req = httpTestingController.expectOne(baseUrl + '/contact/create');
    const msg = 'error';
    req.flush(msg,{status: 500, statusText: 'Internal server error'});
    expect(req.request.method).toEqual('POST');
  }));

  it('[createContact] should throw error with message', async(() => {
    const body={};
    service.createContact(body).subscribe((res) => {
    }, (error) => {
      expect(error).not.toBeNull();
    });

    const req = httpTestingController.expectOne(baseUrl + '/contact/create');
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'});
    expect(req.request.method).toEqual('POST');
  }));

  it('should delete contact', async(() => {
      let searchParams = {
        svoId: 1,
        modifiedBy: 1

      }

     service.deleteContact(searchParams).subscribe((res) => {
        expect(res).not.toBeNull();
      });
      const req = httpTestingController.expectOne(baseUrl +'/contact/delete?svoId=' + searchParams.svoId + '&modifiedBy=' + searchParams.modifiedBy);
      expect(req.cancelled).toBeFalsy();
      expect(req.request.method).toEqual('DELETE');
      req.flush({});
    }));
});
