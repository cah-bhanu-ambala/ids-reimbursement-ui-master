import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import {FileAttachmentService} from 'src/app/common/services/http/file-attachment.service';

import { AddWorkitemComponent } from './add-workitem.component';
import { PatientService } from 'src/app/common/services/http/patient.service';

describe('AddWorkitemComponent', () => {
  let component: AddWorkitemComponent;
  let fixture: ComponentFixture<AddWorkitemComponent>;
  let workItemService: WorkitemService;
  let patientService: PatientService;
  let commonService: CommonService;
  let fileAttachmentService: FileAttachmentService;
  let toastr: ToastrService;

  const facilityData=[
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

  const searchResult =[{
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

const icdCodes =[{
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

const drugCodes = [{
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
}];

const wiFormValue ={
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
  icdCodes: [{icdCode:'A00.9', ctive:true,createdDate:"2021-02-28T01:42:51.001+0000",createdBy:1,modifiedDate:"2021-02-28T01:42:51.001+0000",modifiedBy:1,workItemIcdCodeId:15,workItemId:null,icdId:4}],
  drugCodes:[{drugCode:"J0135",drugId:33,createdBy:1,modifiedBy:1}],
  attachment1: "",
  attachment2: "",
  attachment3: "",
  attachment4: "",
  generalNotes: "Test",
  createdBy:1,
  modifiedBy: 1
};

const orderTypes = [
  {
     "active": true,
     "createdDate": "2023-03-29T16:23:18.427+00:00",
     "createdBy": 1,
     "modifiedDate": "2023-03-29T16:23:18.427+00:00",
     "modifiedBy": 1,
     "orderTypeId": 3,
     "orderTypeName": "Audit",
     "createdByName": "admin",
     "modifiedByName": "admin"
  },
  {
     "active": true,
     "createdDate": "2021-02-26T00:37:52.290+00:00",
     "createdBy": 1,
     "modifiedDate": "2021-02-26T00:37:52.290+00:00",
     "modifiedBy": 1,
     "orderTypeId": 2,
     "orderTypeName": "Non Oncology",
     "createdByName": "admin",
     "modifiedByName": "admin"
  },
  {
     "active": true,
     "createdDate": "2021-02-26T00:37:52.290+00:00",
     "createdBy": 1,
     "modifiedDate": "2021-02-26T00:37:52.290+00:00",
     "modifiedBy": 1,
     "orderTypeId": 1,
     "orderTypeName": "Oncology",
     "createdByName": "admin",
     "modifiedByName": "admin"
}];

const billingTypes = [
  {
     "active": true,
     "createdDate": "2023-03-29T15:53:03.562+00:00",
     "createdBy": 1,
     "modifiedDate": "2023-03-29T15:53:03.562+00:00",
     "modifiedBy": 1,
     "facilityBillingTypeId": 5,
     "facilityBillingTypeName": "AUDIT",
     "createdByName": "admin",
     "modifiedByName": "admin"
  },
  {
     "active": true,
     "createdDate": "2021-02-26T00:37:52.238+00:00",
     "createdBy": 1,
     "modifiedDate": "2021-02-26T00:37:52.238+00:00",
     "modifiedBy": 1,
     "facilityBillingTypeId": 1,
     "facilityBillingTypeName": "N/A",
     "createdByName": "admin",
     "modifiedByName": "admin"
  },
  {
     "active": true,
     "createdDate": "2021-02-26T00:37:52.238+00:00",
     "createdBy": 1,
     "modifiedDate": "2021-02-26T00:37:52.238+00:00",
     "modifiedBy": 1,
     "facilityBillingTypeId": 3,
     "facilityBillingTypeName": "PHARM",
     "createdByName": "admin",
     "modifiedByName": "admin"
  },
  {
     "active": true,
     "createdDate": "2021-02-26T00:37:52.238+00:00",
     "createdBy": 1,
     "modifiedDate": "2021-02-26T00:37:52.238+00:00",
     "modifiedBy": 1,
     "facilityBillingTypeId": 4,
     "facilityBillingTypeName": "RAD",
     "createdByName": "admin",
     "modifiedByName": "admin"
  },
  {
     "active": true,
     "createdDate": "2021-02-26T00:37:52.238+00:00",
     "createdBy": 1,
     "modifiedDate": "2021-02-26T00:37:52.238+00:00",
     "modifiedBy": 1,
     "facilityBillingTypeId": 2,
     "facilityBillingTypeName": "VOB",
     "createdByName": "admin",
     "modifiedByName": "admin"
}];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWorkitemComponent ],
      imports:[
        ReactiveFormsModule,HttpClientTestingModule, ToastrModule.forRoot()
        ,BrowserAnimationsModule, NgbModule, NgSelectModule,TableModule,
        ButtonModule, TooltipModule, ],
      providers: [WorkitemService,CommonService, PatientService, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWorkitemComponent);
    component = fixture.componentInstance;
    workItemService = TestBed.inject(WorkitemService);
    commonService = TestBed.inject(CommonService);
    patientService = TestBed.inject(PatientService);
    fileAttachmentService = TestBed.inject(FileAttachmentService);
    toastr = TestBed.inject(ToastrService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check search form is valid when all values are entered', () => {
    component.addFormSearchPatient.patchValue({
      facilityId: 1,
      mrn: 'mrn'
    });
    expect(component.sf).toBeTruthy();
    expect(component.addFormSearchPatient.valid).toBeTrue();
  });

  it('should check add workitem form is valid when all values are entered', () => {
    const form = {providerId:8,orderTypeId:1,referralNumber:"555",patientId:"",orderDate:{year:2021,month:2,day:26},facilityBillingTypeId:"2",notes:"",icdCodes:[{icdCode:"A00.9"}],drugCodes:[{drugCode:"J0636"}],"attachment1":"","attachment2":"","attachment3":"","attachment4":"",generalNotes:"Test"};
    component.addFormWorkItem.patchValue(form);
    expect(component.f).toBeTruthy();
    expect(component.addFormWorkItem.valid).toBeTrue();
  });

  it('[addGetFacilityList] should get facility list', async(() => {
    spyOn(workItemService, 'getApprovedFacilities').and.returnValue(of(facilityData));
    component.addGetFacilityList();
    expect(component.addFacilities).toEqual(facilityData);
    expect(workItemService.getApprovedFacilities).toHaveBeenCalled();
  }));

  it('[addGetFacilityList] should throw error', async(() => {
    let err="error"
    const spy =spyOn(workItemService, 'getApprovedFacilities').and.returnValue(throwError(err));
    component.addGetFacilityList();
    expect(spy).toHaveBeenCalled();
  }));

  // it('[getIcdList] should get icd list', async(() => {
  //   const spy =spyOn(commonService, 'getICDList').and.returnValue(of(icdCodes));
  //   component.getAddIcdList();
  //   expect(component.icdList).not.toBeNull();
  //   expect(component.icdList).toEqual(icdCodes);
  //   expect(spy).toHaveBeenCalled();
  // }));

  // it('[getIcdList] should throw error', async(() => {
  //   let err="error"
  //   const spy =spyOn(commonService, 'getICDList').and.returnValue(throwError(err));
  //   component.getAddIcdList();
  //   expect(spy).toHaveBeenCalled();
  // }));

  it('[getBillingTypes] should get billing types list', async(() => {
    const spy = spyOn(workItemService, 'getBillingTypes').and.returnValue(of({}));
    component.getBillingTypes();
    expect(component.billingTypes).not.toBeNull();
    expect(component.tempBillingTypes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));
  it('[getOrderTypes] should make api call', async(() => {
      const spy = spyOn(workItemService, 'getOrderTypes').and.returnValue(of({}));
      component.getOrderTypes();
      expect(spy).toHaveBeenCalled();
    }));

  it('[getBillingTypes] should throw error', async(() => {
    let err="error"
    const spy =spyOn(workItemService, 'getBillingTypes').and.returnValue(throwError(err));
    component.getBillingTypes();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getProviderList] should get providers list', async(() => {
    const spy = spyOn(workItemService, 'getProviderList').and.returnValue(of({}));
    component.getProviderList();
    expect(component.billingTypes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getProviderList] should throw error', async(() => {
    let err="error"
    const spy =spyOn(workItemService, 'getProviderList').and.returnValue(throwError(err));
    component.getProviderList();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSearch] should search workitem when form is valid', async(() => {
    component.addFormSearchPatient.patchValue({
      facilityId: 1,
      mrn: 'mrn'
    });

    spyOn(workItemService, 'getMrnFacilities').and.returnValue(of(searchResult));
    component.onSearch();
    expect(component.datasource ).toEqual(searchResult);
    expect(workItemService.getMrnFacilities).toHaveBeenCalled();
  }));

  it('[onSearch] should return false when form is invalid', async(() => {
    expect(component.onSearch() ).toBeFalse();
    expect(component.searched ).toBeTrue();
  }));

  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.showGrid).toBeFalse();
    expect(component.addFormWorkItem.pristine).toBeTrue();
  }));

  it('[onClear] should cancel form submission', async(() => {
    component.onClear();
    expect(component.addFormWorkItem.pristine).toBeTrue();
  }));

  it('[loadAddWorkItemDetails] should load data after 500ms', fakeAsync(() => {
    const event: LazyLoadEvent ={"first":0,"rows":10,"sortOrder":1,"filters":{},"globalFilter":null};
    component.datasource = searchResult;
    component.loadAddWorkItemDetails(event);
    tick(500);
    expect(component.loading ).toBeFalse();
  }));

  it('[loadAddWorkItemDetails] should not load data when datasource in null', fakeAsync(() => {
    const event: LazyLoadEvent ={"first":0,"rows":10,"sortOrder":1,"filters":{},"globalFilter":null};
    component.loadAddWorkItemDetails(event);
    tick(500);
    expect(component.loading).toBeTrue();
  }));

  it('[addWorkItem] should add work item', fakeAsync(() => {
    component.addWorkItem(wiFormValue);
    expect(component.showAddWorkItem).toBeTrue();
  }));

  it('[generateDianosisControls] should add new ICD field', fakeAsync(() => {
    component.generateDianosisControls();
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[generateDianosisControls] should show error when trying to add more than 10 new ICD fields', fakeAsync(() => {
    component.addNoOfICDCodes =11;
    spyOn(toastr,'info');
    component.generateDianosisControls();
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[generateDrugCodeControls] should add new drug field', fakeAsync(() => {
    component.generateDrugCodeControls();
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[generateDrugCodeControls] should show error when trying to add more than 13 new Drug fields', fakeAsync(() => {
    component.noOfdrugCodes = 14;
    spyOn(toastr,'info');

    component.generateDrugCodeControls();
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[trackByIcdCode] should return val', async(() => {
    const val =  {icdId:'J0170'};
    expect(component.trackByIcdCode(val)).not.toBeNull();
  }));

it('[trackByDrugCode] should return val', async(() => {
    const val =  'A00.1-Cholera due to Vibrio cholerae 01, biovar eltor';
    expect(component.trackByDrugCode(val)).toEqual(val);
  }));

  it('[onIcdCodeChange] should patch icd value to the form', async(() => {
    const selectedValue= 'JA00.1-Cholera due to Vibrio cholerae 01, biovar eltor';
    const Ctrlidx= 0;
    component.onIcdCodeChange(selectedValue, Ctrlidx);
    expect(component.icdCodes).not.toBeNull();
  }));

  it('[onDrugCodeChange] should patch drug value to the form', async(() => {
    const selectedValue= 'J0170-Adrenalin epinephrin inject-Adrenalin epinephrin inject';
    const Ctrlidx= 0;
    component.onDrugCodeChange(selectedValue, Ctrlidx);
    expect(component.drugCodes).not.toBeNull();
  }));

  it('[onSubmit] should submit form when all value are set',fakeAsync(() => {
   const createWiResp = {active:true,createdDate:"2021-02-28T01:42:50.991+0000",createdBy:1,modifiedDate:"2021-02-28T01:42:51.007+0000",modifiedBy:1,workItemId:26,patientId:3,providerId:8,facilityBillingTypeId:2,facilityBillingLevelId:1,workItemStatusId:1,orderTypeId:1,orderDate:"2021-02-26T08:00:00.000+0000",referralNumber:"555",notes:"",generalNotes:"Test",assignedToId:0,dateIn:"0195-05-02",dateOut:null,buyBill:"U",externalWorkId:"",wiInsurance:{active:true,createdDate:"2021-02-28T01:42:51.003+0000",createdBy:1,modifiedDate:"2021-02-28T01:42:51.003+0000",modifiedBy:1,workItemInsId:14,primaryInsRep:"",primaryInsRefNum:"",primaryInNetwork:"U",deductibleMax:0,deductibleMet:0,outOfPocketMax:0,outOfPocketMet:0,coInsurance:0,primaryInsNotes:"",primaryInsClassification:1,secondaryInsRep:"",secondaryInsRefNum:"",secondaryInNetwork:"U",secondaryInsNotes:"",secondaryInsClassification:2,workItemId:26,secondaryInsuranceName:"",primaryInsuranceName:""},icdCodes:[{active:true,createdDate:"2021-02-28T01:42:51.001+0000",createdBy:1,modifiedDate:"2021-02-28T01:42:51.001+0000",modifiedBy:1,workItemIcdCodeId:15,workItemId:null,icdId:4}],drugCodes:[{active:true,createdDate:"2021-02-28T01:42:50.994+0000",createdBy:1,modifiedDate:"2021-02-28T01:42:50.994+0000",modifiedBy:1,workItemDrugCodeId:19,workItemId:null,drugId:33,isCover:"U",priorAuth:"U",priorAuthNo:"",priorAuthFromDate:null,priorAuthToDate:null,priorAuthNotes:"",priorAuthApprovalReason:1,visitsApproved:"",unitsApproved:"",advocacyNeeded:"U",advocacyNotes:""}]};
   const attachmentResp = {active:true,createdDate:"2021-02-28T02:34:05.131+0000",createdBy:1,modifiedDate:"2021-02-28T02:34:05.131+0000",modifiedBy:1,workItemAttachmentId:1,workItemId:27,attachmentPath:"keyboard-shortcuts-windows.pdf"};
   component.addFormWorkItem.patchValue(wiFormValue);
   component.icdList = icdCodes;
   component.patientId = 1;
   spyOn(FormData.prototype, "append");

   const patientSpy = spyOn(patientService, 'getByPatientId').and.returnValue(of({"primaryInsuranceId": 3, "secondaryInsuranceId": 10}));
   const spy = spyOn(workItemService, 'createWorkItem').and.returnValue(of(createWiResp));
   component.fileAttachmentData.selectedFiles = [{"fakeData": "fakeData"}];
   spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));
   spyOn(toastr, 'success');

   component.onSubmit();
   expect(component.showAddWorkItem ).toBeFalse();
   expect(component.showPatientSearch).toBeTrue();
   expect(spy).toHaveBeenCalled();
   expect(patientSpy).toHaveBeenCalled();
 }));

