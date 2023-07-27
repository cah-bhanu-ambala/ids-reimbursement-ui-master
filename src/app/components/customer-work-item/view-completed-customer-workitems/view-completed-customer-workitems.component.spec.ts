import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { ViewCompletedCustomerWorkitemsComponent } from './view-completed-customer-workitems.component';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { of, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import {CustomerWorkItemModule} from "../customer-work-item.module";

describe('ViewCompletedCustomerWorkitemsComponent', () => {
  let component: ViewCompletedCustomerWorkitemsComponent;
  let fixture: ComponentFixture<ViewCompletedCustomerWorkitemsComponent>;
  let wiService: WorkitemService;
  let toastr: ToastrService;

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

  const wiData ={
    workItemId: 22,
    teamMemberId: 1,
    workItemStatusId: 1,
    facilityBillingLevelId: "7",
    dateOut: "2021-02-25T08:00:00.000Z",
    providerId: 1,
    orderDate: "2021-02-18T08:00:00.000Z",
    buyBill: "U",
    externalWorkId: "123",
    orderTypeId: "1",
    wiInsurance: {
        primaryInsRep: "John",
        primaryInsRefNum: "999",
        primaryInNetwork: "Y",
        deductibleMax: "3000",
        deductibleMet: "1111",
        outOfPocketMax: "222",
        outOfPocketMet: "100",
        coInsurance: 20,
        primaryInsClassification: "3",
        primaryInsNotes: "Test",
        secondaryInsRefNum: "879",
        secondaryInsRep: "Fed",
        secondaryInNetwork: "Y",
        secondaryInsClassification: "22",
        secondaryInsNotes: "Test",
        workItemId: 22,
        modifiedBy: 1,
        createdBy: 1,
        workItemInsId: 10
    },
    generalNotes: "Test",
    drugCodes: [{
        createdBy: 1,
        modifiedBy: 1,
        drugProcCode: "J0135",
        isCover: "Y",
        priorAuth: "Y",
        priorAuthApprovalReason: "2",
        workItemDrugCodeId: 15,
        workItemId: 22,
        priorAuthNo: "456",
        priorAuthFromDate: "2021-03-02T08:00:00.000Z",
        priorAuthToDate: "2021-03-13T08:00:00.000Z",
        priorAuthNotes: "prior auth",
        visitsApproved: "2",
        unitsApproved: "1",
        advocacyNeeded: "Y",
        advocacyNotes: "Test",
        drugId: 2
    }],
    icdCodes: [{
        createdBy: 1,
        modifiedBy: 1,
        icdCode: "A00.0",
        workItemIcdCodeId: 11,
        workItemId: 22,
        icdId: 2
    }],
    modifiedBy: 1,
    dateIn: "",
    patientId: 3,
    attachments: [{
      active: true,
      createdDate: "2021-02-07T19:18:17.641Z",
      createdBy: 0,
      modifiedDate: "2021-02-07T19:18:17.641Z",
      modifiedBy: 0,
      workItemAttachmentId: 0,
      workItemId: 0,
      attachemntPath: "test"
  }],
};

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

  const wiSearchResult = [{
    active: true,
    createdDate: "2021-02-22T14:54:53.408+0000",
    createdBy: 1,
    modifiedDate: "2021-02-22T14:54:53.706+0000",
    modifiedBy: 1,
    workItemId: 13,
    facilityBillingLevelId: 1,
    facilityBillingTypeId: 3,
    providerId: 1,
    workItemStatusId: 1,
    patientId: 3,
    orderTypeId: 1,
    orderDate: "2021-02-01T08:00:00.000+0000",
    referralNumber: "",
    notes: "",
    generalNotes: "",
    assignedToId: 0,
    dateIn: "2021-02-22T08:00:00.000+0000",
    dateOut: null,
    buyBill: "N",
    externalWorkId: "",
    wiInsurance: {
      active: true,
      createdDate: "2021-02-22T14:54:53.622+0000",
      createdBy: 1,
      modifiedDate: "2021-02-22T14:54:53.622+0000",
      modifiedBy: 1,
      workItemInsId: 7,
      primaryInsRep: "1323",
      primaryInsRefNum: "1231",
      primaryInNetwork: "U",
      deductibleMax: 0,
      deductibleMet: 0,
      outOfPocketMax: 0,
      outOfPocketMet: 0,
      coInsurance: 0,
      primaryInsNotes: "notes",
      primaryInsClassification: 1,
      secondaryInsRep: "",
      secondaryInsRefNum: "",
      secondaryInNetwork: "U",
      secondaryInsNotes: "",
      secondaryInsClassification: 2,
      workItemId: 13,
      secondaryInsuranceName: "Unknown",
      primaryInsuranceName: "Unknown"
    },
    icdCodes: [],
    drugCodes: [],
    attachments: [],
    providerName: "James12",
    facilityBillingLevelName: "N/A",
    workItemStatusName: "New",
    facilityBillingTypeName: "PHARM",
    orderTypeName: "Oncology",
    facilityId: 1,
    facilityName: "Facility 1",
    facilityNPI: "1234567890",
    providerNPi: "1234567891",
    facilityEin: "1234567890",
    patientMrn: "mrn"
  }];

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
    modifiedBy: 1,
    wiInsurance: [{
      active: true,
      createdDate: "2021-02-22T14:54:53.622+0000",
      createdBy: 1,
      modifiedDate: "2021-02-22T14:54:53.622+0000",
      modifiedBy: 1,
      workItemInsId: 7,
      primaryInsRep: "1231",
      primaryInsRefNum: "1234",
      primaryInNetwork: "U",
      deductibleMax: 10000,
      deductibleMet: 5000,
      outOfPocketMax: 500,
      outOfPocketMet: 500,
      coInsurance: 1000,
      primaryInsNotes: "",
      primaryInsClassification: 1,
      secondaryInsRep: "abc",
      secondaryInsRefNum: "1321",
      secondaryInNetwork: "U",
      secondaryInsNotes: "test",
      secondaryInsClassification: 2,
      workItemId: 13,
      secondaryInsuranceName: "Unknown",
      primaryInsuranceName: "Unknown"
    }],
    attachments:[]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewCompletedCustomerWorkitemsComponent],
      imports: [
        ReactiveFormsModule, HttpClientTestingModule, ToastrModule.forRoot()
        , BrowserAnimationsModule, NgbModule, NgSelectModule, TableModule,
        ButtonModule, TooltipModule, FormsModule, CustomerWorkItemModule
      ],
      providers: [WorkitemService, ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCompletedCustomerWorkitemsComponent);
    component = fixture.componentInstance;
    wiService = TestBed.inject(WorkitemService);
    toastr = TestBed.inject(ToastrService);
    component.ngOnInit();
    fixture.detectChanges();
    fixture.changeDetectorRef.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get facility list', async(() => {
    spyOn(wiService, 'getApprovedFacilities').and.returnValue(of(facilityData));
    component.getFacilityList();
    expect(component.facilities).toEqual(facilityData);
    expect(wiService.getApprovedFacilities).toHaveBeenCalled();
  }));

  it('should get facility list throws error', async(() => {
    let err = "error"
    const spy = spyOn(wiService, 'getApprovedFacilities').and.returnValue(throwError(err));
    component.getFacilityList();
    expect(spy).toHaveBeenCalled();
  }));


  it('should get status list', async(() => {
    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    component.getwiStatuses();
    expect(component.wiStatuses).toEqual(wiStatus);
    expect(wiService.getwiStatuses).toHaveBeenCalled();
  }));

  it('should get status list throws error', async(() => {
    let err = "error"
    const spy = spyOn(wiService, 'getwiStatuses').and.returnValue(throwError(err));
    component.getwiStatuses();
    expect(spy).toHaveBeenCalled();
  }));


  it('should get team members list', async(() => {
    spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
    component.getTeamMembers();
    expect(component.wiStatuses).not.toBeNull();
    expect(wiService.getAllTeamMembers).toHaveBeenCalled();
  }));

  it('should get team members throws error', async(() => {
    let err = "error"
    const spy = spyOn(wiService, 'getAllTeamMembers').and.returnValue(throwError(err));
    component.getTeamMembers();
    expect(spy).toHaveBeenCalled();
  }));

  it('should get all approval reasons', async(() => {
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));
    component.getApprovalReasons();
    expect(component.wiStatuses).not.toBeNull();
    expect(wiService.getAllApprovalReasons).toHaveBeenCalled();
  }));

  it('should get all approval reasons throws an error', async(() => {
    let err = "error";
    const spy = spyOn(wiService, 'getAllApprovalReasons').and.returnValue(throwError(err));
    component.getApprovalReasons();
    expect(spy).toHaveBeenCalled();
  }));


  it('should get primary insurance list', async(() => {
    spyOn(wiService, 'getPrimaryIns').and.returnValue(of({}));
    component.getPrimaryIns();
    expect(component.getPrimaryIns).not.toBeNull();
    expect(wiService.getPrimaryIns).toHaveBeenCalled();
  }));

  it('should get primary insurance list throws error', async(() => {
    let err = "error"
    let spy = spyOn(wiService, 'getPrimaryIns').and.returnValue(throwError(err));
    component.getPrimaryIns();
    expect(spy).toHaveBeenCalled();
  }));

  it('should get secondary insurance list', async(() => {
    spyOn(wiService, 'getSecondaryIns').and.returnValue(of({}));
    component.getSecondaryIns();
    expect(component.getSecondaryIns).not.toBeNull();
    expect(wiService.getSecondaryIns).toHaveBeenCalled();
  }));

  it('should get secondary insurance list throws error', async(() => {
    let err = "error"
    let spy = spyOn(wiService, 'getSecondaryIns').and.returnValue(throwError(err));
    component.getSecondaryIns();
    expect(spy).toHaveBeenCalled();
  }));


  it('should search workitem when form is valid', async(() => {
    component.completedFormSearchWI = new FormGroup({
      facilityId: new FormControl(''),
      intFacilityId: new FormControl(''),
      workItemStatusId: new FormControl(''),
      teamMemberId: new FormControl(''),
      dateOut: new FormControl(null),
      mrn: new FormControl('')
    });
   let date = {
      year: '2023',
      month: '01',
      day: '29'
    }

    component.completedFormSearchWI.patchValue({
      mrn: 'mrn0001',
      facilityId: 1,
      intFacilityId: 1,
      facilityName: 'facility1',
      workItemStatusId: 1,
      teamMemberId: 1,
      dateOut: date
    });

    let params = {
      'facilityId': 1,
      'patientMrn': 'mrn0001',
      'workItemStatusId': 1,
      'dateOut': "2023-01-29",
      'teamMemberId': 1
    };
    // component.wiDatasource = [wiSearchResult];
    component.workItemsloading = false;
    component.wiTotalRecords = 1;
    component.showViewWorkItemGrid = false;
    spyOn(wiService, 'getAllWorkItem').and.returnValue(of([wiSearchResult]));

    component.onSearch();
    expect(component.showViewWorkItemGrid).toBeTrue();
    expect(component.wiDatasource).toEqual([wiSearchResult]);
    expect(component.workItemsloading).toEqual(false);
    expect(component.wiTotalRecords).toEqual([wiSearchResult].length);
    expect(component.showError).toEqual(false);
    expect(wiService.getAllWorkItem).toHaveBeenCalledWith(params);
  }));

  it('should search workitem when form is valid - when result is empty', async(() => {
    component.completedFormSearchWI = new FormGroup({
      facilityId: new FormControl(''),
      intFacilityId: new FormControl(''),
      workItemStatusId: new FormControl(''),
      teamMemberId: new FormControl(''),
      dateOut: new FormControl(null),
      mrn: new FormControl('')
    });
    let date = {
      year: '2023',
      month: '01',
      day: '29'
    }

    component.completedFormSearchWI.patchValue({
      mrn: 'mrn0001',
      facilityId: 1,
      intFacilityId: 1,
      facilityName: 'facility1',
      workItemStatusId: 1,
      teamMemberId: 1,
      dateOut: date
    });

    component.workItemsloading = false;
    component.wiTotalRecords = 1;
    component.showViewWorkItemGrid = true;
    spyOn(wiService, 'getAllWorkItem').and.returnValue(of([]));

    component.onSearch();
    expect(component.showViewWorkItemGrid).toBeFalse();
    expect(component.wiDatasource).toEqual([]);
    expect(component.workItemsloading).toEqual(false);
    expect(component.wiTotalRecords).toEqual(0);
    expect(component.showError).toBeTrue()
    expect(wiService.getAllWorkItem).toHaveBeenCalled();
  }));


  it('should get customer work item ', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    }
    component.wiDatasource = [wiSearchResult];
    component.loadWiDetails(event);
    tick(500);
    expect(component.workItemsloading).toBeFalse();
    expect(component.loadWiDetails).not.toBeNull();
  }));

  it('should load view work item', async(() => {
    let wiNumber = 123;
    spyOn(wiService, 'getWorkItemByIdAndFacilityId').and.returnValue(of(wiFormValue));
    component.onView(wiNumber);
    expect(
      component.completedWiInfo).toEqual(wiFormValue);
    expect(wiService.getWorkItemByIdAndFacilityId).toHaveBeenCalled();
  }));

  it('[onView] should load the data and set the form ', async(() => {
    const winum = 22;
    component.completedWiInfo = [wiData];
    spyOn(wiService, 'getWorkItemByIdAndFacilityId').and.returnValue(of(wiData));
    component.onView(winum);
    expect(component.completedWiInfo ).toEqual(wiData);
    expect(component.f).not.toBeNull();
    expect(component.icdCodes).not.toBeNull();
    expect(component.drugCodes).not.toBeNull();
  }));

  it('should return form',async(()=>{
    component.completedFormSearchWI =new FormGroup({});
    expect(component.sf).not.toBeNull();
  }))

  it('should not return form', async(() => {
    component.completedFormSearchWI = null;
    expect(component.sf).toBeNull();
  }))

  it('should return work item form',async(()=>{
    component.completedFormWorkItem  =new FormGroup({});
    expect(component.f).not.toBeNull();
  }))

  it('should return icd codes',async(()=>{
    component.completedWiInfo = wiFormValue;
    expect(component.completedWiInfo.icdCodes).not.toBeNull();
  }))


  it('should get Icd Codes Info', async(() => {
    let icdCodes = [
      {
        active: true,
        createdDate: "2021-02-07T08:58:46.238Z",
        createdBy: 0,
        modifiedDate: "2021-02-07T08:58:46.238Z",
        modifiedBy: 0,
        workItemIcdCodeId: 0,
        workItemId: 0,
        icdId: 0,
        icdDescription: "test",
        icdCode: "test"
      },
      {
        active: true,
        createdDate: "2021-02-07T08:58:46.238Z",
        createdBy: 0,
        modifiedDate: "2021-02-07T08:58:46.238Z",
        modifiedBy: 0,
        workItemIcdCodeId: 0,
        workItemId: 0,
        icdId: 1,
        icdDescription: "test1",
        icdCode: "test1"
      },
    ];
    component.getIcdCodesInfo(icdCodes);
    expect(component.getIcdCodesInfo(icdCodes)).toBeTruthy();
  }));

  it('should get Icd Codes Info case 2', async(() => {
    let icdCodes = [];
    component.getIcdCodesInfo(icdCodes);
    expect(component.getIcdCodesInfo(icdCodes)).toBeTruthy();
  }));

  it('should get drug Codes Info', async(() => {
    let drugCodes = []
    component.getdrugCodeInfo(drugCodes);
    expect(component.getdrugCodeInfo(drugCodes)).toEqual(drugCodes);
  }));

  it('should get drug Codes Info case 2', async(() => {
    let drugCodes = [
      {
        active: true,
        createdDate: "2021-02-07T08:58:46.238Z",
        createdBy: 0,
        modifiedDate: "2021-02-07T08:58:46.238Z",
        modifiedBy: 0,
        workItemDrugCodeId: 0,
        workItemId: 0,
        drugId: 0,
        isCover: "test",
        priorAuth: "test",
        priorAuthNo: "test",
        priorAuthFromDate: "2021-02-07T08:58:46.238Z",
        priorAuthToDate: "2021-02-07T08:58:46.238Z",
        priorAuthNotes: "test",
        priorAuthApprovalReason: 0,
        visitsApproved: "test",
        unitsApproved: "test",
        advocacyNeeded: "test",
        advocacyNotes: "test",
        drugLongDesc: "test",
        drugShortDesc: "test",
        drugProcCode: "test"
      },
      {
        active: true,
        createdDate: "2021-02-07T08:58:46.238Z",
        createdBy: 0,
        modifiedDate: "2021-02-07T08:58:46.238Z",
        modifiedBy: 0,
        workItemDrugCodeId: 10,
        workItemId: 10,
        drugId: 10,
        isCover: "test",
        priorAuth: "test",
        priorAuthNo: "test",
        priorAuthFromDate: "2021-02-07T08:58:46.238Z",
        priorAuthToDate: "2021-02-07T08:58:46.238Z",
        priorAuthNotes: "test",
        priorAuthApprovalReason: 0,
        visitsApproved: "test",
        unitsApproved: "test",
        advocacyNeeded: "test",
        advocacyNotes: "test",
        drugLongDesc: "test",
        drugShortDesc: "test",
        drugProcCode: "test"
      },
    ];
    component.getdrugCodeInfo(drugCodes);
    expect(component.getdrugCodeInfo(drugCodes)).toBeTruthy();
  }));

  it('should open a file', () => {
    const id = 1;
    const attachmentName = 'test';
    let blob = { foo: 'bar', file: 'file' };
    let urlCreateObjectSpy = spyOn(window.URL, 'createObjectURL').and.returnValue(blob.file);
    component.openFile(id, attachmentName);
    expect(urlCreateObjectSpy).toBeTruthy();
    expect(component.filesList).not.toBeNull();
  });

  it("should open File", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf"
    const spy = spyOn(wiService, 'getAttachmentById').and.returnValue(of({}));
    component.openFile(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });

  it("should open File throws error", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf";
    let err = "error";
    const spy = spyOn(wiService, 'getAttachmentById').and.returnValue(throwError(err));
    component.openFile(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });

  it('[showFailure] works', fakeAsync((msg: any) => {
    msg = 'error';
    component.showFailure(msg);
    flush();
    expect(component.showFailure).toBeTruthy();
  }));


  it('onReset', () => {
    component.completedFormSearchWI = new FormGroup({
      facilityId: new FormControl(''),
      intFacilityId: new FormControl(''),
      workItemStatusId: new FormControl(''),
      teamMemberId: new FormControl(''),
      dateOut: new FormControl(null),
      mrn: new FormControl('')
    });
    component.completedFormWorkItem = new FormGroup({});
    component.onReset();
    expect(component.f).toEqual({});
    expect(component.icdCodes).toBeNull();
    expect(component.drugCodes).toBeNull();
  });

  it('[getFormattedDate] works', fakeAsync((selectedDate) =>{
      selectedDate = {month:'01',day:'31', year:'2022'};
      component.getFormattedDate(selectedDate);
      expect(component).toBeTruthy();
  }));

  it('[exportPDF] should export data to pdf file', fakeAsync(() => {
    component.completedWiInfo = wiFormValue;
    let wiNumber = 123;
    spyOn(wiService, 'getWorkItemByIdAndFacilityId').and.returnValue(of(wiFormValue));
    component.onView(wiNumber);
    component.exportPDF();
    flush();

    expect(component.exportPDF).toBeTruthy();
  }));

  it('[getInsuranceClassification] is called with type and id', () => {
    let type = 'primaryInsurance';
    let pi = {
      insuranceId: 123,
      insuranceName: 'primaryIns1'
    }
    component.primaryInsList = [{insuranceId: 123, insuranceName: 'primaryName'}]
    component.getInsuranceClassification(type, pi.insuranceId);
    expect(component.getInsuranceClassification).toBeTruthy();
  });

  it('[getInsuranceClassification] is called with type and id (case 2)', () => {
    let type = 'primaryInsurance';
    let pi = {
      insuranceId: 123,
      insuranceName: 'primaryIns1'
    }
    component.primaryInsList = [{insuranceId: 465, insuranceName: 'primaryName'}]
    component.getInsuranceClassification(type, pi.insuranceId);
    expect(component.getInsuranceClassification).toBeTruthy();
  });

  it('[getInsuranceClassification] is called with type and id (secondary)', () => {
    let type = 'secondaryInsurance';
    let pi = {
      insuranceId: 281,
      insuranceName: 'secondaryIns1'
    }
    component.secondaryInsList = [{insuranceId: 281, insuranceName: 'secondaryName'}]
    component.getInsuranceClassification(type, pi.insuranceId);
    expect(component.getInsuranceClassification).toBeTruthy();
  });

  it('[getInsuranceClassification] is called with type and id (secondary)', () => {
    let type = 'secondaryInsurance';
    let pi = {
      insuranceId: 281,
      insuranceName: 'secondaryIns1'
    }
    component.secondaryInsList = [{insuranceId: 81, insuranceName: 'secondaryName'}]
    component.getInsuranceClassification(type, pi.insuranceId);
    expect(component.getInsuranceClassification).toBeTruthy();
  });

  it('[getApprovalReasonLabel] gets approved with approvalId', () => {
    let approvalId = 123;
    component.wiApprovalReasons = [
      {priorAuthStatusId: 123, priorAuthStatusName: 'authStatusNameTest'}
    ];
    component.getApprovalReasonLabel(approvalId);
    expect(component.getApprovalReasonLabel).toBeTruthy();
  });

  it('[getApprovalReasonLabel] gets denied with invalid approvalId', () => {
    let approvalId = 123;
    component.wiApprovalReasons = [
      {priorAuthStatusId: 968, priorAuthStatusName: 'authStatusNameTest'}
    ];
    component.getApprovalReasonLabel(approvalId);
    expect(component.getApprovalReasonLabel).toBeTruthy();
  });

  it('[getTeamMemberName] get names with teamMemberId', () => {
    let teamMemberId = 345;
    component.wiTeamMembers = [
      {userId: 345, userName: 'teamMemberNameTest'}
    ];
    const spy = spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}))
    component.getTeamMemberName(teamMemberId);
    expect(component.getTeamMemberName).toBeTruthy();
  });

  it('[getTeamMemberName] does not get names with teamMemberId', () => {
    let teamMemberId = 345;
    component.wiTeamMembers = [
      {userId: 789, userName: 'teamMemberNameTest'}
    ];
    const spy = spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}))
    component.getTeamMemberName(teamMemberId);
    expect(component.getTeamMemberName).toBeTruthy();
  });

  it('[refreshViewWorkItemGrid] reset the ViewWorkItemGrid', () => {
    component.showViewWorkItemGrid = true;
    component.wiSearchResult = [wiData];
    component.refreshViewWorkItemGrid();
    expect(component.showViewWorkItemGrid).toBeFalse();
    expect(component.wiSearchResult).toEqual([]);
  });
});


