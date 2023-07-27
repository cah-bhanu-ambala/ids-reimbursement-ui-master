// Http testing module and mocking controller
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

// Other imports
import { HttpService } from './http.service';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

describe('HttpService', () => {
  let service: HttpService;
  let httpTestingController: HttpTestingController;
  const baseUrl = environment.serviceUrl;

  const contactData = [
    {
      active: true,
      createdDate: '2021-02-01T18:00:13.083+0000',
      createdBy: 1,
      modifiedDate: '2021-02-01T18:00:13.083+0000',
      modifiedBy: 1,
      contactId: 1,
      contactName: 'ABC ',
      contactTypeId: 2,
      contactPhone: '1122233333',
      contactFax: '4445556666',
      contactWebsite: 'www.abc.com',
      contactNotes: 'test Notes',
      contactTypeName: 'Insurance',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService],
    });
    // Inject the http service and test controller for each test
    service = TestBed.inject(HttpService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get data by code to any given end point', async(() => {
    const drugCode = 2;
    const endpoint = 'drug/getByDrugProcCode?drugProcCode=' + drugCode;
    service.getByCode(endpoint).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should make request to any given endpoint', async(() => {
    const endpoint = 'insurance/getPrimaryInsurance';
    service.getAll(endpoint).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should make post request to any given endpoint when isupdate is false', async(() => {
    const endpoint = 'provider/update/';
    const body = {};
    const isUpdate = false;
    service.post(endpoint, body, isUpdate).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('should make post request to any given endpoint when isupdate is true', async(() => {
    const endpoint = 'provider/create/';
    const body = {};
    const isUpdate = true;
    service.post(endpoint, body, isUpdate).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should post attachment data for any given endpoint', async(() => {
    let formData = new FormData();
    const endpoint = 'patient/advocacy/attachment/create';
    service.postAttachment(endpoint, formData).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(formData);
    });
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush(formData);
  }));

  it('should search any', async(() => {
    let endpoint = 'contact/getByContactName?contactName=';
    const contactname = 'ABC';
    endpoint += contactname;
    service.searchByAny(endpoint).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(contactData);
    });
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(contactData);
  }));

  it('should make delete request for any given endpoint', async(() => {
    let endpoint = 'drug/delete?svoId=';
    let drugId = 25;
    let userId = 1;

    endpoint += drugId + '&modifiedBy=' + userId;
    service.delete(endpoint).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));

  it('should throw error obj with message while calling get data by code', async(() => {
    const drugCode = 2;
    const endpoint = 'drug/getByDrugProcCode?drugProcCode=' + drugCode;
    service.getByCode(endpoint).subscribe(
      (res) => {},
      (err) => {
        expect(err).not.toBeNull();
      }
    );
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(
      { message: 'error' },
      { status: 500, statusText: 'Internal server error' }
    );

    expect(req.cancelled).toBeTrue();
  }));

  it('should throw error obj with message while calling get data by code', async(() => {
    const drugCode = 2;
    const endpoint = 'drug/getByDrugProcCode?drugProcCode=' + drugCode;
    service.getByCode(endpoint).subscribe(
      (res) => {},
      (err) => {
        expect(err).not.toBeNull();
      }
    );
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush('error', { status: 500, statusText: 'Internal server error' });

    expect(req.cancelled).toBeTrue();
  }));

  it('get<T> is called', async(() => {
    const url = "test.com"
    service.get(url).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + url);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({})
    
  }));

  it('put<T> is called', async(() => {
    const url = "test.com"
    service.put(url).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + url);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({})
    
  }));

  it('postData<T> is called', async(() => {
    const url = "test.com"
    service.postData(url).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + url);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({})
    
  }));
});
