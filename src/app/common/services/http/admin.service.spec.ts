import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AdminService } from './admin.service';
import { Facility } from 'src/app/models/classes/facility';
import { environment } from 'src/environments/environment'; 

describe('AdminService', () => {
  let service: AdminService;
  let httpTestingController:HttpTestingController;
  const baseUrl = environment.serviceUrl;

  const approveFacilityResp = {"active":true,"createdDate":"2021-02-10T06:31:47.517+0000","createdBy":1,"modifiedDate":"2021-02-26T23:09:43.559+0000","modifiedBy":1,"facilityId":3,"facilityName":"test","facilityNickName":"test","ein":"13","contact1":"contact1231152233","contactRole1":"","contact2":"contact2","contactRole2":"","contact3":"contact35","contactRole3":"","contact4":"contact43","contactRole4":"","facilityNPI":"2323","address":"test ","phone":null,"fax":"7616151002","status":"Approved","facilityBillingDetails":[{"active":true,"createdDate":null,"createdBy":1,"modifiedDate":"2021-02-25T20:09:43.464+0000","modifiedBy":1,"facilityBillingDetailId":17,"facilityId":3,"billingLevelId":5,"billingAmount":6154.0,"facilityBillingLevelName":"PHARM L1"},{"active":true,"createdDate":null,"createdBy":1,"modifiedDate":"2021-02-25T20:09:43.464+0000","modifiedBy":1,"facilityBillingDetailId":21,"facilityId":3,"billingLevelId":9,"billingAmount":123.0,"facilityBillingLevelName":"RAD L2"},{"active":true,"createdDate":null,"createdBy":1,"modifiedDate":"2021-02-25T20:09:43.466+0000","modifiedBy":1,"facilityBillingDetailId":22,"facilityId":3,"billingLevelId":2,"billingAmount":123.0,"facilityBillingLevelName":"VOB L1"},{"active":true,"createdDate":null,"createdBy":1,"modifiedDate":"2021-02-25T20:09:43.467+0000","modifiedBy":1,"facilityBillingDetailId":23,"facilityId":3,"billingLevelId":3,"billingAmount":0.0,"facilityBillingLevelName":"VOB L2"},{"active":true,"createdDate":null,"createdBy":1,"modifiedDate":"2021-02-25T20:09:43.468+0000","modifiedBy":1,"facilityBillingDetailId":24,"facilityId":3,"billingLevelId":4,"billingAmount":0.0,"facilityBillingLevelName":"VOB L3"},{"active":true,"createdDate":null,"createdBy":1,"modifiedDate":"2021-02-25T20:09:43.469+0000","modifiedBy":1,"facilityBillingDetailId":18,"facilityId":3,"billingLevelId":6,"billingAmount":2222.0,"facilityBillingLevelName":"PHARM L2"},{"active":true,"createdDate":null,"createdBy":1,"modifiedDate":"2021-02-25T20:09:43.470+0000","modifiedBy":1,"facilityBillingDetailId":19,"facilityId":3,"billingLevelId":7,"billingAmount":1.23456789012E9,"facilityBillingLevelName":"PHARM L3"},{"active":true,"createdDate":null,"createdBy":1,"modifiedDate":"2021-02-25T20:09:43.471+0000","modifiedBy":1,"facilityBillingDetailId":20,"facilityId":3,"billingLevelId":8,"billingAmount":1234570.12,"facilityBillingLevelName":"RAD L1"}]};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AdminService);
    httpTestingController=TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
 
  it('should approve facility', async(() => { 
    let facObject=new Facility();
    facObject.facilityId=1;
    facObject.modifiedBy=1;
    facObject.status="Approved";

    const endpoint='facility/updateStatus';
    service.approveFacility(endpoint,facObject).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(approveFacilityResp);
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush(approveFacilityResp);
  }));

  it('[approveFacility] should throw error', async(() => {  

    let facObject=new Facility();
    facObject.facilityId=1;
    facObject.modifiedBy=1;
    facObject.status="Approved";

    const endpoint='facility/updateStatus';
    let message="Something went wrong,Please check!";
    service.approveFacility(endpoint,facObject).subscribe((res) => { 
    }, (error) => { 
      expect(error).toEqual(message);
    }); 

    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint);
    const msg = 'error';
    req.flush(msg,{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('PUT');
  }));

  it('[approveFacility] should throw error with message', async(() => {  

    let facObject=new Facility();
    facObject.facilityId=1;
    facObject.modifiedBy=1;
    facObject.status="Approved";

    const endpoint='facility/updateStatus'; 
    service.approveFacility(endpoint,facObject).subscribe((res) => {
    }, (error) => {
      expect(error).not.toBeNull();
    }); 

    const req = httpTestingController.expectOne(baseUrl + '/' + endpoint); 
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'}); 

    expect(req.cancelled).toBeTrue();
    expect(req.request.method).toEqual('PUT');
  }));

  
});