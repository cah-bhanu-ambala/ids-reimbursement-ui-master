import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { PatientService } from './patient.service';

describe('PatientService', () => {
  let patientService: PatientService;
  let httpTestingController: HttpTestingController;

  const baseUrl = environment.serviceUrl;
  const advocacy={
    advocacyId: 1,
    patientId: 1,
    workItemId: 1,
    advocacyStatusId: 1,
    advocacyTypeId: 1,
    advocacySource: "advsource",
    diagnosisForAdvocacyId: 1,
    drugForAdvocacy: "advdrug",
    startDate: "2021-01-13T08:00:00.000+0000",
    endDate: "2021-02-04T08:00:00.000+0000",
    maxAmountAvail: 100,
    lookBack: "",
    lookBackStartDate: null,
    notes: "",
    active: true,
    createdDate: "2021-02-07T02:18:04.634+0000",
    createdBy: 1,
    modifiedDate: "2021-02-07T02:18:04.634+0000",
    modifiedBy: 1,
    attachments: [],
    facilityName: "Facility 1",
    facilityNPI: "1234567890",
    facilityEin: "1234567890",
    advocacyTypeName: "Commercial Copay",
    advocacyStatusName: "Application to Clinic",
    icdCode: "A00",
    patientMrn: "mrn123"
};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PatientService]
    });
    patientService = TestBed.inject(PatientService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(patientService).toBeTruthy();
  });

  it('should update Advocacy', async(() => {
    patientService.updateAdvocacy(advocacy).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(advocacy);
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush(advocacy);
  }));

  it('should create Advocacy', async(() => {
    patientService.createAdvocacy(advocacy).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(advocacy);
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush(advocacy);
  }));

  it('should post attachment', async(() => {
    let formData = new FormData();
    patientService.postAttachment(formData).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(formData);
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/attachment/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush(formData);
  }));

  it('should search by facility id or mrn', async(() => {
    let params={
      facilityId:1,
      mrn: 'mrn123',
      advocacyNeeded: 'Y',
      pageSize: 5,
      pageNum: 0
    }
    patientService.searchPatientByAny(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/workitem/drugCode/findWorkItemDrugCodeByAdvocacyNeeded?facilityId='
    +params.facilityId+ '&patientMrn='+ params.mrn+'&advocacyNeeded='+params.advocacyNeeded+'&pageNum='+params.pageNum+'&pageSize='+params.pageSize);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get advocacies by facility id', async(() => {
    let params={
      facilityIds:[1],
      mrn: 'mrn123',
      advocacyStatusIds :[1]
    }
    patientService.getAdvocaciesByFacilityId(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/getAdvocacies?facilityIds='
   +params.facilityIds+ '&patientMrn=' +params.mrn+'&advocacyStatusIds=' +params.advocacyStatusIds );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should delete advocacies by id', async(() => {
    let params={
      svoId :1,
      modifiedBy: 1
    }
    patientService.deleteAdvocacyById(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/advocacy/delete?svoId='
    +params.svoId +'&modifiedBy='+params.modifiedBy);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));

  it('should get facility list', async(() => {
    const id=1;
    patientService.getAdvocacyById(id).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/advocacy/getById/'+id);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get appointment list', async(() => {
    const id=1;
    patientService.getAppointmentByPatientId(id).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/appointment/getAllAppointmentsByAdvocacyId/'+id);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should update appointment', async(() => {
    patientService.updateAppointment({}).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/appointment/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should create appointment', async(() => {
    patientService.createAppointment({}).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/appointment/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('[getPrimaryInsuranceList] should get PrimaryInsurance List', async(() => {
    patientService.getPrimaryInsuranceList().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/insurance/getPrimaryInsurance');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getSecondaryInsuranceList] should get get Secondary Insurance List', async(() => {
    patientService.getSecondaryInsuranceList().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/insurance/getSecondaryInsurance');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getFacilityList] should get Facility List', async(() => {
    patientService.getFacilityList().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/facility/getApprovedFacilities');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getContactStatus] should get Contact Status', async(() => {
    patientService.getContactStatus().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/contactStatus/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getFirstOutcomeList] should get FirstOutcome List', async(() => {
    patientService.getFirstOutcomeList().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/contactOutcome/getFirstOutcomeTypes');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getSecondtOutcomeList] should get SecondtOutcome List', async(() => {
    patientService.getSecondtOutcomeList().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/contactOutcome/getSecondOutcomeTypes');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getThirdOutcomeList] should get ThirdOutcome List', async(() => {
    patientService.getThirdOutcomeList().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/contactOutcome/getThirdOutcomeTypes');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[searchByFacilityAndMrn] should search By Facility And Mrn', async(() => {
    const facilityId = 7;
    const mrn ='mrn';
    patientService.searchByFacilityAndMrn(mrn).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/getPatientsBySearchParam?patientSearchParam='+mrn);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getByPatientId] should get By PatientId', async(() => {
    const patientId = 7;
    patientService.getByPatientId(patientId).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/getById/' + patientId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should create a new patient', async(() => {
    const body={};
    patientService.createPatient(body).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('should update patient details', async(() => {
    const body={};
    patientService.updatePatient(body).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));


  it('should throw error obj with message while updating patient details', async(() => {
    const body={};
    patientService.updatePatient(body).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('should throw error while updating patient details', async(() => {
    const body={};
    patientService.updatePatient(body).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush("error",{status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('[getClinicRespondedPatients] should get By getClinicRespondedPatients', async(() => {
    const params ={
      facilityId: '123',
      mrn: '45'
    };
    patientService.getClinicRespondedPatients(params).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/patient/getClinicRespondedPatients?facilityId=' + params.facilityId
    + '&mrn=' + params.mrn);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[deleteAppointmentById] should delete based on params', async(() => {
    const params ={
      svoId: '123',
      modifiedBy: 'tester'
    };
    patientService.deleteAppointmentById(params).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +
      '/patient/appointment/delete?svoId=' +
      params.svoId +
      '&modifiedBy=' +
      params.modifiedBy);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));

  it('[rejectRequestToDelete] should reject delete ', async(() => {
    let body = {};
    patientService.rejectRequestToDelete(body).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +
      '/patient/appointment/rejectRequestToDelete');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('[updatePatientInfoInCustomerWorkItem] should update patient info ', async(() => {
    let body = {};
    patientService.updatePatientInfoInCustomerWorkItem(body).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +
      '/customerWorkItem/updatePatientInfo');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should delete multiple patients by id', async(() => {
    const body = [1, 2];
    const userId = 1;
    patientService.deleteAllPatientsById(body, userId).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/patient/deleteAllById?modifiedBy='+userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));


  // fit('[deleteAttachment] should delete attachment based on params', async(() => {
  //   const params ={
  //     svoIdArray: [{svoIds: '123'}, {svoIds: '456'}],
  //     modifiedBy: 'tester'
  //   };
  //   patientService.deleteAttachment(params).subscribe((res) => {
  //    expect(res).not.toBeNull();
  //   });
  //   const req = httpTestingController.expectOne(baseUrl +
  //     '/patient/advocacy/attachment/delete');
  //   expect(req.cancelled).toBeFalsy();
  //   expect(req.request.method).toEqual('DELETE');
  //   req.flush({});
  // }));


});
