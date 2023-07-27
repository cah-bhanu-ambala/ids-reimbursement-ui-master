import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { CustomerReportsService } from './customer-reports.service';

describe('CustomerReportsService', () => {
  let service: CustomerReportsService;
  let httpTestingController: HttpTestingController;
  let baseUrl = environment.serviceUrl; 

  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerReportsService]
    });
    service = TestBed.inject(CustomerReportsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(CustomerReportsService).toBeTruthy();
  }); 

  it('get customer Order completed report', async(() => { 
    
    const params = {
      facilityId: 1,
      dateOutFrom: '09/01/2021',
      dateOutTo:'09/14/2021'      
    }

    service.getCustomerOrderCompletedReport(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
       });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/getCustomerOrderCompletedReport'
      + '?facilityId=' + params.facilityId
      + '&dateOutFrom=' + params.dateOutFrom  
      + '&dateOutTo=' + params.dateOutTo      
    );

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('get customer Order completed report throws an error', async(() => { 
    
    const params = {
      facilityId: 1,
      dateOutFrom: '09/01/2021',
      dateOutTo: '09/14/2021'      
    }

    service.getCustomerOrderCompletedReport(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
       });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/getCustomerOrderCompletedReport'
      + '?facilityId=' + params.facilityId
      + '&dateOutFrom=' + params.dateOutFrom  
      + '&dateOutTo=' + params.dateOutTo      
    );

    const msg = 'error';
    req.flush(msg,{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('GET');
  }));

  it('get customer advocacy Order type report', async(() => { 
    
    const params = {
      facilityId: 1,
      dateCreatedFrom: undefined, //moment('09/01/2021').subtract(1, 'M').format('MM/DD/YYYY').toString(),
      dateCreatedTo: undefined//moment('09/14/2021').subtract(1, 'M').format('MM/DD/YYYY').toString()      
    }

    service.getAdvocacyOrderTypeReport(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
       });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/getCustomerAdvocacyTypeReport'
      + '?facilityId=' + params.facilityId
      + '&dateCreatedFrom=' + params.dateCreatedFrom  
      + '&dateCreatedTo=' + params.dateCreatedTo      
    );

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('get customer advocacy order type report throws an error', async(() => { 
    
    const params = {
      facilityId: 1,
      dateCreatedFrom: undefined,
      dateCreatedTo: undefined     
    }

    service.getAdvocacyOrderTypeReport(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
       });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/getCustomerAdvocacyTypeReport'
      + '?facilityId=' + params.facilityId
      + '&dateCreatedFrom=' + params.dateCreatedFrom  
      + '&dateCreatedTo=' + params.dateCreatedTo      
    );

    const msg = 'error';
    req.flush(msg,{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('GET');
  }));


  it('get customer secured advocacy report ', async(() => { 
    
    const params = {
      facilityId: 1,
      dateCreatedFrom: undefined,
      dateCreatedTo: undefined,
      patientMrn: undefined  
    }

    service.getSecureAdvocacyReport(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
       });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/getCustomerSecuredAdvocacyReport'
      + '?facilityId=' + params.facilityId
      + '&patientMrn=' + params.patientMrn
      + '&dateCreatedFrom=' + params.dateCreatedFrom  
      + '&dateCreatedTo=' + params.dateCreatedTo      
    );

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('get customer secured advocacy report throws an error', async(() => { 
    
    const params = {
      facilityId: 1,
      dateCreatedFrom: undefined,
      dateCreatedTo: undefined,
      patientMrn: undefined   
    }

    service.getSecureAdvocacyReport(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
       });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/getCustomerSecuredAdvocacyReport'
      + '?facilityId=' + params.facilityId
      + '&patientMrn=' + params.patientMrn
      + '&dateCreatedFrom=' + params.dateCreatedFrom  
      + '&dateCreatedTo=' + params.dateCreatedTo      
    );

    const msg = 'error';
    req.flush(msg,{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('GET');
  }));
});