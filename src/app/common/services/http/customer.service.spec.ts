import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { CustomerService } from './customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpTestingController: HttpTestingController;
  let baseUrl = environment.serviceUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService]
    });
    service = TestBed.inject(CustomerService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('get patiend no responded status', async(() => {

    const params = {
      facilityId: 1,
      mrn: 'mrn'
    }

    service.getPatientNotRespondedStatusPatients(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
       });
    const req = httpTestingController.expectOne(baseUrl + '/patient/getPatientNotRespondedStatusPatients'
      + '?facilityId=' + params.facilityId
      + '&mrn=' + params.mrn
    );

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('get all appointments by advocacy', async(() => {

 const id = 1;

    service.getAllAppointmentsByAdvocacyIdForExternalCustomer(id).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
       });
    const req = httpTestingController.expectOne(baseUrl + '/patient/appointment/getAllAppointmentsByAdvocacyIdForExternalCustomer/'
      + id
    );

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('get advocacies by facility', async(() => {

    const advocacySearchParam = 'test', facilityId = 1;

       service.SearchForCustAdvocacies(advocacySearchParam, facilityId).subscribe((res) => {
         expect(res).not.toBeNull();
       },(error: any) => {
         expect(error).toEqual('Something went wrong,Please check.');
          });
       const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/getAdvocaciesByFacilityIdUserRoleAndSearchParam?facilityId=' + facilityId +
       '&advocacySearchParam=' + advocacySearchParam
       );

       expect(req.cancelled).toBeFalsy();
       expect(req.request.method).toEqual('GET');
       req.flush({});
     }));



  it('should update patient', async(() => {
    const body={};
    service.updatePatient(body).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/updatePatient');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('Request to delete appointment', async(() => {
    const params={
      svoId: 1,
      modifiedBy: 1
    };
    service.deleteAppointmentByCust(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/appointment/requestToDelete?svoId=' +params.svoId +'&modifiedBy='+params.modifiedBy );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('Delete appointment by customer should throw error', async(() => {

    const params={
      svoId: 1,
      modifiedBy: 1
    };
    service.deleteAppointmentByCust(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/appointment/requestToDelete?svoId=' +params.svoId +'&modifiedBy='+params.modifiedBy );

    const msg = 'error';
    req.flush(msg,{status: 500, statusText: 'Internal server error'});
    expect(req.request.method).toEqual('PUT');
  }));

  it('Update patient should throw error', async(() => {

    const body={};
    service.updatePatient(body).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/updatePatient');
    const msg = 'error';
    req.flush(msg,{status: 500, statusText: 'Internal server error'});
    expect(req.request.method).toEqual('PUT');
  }));

});
