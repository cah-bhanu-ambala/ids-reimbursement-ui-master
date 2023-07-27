
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

import { CustomerWorkitemService } from './customer-workitem.service';
import { asyncScheduler, of } from 'rxjs';

describe('CustomerWorkitemService', () => {
  let httpservice: HttpService;
  let httpTestingController: HttpTestingController;
  let customerWorkitemService: CustomerWorkitemService;
  const baseUrl = environment.serviceUrl;

  const facilityListdata = [
    {
      "active": true,
      "createdDate": "2021-02-02T08:45:12.587Z",
      "createdBy": 0,
      "modifiedDate": "2021-02-02T08:45:12.587Z",
      "modifiedBy": 0,
      "facilityId": 0,
      "facilityName": "string",
      "facilityNickName": "string",
      "ein": "string",
      "contacts": "string",
      "facilityNPI": "string",
      "address": "string",
      "phone": "string",
      "fax": "string",
      "status": "string",
      "facilityBillingDetails": [
        {
          "active": true,
          "createdDate": "2021-02-02T08:45:12.587Z",
          "createdBy": 0,
          "modifiedDate": "2021-02-02T08:45:12.587Z",
          "modifiedBy": 0,
          "facilityBillingDetailId": 0,
          "facilityId": 0,
          "billingLevelId": 0,
          "billingAmount": 0,
          "billingLevelName": "string"
        }
      ]
    }
  ];

  const icdResp = [{
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 2,
    icdCode: "A00.0",
    description: "Cholera due to Vibrio cholerae 01, biovar cholerae"
  }];

  const provResp = [{

  },
  {

  }]
  const drugResp = {content: [{
    active: true,
    createdDate: "2021-02-01T17:36:50.881+0000",
    createdBy: 1,
    modifiedDate: "2021-02-17T17:50:17.409+0000",
    modifiedBy: 1,
    drugId: 2,
    drugProcCode: "J0135",
    shortDesc: "Adalimumab injection",
    longDesc: "Adalimumab injection",
    brandName: "Humira Pen",
    genericName: "adalimumab",
    lcd: "LCD1728",
    notes: "test notes"
  }]};


  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HttpService,CustomerWorkitemService]
    });
    httpservice = TestBed.inject(HttpService);
    customerWorkitemService = TestBed.inject(CustomerWorkitemService);
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(customerWorkitemService).toBeTruthy();
  });

  it('should set customer workitem Info', () => {
    expect(customerWorkitemService.setwItemInfo('test')).not.toBeNull();
    expect(customerWorkitemService.setwItemInfo('')).toBeFalsy();
  });

  it('should get customer work item Info', () => {
    expect(customerWorkitemService.getwItemInfo()).not.toBeNull();
  });

  it('should get team members list', async(() => {
    customerWorkitemService.getAllTeamMembers().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/user/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get all approval reasons', async(() => {
    customerWorkitemService.getAllApprovalReasons().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/priorAuthStatus/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get work item status', async(() => {
    customerWorkitemService.getApprovedFacilities().subscribe((res) => {
      expect(res).toEqual(facilityListdata);
    });
    const req = httpTestingController.expectOne(baseUrl + '/facility/getApprovedFacilities');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(facilityListdata);
  }));

  it('should get primary insurance', async(() => {
    customerWorkitemService.getPrimaryIns().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/insurance/getPrimaryInsurance');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));


  it('should get secondary insurance', async(() => {
    customerWorkitemService.getSecondaryIns().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/insurance/getSecondaryInsurance');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get billing levels', async(() => {
    customerWorkitemService.getbilligLevels().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/facilityBillingLevel/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));


  it('should getBillingTypes', async(() => {
    customerWorkitemService.getBillingTypes().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/facilityBillingType/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get work item status', async(() => {
    customerWorkitemService.getwiStatuses().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/customerWorkItemStatus/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get all customer entered workItems', async(() => {
    const params = {
      facilityIds: [1,2],
      statusIds: [1,2]
    }

    customerWorkitemService.getCustomerSubmittedWorkItem(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
    });

    const req = httpTestingController.expectOne(baseUrl + '/customerWorkItem/getCustomerEnteredWorkItems'
    + '?facilityIds=' + params.facilityIds
    + '&statusIds=' + params.statusIds
    );

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should create customer work item', async(() => {
    const body={};
    customerWorkitemService.createCustomerWorkItem(body).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/customerWorkItem/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('should post attachment data for any given endpoint', async(() => {
    let formData = new FormData();

    const endpoint='/customerWorkItem/attachment/create';
    customerWorkitemService.postAttachment(formData).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(formData);
    });
    const req = httpTestingController.expectOne(baseUrl +endpoint );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush(formData);

  }));

  it('should request to Delete Customer WorkItem', async(() => {
    let params = {
      svoid : 1,
      modifiedBy: 1
    }
    const endpoint='/customerWorkItem/requestToDelete?svoId=' + params.svoid + '&modifiedBy=' + params.modifiedBy;
    customerWorkitemService.requestToDeleteCustomerWorkItem(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + endpoint );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should delete customer workitem by id', async(() => {
    const params={
      customerWorkItemId:123,
      modifiedBy:1
    }
    customerWorkitemService.deleteCustomerWorkItem(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/customerWorkItem/delete?svoId='
    + params.customerWorkItemId+ '&modifiedBy='+params.modifiedBy, "deleteCustomerWorkItem");
    expect(req.request.method).toBe('DELETE');
    expect(req.cancelled).toBeFalsy();
  }));

  it('should Search By ICDCode', async(() => {
    const icdCode = 'a00.0';
    customerWorkitemService.SearchByICDCode(icdCode).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(icdResp);
    });
    const req = httpTestingController.expectOne(baseUrl + '/icd/getByIcdCodeContainingIgnoreCase?icdCode=' + icdCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(icdResp);
  }));

  it('should get ProviderList', async(() => {
    customerWorkitemService.getProviderList().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/provider/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));



  it('should get IcdDetails', async(() => {
    const icdCode = 'a00.0';
    const response = ['A00.0 - Cholera due to Vibrio cholerae 01, biovar cholerae - 2'];
    customerWorkitemService.getIcdDetails(icdCode).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(response);
    });
    const req = httpTestingController.expectOne(baseUrl + '/icd/getByIcdCodeContainingIgnoreCase?icdCode=' + icdCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(icdResp);
  }));

  it('should get DrugDetails', async(() => {
    const drugCode = 'J0135';
    customerWorkitemService.getDrugDetails(drugCode).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/drug/findByProcCodeDescContainingIgnoreCase?drugSearchParam=' + drugCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(drugResp);
  }));

  it('should get Provider details', async(() => {
    const term = '1234';
    customerWorkitemService.getProviders(term).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/provider/getByProviderAndNpi?providerNpi=' + term);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(provResp);
  }));


  it('should get all submitted customer workItems', async(() => {
    const params = {
      facilityId: 1,
      patientMrn: 'mrn',
      whoAdded: 1
    }

    customerWorkitemService.getSubmittedCustomerWorkItems(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/customerWorkItem/getSubmittedWorkItems'
      + '?facilityId=' + params.facilityId
      + '&patientMrn=' + params.patientMrn
      + '&whoAdded=' + params.whoAdded
    );

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));


  it('get Submitted Customer Work items should throws an error', async(() => {

    const params = {
      facilityId: 1,
      patientMrn: 'mrn',
      whoAdded: 1
    }

    customerWorkitemService.getSubmittedCustomerWorkItems(params).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
       });
    const req = httpTestingController.expectOne(baseUrl + '/customerWorkItem/getSubmittedWorkItems'
      + '?facilityId=' + params.facilityId
      + '&patientMrn=' + params.patientMrn
      + '&whoAdded=' + params.whoAdded
    );

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({message: "Something went wrong,Please check."}, {status: 500, statusText: 'Something went wrong,Please check.'});
    expect(req.cancelled).toBeTrue();
  }));

  it('should download attachment', async() => {
    const id = 1;
    let response = new Blob();
    customerWorkitemService.getAttachmentById(id).subscribe((res : Blob) => {
      expect(res).toEqual(response, 'should return expected data');
      expect(response).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/customerWorkItem/attachment/downloadFile/' + id);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(response);

  });


  it('should create MRN', async(() => {
    const body={};
    customerWorkitemService.createMRN(body).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/createMRN');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('[CreateMRN] Create MRN fails should throws an error', async(() => {
    const body={};
    customerWorkitemService.createMRN(body).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/createMRN');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({message: "Something went wrong,Please check."}, {status: 500, statusText: 'Something went wrong,Please check.'});
    expect(req.cancelled).toBeTrue();
  }));

  it('should get customer work item by id', async(() => {
    const customerWorkItemId=113;
    customerWorkitemService.getCustomerWorkItem(customerWorkItemId).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/customerWorkItem/getById/'+ customerWorkItemId);
    console.log(req.request.url);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

});
