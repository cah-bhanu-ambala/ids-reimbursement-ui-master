import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { HttpService } from './http.service';

import { WorkitemService } from './workitem.service';
import { of } from 'rxjs';

describe('WorkitemService', () => {
  let httpservice: HttpService;
  let httpTestingController: HttpTestingController;
  let workitemService: WorkitemService;
  const baseUrl = environment.serviceUrl;

  const facilityListdata=[
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

  const icdResp =[{
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 2,
    icdCode: "A00.0",
    description: "Cholera due to Vibrio cholerae 01, biovar cholerae"
}];

const drugResp ={content: [{
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
      providers: [WorkitemService, WorkitemService]
    });
    workitemService = TestBed.inject(WorkitemService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(workitemService).toBeTruthy();
  });

  it('should set workitem Info', () => {
    expect(workitemService.setwItemInfo('test')).not.toBeNull();
    expect(workitemService.setwItemInfo('')).toBeFalsy();
  });

  it('should get Advocacy Info', () => {
    expect(workitemService.getwItemInfo()).not.toBeNull();
  });

  it('should get team members list', async(() => {
    workitemService.getAllTeamMembers().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/user/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get all approval reasons', async(() => {
    workitemService.getAllApprovalReasons().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/priorAuthStatus/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get work item status', async(() => {
    workitemService.getwiStatuses().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/workitemStatus/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get work item status', async(() => {
    workitemService.getApprovedFacilities().subscribe((res) => {
     expect(res).toEqual(facilityListdata);
    });
    const req = httpTestingController.expectOne(baseUrl +'/facility/getApprovedFacilities');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(facilityListdata);
  }));

  it('should get primary insurance', async(() => {
    workitemService.getPrimaryIns().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/insurance/getPrimaryInsurance');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get secondary insurance', async(() => {
    workitemService.getSecondaryIns().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/insurance/getSecondaryInsurance');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get billing levels', async(() => {
    workitemService.getbilligLevels().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/facilityBillingLevel/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));
 it('should getOrderTypes', async(() => {
    workitemService.getOrderTypes().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/orderType/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));
  it('should getBillingTypes', async(() => {
    workitemService.getBillingTypes().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/facilityBillingType/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should searchViewWorkItem', async(() => {
    const searchParam ="13";
    workitemService.searchViewWorkItem(searchParam).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/getViewWorkItems?searchParam=' + searchParam);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should Search By ICDCode', async(() => {
    const icdCode='a00.0';
    workitemService.SearchByICDCode(icdCode).subscribe((res) => {
     expect(res).not.toBeNull();
     expect(res).toEqual(icdResp);
    });
    const req = httpTestingController.expectOne(baseUrl +'/icd/getByIcdCodeContainingIgnoreCase?icdCode='+icdCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(icdResp);
  }));

  it('should get IcdDetails', async(() => {
    const icdCode='a00.0';
    const response =['A00.0 - Cholera due to Vibrio cholerae 01, biovar cholerae - 2'];
    workitemService.getIcdDetails(icdCode).subscribe((res) => {
     expect(res).not.toBeNull();
     expect(res).toEqual(response);
    });
    const req = httpTestingController.expectOne(baseUrl +'/icd/getByIcdCodeContainingIgnoreCase?icdCode='+icdCode);
    // const req = httpTestingController.expectOne(baseUrl +'/icd/getByIcdCodeContainingIgnoreCase2?icdCode='+icdCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(icdResp);
  }));

  it('should get DrugDetails', async(() => {
    const drugCode='J0135';
    workitemService.getDrugDetails(drugCode).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/drug/findByProcCodeDescContainingIgnoreCase?drugSearchParam='+drugCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(drugResp);
  }));

  it('should get ProviderList', async(() => {
    workitemService.getProviderList().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/provider/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get work item by id', async(() => {
    const wiNumber=123;
    workitemService.getWorkItemById(wiNumber).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/workitem/getById/'+wiNumber);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get work item by id and facilityId', async(() => {
        const wiNumber=123;
        const facilityIdValue=123;
        workitemService.getWorkItemByIdAndFacilityId(wiNumber,facilityIdValue).subscribe((res) => {
        expect(res).not.toBeNull();
      });
      const req = httpTestingController.expectOne(baseUrl +'/patient/workitem/getByWorkitemIdAndFacilityId?workitemId=' + wiNumber + "&facilityId="+facilityIdValue);
      expect(req.cancelled).toBeFalsy();
      expect(req.request.method).toEqual('GET');
      req.flush({});
    }));

  it('should search by Mrn and Facility name', async(() => {
    const params={
      facilityId: 1,
      mrn: 'mrn'
    }

    workitemService.getMrnFacilities(params).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/getByMrnAndFacility?facilityId='
                                    +params.facilityId + '&mrn=' + params.mrn);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get All WorkItems', async(() => {
    const params={
      facilityId: 1,
      patientMrn: 'mrn',
      workItemStatusId: 15,
      dateOut: null,
      teamMemberId: 1
    }

    workitemService.getAllWorkItem(params).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/workitem/getWorkItems'
    + '?facilityId=' + params.facilityId
    + '&patientMrn=' + params.patientMrn
    + '&workItemStatusId=' + params.workItemStatusId
    + '&dateOut='+ params.dateOut
    + '&teamMemberId='+ params.teamMemberId);

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get WorkItems by page', async(() => {
    const params={
      facilityId: 1,
      patientMrn: 'mrn',
      workItemStatusId: 15,
      dateOut: "",
      teamMemberId: 1,
      orderTypeId: 1,
      viewSearchParam: "",
      pageNum: 0,
      pageSize: 10,
      orderBy: "workItemId 1"
    }

    workitemService.getWorkItemsPage(params).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res.content).not.toBeNull();
    });

    httpTestingController.expectOne(baseUrl +'/patient/workitem/getWorkItemsPage'
    + '?facilityId=' + params.facilityId
    + '&patientMrn=' + params.patientMrn
    + '&workItemStatusId=' + params.workItemStatusId
    + '&dateOut='+ params.dateOut
    + '&teamMemberId='+ params.teamMemberId
    + '&orderTypeId='+ params.orderTypeId
    + '&viewSearchParam=' + params.viewSearchParam
    + '&pageNum=' + params.pageNum
    + '&pageSize=' + params.pageSize
    + '&orderBy=' + params.orderBy);
  }));

  it('should get WorkItems by page with null params', async(() => {
    const params={
      facilityId: null,
      patientMrn: null,
      workItemStatusId: null,
      dateOut: null,
      teamMemberId: null,
      orderTypeId: null,
      viewSearchParam: null,
      pageNum: 0,
      pageSize: 10,
      orderBy: "workItemId 1"
    }

    workitemService.getWorkItemsPage(params).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res.content).not.toBeNull();
    });

    const req = httpTestingController.expectOne(baseUrl +'/patient/workitem/getWorkItemsPage'
    + '?facilityId=' + ""
    + '&patientMrn=' + ""
    + '&workItemStatusId=' + ""
    + '&dateOut='+ ""
    + '&teamMemberId='+ ""
    + '&orderTypeId='+ ""
    + '&viewSearchParam=' + ""
    + '&pageNum=' + params.pageNum
    + '&pageSize=' + params.pageSize
    + '&orderBy=' + params.orderBy);
  }));

  it('should get WorkItems by facilityId', async(() => {
    const params={
      facilityId: 1,
    }

    workitemService.getAllWorkItemsByFacilityId(params).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/workitem/getWorkItems'
    + '?facilityId=' + params.facilityId);

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should update work item', async(() => {
    const body={};
    workitemService.updateWorkItem(body).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should create work item', async(() => {
    const body={};
    workitemService.createWorkItem(body).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('should delete workitem by id', async(() => {
    const params={
      workItemId:123,
      userId:1
    }
    workitemService.deleteWorkItem(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/delete?svoId='
    +params.workItemId+ '&modifiedBy='+params.userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));

  it('should delete multiple workitems by id', async(() => {
    const body = [1, 2];
    const userId = 1;
    workitemService.deleteAllWorkItemsById(body, userId).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/deleteAllById?modifiedBy='+userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));

  it('should post attachment data for any given endpoint', async(() => {
    let formData = new FormData();

    const endpoint='/patient/workitem/attachment/create';
    workitemService.postAttachment(formData).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(formData);
    });
    const req = httpTestingController.expectOne(baseUrl +endpoint );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush(formData);

  }));

  it('should throw error while updating work item', async(() => {
    const body={};
    workitemService.updateWorkItem(body).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush("error", {status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('should throw error obj with message while updating work item', async(() => {
    const body={};
    workitemService.updateWorkItem(body).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({message: "error"}, {status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('SearchByICDCode should Search By ICDCode (null condition)', async(() => {
    const icdCode = null;
    workitemService.SearchByICDCode(icdCode).subscribe((res) => {
     expect(res).toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/icd/getByIcdCodeContainingIgnoreCase?icdCode='+icdCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(null);
  }));

  it('[getDenialTypes] should get all types', async(() => {

    const mockDenialList = [
                            { dname: 'Den1' },
                            {dname: 'Den2' }
                              ];
    workitemService.getDenialTypes().subscribe((res) => {
      expect(res).toEqual(mockDenialList);
    });
    const req = httpTestingController.expectOne(baseUrl + '/denialType/getAll');
    expect(req.request.method).toEqual('GET');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    req.flush(mockDenialList);
  }));
  it('[getDenialTypeById] should get all types', async(() => {
    const mockDenial = { dname: 'Den1' };
    workitemService.getDenialTypeById(1).subscribe((res) => {
      expect(res).toEqual(mockDenial);
    });
    const req = httpTestingController.expectOne(baseUrl + '/denialType/getById/1');
    expect(req.request.method).toEqual('GET');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.responseType).toEqual('json');
    req.flush(mockDenial);
  }));

});
