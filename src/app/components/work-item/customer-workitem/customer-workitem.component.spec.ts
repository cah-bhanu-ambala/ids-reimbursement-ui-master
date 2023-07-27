import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbDatepickerModule,NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { CustomerWorkitemComponent } from './customer-workitem.component';
import { CustomerWorkitemService } from 'src/app/common/services/http/customer-workitem.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';

class MdDialogMock {
  open() {
    return {
      open: () => {}
    };
  }
};

const activatedRouteMock = {
  queryParams: of({
    customerWorkItemNumber: '123',
    patientId: '124',
  }),
};


describe('CustomerWorkitemComponent', () => {
  let component: CustomerWorkitemComponent;
  let fixture: ComponentFixture<CustomerWorkitemComponent>;
  let customerWorkitemService: CustomerWorkitemService;
  let toastr: ToastrService;
  let router: Router;
  let dialog: MdDialogMock;

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
      facilityId: 2,
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

  const wiSearchResult= [{
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
    buyBill: "U",
    externalWorkId: "",
    wiInsurance: {
        active: true,
        createdDate: "2021-02-22T14:54:53.622+0000",
        createdBy: 1,
        modifiedDate: "2021-02-22T14:54:53.622+0000",
        modifiedBy: 1,
        workItemInsId: 7,
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
        workItemId: 13,
        secondaryInsuranceName: "Unknown",
        primaryInsuranceName: "Unknown"
    },
    icdCodes: [],
    drugCodes: [],
    attachments: [],
    providerName: "James12 ",
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

  const searchFormValues = [
    {
      facilityIds: [1,2,3],
      workItemStatusId: 1,
      teamMemberId: 1,
      mrn: 'mrn001'
    },
    {
      facilityIds: [2,3,3],
      workItemStatusId: 2,
      teamMemberId: 1,
      mrn: 'mrn002'
    }
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerWorkitemComponent],
      imports: [
        ReactiveFormsModule, HttpClientTestingModule, ToastrModule.forRoot()
        , BrowserAnimationsModule, NgbModule, NgSelectModule, TableModule,
        ButtonModule, TooltipModule,
      ],
      providers: [CustomerWorkitemService, ToastrService,
        {
        provide: Router,
        useClass: class {
          navigate = jasmine.createSpy("navigate");
        }
      }      ,
          {
            provide: ActivatedRoute, useValue: activatedRouteMock
          },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWorkitemComponent);
    component = fixture.componentInstance;
    customerWorkitemService = TestBed.inject(CustomerWorkitemService);
    toastr = TestBed.inject(ToastrService);
    router = fixture.debugElement.injector.get(Router);
    dialog = TestBed.get(NgbModal);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return form',async(()=>{
    component.formSearchCustomerWI =new FormGroup({});
    expect(component.sf).not.toBeNull();
  }))

  it('should not return form',async(()=>{
    component.formSearchCustomerWI =null;
    expect(component.sf).toBeNull();
  }))

  it('should get facility list', async(() => {
    spyOn(customerWorkitemService, 'getApprovedFacilities').and.returnValue(of(facilityData));
    component.getFacilityList();
    expect(component.facilities).toEqual(facilityData);
    expect(customerWorkitemService.getApprovedFacilities).toHaveBeenCalled();
  }));

  it('should get facility list throws error', async(() => {
    let err = "error"
    const spy = spyOn(customerWorkitemService, 'getApprovedFacilities').and.returnValue(throwError(err));
    component.getFacilityList();
    expect(spy).toHaveBeenCalled();
  }));

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

  it('should search workitem when form is valid', async(() => {
    component.formSearchCustomerWI.patchValue({
      facilityIds: [1,2],
      workItemStatusId: 1,
      teamMemberId: [''],
      mrn: 'mrn'
    });

    const spy =spyOn(customerWorkitemService, 'getCustomerSubmittedWorkItem').and.returnValue(of(wiSearchResult));
    component.onSearch();
    expect(component.datasource ).toEqual(wiSearchResult);
    spy.and.callThrough();
    expect(spy).toHaveBeenCalled();
  }));

  it('should search workitem and return empty data', async(() => {
    component.formSearchCustomerWI.patchValue({
      facilityIds: [1,2],
      workItemStatusId: 10,
      teamMemberId: [''],
      mrn: 'mrn'
    });

    const spy =spyOn(customerWorkitemService, 'getCustomerSubmittedWorkItem').and.returnValue(of({}));
    component.onSearch();
    component.datasource = [];
    expect(component.datasource ).toEqual([]);
    expect(component.showGrid).toEqual(false);
    expect(component.showError ).toEqual(true);
    spy.and.callThrough();
    expect(spy).toHaveBeenCalled();
  }));

  it('should search workitem should throw error', async(() => {
    component.formSearchCustomerWI.patchValue({
      facilityIds: [1,2],
      workItemStatusId: 10,
      teamMemberId: [''],
      mrn: 'mrn'
    });
    let err = "error";
    const spy =spyOn(customerWorkitemService, 'getCustomerSubmittedWorkItem').and.returnValue(throwError(err));
    component.onSearch();
    expect(spy).toHaveBeenCalled();
  }));


  it('Form check is valid or not if no values entered', () => {
    expect(component.formSearchCustomerWI.invalid).toBeFalsy();
  });


  it('should get customer work item ', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.datasource= [wiSearchResult];
    component.loadCustomerWorkItemDetails(event);
    tick(500);
    expect(component.loading).toBeFalse();
    expect(component.loadCustomerWorkItemDetails).not.toBeNull();
  }));

  it('should not get any data when datasource is empty', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.loadCustomerWorkItemDetails(event);
    tick(500);
    expect(component.loading).toBeTrue();
  }));

  it('should get Icd Codes Info', async(() => {
    let icdCodes = [];
    component.getIcdCodesInfo(icdCodes);
    expect(component.getIcdCodesInfo(icdCodes)).toEqual(icdCodes);
  }));

  it('should get Icd Codes Info case 2', async(() => {
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
    expect(component.getIcdCodesInfo(icdCodes)).toBeTruthy;
  }));

  it('should get drug Codes Info', async(() => {
    let drugCodes = []
    component.getdrugCodeInfo(drugCodes);
    expect(component.getdrugCodeInfo(drugCodes)).toEqual(drugCodes);
  }));

  it('should get drug Codes Info', async(() => {
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
    ]
    component.getdrugCodeInfo(drugCodes);
    expect(component.getdrugCodeInfo(drugCodes)).toBeTruthy();
  }));

  it('should add patient and route', async(() => {
    let customerWorkItem = {facilityId:1, mrn: 'mrn001', primaryInsuranceId:1, customerWorkItemId: 1}
    component.addPatient(customerWorkItem);
    expect(component.formSearchCustomerWI).toBeTruthy();
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

  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.searched ).toBeFalse();
  }));

  it('should add patient and route', async(() => {
    let customerWorkItem = {facilityId:1, mrn: 'mrn001', primaryInsuranceId:1, customerWorkItemId: 1}
    component.addPatient(customerWorkItem);
    expect(component.formSearchCustomerWI).toBeTruthy();
  }));

  it('should delete customer work item', async(() => {
    let cwiNumber = 123;
    let custWorkItemId =456;
    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    spyOn(dialog, 'open').and.callThrough();
    const spy =spyOn(customerWorkitemService, 'deleteCustomerWorkItem').and.returnValue(of({}));
    component.deleteWI(cwiNumber);

    component.onDelete(custWorkItemId);
    expect(dialog.open).toHaveBeenCalled();
    expect(component.deleteWI).toBeTruthy();

    expect(spy).toHaveBeenCalled();

  }));


  it('should add new work item', async(() => {
    let customerWorkItem = {facilityId:1, mrn: 'mrn001', primaryInsuranceId:1, customerWorkItemId: 1}
    component.addNewWorkItem(customerWorkItem);
    expect(component.addNewWorkItem).toBeTruthy();
  }));

  it('should open attachment', fakeAsync(() => {
    let id =1;
    let name = 'sp@1234.pdf';
    const spy =spyOn(customerWorkitemService, 'getAttachmentById').and.returnValue(of({}));
    component.openFile(id, name);
    expect(spy).toHaveBeenCalled();
    expect(component.openFile(id, name)).toBeUndefined();
    flush();
  }));

  it('should open attachment should throw error', fakeAsync(() => {
    let id =1;
    let name = 'sp@1234.pdf';
    let err = "error";
    const spy =spyOn(customerWorkitemService, 'getAttachmentById').and.returnValue(throwError(err));
    component.openFile(id, name);
    expect(spy).toHaveBeenCalled();
    flush();
  }));

   it('[onClearAll] triggers when type is facilities', () => {
    let type = 'advocacies';
    component.onClearAll(type);
    expect(component.facilities).toBeTruthy;
  });

  it('[onSelectAll] triggers when type is facilities', () => {
    let type = 'advocacies';
    component.onSelectAll(type);
    expect(component.facilities).toBeTruthy;
  });
});

