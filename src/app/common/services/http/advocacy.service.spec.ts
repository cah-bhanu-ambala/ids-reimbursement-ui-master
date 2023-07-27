import { HttpErrorResponse, HttpParams, HttpRequest } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { throwError } from 'rxjs';
import { first } from 'rxjs/operators';
import { Advocacy } from 'src/app/models/classes/advocacy';
import { environment } from 'src/environments/environment';

import { AdvocacyService } from './advocacy.service';

describe('AdvocacyService', () => {
  let advocacyService: AdvocacyService;
  let httpTestingController: HttpTestingController;
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

  const advocacy: Advocacy={
    icdCode: "A00",
    patientMrn: "mrn123",
    facilityId: 1,
    advocacyStatusId: 1,
    advocacyTypeId: 1,
    advocacySource: "advsource",
    startDate: "2021-01-13T08:00:00.000Z",
    endDate: "2021-02-04T08:00:00.000Z",
    maxAmountAvail: 100,
    lookBack: "",
    lookBackStartDate: null,
    notes: "",
    patientId: 1,
    drugId: 31,
    createdBy: 1,
    active: true,
    advocacyId: 1,
    icdDescription:"Cholera due to Vibrio cholerae 01, biovar eltor",
    drugProcCode:"J0135",
    facilityName:"Facility 1",
    icdId:1,
    workItemId: 22,
    attachments:[]
};

const advocacyMaintenanceResult =
    {
      "content": [
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 78,
              "notes": null,
              "lookBack": null,
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T15:47:10.736",
              "icdCode": "A04.72",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 67899.0,
              "advocacyStatusName": "Approved",
              "advocacyTypeName": "Commercial Copay - Pharmacy",
              "lookBackStartDate": null,
              "attachments": "79~00021_Workitem-73.pdf,78~MicrosoftTeams-image (10).png",
              "followUp": false
          },
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 76,
              "notes": "",
              "lookBack": "",
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T16:40:18.643",
              "icdCode": "A04.72",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 23433.0,
              "advocacyStatusName": "Advocacy Identified",
              "advocacyTypeName": "Commercial Copay",
              "lookBackStartDate": null,
              "attachments": "76~00021_Workitem-73.pdf",
              "followUp": false
          },
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 74,
              "notes": "",
              "lookBack": "",
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T10:53:57.719",
              "icdCode": "A04.2",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 67899.0,
              "advocacyStatusName": "Advocacy Identified",
              "advocacyTypeName": "Commercial Copay",
              "lookBackStartDate": null,
              "attachments": "74~MicrosoftTeams-image (10).png",
              "followUp": false
          },
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 73,
              "notes": null,
              "lookBack": null,
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T10:50:10.697",
              "icdCode": "A54.00",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 67899.0,
              "advocacyStatusName": "Advocacy Identified",
              "advocacyTypeName": "Commercial Copay",
              "lookBackStartDate": null,
              "attachments": "73~73482304_Workitem-194 (4).pdf",
              "followUp": false
          },
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 72,
              "notes": "",
              "lookBack": "",
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T10:48:58.006",
              "icdCode": "A54.00",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 67899.0,
              "advocacyStatusName": "Advocacy Identified",
              "advocacyTypeName": "Commercial Copay",
              "lookBackStartDate": null,
              "attachments": "72~73482304_Workitem-194 (4).pdf",
              "followUp": false
          }
      ],
      "pageable": {
          "sort": {
              "sorted": true,
              "unsorted": false,
              "empty": false
          },
          "pageSize": 5,
          "pageNumber": 0,
          "offset": 0,
          "unpaged": false,
          "paged": true
      },
      "totalPages": 9,
      "totalElements": 45,
      "last": false,
      "numberOfElements": 5,
      "size": 5,
      "number": 0,
      "sort": {
          "sorted": true,
          "unsorted": false,
          "empty": false
      },
      "first": true,
      "empty": false
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AdvocacyService]
    });
    advocacyService = TestBed.inject(AdvocacyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(advocacyService).toBeTruthy();
  });

  it('should set Advocacy Info', () => {
    expect(advocacyService.setAdvocacyInfo(advocacy)).not.toBeNull();
  });

  it('should get Advocacy Info', () => {
    expect(advocacyService.getAdvocacyInfo()).not.toBeNull();
  });

  it('should set route', () => {
    expect(advocacyService.setRouteTo("/dashboard/advocacy/addAppointment")).not.toBeNull();
  });

  it('should get route', () => {
    expect(advocacyService.getRouteTo()).not.toBeNull();
  });

  it('should get facility list', async(() => {
    advocacyService.getFacilityList().subscribe((res) => {
      expect(res).toEqual(facilityListdata);
    });
    const req = httpTestingController.expectOne(baseUrl +'/facility/getApprovedFacilities');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(facilityListdata);
  }));

  it('should get Drug list', async(() => {
    advocacyService.getDrugList().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/drug/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get ICD list', async(() => {
    advocacyService.getIcdList().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/icd/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get advocacy status', async(() => {
    advocacyService.getAllAdvocacyStatus().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/advocacyStatus/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get advocacy type', async(() => {
    advocacyService.getAllAdvocacyTypes().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/advocacyType/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get all appointment type', async(() => {
    advocacyService.getAllAppointmentTypes().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/appointmentType/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get all appointment status', async(() => {
    advocacyService.getAllAppointmentStatus().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/appointmentStatus/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should Search for all opportunities', async(() => {
    let Searchvalue=''
    advocacyService.SearchForAllOpportunities(Searchvalue).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/advocacyOpportunity/getAdvocacyOpportunitiesBySearchParam?advocacyOpportunitySearchParam=' + Searchvalue);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should Search for opportunities', async(() => {
    let searchParams = {
      primaryInsuranceId: 1,
      secondaryInsuranceId: 1,
      advocacyOpportunityTypeId: 1
    }

   advocacyService.SearchForOpportunities(searchParams).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/advocacyOpportunity/getAdvocacyOpportunities?' + 'primaryInsuranceId='
    + searchParams.primaryInsuranceId + '&secondaryInsuranceId=' + searchParams.secondaryInsuranceId + '&advocacyOpportunityTypeId=' + searchParams.advocacyOpportunityTypeId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should delete Adv Opp', async(() => {
   const oppId = 1;
   let userId: 1;

   advocacyService.deleteAdvOpp(oppId,userId).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/advocacyOpportunity/delete?svoId=' + oppId + '&modifiedBy=' + userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));

  it('should get Primary Insurance List', async(() => {
    advocacyService.getPrimaryInsuranceList().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/insurance/getPrimaryInsurance');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get Secondary Insurance List', async(() => {
    advocacyService.getSecondaryInsuranceList().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/insurance/getSecondaryInsurance');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get Advocacy Opportunity Types', async(() => {
    advocacyService.getAdvocacyOpportunityTypes().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/advocacyOpportunityType/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should create Opportunity Type', async(() => {
    const body={};
    advocacyService.createOpportunityType(body).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/advocacyOpportunity/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('should create Opportunity Type throw error with message', async(() => {
    const body={};
    advocacyService.createOpportunityType(body).subscribe((res) => {
    }, (error) => {
      expect(error).not.toBeNull();
    });

    const req = httpTestingController.expectOne(baseUrl + '/advocacyOpportunity/create');
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'});
    expect(req.request.method).toEqual('POST');
  }));


  it('should update Opportunity Type', async(() => {
    const body={};
    advocacyService.updateOpportunityType(body).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/advocacyOpportunity/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should update Opportunity Type throw error with message', async(() => {
    const body={};
    advocacyService.updateOpportunityType(body).subscribe((res) => {
    }, (error) => {
      expect(error).not.toBeNull();
    });

    const req = httpTestingController.expectOne(baseUrl + '/advocacyOpportunity/update');
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'});
    expect(req.request.method).toEqual('PUT');
  }));

  it('should post attachment data for any given endpoint', async(() => {
    let formData = new FormData();
    advocacyService.postAttachment(formData).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(formData);
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/appointment/attachment/create' );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush(formData);

  }));

  it('should delete Appointment Attachment', async(() => {
    let searchParams = {
      svoIdArray: [1],
      modifiedBy: 1

    }

   advocacyService.deleteAttachment(searchParams).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/appointment/attachment/delete?svoIds=' + 1 + '&modifiedBy=' + searchParams.modifiedBy);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));

  it('should get Appointment Attachment', async(() => {
    const id = 1;
    let response = new Blob();
    advocacyService.getAttachmentById(id).subscribe((res) => {
       expect(res).not.toBeNull();
     });
     const req = httpTestingController.expectOne(baseUrl +'/patient/appointment/attachment/downloadFile/' + id);
     expect(req.cancelled).toBeFalsy();
     expect(req.request.method).toEqual('GET');
     req.flush(response);
   }));

  it('should get advocacies by facility ids, patientMrn, advocacyStatusIds', async(() => {

    let advocacyParams={
      patientMrnsearchParam: '0003',
      facilityIdSearchParam: '19',
      advStatusIdSearchParam: '11',
      pageNum: 0,
      pageSize: 5,
      orderBy: ['advocacyId -1','param 2'],
      pagination:true
    }
    advocacyService.getAdvocacyMaintenanceSearchParamsForPagination(advocacyParams).subscribe((response) => {
      expect(response).toEqual(advocacyMaintenanceResult)
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacyMaintenance/getAdvocacyMaintenanceSearchParamsForPagination?patientMrnsearchParam='
         +advocacyParams.patientMrnsearchParam
         +'&facilityIdSearchParam='+ advocacyParams.facilityIdSearchParam
         +'&advStatusIdSearchParam='+advocacyParams.advStatusIdSearchParam
         +'&pageNum='+advocacyParams.pageNum
         +'&pageSize='+advocacyParams.pageSize
         + '&orderBy=advocacyId%20-1,param%202'
         + '&pagination=' +advocacyParams.pagination);

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(advocacyMaintenanceResult);
    httpTestingController.verify();
  }));

  it('should get advocacies by facility ids, patientMrn, advocacyStatusIds', async(() => {

    let advocacyParams={
      patientMrnsearchParam: '0003',
      facilityIdSearchParam: '19',
      advStatusIdSearchParam: '11',
      pageNum: 0,
      pageSize: 5,
      orderBy: ['advocacyId -1','param 2'],
      pagination:false
    }
    advocacyService.getAdvocacyMaintenanceSearchParamsForPagination(advocacyParams).subscribe((response) => {
      expect(response).toEqual(advocacyMaintenanceResult)
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacyMaintenance/getAdvocacyMaintenanceSearchParamsForPagination?patientMrnsearchParam='
         +advocacyParams.patientMrnsearchParam
         +'&facilityIdSearchParam='+ advocacyParams.facilityIdSearchParam
         +'&advStatusIdSearchParam='+advocacyParams.advStatusIdSearchParam
         +'&pageNum='+advocacyParams.pageNum
         +'&pageSize='+advocacyParams.pageSize
         + '&orderBy=advocacyId%20-1,param%202'
         + '&pagination=' +advocacyParams.pagination);

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(advocacyMaintenanceResult);
    httpTestingController.verify();
  }));

});
