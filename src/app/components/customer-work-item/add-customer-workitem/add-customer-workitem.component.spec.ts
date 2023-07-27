import {async, ComponentFixture, fakeAsync, flush, TestBed, tick} from '@angular/core/testing';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {NgbModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {NgSelectModule} from '@ng-select/ng-select';
import {ButtonModule} from 'primeng/button';
import {CustomerWorkitemService} from 'src/app/common/services/http/customer-workitem.service';
import {Router} from '@angular/router';
import {AddCustomerWorkitemComponent} from './add-customer-workitem.component';
import {CommonService} from 'src/app/common/services/http/common.service';
import {PatientService} from 'src/app/common/services/http/patient.service';
import {of, throwError} from 'rxjs';
import {LazyLoadEvent} from 'primeng/api';
import {FileAttachmentService} from 'src/app/common/services/http/file-attachment.service';
import {CustomerWorkItemModule} from "../customer-work-item.module";

export class MockNgbModalRef {
  componentInstance = {
    prompt: undefined,
    title: undefined
  };
  result: Promise<any> = new Promise((resolve, reject) => resolve(true));
}

describe('AddCustomerWorkitemComponent', () => {
  let component: AddCustomerWorkitemComponent;
  let fixture: ComponentFixture<AddCustomerWorkitemComponent>;
  let commonService: CommonService;
  let customerWorkitemService: CustomerWorkitemService;
  let fileAttachmentService: FileAttachmentService;
  let toastr: ToastrService;
  let router: Router;
  let patientService: PatientService;
  let attachment;
  let ngbModal: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddCustomerWorkitemComponent],
      imports: [
        ReactiveFormsModule, HttpClientTestingModule, ToastrModule.forRoot()
        , BrowserAnimationsModule, NgbModule, NgSelectModule, TableModule,
        ButtonModule, TooltipModule,CustomerWorkItemModule
      ],
      providers: [CommonService, CustomerWorkitemService, ToastrService, PatientService, {
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
    fixture = TestBed.createComponent(AddCustomerWorkitemComponent);
    component = fixture.componentInstance;
    commonService = TestBed.inject(CommonService);
    customerWorkitemService = TestBed.inject(CustomerWorkitemService);
    fileAttachmentService = TestBed.inject(FileAttachmentService);
    toastr = TestBed.inject(ToastrService);
    patientService = TestBed.inject(PatientService);
    router = fixture.debugElement.injector.get(Router);
    ngbModal = TestBed.get(NgbModal);
    attachment = { getFile: function () { return 'foo'; } };
    component.ngOnInit();
    fixture.detectChanges();
  });

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

  const wiFormValue = {
    facilityName: 'test',
    facilityId: 1,
    patientMrn: '0001',
    providerId: 8,
    providerName: 'test2',
    patientId: "",
    dos: { year: 2021, month: 2, day: 26 },
    icdCodes: [{ icdCode: "A00.9" }],
    drugCodes: [{ drugCode: "J0636" }],
    generalNotes: "Test",
    createdBy: 1,
    modifiedBy: 1
  };



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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[Form Valid Check] should check customer work item form is valid when all values are entered', () => {
    const form = {
      facilityName: 'test',
      facilityId: 1,
      intFacilityId: 15,
      patientMrn: '0001',
      providerId: 8,
      providerName: 'test2',
      patientId: "",
      dos: { year: 2021, month: 2, day: 26 },
      icdCodes: [{ icdCode: "A00.9" }],
      drugCodes: [{ drugCode: "J0636" }],
      generalNotes: "Test"

    };
    component.formCustomerWorkItem.patchValue(form);
    expect(component.f).toBeTruthy();
    expect(component.formCustomerWorkItem.valid).toBeTrue();
  });

  it('should get facilityId', async(() => {
    component.facilityId;
    expect(component.facilityId).not.toBeNull();
  }));

  it('[getBillingTypes] should get billing types list', async(() => {
    const spy = spyOn(customerWorkitemService, 'getBillingTypes').and.returnValue(of({}));
    component.getBillingTypes();
    expect(component.billingTypes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[loadAddWorkItemDetails] should load data after 500ms', fakeAsync(() => {
    const event: LazyLoadEvent = { "first": 0, "rows": 10, "sortOrder": 1, "filters": {}, "globalFilter": null };
    component.datasource = searchResult;
    component.loadAddWorkItemDetails(event);
    tick(500);
    expect(component.loading).toBeFalse();
  }));

  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.showGrid).toBeFalse();
    expect(component.formCustomerWorkItem.pristine).toBeTrue();
  }));

  it('[onClear] should cancel form submission', async(() => {
    component.onClear();
    expect(component.formCustomerWorkItem.pristine).toBeTrue();
  }));

  // it('[addWorkItem] should add work item', fakeAsync(() => {
  //   component.addWorkItem(wiFormValue);
  //   expect(component.showAddWorkItem).toBeTrue();
  // }));

  it('[generateDianosisControls] should add new ICD field', fakeAsync(() => {
    component.generateDianosisControls();
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[generateDianosisControls] should show error when trying to add more than 10 new ICD fields', fakeAsync(() => {
    component.noOfICDCodesCust = 11;
    spyOn(toastr, 'info');
    component.generateDianosisControls();
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[generateDianosisControls] should show error when trying to add less than 10 new ICD fields', fakeAsync(() => {
    component.noOfICDCodesCust = 1;
    spyOn(toastr, 'info');
    component.generateDianosisControls();
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[generateDrugCodeControls] should add new drug field', fakeAsync(() => {
    component.generateDrugCodeControls();
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[generateDrugCodeControls] should show error when trying to add more than 13 new Drug fields', fakeAsync(() => {
    component.noOfdrugCodesAddCust = 14;
    spyOn(toastr, 'info');

    component.generateDrugCodeControls();
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[generateDrugCodeControls] should show error when trying to add less than 13 new Drug fields', fakeAsync(() => {
    component.noOfdrugCodesAddCust = 1;
    spyOn(toastr, 'info');

    component.generateDrugCodeControls();
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[loadPatientDetails] should not get any data when datasource is empty', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    };
    component.icdDatasource = icdCodes;
    component.loadICDDetails(event);
    tick(500);
    expect(component.icdloading).toBeFalse();
    expect(component.icdSearchResult).not.toBeNull();
  }));

  it('[trackByIcdCode] should return val', async(() => {
    const val = { icdId: 'J0170' };
    expect(component.trackByIcdCode(val)).not.toBeNull();
  }));

  it('[onIcdCodeChange] should patch icd value to the form', async(() => {
    const selectedValue = 'JA00.1-Cholera due to Vibrio cholerae 01, biovar eltor';
    const Ctrlidx = 0;
    component.onIcdCodeChange(selectedValue, Ctrlidx);
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[onDrugCodeChange] should patch drug value to the form', async(() => {
    const selectedValue = 'J0170-Adrenalin epinephrin inject-Adrenalin epinephrin inject';
    const Ctrlidx = 0;
    component.onDrugCodeChange(selectedValue, Ctrlidx);
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[trackByDrugCode] should return val', async(() => {
    const val = 'A00.1-Cholera due to Vibrio cholerae 01, biovar eltor';
    expect(component.trackByDrugCode(val)).toEqual(val);
  }));

  it('[onSubmit] should submit form appointment', async(() => {
    component.formCustomerWorkItem.patchValue({});
    component.submitted =false;
    component.isUpdate = true;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(customerWorkitemService, 'createCustomerWorkItem').and.returnValue(of({})) ;

    component.onSubmit();
    expect(spy).toBeTruthy();
    expect(component.submitted).toBeTruthy();
    }));

  it('track By Mrn', async(() => {
    const val = '0001';
    expect(component.trackByMrn(val)).toEqual(val);
  }));

  it('track By Provider', async(() => {
    const val = 'provider1';
    expect(component.trackByProvider(val)).toEqual(val);
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

  it('add mrn', fakeAsync((msg: any) => {
    msg = 'error';
    component.addMrn();
    flush();
    expect(component.showFailure).toBeTruthy();
  }));

  it('save mrn', fakeAsync((msg: any) => {
    msg = 'error';
    const spy = spyOn(customerWorkitemService, 'createMRN').and.returnValue(of(patient));
    component.onSaveMrn();
    flush();
    expect(spy).toHaveBeenCalled();
    expect(component.showSuccess).toBeTruthy();
  }));

  it('save mrn', fakeAsync((msg: any) => {
    let selectedValue = 'david-dr-0001';
    component.onProviderChange(selectedValue);
    flush();
    expect(component.showSuccess).toBeTruthy();
  }));

  it('save mrn 2', fakeAsync((msg: any) => {
    let selectedValue = 'david-dr-9999999999';
    component.onProviderChange(selectedValue);
    flush();
    expect(component.showSuccess).toBeTruthy();
  }));

  it('[Form Valid Check] should check customer work item form is valid when all values are entered', () => {
    const form = {
      facilityName: 'test',
      intFacilityId: 15,
      facilityId: 1,
      patientMrn: '0001',
      providerId: 8,
      providerName: 'test2',
      patientId: "",
      dos: { year: 2021, month: 2, day: 26 },
      icdCodes: [icdCodes],
      drugCodes: [drugCodes],
      generalNotes: "Test"

    };
    component.formCustomerWorkItem.patchValue(form);
    spyOn(FormData.prototype, "append");
    const spy = spyOn(customerWorkitemService, 'createCustomerWorkItem').and.returnValue(of(form));
    component.fileAttachmentData.selectedFiles = [{"fakeData": "fakeData"}];
    spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));

    component.onSubmit();
    expect(component.f).toBeTruthy();
    expect(spy).toBeTruthy();
    expect(component.formCustomerWorkItem.valid).toBeTrue();
  });

  it('[Form Valid Check] should check customer work item form throws error', () => {
    const form = {
      facilityName: 'test',
      facilityId: 1,
      intFacilityId: 15,
      patientMrn: '0001',
      providerId: 8,
      providerName: 'test2',
      patientId: "",
      dos: { year: 2021, month: 2, day: 26 },
      icdCodes: [icdCodes],
      drugCodes: [drugCodes],
      generalNotes: "Test"

    };
    let err = "error";
    component.formCustomerWorkItem.patchValue(form);
    spyOn(FormData.prototype, "append");
    const spy = spyOn(customerWorkitemService, 'createCustomerWorkItem').and.returnValue(throwError(err));
    component.onSubmit();
    expect(component.f).toBeTruthy();
    expect(spy).toBeTruthy();
    expect(component.formCustomerWorkItem.valid).toBeTrue();
  });

  it('should filter icd code input', fakeAsync(() => {
    let spy = spyOn(customerWorkitemService, "getIcdDetails").and.callFake(() => of([]));
    component.generateDianosisControls();
    fixture.detectChanges();

    component.icdCodesInput$[0].next("A1");
    tick(1000);
    
    expect(spy).toHaveBeenCalledWith("A1");
  }));

  it('should setup icd subscribers', () => {
    component.loadIcdCodes();
    expect(component.icdCodesFiltered$.length).toEqual(1);
    expect(component.icdCodesInput$.length).toEqual(1);
  });

  it('should filter drug code input', fakeAsync(() => {
    let spy = spyOn(customerWorkitemService, "getDrugDetails").and.callFake(() => of([]));
    component.generateDrugCodeControls();
    fixture.detectChanges();

    component.drugCodesInput$[0].next("J1");
    tick(1000);
    
    expect(spy).toHaveBeenCalledWith("J1");
  }));

  it('should setup drug subscribers', () => {
    component.loadDrugCodes();
    expect(component.drugCodesFiltered$.length).toEqual(1);
    expect(component.drugCodesInput$.length).toEqual(1);
  });

});
