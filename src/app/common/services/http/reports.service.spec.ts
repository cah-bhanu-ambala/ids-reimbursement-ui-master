import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { ReportsService } from './reports.service';

describe('ReportsService', () => {
  let reportsService: ReportsService;
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

  let httpTestingController: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReportsService]
    });
    reportsService = TestBed.inject(ReportsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(reportsService).toBeTruthy();
  });

  it('should get facility list', async(() => {
    reportsService.getAllFacilities().subscribe((res) => {
      expect(res).toEqual(facilityListdata);
    });
    const req = httpTestingController.expectOne(baseUrl +'/facility/getApprovedFacilities');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(facilityListdata);
  }));

  it('should get advocacy type', async(() => {
    reportsService.getAllAdvocacyTypes().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/advocacyType/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get team members list', async(() => {
    const params={userId:1};
    reportsService.getTeamMemberList(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/user/getTeamMemberList?userId='+params.userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get delinquency details', async(() => {
    const params={
      facilityIds:[],
      dateIn: '',
      userId:1
    };
    reportsService.getDelinquencyDetails(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/workitem/getDelinquencyWorkItems?facilityIds='
    + params.facilityIds +
    '&dateIn=' + params.dateIn + '&userId=' + params.userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get summary details when teamemberIds are not null', async(() => {
    const params={
      teamMembersIds:[],
      facilityIds:[],
      fromDate: '',
      toDate: '',
      dateType:'',
      userId:1
    };
    reportsService.getSummaryDetails(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/workitem/getWorkItemSummaryReport?facilityIds=' + params.facilityIds +
    '&fromDate=' + params.fromDate +'&toDate=' + params.toDate + '&dateType=' + params.dateType + '&teamMembersIds='+params.teamMembersIds + '&userId=' + params.userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get advocacy analysis details when advocacyTypeIds is not null', async(() => {
    const params={
      advocacyTypeIds:[],
      facilityIds:[],
      dateCreatedFrom: '',
      dateCreatedTo:'',
      userId:1
    };
    reportsService.getAdvocacyAlalysisDetails(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +
      '/patient/advocacy/getAdvocacyAnalysisReport?facilityIds=' + params.facilityIds +
    '&advocacyTypeIds=' + params.advocacyTypeIds + '&dateCreatedFrom=' + params.dateCreatedFrom
     + '&dateCreatedTo=' +
    params.dateCreatedTo + '&userId=' + params.userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get billing details', async(() => {
    const params={
      facilityIds:[],
      dateOutFrom: '',
      dateOutTo:'',
      userId:1
    };
    reportsService.getBillingDetails(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/workitem/getBillingReport?facilityIds='
    + params.facilityIds +
    '&dateOutFrom=' + params.dateOutFrom + '&dateOutTo=' + params.dateOutTo + '&userId=' + params.userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get work status details', async(() => {
    const params={
      facilityIds:[],
      fromDate: '',
      toDate:'',
      userId:1
    };
    reportsService.getWorkstatusDetails(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/workitem/getWorkItemStatusReport?facilityIds='
     + params.facilityIds + '&userId=' + params.userId+'&fromDate=' + params.fromDate + '&toDate=' + params.toDate);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should throw error obj with message while retrieving facility list', async(() => {
    reportsService.getAllFacilities().subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/facility/getApprovedFacilities');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('should throw error while retrieving facility list', async(() => {
    reportsService.getAllFacilities().subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/facility/getApprovedFacilities');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush("error",{status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('getBossInvoiceDetails should post to server', async(() => {
    const params={
      wbsNames: ['test'],
      dateOutFrom: '2021-02-02T08:45:12.587Z',
      dateOutTo: '2021-12-02T08:45:12.587Z'
    };
    reportsService.getBossInvoiceDetails(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/getBossBillingReport');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({})

  }));

  it('getdeletedWorkItemDetails should get data from the server', async(() => {
    const params={
      facilityIds:['123'],
      dateOutFrom:"01/01/2022",
      dateOutTo:"12/31/2022"
    };
    reportsService.getdeletedWorkItemDetails(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/getDeletedWorkItems' 
    + '?facilityIds=' + params.facilityIds
    + '&dateFrom=' + params.dateOutFrom
    + '&dateTo=' + params.dateOutTo );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({})

  }));

});
