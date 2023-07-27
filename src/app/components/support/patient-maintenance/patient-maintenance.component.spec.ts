import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { PatientService } from 'src/app/common/services/http/patient.service';

import { PatientMaintenanceComponent } from './patient-maintenance.component';

describe('PatientMaintenanceComponent', () => {
  let component: PatientMaintenanceComponent;
  let fixture: ComponentFixture<PatientMaintenanceComponent>;
  let patientService: PatientService;
  let toastr: ToastrService;

  const primaryInsuranceList =[
    {
      "active": true,
      "createdDate": "2021-02-01T17:37:57.740+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:37:57.740+0000",
      "modifiedBy": 1,
      "insuranceId": 3,
      "insuranceType": "Primary",
      "insuranceName": "Commercial"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:37:57.740+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:37:57.740+0000",
      "modifiedBy": 1,
      "insuranceId": 4,
      "insuranceType": "Primary",
      "insuranceName": "Government"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:37:57.740+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:37:57.740+0000",
      "modifiedBy": 1,
      "insuranceId": 5,
      "insuranceType": "Primary",
      "insuranceName": "Medicaid Managed"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:37:57.740+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:37:57.740+0000",
      "modifiedBy": 1,
      "insuranceId": 6,
      "insuranceType": "Primary",
      "insuranceName": "Medicaid State"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:37:57.740+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:37:57.740+0000",
      "modifiedBy": 1,
      "insuranceId": 7,
      "insuranceType": "Primary",
      "insuranceName": "Medicare A"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:37:57.740+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:37:57.740+0000",
      "modifiedBy": 1,
      "insuranceId": 8,
      "insuranceType": "Primary",
      "insuranceName": "Medicare A & B"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:37:57.740+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:37:57.740+0000",
      "modifiedBy": 1,
      "insuranceId": 9,
      "insuranceType": "Primary",
      "insuranceName": "Medicare Replacement"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:37:57.740+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:37:57.740+0000",
      "modifiedBy": 1,
      "insuranceId": 10,
      "insuranceType": "Primary",
      "insuranceName": "Self Pay"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:37:57.740+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:37:57.740+0000",
      "modifiedBy": 1,
      "insuranceId": 1,
      "insuranceType": "Primary",
      "insuranceName": "Unknown"
    }
  ];

  const approvedFacilityData=[
    {
      "active": true,
      "createdDate": "2021-02-01T17:54:57.847+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:55:16.974+0000",
      "modifiedBy": 1,
      "facilityId": 1,
      "facilityName": "Facility 1",
      "facilityNickName": "Facility 1",
      "ein": "1234567890",
      "contacts": "Dr ABC",
      "facilityNPI": "1234567890",
      "address": "Houston",
      "phone": "1112223333",
      "fax": "4445556666",
      "status": "Approved",
      "facilityBillingDetails": [
        {
          "active": true,
          "createdDate": "2021-02-01T17:54:57.974+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:54:57.974+0000",
          "modifiedBy": 1,
          "facilityBillingDetailId": 1,
          "facilityId": 1,
          "billingLevelId": 5,
          "billingAmount": 1,
          "billingLevelName": "PHARM L1"
        }
      ]
    }
  ];

  const searchResultData=[
    {
      active: true,
      createdDate: "2021-02-01T18:01:06.257+0000",
      createdBy: 1,
      modifiedDate: "2021-02-16T02:47:47.012+0000",
      modifiedBy: 1,
      patientId: 1,
      mrn: "mrn123",
      facilityId: 15,
      primaryInsuranceId: 3,
      secondaryInsuranceId: null,
      proofOfIncome: 0,
      householdSize: null,
      contactStatusId: 1,
      notes: "",
      firstContactDate: null,
      firstContactOutcome: 1,
      secondContactDate: null,
      secondContactOutcome: 2,
      thirdContactDate: null,
      thirdContactOutcome: 3,
      facilityName: "43244",
      facilityNPI: "23222",
      facilityEin: "343"
  }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientMaintenanceComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule,NgbModule,
        ToastrModule.forRoot(),BrowserAnimationsModule ] ,
      providers:[PatientService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientMaintenanceComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(PatientService);
   component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[MRN-Check]-should check MRN value is required', () => {
    let mrn = component.formPatient.controls['mrn'];
    expect(mrn.valid).toBeFalsy();
    expect(mrn.pristine).toBeTruthy();
    expect(mrn.errors['required']).toBeTruthy();
  });

  it('[facility Id-Check]-should check facility Id value is required', () => {
    let facilityId = component.formPatient.controls['facilityId'];
    expect(facilityId.valid).toBeFalsy();
    expect(facilityId.pristine).toBeTruthy();
    expect(facilityId.errors['required']).toBeTruthy();
  });

  it('[primary Insurance Id-Check]-should check primary Insurance Id value is required', () => {
    let primaryInsuranceId = component.formPatient.controls['primaryInsuranceId'];
    expect(primaryInsuranceId.valid).toBeFalsy();
    expect(primaryInsuranceId.pristine).toBeTruthy();
    expect(primaryInsuranceId.errors['required']).toBeTruthy();
  });

  it('[MRN-Check]-should check MRN errors', () => {
    let mrn = component.formPatient.controls['mrn'];
    mrn.setValue('abcdefzhijklmnopqrstuvwxyzzz'); // Gave more than 50 chars
    expect(mrn.errors).not.toBeNull();
    expect(mrn.valid).toBeFalsy();
    mrn.setValue('12_*&^'); // Gave characters otherthan alpha numeric
    expect(mrn.errors).not.toBeNull();
    expect(mrn.valid).toBeFalsy();
    mrn.setValue('abcd123'); // gave valid entry
    expect(mrn.errors).toBeNull();
    expect(mrn.valid).toBeTruthy();
  });

  it('[Proof Of Income-Check]-should check Proof Of Income errors', () => {
    let poi = component.formPatient.controls['proofOfIncome'];
    poi.setValue(234567890000); // Gave more than 10 chars
    expect(poi.errors).not.toBeNull();
    expect(poi.valid).toBeFalsy();
    poi.setValue('abc234567'); // gave alphabets which is not valid
    expect(poi.errors).not.toBeNull();
    expect(poi.valid).toBeFalsy();
    poi.setValue(3456); // valid entry
    expect(poi.errors).toBeNull();
    expect(poi.valid).toBeTruthy();
  });


  it('[Household Size-Check]-should check Household Size errors', () => {
    let householdSize = component.formPatient.controls['householdSize'];
    householdSize.setValue(4560); // gave more than 2 digits
    expect(householdSize.errors).toBeNull();
    // expect(householdSize.valid).toBeFalsy();
    // householdSize.setValue('abcdf'); // gave alphabets which is not valid
    // expect(householdSize.errors).toBeNull();
    // expect(householdSize.valid).toBeFalsy();
    // householdSize.setValue(24);// valid entry
    // expect(householdSize.errors).toBeNull();
    // expect(householdSize.valid).toBeTruthy();
  });

  it('[Notes Size-Check]-should check Notes errors', () => {
    let notes = component.formPatient.controls['notes'];
    notes.setValue('test)(*&^'); // gave special characters
    expect(notes.errors).toBeNull();
    expect(notes.valid).toBeTrue();
    notes.setValue('test the notes');// valid entry
    expect(notes.errors).toBeNull();
    expect(notes.valid).toBeTrue();
  });

  it('[Contact Form-Check]-Should check form is invalid if no values are entered', () => {
    expect(component.formPatient.valid).toBeFalsy();
  });

  it('[Form-Check]-Should check form is valid when values are entered', () => {
    component.formPatient.controls['mrn'].setValue('test123');
    component.formPatient.controls['facilityId'].setValue(2);
    component.formPatient.controls['primaryInsuranceId'].setValue(3);
    component.formPatient.controls['proofOfIncome'].setValue(4500);
    component.formPatient.controls['householdSize'].setValue(55);
    component.formPatient.controls['contactStatusId'].setValue(1);
    expect(component.formPatient.valid).toBeTruthy();
  });

  it('[getPrimaryInsuranceList] should get primary insurance list', async(() => {
    let spy=spyOn(patientService, 'getPrimaryInsuranceList').and.returnValue(of(primaryInsuranceList));
    component.getPrimaryInsuranceList();
    expect(component.primaryInsuranceList).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getPrimaryInsuranceList] should throw error', async(() => {
    let err="error"
    spyOn(patientService, 'getPrimaryInsuranceList').and.returnValue(throwError(err));
    component.getPrimaryInsuranceList();
    expect(patientService.getPrimaryInsuranceList).toHaveBeenCalled();
  }));

  it('[getSecondaryInsuranceList] should get secondary insurance list', async(() => {
    let spy=spyOn(patientService, 'getSecondaryInsuranceList').and.returnValue(of(primaryInsuranceList));
    component.getSecondaryInsuranceList();
    expect(component.secondaryInsuranceList).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getSecondaryInsuranceList] should throw error', async(() => {
    let err="error"
    spyOn(patientService, 'getSecondaryInsuranceList').and.returnValue(throwError(err));
    component.getSecondaryInsuranceList();
    expect(patientService.getSecondaryInsuranceList).toHaveBeenCalled();
  }));

  it('[getFacilityList] should get list', async(() => {
    let spy=spyOn(patientService, 'getFacilityList').and.returnValue(of(approvedFacilityData));
    component.getFacilityList();
    expect(component.facilities).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getFacilityList] should throw error', async(() => {
    let err="error"
    spyOn(patientService, 'getFacilityList').and.returnValue(throwError(err));
    component.getFacilityList();
    expect(patientService.getFacilityList).toHaveBeenCalled();
  }));

  it('[getContactStatus] should get list', async(() => {
    let spy=spyOn(patientService, 'getContactStatus').and.returnValue(of({}));
    component.getContactStatus();
    expect(component.contactStatuses).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getContactStatus] should throw error', async(() => {
    let err="error"
    const spy =spyOn(patientService, 'getContactStatus').and.returnValue(throwError(err));
    component.getContactStatus();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getFirstOutcomeList] should get list', async(() => {
    let spy=spyOn(patientService, 'getFirstOutcomeList').and.returnValue(of({}));
    component.getFirstOutcomeList();
    expect(component.outcomes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getFirstOutcomeList] should throw error', async(() => {
    let err="error"
    spyOn(patientService, 'getFirstOutcomeList').and.returnValue(throwError(err));
    component.getFirstOutcomeList();
    expect(patientService.getFirstOutcomeList).toHaveBeenCalled();
  }));

  it('[getSecondtOutcomeList] should get list', async(() => {
    let spy=spyOn(patientService, 'getSecondtOutcomeList').and.returnValue(of(primaryInsuranceList));
    component.getSecondtOutcomeList();
    expect(component.secondOutcomes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getSecondtOutcomeList] should throw error', async(() => {
    let err="error"
    spyOn(patientService, 'getSecondtOutcomeList').and.returnValue(throwError(err));
    component.getSecondtOutcomeList();
    expect(patientService.getSecondtOutcomeList).toHaveBeenCalled();
  }));

  it('[getThirdOutcomeList] should get list', async(() => {
    let spy=spyOn(patientService, 'getThirdOutcomeList').and.returnValue(of(primaryInsuranceList));
    component.getThirdOutcomeList();
    expect(component.thirdOutcomes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getThirdOutcomeList] should throw error', async(() => {
    let err="error"
    spyOn(patientService, 'getThirdOutcomeList').and.returnValue(throwError(err));
    component.getThirdOutcomeList();
    expect(patientService.getThirdOutcomeList).toHaveBeenCalled();
  }));

  it('[onSearch] should search for facility and results found', async(() => {
    component.formSearchPatient.controls['facilityId'].setValue(1);
    component.formSearchPatient.controls['mrn'].setValue('mrn123');
    spyOn(patientService, 'searchByFacilityAndMrn').and.returnValue(of(searchResultData));
    component.onSearch('');
    expect(component.searchResult).toEqual(searchResultData);
    expect(patientService.searchByFacilityAndMrn).toHaveBeenCalled();
  }));

  it('[onSearch] should search for facility and results empty', async(() => {
    component.formSearchPatient.controls['facilityId'].setValue('Facility 1');
    component.formSearchPatient.controls['mrn'].setValue('mrn123');
    spyOn(patientService, 'searchByFacilityAndMrn').and.returnValue(of([]));
    spyOn(component, 'showInfo').and.callFake(()=>"No records");
    component.onSearch('');
    expect(component.searchResult).toEqual([]);
    expect(patientService.searchByFacilityAndMrn).toHaveBeenCalled();
  }));

  it('[onSearch] should throw error', async(() => {
    component.formSearchPatient.controls['facilityId'].setValue(1);
    component.formSearchPatient.controls['mrn'].setValue('mrn123');
    spyOn(component, 'showFailure').and.callFake(()=>"Failed");
    let spy=spyOn(patientService, 'searchByFacilityAndMrn').and.returnValue(throwError("error"));
    component.onSearch('');
    expect(spy).toHaveBeenCalled();
  }));

  it('should return formSearchPatient form with values', async(() => {
    component.formSearchPatient.controls['facilityId'].setValue(1);
    component.formSearchPatient.controls['mrn'].setValue('mrn123');
    expect(component.sf).toBeTruthy();
  }));

  it('[onSubmit] should not update data when form is invalid', async(() => {
    component.submitted = true;
    expect(component.onSubmit()).toBeFalse();
  }));

  it('[onSubmit] should update form when all the data is supplied', async(() => {
    component.isUpdate=true;
    component.formPatient.controls['mrn'].setValue('mrn123');
    component.formPatient.controls['facilityId'].setValue(1);
    component.formPatient.controls['primaryInsuranceId'].setValue(3);
    component.formPatient.controls['proofOfIncome'].setValue(4500);
    component.formPatient.controls['householdSize'].setValue(55);
    component.formPatient.controls['contactStatusId'].setValue(1);
    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    spyOn(patientService, 'updatePatient').and.returnValue(of({})) ;
    component.onSubmit();
    expect(patientService.updatePatient).toHaveBeenCalled();
  }));

  it('[onSubmit] should submit with all date fields', async(() => {
    component.isUpdate=true;
    component.formPatient.controls['mrn'].setValue('mrn123');
    component.formPatient.controls['facilityId'].setValue(1);
    component.formPatient.controls['primaryInsuranceId'].setValue(3);
    component.formPatient.controls['proofOfIncome'].setValue(4500);
    component.formPatient.controls['householdSize'].setValue(55);
    component.formPatient.controls['firstContactDate'].setValue({year:2021,month:2,day:1});
    component.formPatient.controls['secondContactDate'].setValue({year:2021,month:2,day:2});
    component.formPatient.controls['thirdContactDate'].setValue({year:2021,month:2,day:3});
    component.formPatient.controls['contactStatusId'].setValue(1);

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy = spyOn(patientService, 'updatePatient').and.returnValue(of({})) ;
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
   }));

    it('[onSubmit] should throw error when during onsubmit create', async(() => {
    component.isUpdate=true;
    component.formPatient.controls['mrn'].setValue('mrn123');
    component.formPatient.controls['facilityId'].setValue(1);
    component.formPatient.controls['primaryInsuranceId'].setValue(3);
    component.formPatient.controls['proofOfIncome'].setValue(4500);
    component.formPatient.controls['householdSize'].setValue(55);
    component.formPatient.controls['contactStatusId'].setValue(1);

    spyOn(component, 'showFailure').and.callFake(()=>"Failed");
    const spy= spyOn(patientService, 'updatePatient').and.returnValue(throwError("error")) ;
    component.onSubmit();
    expect(component.submitted).toBeTrue();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSubmit] should throw error when during onsubmit Update', async(() => {
    component.isUpdate=false;
    component.formPatient.controls['mrn'].setValue('mrn123');
    component.formPatient.controls['facilityId'].setValue(1);
    component.formPatient.controls['primaryInsuranceId'].setValue(3);
    component.formPatient.controls['proofOfIncome'].setValue(4500);
    component.formPatient.controls['householdSize'].setValue(55);
    component.formPatient.controls['contactStatusId'].setValue(1);

    spyOn(component, 'showFailure').and.callFake(()=>"Failed");
    const spy= spyOn(patientService, 'createPatient').and.returnValue(throwError("error")) ;
    component.onSubmit();
    expect(component.submitted).toBeTrue();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onEdit] should navigate to patientMaintenance when all values are set', inject([Router], (router: Router) => {
    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(patientService, 'getByPatientId').and.returnValue(of(searchResultData[0])) ;
    const patientId=1;
    spyOn(router, 'navigate').and.stub();
    component.onEdit(patientId);
    expect(spy).toHaveBeenCalled();
   }));

   it('[onEdit] should throw error', inject([Router], (router: Router) => {
    spyOn(component, 'showFailure').and.callFake(()=>"Failed");
    const spy =spyOn(patientService, 'getByPatientId').and.returnValue(throwError("Error")) ;
    const patientId=1;
    component.onEdit(patientId);
    expect(spy).toHaveBeenCalled();
   }));

   it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.submitted).toBeFalse();
    expect(component.formPatient.pristine).toBeTrue();
  }));

  it('[onCancel] should cancel form submission', async(() => {
    component.onCancel();
    expect(component.isUpdate).toBeFalse();
  }));

  it('[loadPatientDetails] should not get any data when datasource is empty', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.patientDatasource = searchResultData;
    component.loadPatientDetails(event);
    tick(500);
    expect(component.patientGridloading  ).toBeFalse();
    expect(component.patientSearchResult  ).not.toBeNull();
  }));

  it('[showSuccess] works', fakeAsync((msg:any) => {
    msg = 'success';
    component.showSuccess(msg);
    flush();
    expect(component.showSuccess).toBeTruthy();
  }));

  it('[showInfo] works', fakeAsync((msg:any) => {
    msg = 'info';
    component.showInfo(msg);
    flush();
    expect(component.showInfo).toBeTruthy();
  }));

  it('[showFailure] works', fakeAsync((msg:any) => {
    msg = 'error';
    component.showFailure(msg);
    flush();
    expect(component.showFailure).toBeTruthy();
  }));
  it('[exportExcel] should export data to excel file', fakeAsync(() => {
    component.patientDatasource=searchResultData;
    component.exportExcel();
    flush();
    expect(component.exportExcel).toBeTruthy();

  }));
});
