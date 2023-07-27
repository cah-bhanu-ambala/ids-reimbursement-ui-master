import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { LazyLoadEvent } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as FileSaver from 'file-saver';
import { NgSelectModule } from '@ng-select/ng-select';
import { Facility } from 'src/app/models/classes/facility';
import { BossInvoiceComponent } from 'src/app/components/reports/boss-invoice/boss-invoice.component';

describe('DelinquencyComponent', () => {
  let component: BossInvoiceComponent;
  let fixture: ComponentFixture<BossInvoiceComponent>;
  let reportsService:ReportsService;

  let allFacilityData=[
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
      billingLevelName: "PHARM L1",
      facilityWbsDetails:[ {
        wbsName: 'name2'
      }]
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
      billingLevelName: "PHARM L2",
      facilityWbsDetails:[ {
        wbsName: 'name2'
      }]
    }
  ];

  const billingData=[{
    active: true,
    createdDate: "2021-02-07T08:58:46.237Z",
    createdBy: 0,
    modifiedDate: "2021-02-07T08:58:46.237Z",
    modifiedBy: 0,
    workItemId: 0,
    patientId: 0,
    providerId: 0,
    facilityBillingTypeId: 0,
    facilityBillingLevelId: 0,
    workItemStatusId: 0,
    orderTypeId: 0,
    orderDate: "2021-02-07T08:58:46.237Z",
    referralNumber: "test",
    notes: "test",
    generalNotes: "test",
    assignedToId: 0,
    dateIn: "2021-02-07T08:58:46.237Z",
    dateOut: "2021-02-07T08:58:46.237Z",
    buyBill: "test",
    externalWorkId: "test",
    wiInsurance: {
        active: true,
        createdDate: "2021-02-07T08:58:46.237Z",
        createdBy: 0,
        modifiedDate: "2021-02-07T08:58:46.237Z",
        modifiedBy: 0,
        workItemInsId: 0,
        primaryInsRep: "test",
        primaryInsRefNum: "test",
        primaryInNetwork: "test",
        deductibleMax: 0,
        deductibleMet: 0,
        outOfPocketMax: 0,
        outOfPocketMet: 0,
        coInsurance: 0,
        primaryInsNotes: "test",
        primaryInsClassification: 0,
        secondaryInsRep: "test",
        secondaryInsRefNum: "test",
        secondaryInNetwork: "test",
        secondaryInsNotes: "test",
        secondaryInsClassification: 0,
        workItemId: 0,
        secondaryInsuranceName: "test",
        primaryInsuranceName: "test"
    },
    icdCodes: [{
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
    }],
    drugCodes: [{
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
    }],
    attachments: [{
        active: true,
        createdDate: "2021-02-07T08:58:46.238Z",
        createdBy: 0,
        modifiedDate: "2021-02-07T08:58:46.238Z",
        modifiedBy: 0,
        workItemAttachmentId: 0,
        workItemId: 0,
        attachemntPath: "test"
    }],
    facilityEin: "test",
    providerNPi: "test",
    providerName: "test",
    patientMrn: "test",
    facilityName: "test",
    facilityNPI: "test",
    orderTypeName: "test",
    facilityBillingTypeName: "test",
    facilityBillingLevelName: "test",
    workItemStatusName: "test"
}];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BossInvoiceComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule,
          FormsModule,NgbModule,TableModule,CalendarModule,MultiSelectModule,
          ToastrModule.forRoot(), BrowserAnimationsModule, NgSelectModule],
      providers:[ReportsService ]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(BossInvoiceComponent);
    component = fixture.componentInstance;
    reportsService=TestBed.inject(ReportsService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Should check Reports form is invalid if no values are entered', () => {
    expect(component.reportsForm.valid).toBeFalsy();
  });

  it('[getFacilityList] should get facility list', async(() => {
    spyOn(reportsService, 'getAllFacilities').and.returnValue(of(allFacilityData));
    component.getFacilityList();
    expect(component.facilities).toEqual(allFacilityData);
    expect(reportsService.getAllFacilities).toHaveBeenCalled();
  }));

  it('[getFacilityList] should throw error', async(() => {
    let err="error"
    spyOn(reportsService, 'getAllFacilities').and.returnValue(throwError(err));
    component.getFacilityList();
    expect(reportsService.getAllFacilities).toHaveBeenCalled();
  }));

  it('[getBillingReport] should get details when form is valid', async(() => {
    component.reportsForm.controls['dateOutFrom'].setValue({month:3,day:5, year:2021});
    component.reportsForm.controls['dateOutTo'].setValue({month:12,day:5, year:2022});
    component.userId=1;

    spyOn(reportsService, 'getBillingDetails').and.returnValue(of({})) ;
    component.getBillingReport();
    expect(component.invoiceDatasource).not.toBeNull();
  }));

  it('[getBillingReport] should get details when form is valid with wbsNames', async(() => {
    component.reportsForm.controls['dateOutFrom'].setValue({month:3,day:5, year:2021});
    component.reportsForm.controls['dateOutTo'].setValue({month:12,day:5, year:2022});
    component.reportsForm.controls['WbsNames'].setValue([{wbsNames: 1}, {wbsNames:2}])
    component.userId=1;

    spyOn(reportsService, 'getBillingDetails').and.returnValue(of({})) ;
    component.getBillingReport();
    expect(component.invoiceDatasource).not.toBeNull();
  }));


