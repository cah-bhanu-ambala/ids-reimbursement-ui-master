import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { DrugAdvocacyClearanceComponent } from './drug-advocacy-clearance.component';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { DrugAdvocacyClearanceService } from 'src/app/common/services/http/drug-advocacy-clearance.service';
import { of, throwError } from 'rxjs';
import { CommonService } from 'src/app/common/services/http/common.service';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { LazyLoadEvent } from 'primeng/api';

describe('CustomerWorkitemComponent', () => {
  let component: DrugAdvocacyClearanceComponent;
  let fixture: ComponentFixture<DrugAdvocacyClearanceComponent>;
  let commonService: CommonService;
  let wiService: WorkitemService;
  let drugAdvocacyClearanceService: DrugAdvocacyClearanceService;
  let advocacyService: AdvocacyService;
  let toastr: ToastrService;
  let router: Router;

  const icdCodes = [{
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 2,
    icdCode: "A00.0",
    description: "Cholera due to Vibrio cholerae 01, biovar cholerae"
  }, {
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 3,
    icdCode: "A00.1",
    description: "Cholera due to Vibrio cholerae 01, biovar eltor"
  }, {
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 4,
    icdCode: "A00.9",
    description: "Cholera, unspecified"
  }, {
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 5,
    icdCode: null,
    description: "Cholera, unspecified"
  }];

  const drugCodes = [{
    active: true,
    createdDate: "2021-02-01T17:36:50.881+0000",
    createdBy: 1,
    modifiedDate: "2021-02-17T17:50:17.409+0000",
    modifiedBy: 1,
    drugId: 2,
    drugProcCode: "J0135",
    customerDrugId: 1,
    shortDesc: "Adalimumab injection",
    longDesc: "Adalimumab injection",
    brandName: "Humira Pen",
    genericName: "adalimumab",
    lcd: "LCD1728",
    notes: "test notes"
  }, {
    active: true,
    createdDate: "2021-02-01T17:36:50.881+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.881+0000",
    modifiedBy: 1,
    drugId: 25,
    drugProcCode: "J0170",
    shortDesc: "Adrenalin epinephrin inject",
    longDesc: "Adrenalin epinephrin inject",
    brandName: "Epinephrine",
    genericName: "epinephrine",
    lcd: "",
    notes: ""
  }, {
    active: true,
    createdDate: "2021-02-01T17:36:50.881+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.881+0000",
    modifiedBy: 1,
    drugId: 25,
    drugProcCode: null,
    shortDesc: "Adrenalin epinephrin inject",
    longDesc: "Adrenalin epinephrin inject",
    brandName: "Epinephrine",
    genericName: "epinephrine",
    lcd: "",
    notes: ""
  }
  ];

  const primaryInsuranceList = [
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

  const addFormData = {
    patientMrn: 'mrn',
    facilityName: "Facility 1",
    advocacyId: 27,
    drugId: 9,
    drugCode: 9,
    advocacyStatusId: 3,
    advocacyTypeId: 4,
    advocacySource: "advsource",
    diagnosisCode: 14449,
    workItemId: 8,
    maxAmountAvail: 1000,
    startDate: { year: 2021, month: 2, day: 2 },
    endDate: { year: 2021, month: 2, day: 12 },
    icdId: 8024,
    lookBack: "Test",
    lookBackStartDate: { year: 2021, month: 1, day: 2 },
    createdDate: { year: 2021, month: 2, day: 2 },
    createdBy: 1,
    modifiedBy: 1,
    modifiedDate: { year: 2021, month: 2, day: 2 },
    notes: "Test",
    patientId: 3
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrugAdvocacyClearanceComponent],
      imports: [
        ReactiveFormsModule, HttpClientTestingModule, ToastrModule.forRoot()
        , BrowserAnimationsModule, NgbModule, NgSelectModule, TableModule,
        ButtonModule, TooltipModule,
      ],
      providers: [CommonService, WorkitemService, DrugAdvocacyClearanceService, AdvocacyService, ToastrService, {
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
    fixture = TestBed.createComponent(DrugAdvocacyClearanceComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(CommonService);
    wiService = TestBed.inject(WorkitemService);
    drugAdvocacyClearanceService = TestBed.inject(DrugAdvocacyClearanceService);
    advocacyService = TestBed.inject(AdvocacyService);
    toastr = TestBed.inject(ToastrService);
    router = fixture.debugElement.injector.get(Router);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('[getAdvocacyTypes] should get advocacy type list', async(() => {
    spyOn(advocacyService, 'getAllAdvocacyTypes').and.returnValue(of({}));
    component.getAdvocacyTypes();
    expect(component.advocacyClearanceTypes).not.toBeNull();
    expect(advocacyService.getAllAdvocacyTypes).toHaveBeenCalled();
  }));

  it('[getAdvocacyTypes] should throw error', async(() => {
    let err = "error"
    const spy = spyOn(advocacyService, 'getAllAdvocacyTypes').and.returnValue(throwError(err));
    component.getAdvocacyTypes();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getIcdList] should get icd list', async(() => {
    const spy = spyOn(commonService, 'getICDList').and.returnValue(of(icdCodes));
    component.getIcdList();
    expect(spy).toHaveBeenCalled();
    expect(component.fa).toBeTruthy;
  }));

  it('[getIcdList] should get icd list throw error', async(() => {
    let err = "error";
    const spy = spyOn(commonService, 'getICDList').and.returnValue(throwError(err));
    component.getIcdList();
    expect(spy).toHaveBeenCalled();
    expect(component.fa).toBeTruthy;
  }));


  it('[getPrimaryInsuranceList] should get primary insurance list', async(() => {
    let spy = spyOn(advocacyService, 'getPrimaryInsuranceList').and.returnValue(of(primaryInsuranceList));
    component.getPrimaryInsurance();
    expect(spy).toHaveBeenCalled();
    expect(component.fa).toBeTruthy;
  }));

  it('[getPrimaryInsuranceList] should throw error', async(() => {
    let err = "error"
    spyOn(advocacyService, 'getPrimaryInsuranceList').and.returnValue(throwError(err));
    component.getPrimaryInsurance();
    expect(component.fa).toBeTruthy;
  }));

  it('[getSecondaryInsuranceList] should get secondary insurance list', async(() => {
    let spy = spyOn(advocacyService, 'getSecondaryInsuranceList').and.returnValue(of(primaryInsuranceList));
    component.getSecondaryInsurance();
    expect(spy).toHaveBeenCalled();
    expect(component.fa).toBeTruthy;
  }));

  it('[getSecondaryInsuranceList] should throw error', async(() => {
    let err = "error"
    spyOn(advocacyService, 'getSecondaryInsuranceList').and.returnValue(throwError(err));
    component.getSecondaryInsurance();
    expect(component.fa).toBeTruthy;
  }));

  it('[getApprovalReasons] should get approval reasons list', async(() => {
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));
    component.getApprovalReasons();
    expect(component.advClearWiApprovalReasons).not.toBeNull();
    expect(wiService.getAllApprovalReasons).toHaveBeenCalled();
  }));

  it('[getApprovalReasons] should throw error', async(() => {
    let err = "error"
    const spy = spyOn(wiService, 'getAllApprovalReasons').and.returnValue(throwError(err));
    component.getApprovalReasons();
    expect(spy).toHaveBeenCalled();
  }));


  it('[onClearanceSearch] should search for workitems with advocacy needed', async(() => {
    component.advClearanceSearchForm.patchValue({
      facilityId: 1,
      mrn: 'mrn88'
    });
    const searchResult = [{ "workItemDrugCodeId": 28, "workItemId": 8, "advocacyNeeded": "Y", "advocacyNotes": "", "drugId": 9, "drugCode": "J2271", "patientId": 4, "patientMrn": "mrn8888", "facilityId": 1, "facilityName": "Facility 1", "statusName": "New" }];
    const spy = spyOn(drugAdvocacyClearanceService, 'getAllAdvocaciesWithClearanceBySearchParam').and.returnValue(of(searchResult));
    component.onClearanceSearch();
    expect(component.advClearadvDatasource).toEqual(searchResult);
    expect(spy).toHaveBeenCalled();
  }));

  it('[onClearanceSearch] should return empty result set when no search results found ', () => {
    const searchResult = [];
    const spy = spyOn(drugAdvocacyClearanceService, 'getAllAdvocaciesWithClearanceBySearchParam').and.returnValue(of(searchResult));
    component.onClearanceSearch();
    expect(spy).toHaveBeenCalled();
    expect(component.advClearshowGrid).toBeFalse();
  });

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

  it('should load data after 500ms', fakeAsync(() => {
    const event: LazyLoadEvent = { "first": 0, "rows": 10, "sortOrder": 1, "filters": {}, "globalFilter": null };
    component.advClearadvDatasource = [];
    component.loadAdvDetails(event);
    tick(500);
    expect(component.advloading).toBeFalse();
  }));


  it('on Edit Patient', async(() => {
    const advocacy = {
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

    component.onEdit(advocacy);
    expect(component.drugAdvocacyClearanceForm.valid).toBeFalsy();
  }));

  it('should delete appointment', fakeAsync(() => {
    const appointmentId = 25;
    let spy = spyOn(drugAdvocacyClearanceService, 'deleteAdvocacyClearanceByDrugId').and.returnValue(of([]));
    component.deleteAdvocacy(appointmentId);
    tick(500);
    flush();
    expect(spy).toHaveBeenCalled();
  }));


  it('should delete appointment throw error', fakeAsync(() => {
    const appointmentId = 25;
    let err = "error";
    let spy = spyOn(drugAdvocacyClearanceService, 'deleteAdvocacyClearanceByDrugId').and.returnValue(throwError(err));
    component.deleteAdvocacy(appointmentId);
    tick(500);
    flush();
    expect(spy).toHaveBeenCalled();
  }));

  it('should delete advocacy', fakeAsync(() => {
    const advocacyId = 25;
    let spy = spyOn(drugAdvocacyClearanceService, 'deleteAdvocacyClearanceByDrugId').and.returnValue(of([]));
    component.onDelete(advocacyId);
    tick(500);
    flush();
    expect(spy).toBeTruthy();
  }));

  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.advClearshowAddICDGrid).toBeFalse();
  }));

  it('[onResetSF] should clear the form', async(() => {
    component.onResetSF();
    expect(component.advClearshowAddICDGrid).toBeFalse();
  }));

  it('[onSubmit] should submit form', () => {    
    component.isUpdate = true;
    component.onSubmit(); 
    expect(component).toBeTruthy; 
  });

  it('[bulkAddClearance] should add multiple icd codes', fakeAsync(() => {
    commonService = TestBed.inject(CommonService);
    spyOn(commonService, 'getExactIcd')
      .withArgs("C50.0").and.returnValue(of({icdCode: "C50.0"}))
      .withArgs("C50.1").and.returnValue(of({icdCode: "C50.1"}))
      .withArgs("C50.2").and.returnValue(of({icdCode: "C50.2"}));
    component.bulkAddClearance();
    component.modal.componentInstance.notes = 'C50.0,C50.1,C50.2';
    component.modal.componentInstance.confirm.emit();

    expect(component.advClearselectedIcdCodes).toEqual(["C50.0","C50.1","C50.2"]);
  }));
});

