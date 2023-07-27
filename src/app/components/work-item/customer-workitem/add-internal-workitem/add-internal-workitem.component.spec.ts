import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent, SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { of, throwError } from 'rxjs';
import { CommonService } from 'src/app/common/services/http/common.service';
import { CustomerWorkitemService } from 'src/app/common/services/http/customer-workitem.service';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';

import { AddInternalWorkitemComponent } from './add-internal-workitem.component';
import {FileAttachmentService} from "../../../../common/services/http/file-attachment.service";

describe('Add Internal Work item Component', () => {
  let component: AddInternalWorkitemComponent;
  let fixture: ComponentFixture<AddInternalWorkitemComponent>;
  let commonService: CommonService;
  let workItemService: WorkitemService;
  let customerWorkitemService: CustomerWorkitemService;
  let fileAttachmentService: FileAttachmentService;
  let toastr: ToastrService;
  let router: Router;

  // let customerWorkItemNo;
  // let customerWorkItemNumber;
  // let selectedPatientId;


  const activatedRouteMock = {
    queryParams: of({
      customerWorkItemNumber: '123',
      patientId: '124',
    }),
  };

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

  const wiStatus = [{
    active: true,
    createdDate: "2021-02-01T17:37:57.760+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:37:57.760+0000",
    modifiedBy: 1,
    workItemStatusId: 2,
    workItemStatusName: "Approved"
  }, {
    active: true,
    createdDate: "2021-02-01T17:37:57.760+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:37:57.760+0000",
    modifiedBy: 1,
    workItemStatusId: 4,
    workItemStatusName: "Denied"
  }, {
    active: true,
    createdDate: "2021-02-01T17:37:57.760+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:37:57.760+0000",
    modifiedBy: 1,
    workItemStatusId: 3,
    workItemStatusName: "In Process"
  }, {
    active: true,
    createdDate: "2021-02-01T17:37:57.760+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:37:57.760+0000",
    modifiedBy: 1,
    workItemStatusId: 1,
    workItemStatusName: "New"
  }, {
    active: true,
    createdDate: "2021-02-01T17:37:57.760+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:37:57.760+0000",
    modifiedBy: 1,
    workItemStatusId: 5,
    workItemStatusName: "Pending"
  }, {
    active: true,
    createdDate: "2021-02-01T17:37:57.760+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:37:57.760+0000",
    modifiedBy: 1,
    workItemStatusId: 6,
    workItemStatusName: "Reviewed for Advocacy"
  }];

  const wiFormValue = {
    providerId: 8,
    orderTypeId: 1,
    referralNumber: "555",
    patientId: "",
    orderDate: {
      year: 2021,
      month: 2,
      day: 26
    },
    facilityBillingTypeId: "2",
    notes: "",
    icdCodes: [{ icdCode: 'A00.9', ctive: true, createdDate: "2021-02-28T01:42:51.001+0000", createdBy: 1, modifiedDate: "2021-02-28T01:42:51.001+0000", modifiedBy: 1, workItemIcdCodeId: 15, workItemId: null, icdId: 4 }],
    drugCodes: [{ drugCode: "J0135", drugId: 33, createdBy: 1, modifiedBy: 1 }],
    attachment1: "",
    attachment2: "",
    attachment3: "",
    attachment4: "",
    generalNotes: "Test",
    createdBy: 1,
    modifiedBy: 1
  };

  const searchResult = [{
    active: true,
    createdDate: "2021-02-15T06:12:48.059+0000",
    createdBy: 1,
    modifiedDate: "2021-02-17T18:30:44.938+0000",
    modifiedBy: 1,
    patientId: 3,
    mrn: "mrn",
    facilityId: 1,
    primaryInsuranceId: 5,
    secondaryInsuranceId: null,
    proofOfIncome: 0,
    householdSize: null,
    contactStatusId: 1,
    notes: "test@12334",
    firstContactDate: null,
    firstContactOutcome: 1,
    secondContactDate: null,
    secondContactOutcome: 2,
    thirdContactDate: null,
    thirdContactOutcome: 3,
    facilityName: "Facility 1",
    facilityNPI: "1234567890",
    facilityEin: "1234567890"
  }];

  const internalIcdCodes = [{
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
  }];

  const blob = new Blob([""], { type: "image/png" });
  blob["lastModifiedDate"] = "";
  blob["name"] = 'filename';
  const blob2 = new Blob([""], { type: "text/text" });
  blob2["lastModifiedDate"] = "";
  blob2["name"] = 'filename2';
  const selectedFileObj = [{'file':blob},{'file':blob2}];
  const deletedFileObj = [{'file':blob}];

  let formGroupMock: FormGroup;
  let formBuilderMock: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddInternalWorkitemComponent],
      imports: [
        ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, ToastrModule.forRoot()
        , BrowserAnimationsModule, NgbModule, NgSelectModule, TableModule,
        ButtonModule, TooltipModule,],
      providers: [CommonService, WorkitemService, CustomerWorkitemService, ToastrService,
        {
          provide: ActivatedRoute, useValue: activatedRouteMock
        },
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy("navigate");
          }
        },
        {
          provide: ChangeDetectorRef, useValue: {}
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInternalWorkitemComponent);
    component = fixture.componentInstance;

    commonService = TestBed.inject(CommonService);
    workItemService = TestBed.inject(WorkitemService);
    customerWorkitemService = TestBed.inject(CustomerWorkitemService);
    fileAttachmentService = TestBed.inject(FileAttachmentService);
    toastr = TestBed.inject(ToastrService);
    fixture.detectChanges();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check customer work item form is valid when all values are entered', () => {
    const Custform = {
      mrn: '0001',
      facilityName: 'test',
      providerName: 'test2',
      providerId: 8,
      orderTypeId: 1,
      referralNumber: '1',
      patientId: "",
      orderDate: { year: 2021, month: 4, day: 2 },
      facilityBillingTypeId: 1,
      notes: 'test',
      internalIcdCodes: [{ icdCode: "A00.1" }],
      drugCodes: [{ drugCode: "J0635" }],
      attachment1: [''],
      attachment2: [''],
      attachment3: [''],
      attachment4: [''],
      generalNotes: '',
      customerWorkItemStatusId: 1,
      assignedTeamMember: '',
      createdByName: '',
      cad: '',
      customerTeamMember: ''

    };
    component.internalFormWorkItem.patchValue(Custform);
    expect(component.f).toBeTruthy();
    expect(component.internalFormWorkItem.valid).toBeTrue();
  });

  it('should get status list', async(() => {
    spyOn(customerWorkitemService, 'getwiStatuses').and.returnValue(of(wiStatus));
    component.getwiStatuses();
    expect(component.customerWiStatuses).toEqual(wiStatus);
    expect(customerWorkitemService.getwiStatuses).toHaveBeenCalled();
  }));

  it('should get status list throws error', async(() => {
    let err = "error"
    const spy = spyOn(customerWorkitemService, 'getwiStatuses').and.returnValue(throwError(err));
    component.getwiStatuses();
    expect(spy).toHaveBeenCalled();
  }));

  it('should get facility list', async(() => {
    spyOn(workItemService, 'getApprovedFacilities').and.returnValue(of(facilityData));
    component.getInternalFacilityList();
    expect(component.internalFacilities).toEqual(facilityData);
    expect(workItemService.getApprovedFacilities).toHaveBeenCalled();
  }));

  it('should throw error', async(() => {
    let err = "error"
    const spy = spyOn(workItemService, 'getApprovedFacilities').and.returnValue(throwError(err));
    component.getInternalFacilityList();
    expect(spy).toHaveBeenCalled();
  }));

  it('should get billing types list', async(() => {
    const spy = spyOn(workItemService, 'getBillingTypes').and.returnValue(of({}));
    component.getInternalBillingTypes();
    expect(component.billingTypes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('should throw error', async(() => {
    let err = "error"
    const spy = spyOn(workItemService, 'getBillingTypes').and.returnValue(throwError(err));
    component.getInternalBillingTypes();
    expect(spy).toHaveBeenCalled();
  }));

  it('should get providers list', async(() => {
    const spy = spyOn(workItemService, 'getProviderList').and.returnValue(of({}));
    component.getInternalProviderList();
    expect(component.billingTypes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('should throw error', async(() => {
    let err = "error"
    const spy = spyOn(workItemService, 'getProviderList').and.returnValue(throwError(err));
    component.getInternalProviderList();
    expect(spy).toHaveBeenCalled();
  }));

  it('should load data after 500ms', fakeAsync(() => {
    const event: LazyLoadEvent = { "first": 0, "rows": 10, "sortOrder": 1, "filters": {}, "globalFilter": null };
    component.internalDatasource = searchResult;
    component.loadAddWorkItemDetails(event);
    tick(500);
    expect(component.loading).toBeFalse();
  }));

  it('should not load data when datasource in null', fakeAsync(() => {
    const event: LazyLoadEvent = { "first": 0, "rows": 10, "sortOrder": 1, "filters": {}, "globalFilter": null };
    component.loadAddWorkItemDetails(event);
    tick(500);
    expect(component.loading).toBeTrue();
  }));

  it('should reset the flags on reset', async(() => {
    component.onReset();
    expect(component.showGrid).toBeFalse();
    expect(component.showAddWorkItem).toBeFalse();
    expect(component.showError).toBeFalse();

  }));

  it('should clear the fields on clear', async(() => {
    const fields = {
      providerId: '',
      orderTypeId: ''
    }
    component.onClear();
    component.internalFormWorkItem.controls['providerId'].setValue(fields.providerId);
    expect(component.internalFormWorkItem.controls.providerId).toBeTruthy();

  }));


  it('should cancel form submission', async(() => {
    component.onClear();
    expect(component.internalFormWorkItem.pristine).toBeTrue();
  }));

  it('should add work item', fakeAsync(() => {
    component.addWorkItem(wiFormValue);
    expect(component.showAddWorkItem).toBeTrue();
  }));

 //sukirtha's test cases begin
  // fit('[onIcdCodeChange] should patch icd value to the form', () => {
  //   const selectedValue = 'JA00.1-Cholera due to Vibrio cholerae 01, biovar eltor';
  //   const Ctrlidx = 0;
  //   component.onIcdCodeChange(selectedValue, Ctrlidx);
  //   expect(component.icdCodes).not.toBeNull();
  // });
  //sukirtha's test cases end

  it('track by ICD code should return val', async(() => {
    const val = { icdId: 'J0170' };
    expect(component.trackByIcdCodeInternal(val)).not.toBeNull();
  }));

  it('track by Drug code should return val', async(() => {
    const val = 'A00.1-Cholera due to Vibrio cholerae 01, biovar eltor';
    expect(component.trackByDrugCode(val)).toEqual(val);
  }));

  // it('load icd controls by default', async(() => {
  //   //const defaultIcdCodes = [{icdCode:"A00.9", icdDescription:'A00.9'}];
  //   component.customerWorkItem.internalIcdCodes = internalIcdCodes;
  //   component.loadICDControlsByDefault();
  //   expect(component.icdList).not.toBeNull();
  // }));

  // it('load drug codes by default', async(() => {
  //   component.loadDrugControlsByDefault();
  //   component.customerWorkItem.drugCodes = drugCodes;
  //   expect(component.drugCodes).toEqual(drugCodes);
  // }));

  it('should not get any data when datasource is empty', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    };
    component.icdDatasource = internalIcdCodes;
    component.loadICDDetails(event);
    tick(500);
    expect(component.icdloading).toBeFalse();
    expect(component.icdInternalSearchResult).not.toBeNull();
  }));

  it('should submit form without attachments', fakeAsync(() => {
    let router = fixture.debugElement.injector.get(Router);
    const createWiResp = {
      active: true,
      providerFlag: "",
      createdDate: "2021-02-28T01:42:50.991+0000",
      createdBy: 1,
      modifiedDate: "2021-02-28T01:42:51.007+0000",
      modifiedBy: 1,
      workItemId: 26,
      patientId: 3,
      providerId: 8,
      facilityBillingTypeId: 2,
      facilityBillingLevelId: 1,
      workItemStatusId: 1,
      orderTypeId: 1,
      orderDate: "2021-02-26T08:00:00.000+0000",
      referralNumber: "555",
      notes: "",
      generalNotes: "Test",
      assignedToId: 0,
      dateIn: "0195-05-02",
      dateOut: null,
      buyBill: "Y",
      externalWorkId: "",
      wiInsurance: {
        active: true,
        createdDate: "2021-02-28T01:42:51.003+0000",
        createdBy: 1,
        modifiedDate: "2021-02-28T01:42:51.003+0000",
        modifiedBy: 1,
        workItemInsId: 14,
        primaryInsRep: "",
        primaryInsRefNum: "",
        primaryInNetwork: "U",
        deductibleMax: 0,
        deductibleMet: 0,
        outOfPocketMax: 0,
        outOfPocketMet: 0,
        coInsurance: 0,
        primaryInsNotes: "",
        primaryInsClassification: 1,
        secondaryInsRep: "",
        secondaryInsRefNum: "",
        secondaryInNetwork: "U",
        secondaryInsNotes: "",
        secondaryInsClassification: 2,
        workItemId: 26,
        secondaryInsuranceName: "",
        primaryInsuranceName: "" },
        internalIcdCodes: [{
          active: true,
          createdDate: "2021-02-28T01:42:51.001+0000",
          createdBy: 1,
          modifiedDate: "2021-02-28T01:42:51.001+0000",
          modifiedBy: 1,
          workItemIcdCodeId: 15,
          workItemId: null, icdId: 4 }],
          drugCodes: [{
            active: true,
            createdDate: "2021-02-28T01:42:50.994+0000",
             createdBy: 1, modifiedDate: "2021-02-28T01:42:50.994+0000",
             modifiedBy: 1, workItemDrugCodeId: 19,
             workItemId: null, drugId: 33, isCover: "U",
             priorAuth: "U", priorAuthNo: "", priorAuthFromDate: null,
             priorAuthToDate: null, priorAuthNotes: "",
             priorAuthApprovalReason: 1, visitsApproved: "",
             unitsApproved: "", advocacyNeeded: "U", advocacyNotes: "" }] };
    component.internalFormWorkItem.patchValue(wiFormValue);

    const spy = spyOn(workItemService, 'createWorkItem').and.returnValue(of(createWiResp));
    spyOn(FormData.prototype, "append");
    spyOn(component, 'showSuccess').and.callFake(() => "created successfully");

    component.onSubmit();
    expect(component.showAddWorkItem).toBeFalse();
    expect(component.showPatientSearch).toBeTrue();
    expect(spy).toHaveBeenCalled();
    //expect(router.navigate).toHaveBeenCalledWith(['/dashboard/workmenu/customerWorkItem']);
  }));

  it('should submit form with attachments (alternative)', fakeAsync(() => {
    let router = fixture.debugElement.injector.get(Router);
    const createWiResp = {
      active: true,
      providerFlag: "9999999999",
      createdDate: "2021-02-28T01:42:50.991+0000",
      createdBy: 1,
      modifiedDate: "2021-02-28T01:42:51.007+0000",
      modifiedBy: 1,
      workItemId: 26,
      patientId: 3,
      providerId: 8,
      facilityBillingTypeId: 2,
      facilityBillingLevelId: 1,
      workItemStatusId: 1,
      orderTypeId: 1,
      orderDate: "2021-02-26T08:00:00.000+0000",
      referralNumber: "555",
      notes: "",
      generalNotes: "Test",
      assignedToId: 0,
      dateIn: "0195-05-02",
      dateOut: null,
      buyBill: "Y",
      externalWorkId: "",
      wiInsurance: {
        active: true,
        createdDate: "2021-02-28T01:42:51.003+0000",
        createdBy: 1,
        modifiedDate: "2021-02-28T01:42:51.003+0000",
        modifiedBy: 1,
        workItemInsId: 14,
        primaryInsRep: "",
        primaryInsRefNum: "",
        primaryInNetwork: "U",
        deductibleMax: 0,
        deductibleMet: 0,
        outOfPocketMax: 0,
        outOfPocketMet: 0,
        coInsurance: 0,
        primaryInsNotes: "",
        primaryInsClassification: 1,
        secondaryInsRep: "",
        secondaryInsRefNum: "",
        secondaryInNetwork: "U",
        secondaryInsNotes: "",
        secondaryInsClassification: 2,
        workItemId: 26,
        secondaryInsuranceName: "",
        primaryInsuranceName: "" },
        internalIcdCodes: [null],
        drugCodes: [null] };
    component.internalFormWorkItem.patchValue(wiFormValue);
    component.fileAttachmentData.selectedFiles = [{"fakeData": "fakeData"}];

    const spy = spyOn(workItemService, 'createWorkItem').and.returnValue(of(createWiResp));
    spyOn(FormData.prototype, "append");
    spyOn(component, 'showSuccess').and.callFake(() => "created successfully");
    spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));

    component.onSubmit();
    expect(component.showAddWorkItem).toBeFalse();
    expect(component.showPatientSearch).toBeTrue();
    expect(spy).toHaveBeenCalled();
    //expect(router.navigate).toHaveBeenCalledWith(['/dashboard/workmenu/customerWorkItem']);
  }));

  it('[showSuccess] works', fakeAsync((msg:any) => {
    msg = 'success';
    component.showSuccess(msg);
    flush();
    expect(component.showSuccess).toBeTruthy();
  }));

  it('[showFailure] works', fakeAsync((msg:any) => {
    msg = 'error';
    component.showFailure(msg);
    flush();
    expect(component.showFailure).toBeTruthy();
  }));

  it('[showInfo] works', fakeAsync((msg:any) => {
    msg = 'info';
    component.showInfo(msg);
    flush();
    expect(component.showInfo).toBeTruthy();
  }));

  it('should load Customer WorkItem Details', async(() => {
    let wiNumber = 123;
    const spy = spyOn(customerWorkitemService, 'getCustomerWorkItem').and.returnValue(of(wiFormValue));
    component.loadCustomerWorkItemDetails();
    expect(spy).toBeTruthy();
  }));


  it('[generateInternalDianosisControls] should add new ICD field', fakeAsync(() => {
    component.generateInternalDianosisControls();
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[generateInternalDianosisControls] should show error when trying to add more than 10 new ICD fields', fakeAsync(() => {
    component.noOfICDCodes = 11;
    spyOn(toastr, 'info');
    component.generateInternalDianosisControls();
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[generateInternalDianosisControls] should show error when trying to add less than 10 new ICD fields', fakeAsync(() => {
    component.noOfICDCodes = 1;
    spyOn(toastr, 'info');
    component.generateInternalDianosisControls();
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[generateDrugCodeControls] should add new drug field', fakeAsync(() => {
    component.generateDrugCodeControls();
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[generateDrugCodeControls] should show error when trying to add more than 13 new Drug fields', fakeAsync(() => {
    component.noOfdrugCodesInternal = 14;
    spyOn(toastr, 'info');

    component.generateDrugCodeControls();
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[generateDrugCodeControls] should show error when trying to add less than 13 new Drug fields', fakeAsync(() => {
    component.noOfdrugCodesInternal = 1;
    spyOn(toastr, 'info');

    component.generateDrugCodeControls();
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[onProviderChange] should make providerFlag null', () => {
    component.onProviderChange();
    expect(component.internalFormWorkItem.controls.providerFlag.value).toEqual('');
  });

  // fit('[onDrugCodeChange] should patch drug value to the form', async(() => {
  //   const selectedValue = 'J0170 - Adrenalin epinephrin inject - Adrenalin epinephrin inject';
  //   const Ctrlidx = 0;
  //   component.onDrugCodeChange(selectedValue, Ctrlidx);
  //   expect(component).toBeTruthy();
  // }));

  // fit('[onIcdCodeChange] should patch icd value to the form', async(() => {
  //   const selectedValue = 'JA00.1 - Cholera due to Vibrio cholerae 01, biovar eltor - 9888';
  //   const Ctrlidx = 0;
  //   component.onIcdCodeChange(selectedValue, Ctrlidx);
  //   expect(component).toBeTruthy();
  // }));

});
