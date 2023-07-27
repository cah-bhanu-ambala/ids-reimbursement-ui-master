import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from 'src/app/common/services/http/reports.service';
//import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDate, NgbModule } from '@ng-bootstrap/ng-bootstrap';
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
import { AdvocacyBillingComponent } from './advocacy-billing.component';

describe('AdvocacyBillingComponent', () => {
  let component: AdvocacyBillingComponent;
  let fixture: ComponentFixture<AdvocacyBillingComponent>;
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
      facilityWbsDetails: [{
        wbsName: 'name1'
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

const withNotNullAppointment=[{
    active: true,
    createdDate: "2021-02-07T08:58:46.237Z",
    createdBy: 0,
    modifiedDate: "2021-02-07T08:58:46.237Z",
    modifiedBy: 0,
    workItemId: 0,
    patientId: 0,
    providerId: 0,
    advocacyList:[{
      advocacyId: 1,
      appointments: [{
        appointmentId:1,
        dateAdvocacyReceived:"2021-02-07T08:58:46.238Z",
        replacementReceived :"2021-02-07T08:58:46.238Z"
      }]
    }],
    facilityEin: "test",
    providerNPi: "test"
}];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvocacyBillingComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule,
          FormsModule,NgbModule,TableModule,CalendarModule,MultiSelectModule,
          ToastrModule.forRoot(), BrowserAnimationsModule, NgSelectModule],
      providers:[ReportsService ]
    })
    .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(AdvocacyBillingComponent);
    component = fixture.componentInstance;
    reportsService=TestBed.inject(ReportsService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('Should check Reports form is invalid if no values are entered', () => {
    expect(component.advocacyBillingReportForm.valid).toBeFalsy();
  });

  it('[getFacilityListWithWbsNames-Advocacy Billing ] should get facility list', async(() => {
    spyOn(reportsService, 'getAllFacilities').and.returnValue(of(allFacilityData));
    component.getFacilityListWithWbsNames();
    expect(reportsService.getAllFacilities).toHaveBeenCalled();
  }));

  it('[getFacilityListWithWbsNames -Advocacy Billing ] should throw error', async(() => {
    let err="error";
    spyOn(reportsService, 'getAllFacilities').and.returnValue(throwError(err));
    component.getFacilityListWithWbsNames();
    expect(reportsService.getAllFacilities).toHaveBeenCalled();
  }));

  it('[getAdvocacyBillingReport] should get details when form is valid', async(() => {
    component.advocacyBillingReportForm.controls['dateOutFrom'].setValue({month:3,day:5, year:2021});
    component.advocacyBillingReportForm.controls['dateOutTo'].setValue({month:12,day:5, year:2022});
    component.userId=1;

    spyOn(reportsService, 'getAdvocacyBillingReport').and.returnValue(of({})) ;
    component.getAdvocacyBillingReport();
    expect(component.advocacyBillingDataSource).not.toBeNull();
  }));

  it('[getAdvocacyBillingReport] should get details when form is valid with wbsNames', async(() => {
    component.advocacyBillingReportForm.controls['dateOutFrom'].setValue({month:3,day:5, year:2021});
    component.advocacyBillingReportForm.controls['dateOutTo'].setValue({month:12,day:5, year:2022});
    component.advocacyBillingReportForm.controls['WbsNames'].setValue([{wbsNames: 1}, {wbsNames:2}])
    component.userId=1;

    spyOn(reportsService, 'getAdvocacyBillingReport').and.returnValue(of({})) ;
    component.getAdvocacyBillingReport();
    expect(component.advocacyBillingDataSource).not.toBeNull();
  }));
it('[getAdvocacyBillingReport] should get details when form is valid with wbsNames when no names are selected', async(() => {
    component.advocacyBillingReportForm.controls['dateOutFrom'].setValue({month:3,day:5, year:2021});
    component.advocacyBillingReportForm.controls['dateOutTo'].setValue({month:12,day:5, year:2022});
    component.advocacyBillingReportForm.controls['WbsNames'].setValue([])
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
    spyOn(reportsService, 'getAdvocacyBillingReport').and.returnValue(of(facilityData)) ;
    component.getAdvocacyBillingReport();
    expect(component.advocacyBillingDataSource).not.toBeNull();
  }));

  it('[getAdvocacyBillingReport] form is invalid', async(() => {
    component.advocacyBillingReportForm.controls['dateOutFrom'].setValue(null);
    component.advocacyBillingReportForm.controls['dateOutTo'].setValue(null);
    component.getAdvocacyBillingReport();
    expect(component.showError).toBeTrue();

  }));
  it('[onReset] should reset form', async(() => {
    component.onReset();
    expect(component.showError).toBeFalse();
    expect(component.showGrid).toBeFalse();
    expect(component.searched).toBeFalse();
    expect(component.advocacyBillingReportForm.markAsPristine).toBeTruthy();
    expect(component.advocacyBillingReportForm.markAsUntouched).toBeTruthy();
  }));

  it('[loadReport] should get billing data', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.advocacyBillingDataSource=billingData;
    component.loadReport(event);
    tick(500);
    expect(component.loading).toBeFalse();
  }));

  it('[loadReport] should not retrieve any data when datasource is empty', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.loadReport(event);
    tick(500);
    expect(component.loading).toBeTrue();
  }));

  it('[exportFacilityBillingDataToExcel] should export data to excel file', () => {
     component.advocacyBillingDataSource=withNotNullAppointment;
    component.exportAdvocacyBillingDataToExcel();
    expect(component).toBeTruthy;
  });


});