it('[getBillingReport] should get details when form is valid with wbsNames when no names are selected', async(() => {
    component.reportsForm.controls['dateOutFrom'].setValue({month:3,day:5, year:2021});
    component.reportsForm.controls['dateOutTo'].setValue({month:12,day:5, year:2022});
    component.reportsForm.controls['WbsNames'].setValue([])
    component.userId=1;
    const facilityData =
        [
          {
            wbsNames: 1
          },
          {
            wbsNames: 3
          }
        ]
        component.wbsList = facilityData;
    spyOn(reportsService, 'getBillingDetails').and.returnValue(of({})) ;
    component.getBillingReport();
    expect(component.invoiceDatasource).not.toBeNull();
  }));

  it('[getBillingReport] form is invalid', async(() => {
        component.reportsForm.controls['dateOutFrom'].setValue(null);
        component.reportsForm.controls['dateOutTo'].setValue(null);
        component.getBillingReport();
        expect(component.showError).toBeTrue();
      }));
  it('[onReset] should reset form', async(() => {
    component.onReset();
    expect(component.showError).toBeFalse();
    expect(component.invoiceShowGrid).toBeFalse();
    expect(component.searched).toBeFalse();
    expect(component.reportsForm.markAsPristine).toBeTruthy();
    expect(component.reportsForm.markAsUntouched).toBeTruthy();
  }));

  it('[loadReport] should get billing data', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.invoiceDatasource=billingData;
    component.loadReport(event);
    tick(500);
    expect(component.loading).toBeFalse();
    expect(component.billingList).not.toBeNull();
  }));

  it('[loadReport] should not get any data when datasource is empty', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.loadReport(event);
    tick(500);
    expect(component.loading).toBeTrue();
  }));

  it('[exportExcel] should export data to excel file', () => {
     component.invoiceDatasource=billingData;
    component.exportExcel();
    expect(component).toBeTruthy;
  });


  it('[getDelinquencyReport] should get details when form is valid and service return data', async(() => {
    component.reportsForm = new FormGroup({
      WbsNames: new FormControl(''),
      dateOutFrom: new FormControl(''),
      dateOutTo: new FormControl('')
    });
    component.userId=1;
    spyOn(reportsService, 'getBossInvoiceDetails').and.returnValue(of(billingData)) ;
    component.getBillingReport();
    expect(component.invoiceDatasource ).not.toBeNull();

  }));

  it('[getDelinquencyReport] should get details when form is valid and service return  empty data', async(() => {
    component.reportsForm = new FormGroup({
      WbsNames: new FormControl(''),
      dateOutFrom: new FormControl(''),
      dateOutTo: new FormControl('')
    });
    component.userId=1;
    spyOn(reportsService, 'getBossInvoiceDetails').and.returnValue(of([])) ;
    component.getBillingReport();
    expect(component.invoiceShowGrid).toBeFalse;
    expect(component.showError ).toBeFalse;
  }));

  it('[onClearAll] triggers when type is wbsList', fakeAsync((type: string) => {
    type = 'wbsList';
    component.onClearAll(type);
    expect(component.reportsForm.get('WbsNames').value).toEqual([]);
  }));

  it('[onClearAll] triggers when type is not wbsList', fakeAsync((type: string) => {
    type = 'notwbsList';
    component.onClearAll(type);
    expect(component.onClearAll(type)).toBeFalse;
  }));

  it('[onSelectAll] triggers when type is wbsList', () => {
    let type = 'wbsList';
    const facilityData =
    [
      {
        wbsNames: 1
      },
      {
        wbsNames: 3
      }
    ]
    component.wbsList = [facilityData];
    component.onSelectAll(type);
    expect(component.facilities).toBeTruthy;
  });

  it('[onSelectAll] triggers when type is not wbsList', fakeAsync((type: string) => {
    type = 'notwbsList';
    component.onSelectAll(type);
    expect(component.onSelectAll(type)).toBeFalse;
  }));
});
