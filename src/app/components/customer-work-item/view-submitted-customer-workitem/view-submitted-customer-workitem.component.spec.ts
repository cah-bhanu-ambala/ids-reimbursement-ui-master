import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { CustomerWorkitemService } from 'src/app/common/services/http/customer-workitem.service';
import { Router } from '@angular/router';
import { ViewSubmittedCustomerWorkitemComponent } from './view-submitted-customer-workitem.component';
import { of, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import {CustomerWorkItemModule} from "../customer-work-item.module";

describe('ViewSubmittedCustomerWorkitemComponent', () => {
  let component: ViewSubmittedCustomerWorkitemComponent;
  let fixture: ComponentFixture<ViewSubmittedCustomerWorkitemComponent>;
  let customerWorkitemService: CustomerWorkitemService;
  let toastr: ToastrService;
  let router: Router;
  let dialog: MdDialogMock;

class MdDialogMock {
  open() {
    return {
      open: () => {}
    };
  }
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

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewSubmittedCustomerWorkitemComponent ],
      imports:[
        ReactiveFormsModule,HttpClientTestingModule, ToastrModule.forRoot()
        ,BrowserAnimationsModule, NgbModule, NgSelectModule,TableModule,
        ButtonModule, TooltipModule,CustomerWorkItemModule,
      ],
      providers: [CustomerWorkitemService, ToastrService,     {
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
    fixture = TestBed.createComponent(ViewSubmittedCustomerWorkitemComponent);
    component = fixture.componentInstance;
    customerWorkitemService = TestBed.inject(CustomerWorkitemService);
    dialog = TestBed.get(NgbModal);
    toastr = TestBed.inject(ToastrService);
    router = fixture.debugElement.injector.get(Router);
    component.ngOnInit();
    fixture.detectChanges();
    fixture.changeDetectorRef.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return form',async(()=>{
    component.formSearchSubmittedCWI =new FormGroup({});
    expect(component.f).not.toBeNull();
  }))


  it('should check customer work item form is valid when all values are entered', () => {
    const Custform = {
      facilityId: 1,
      facilityName: 'Facility1',
      intFacilityId: '1',
      patientMrn: 'mrn001',
      whoAdded: '1'

    };
    component.formSearchSubmittedCWI.patchValue(Custform);
    expect(component.f).toBeTruthy();
    expect(component.formSearchSubmittedCWI.valid).toBeTrue();
  });

  it('should get customer work item ', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.datasource= [wiSearchResult];
    component.loadSubmittedWorkItems(event);
    tick(500);
    expect(component.loading).toBeFalse();
    expect(component.loadSubmittedWorkItems).not.toBeNull();
  }));

  it('[onSearch] should search workitem when form is valid', async(() => {
    component.formSearchSubmittedCWI.patchValue({
      patientMrn: 'mrn001',
      intFacilityId: 15,
      whoAdded: 1,
          });

    let params = {
      'facilityId': 15 ,
      'patientMrn': 'mrn001',
      'whoAdded': 1
    }
    component.showGrid = false;
    component.loading = true;
    component.datasource = [];
    component.totalRecords = 0;

    const spy =spyOn(customerWorkitemService, 'getSubmittedCustomerWorkItems').and.returnValue(of(wiSearchResult));
    component.onSearch();
    expect(component.datasource ).toEqual(wiSearchResult);
    expect(component.showGrid ).toBeTrue();
    expect(component.loading ).toBeFalse();
    expect(component.totalRecords ).toEqual(wiSearchResult.length);
    expect(spy).toHaveBeenCalledWith(params);
  }));

  it('[onSearch] should search workitem when form is valid returns empty', async(() => {
    component.formSearchSubmittedCWI.patchValue({
      facilityId: 1,
      intFacilityId: 15,
      patientMrn: 'mrn001',
      whoAdded: 1
    });
    component.showGrid = false;
    component.loading = true;
    component.datasource = [];
    component.totalRecords = 0;

    const spy =spyOn(customerWorkitemService, 'getSubmittedCustomerWorkItems').and.returnValue(of([]));
    component.onSearch();
    expect(spy).toHaveBeenCalled();
    expect(component.datasource.length).toEqual(0);
    expect(component.showGrid ).toBeFalse();
    expect(component.loading ).toBeTrue();
  }));

  it('[onSearch] should search workitem when form is valid throws error', async(() => {
    component.formSearchSubmittedCWI.patchValue({
      facilityId: 1,
      intFacilityId: 15,
      patientMrn: 'mrn001',
      whoAdded: 1
    });
    let err = "error";
    component.showGrid = false;
    component.showError = false;
    component.searched = false;
    component.showSCWI = true;
    component.loading = true;
    component.datasource = [];
    component.totalRecords = 0;

    const spy =spyOn(customerWorkitemService, 'getSubmittedCustomerWorkItems').and.returnValue(throwError(err));
    component.onSearch();
    expect(spy).toHaveBeenCalled();

    expect(component.datasource.length).toEqual(0);
    expect(component.showGrid ).toBeFalse();
    expect(component.showError ).toBeTrue();
    expect(component.searched ).toBeTrue();
    expect(component.loading ).toBeTrue();
    expect(component.showSCWI ).toBeFalse();
  }));


  it('should clear the form', async(() => {
    component.onReset();
    expect(component.showGrid).toBeFalse();
    expect(component.formSearchSubmittedCWI.pristine).toBeTrue();
  }));

  it('[deleteAdvocacy] should delete advocacy', fakeAsync(() => {
    const custWorkItemId = 13;
    const spy = spyOn(customerWorkitemService, 'requestToDeleteCustomerWorkItem').and.returnValue(of({}));
    spyOn(component, 'showSuccess').and.callFake(() => "deleted successfully");
    component.onDelete(custWorkItemId);
    flush();
    tick(500);
    expect(spy).toBeTruthy();
  }));

  it('[deleteAdvocacy] should delete advocacy', fakeAsync(() => {
    const custWorkItemId = 13;
    let err = "error";
    const spy = spyOn(customerWorkitemService, 'requestToDeleteCustomerWorkItem').and.returnValue(of({}));
    spyOn(component, 'showSuccess').and.callFake(() => "deleted successfully");
    component.deleteWI(custWorkItemId);
    flush();
    tick(500);
    expect(spy).toBeTruthy();
  }));

   it('should open attachment', async(() => {
    let id =1;
    let name = 'sp@1234.pdf';
      component.openFile(id, name);
    expect(component.openFile).toBeTruthy();
  }));

  it("should open File", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf"
    const mBlob = { size: 1024, type: "application/pdf" };
    const spy = spyOn(customerWorkitemService, 'getAttachmentById').and.returnValue(of({}));
    component.openFile(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });

  it("should open File throws error", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf";
    let err = "error";
    const mBlob = { size: 1024, type: "application/pdf" };
    const spy = spyOn(customerWorkitemService, 'getAttachmentById').and.returnValue(throwError(err));
    component.openFile(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });


  it('[ngAfterContentChecked] is called', async(() =>{
    component.ngAfterContentChecked();
    expect(component.ngAfterContentChecked).toBeTruthy();
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

});


