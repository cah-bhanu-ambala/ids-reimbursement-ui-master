import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { ViewPatientDataComponent } from './view-patient-data.component';

describe('ViewPatientDataComponent', () => {
  let component: ViewPatientDataComponent;
  let formBuilder: FormBuilder;
  let fixture: ComponentFixture<ViewPatientDataComponent>;
  let patientService: PatientService;
  let toastr: ToastrService;

  const approvedFacilityData = [
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

  const searchResultData = [
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
      declarations: [ViewPatientDataComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, NgbModule,
        ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [PatientService,ChangeDetectorRef]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPatientDataComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(PatientService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return form',async(()=>{ 
    component.viewPatientForm =new FormGroup({});
    component.showError = true;
    component.searched = true;
    component.showGrid = false;
    expect(component.f).not.toBeNull();
  }))  
  
  it('should get facility list', async(() => {
    let spy=spyOn(patientService, 'getFacilityList').and.returnValue(of(approvedFacilityData)); 
    component.getFacilityList();
    expect(component.facilities).not.toBeNull();
    expect(spy).toHaveBeenCalled();   
  }));
  
  it('get facility list should throw error', async(() => {
    let err="error"
    spyOn(patientService, 'getFacilityList').and.returnValue(throwError(err)); 
    component.getFacilityList(); 
    expect(patientService.getFacilityList).toHaveBeenCalled();  
  }));

   
  it('should get patient data', fakeAsync(() => { 
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.datasource = searchResultData;
    component.loadPatientData(event);  
    tick(500); 
    expect(component.loading ).toBeFalse(); 
    expect(component.patientsList).not.toBeNull();
  }));

  it('should not get any data when datasource is empty', fakeAsync(() => { 
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.datasource = [];
    component.loadPatientData(event);  
    tick(500); 
    expect(component.loading ).toBeFalse(); 
    expect(component.patientsList).toEqual([]);
  }));

  it('should search for patient data', async(() => {
    component.viewPatientForm.patchValue({
      facilityId: 1,
      mrn: 'mrn88'
    });
    const searchResult = [ {
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
    }];
   const spy = spyOn(patientService, 'getClinicRespondedPatients').and.returnValue(of(searchResult)); 
    component.getViewPatientData();
    expect(component.datasource ).toEqual(searchResult);
    expect(spy).toHaveBeenCalled();  
  }));
  
  it(' should return empty result when no search results found ', async(() => { 
    const searchResult = []; 
    const spy = spyOn(patientService, 'getClinicRespondedPatients').and.returnValue(of(searchResult)); 
    component.getViewPatientData();
    expect(component.showError).toBeTrue();
    expect(spy).toHaveBeenCalled();  
  }));

  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.searched ).toBeFalse();
  }));

  it('should search for patient data when form invalid', async(() => {
    component.viewPatientForm.patchValue({
      facilityId: null,
      mrn: null
    });
    const searchResult = [ {
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
    }];
   const spy = spyOn(patientService, 'getClinicRespondedPatients').and.returnValue(of(searchResult)); 
    component.getViewPatientData();
    expect(component.viewPatientForm.invalid).toBeFalse();
    expect(component.searched).toBeUndefined();
    expect(component.showGrid).toBeTrue();
    expect(component.showError).toBeFalse();
    expect(component.datasource).toEqual(searchResult);
    expect(spy).toHaveBeenCalled();  
  }));
  

  it('should clear the form', async(() => {
    component.onReset();
    expect(component.searched).toBeFalse();
    expect(component.showGrid).toBeFalse();
    expect(component.showError).toBeTrue();
    expect(component.viewPatientForm.pristine).toBeTrue();
  }));




});
