import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CustomerPatientInfoComponent } from './customer-patient-info.component';
import { CustomerService } from 'src/app/common/services/http/customer.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { of, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import {CustomerWorkItemModule} from "../customer-work-item.module";

describe('CustomerPatientInfoComponent', () => {
  let component: CustomerPatientInfoComponent;
  let fixture: ComponentFixture<CustomerPatientInfoComponent>;
  let patientService: PatientService;
  let customerService: CustomerService;
  let toastr: ToastrService;
  let router: Router;

  const facilityData = [
    {
      active: true,
      createdDate: "2021-02-01T17:54:57.974+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:54:57.974+0000",
      modifiedBy: 1,
      facilityBillingDetailId: 1,
      facilityId: 1,
      billingLevelId: 5,
      billingAmount: 1,
      billingLevelName: "PHARM L1"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:54:57.994+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:54:57.994+0000",
      modifiedBy: 1,
      facilityBillingDetailId: 2,
      facilityId: 1,
      billingLevelId: 6,
      billingAmount: 2,
      billingLevelName: "PHARM L2"
    }
  ];

  const patientSearchResult = [
    {
      "mrn": "0001",
      "proofOfIncome": "test",
      "householdSize": "test",
      "contactStatusName": "test",
      "notes": "testnotes"
    }
  ]


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerPatientInfoComponent],
      imports: [
        ReactiveFormsModule, HttpClientTestingModule, ToastrModule.forRoot()
        , BrowserAnimationsModule, NgbModule, NgSelectModule, TableModule,
        ButtonModule, TooltipModule,CustomerWorkItemModule
      ],
      providers: [PatientService, CustomerService, ToastrService, {
        provide: Router,
        useClass: class {
          navigate = jasmine.createSpy("navigate");
        }
      },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerPatientInfoComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(PatientService);
    customerService = TestBed.inject(CustomerService);
    toastr = TestBed.inject(ToastrService);
    router = fixture.debugElement.injector.get(Router);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return search patient form', async(() => {
    component.formSearchPatient = new FormGroup({});
    expect(component.sf).not.toBeNull();
  }))

  it('should return patient form', async(() => {
    component.formPatient = new FormGroup({});
    expect(component.f).not.toBeNull();
  }))


  it('should check patient work item form is valid when all values are entered', () => {
    const Custform = {
      facilityId: 1,
      intFacilityId: 1,
      facilityName: 'Facility1',
      mrn: 'mrn001',

    };
    component.formSearchPatient.patchValue(Custform);
    expect(component.sf).toBeTruthy();
    expect(component.formSearchPatient.valid).toBeTrue();
  });


  it('should check patient work item form is valid when all values are entered', () => {
    const Custform = {
      facilityId: 1,
      contactStatusId: 1,
      mrn: 'mrn001',
      proofOfIncome: '',
      householdSize: '',
      notes: ''
    };
    component.formPatient.patchValue(Custform);
    expect(component.f).toBeTruthy();
    expect(component.formPatient.valid).toBeTrue();
  });


  // it('should get facility list', async(() => {
  //   spyOn(patientService, 'getFacilityList').and.returnValue(of(facilityData));
  //   component.getFacilityList();
  //   expect(component.facilities).toEqual(facilityData);
  //   expect(patientService.getFacilityList).toHaveBeenCalled();
  // }));

  it('should get contact status list', async(() => {
    let spy = spyOn(patientService, 'getContactStatus').and.returnValue(of({}));
    component.getContactStatus();
    expect(component.contactStatuses).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSearch] should search patient when form is valid', async(() => {
    component.formSearchPatient.patchValue({
      facilityId: 11,
      intFacilityId: 1,
      facilityName: 'Facility1',
      mrn: 'mrn001',
    });

    const spy = spyOn(customerService, 'getPatientNotRespondedStatusPatients').and.returnValue(of(patientSearchResult));
    component.onSearch();
    expect(component.patientDatasource).toEqual(patientSearchResult);
    expect(component.showError).toEqual(false);
    expect(component.showGrid).toEqual(true);
    expect(component.patientTotalRecords).not.toBeNull();
    expect(component.resultGridloading).toEqual(false);
    expect(spy).toHaveBeenCalledWith({facilityId: 1, mrn: 'mrn001'});
  }));

  it('[onSearch] should search patient when form is valid and returns empty result', async(() => {
    component.formSearchPatient.patchValue({
      facilityId: 1,
      intFacilityId: 1,
      facilityName: 'Facility1',
      mrn: 'mrn001',
    });

    const spy = spyOn(customerService, 'getPatientNotRespondedStatusPatients').and.returnValue(of([]));
    component.onSearch();    
    expect(component.showError).toEqual(true);
    expect(component.showGrid).toEqual(false);  
    expect(spy).toHaveBeenCalled();
  }));

  it('should search patient and return empty data', fakeAsync(() => {
    component.formSearchPatient.patchValue({ 
      facilityId: 1,
      intFacilityId: 1,
      facilityName: 'Facility1',  
      mrn: 'mrn001',
    });
    let err = "error";

    const spy =spyOn(customerService, 'getPatientNotRespondedStatusPatients').and.returnValue(throwError(err)); 
    component.onSearch();
    spy.and.callThrough();
    flush();
    tick(500);
    expect(spy).toHaveBeenCalled();  
    expect(component.showGrid).toEqual(false);
    expect(component.showError ).toEqual(false);
  })); 


  it('should get patient form ', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    }
    component.patientDatasource = [patientSearchResult];
    component.loadPatientDetails(event);
    tick(500);
    expect(component.resultGridloading).toBeFalse();
    expect(component.loadPatientDetails).not.toBeNull();
  }));



  it('[onReset] should clear the form', async(() => {
    component.onResetSF();
    expect(component.formSearchPatient.pristine).toBeTrue();
    expect(component.submitted).toBeFalse();
    expect(component.showGrid).toBeFalse();
    expect(component.searched).toBeFalse();
    expect(component.showError).toBeFalse();

  }));

  it('[showSuccess] works', fakeAsync((msg: any) => {
    msg = 'success';
    component.showSuccess(msg);
    flush();
    expect(component.showSuccess).toBeTruthy();
  }));

  it('[showFailure] works', fakeAsync((msg: any) => {
    msg = 'error';
    component.showFailure(msg);
    flush();
    expect(component.showFailure).toBeTruthy();
  }));

  it('[showInfo] works', fakeAsync((msg: any) => {
    msg = 'info';
    component.showInfo(msg);
    flush();
    expect(component.showInfo).toBeTruthy();
  }));

  it('[onCancel] should cancel form submission', async(() => {
    component.onCancel();
    expect(component.onClear).toBeTruthy();
  }));

  it('[onSubmit] should update form when all the data is supplied', async(() => {
    spyOn(component, 'showSuccess').and.callFake(() => "success");
    spyOn(patientService, 'updatePatient').and.returnValue(of({}));
    component.onSubmit();
    expect(patientService.updatePatient).toBeTruthy();
  }));

  it('[onSubmit] should throw error', () => {
    const patient = {
      advocacyNeeded: "Y",
      advocacyNotes: "",
      drugCode: "J0135",
      drugId: 2,
      facilityId: 1,
      facilityName: "Facility 1",
      patientId: 3,
      patientMrn: "mrn",
      statusName: "New",
      workItemDrugCodeId: 15,
      workItemId: 22
    };
  
    component.formPatient = new FormGroup({

    });
    spyOn(customerService, 'updatePatient').and.returnValue(of(patient));
    component.onSubmit();
    expect(component.submitted).toBeFalse();
  });


  it('[onSubmit] should throw error', () => {
    const patient = {
      advocacyNeeded: "Y",
      advocacyNotes: "",
      drugCode: "J0135",
      drugId: 2,
      facilityId: 1,
      facilityName: "Facility 1",
      patientId: 3,
      patientMrn: "mrn",
      statusName: "New",
      workItemDrugCodeId: 15,
      workItemId: 22
    };
  
    component.formPatient = new FormGroup({

    });
    let err = "error";
    spyOn(customerService, 'updatePatient').and.returnValue(throwError(err));
    component.onSubmit();
    expect(patientService.updatePatient).toBeTruthy();
  });


  it('on Edit Patient', async(() => {
      const patient = {
      advocacyNeeded: "Y",
      advocacyNotes: "",
      drugCode: "J0135",
      drugId: 2,
      facilityId: 1,
      facilityName: "Facility 1",
      patientId: 3,
      patientMrn: "mrn",
      statusName: "New",
      workItemDrugCodeId: 15,
      workItemId: 22
    };
    spyOn(patientService, 'updatePatient').and.returnValue(of(patient));
    component.onEditPatient(patient);
    expect(patientService.updatePatient).toBeTruthy();
    expect(component.formPatient.valid).toBeFalsy();
  }));

  it('on Edit Patient throws error', () => {
    const patient = {
    advocacyNeeded: "Y",
    advocacyNotes: "",
    drugCode: "J0135",
    drugId: 2,
    facilityId: 1,
    facilityName: "Facility 1",
    patientId: 3,
    patientMrn: "mrn",
    statusName: "New",
    workItemDrugCodeId: 15,
    workItemId: 22
  };
  let err = "error";
  const spy = spyOn(patientService, 'getByPatientId').and.returnValue(throwError(err));
  component.onEditPatient(patient);
  expect(spy).toBeTruthy();
});



});