it('[onSubmit] should return false when add form is invalid',async(() => {
  const val = component.onSubmit();
  expect(val).toBeFalse();
  }));

 it('[onSubmit] should throw API error',async(() => {
  component.addFormWorkItem.patchValue(wiFormValue);
  component.icdList = icdCodes;

  spyOn(patientService, 'getByPatientId').and.returnValue(of({"primaryInsuranceId": 3, "secondaryInsuranceId": 10}));
  const spy = spyOn(workItemService, 'createWorkItem').and.returnValue(throwError("err")) ;
  spyOn(toastr, 'error');

  component.onSubmit();
  expect(spy).toHaveBeenCalled();
  }));

  it('[loadPatientDetails] should not get any data when datasource is empty', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.icdDatasource = icdCodes;
    component.loadICDDetails(event);
    tick(500);
    expect(component.icdloading).toBeFalse();
    expect(component.icdAddSearchResult ).not.toBeNull();
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

  it('should display billing type as audit by default when order type is audit and restrict dropdown should have only audit', () => {
    const selectedOrderTypeId = '3';
    const expectedBillingType = [
      {
        "active": true,"createdDate": "2023-03-29T15:53:03.562+00:00","createdBy": 1,"modifiedDate": "2023-03-29T15:53:03.562+00:00","modifiedBy": 1,"facilityBillingTypeId": 5,"facilityBillingTypeName": "AUDIT","createdByName": "admin","modifiedByName": "admin"
     }
    ];
    component.orderTypes = orderTypes;
    component.billingTypes = billingTypes;
    component.selectedfacilityBillingTypeId =5;
    component.addFormWorkItem.get('facilityBillingTypeId').setValue(component.selectedfacilityBillingTypeId);

    component.onOrderTypeChange(selectedOrderTypeId);
    
    expect(component.billingTypes).toEqual(expectedBillingType);
    expect(component.refOrClaimLabelName).toEqual('Claim Number');
    expect(component.selectedfacilityBillingTypeId).toEqual(expectedBillingType[0].facilityBillingTypeId);
    expect(component.addFormWorkItem.get('facilityBillingTypeId').value).toEqual(component.selectedfacilityBillingTypeId);
  })

  it('should display all billing types when order type is not audit', () => {
    const selectedOrderTypeId = '2';
    component.orderTypes = orderTypes;
    component.tempBillingTypes = billingTypes;

    component.selectedfacilityBillingTypeId ='';
    component.addFormWorkItem.get('facilityBillingTypeId').setValue(component.selectedfacilityBillingTypeId);
    component.onOrderTypeChange(selectedOrderTypeId);
    
    expect(component.billingTypes).toEqual(component.tempBillingTypes);
    expect(component.refOrClaimLabelName).toEqual('Referral Number');
    expect(component.selectedfacilityBillingTypeId).toEqual('');
    expect(component.addFormWorkItem.get('facilityBillingTypeId').value).toEqual(component.selectedfacilityBillingTypeId);
    
  })

});
