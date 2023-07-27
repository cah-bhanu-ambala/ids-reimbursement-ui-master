import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { BillingComponent } from './billing.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SaveEditableRow, TableModule } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { of, throwError } from 'rxjs';
import 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';
import * as moment from 'moment';
import jsPDF from 'jspdf';

describe('BillingComponent', () => {
  let component: BillingComponent;
  let fixture: ComponentFixture<BillingComponent>;
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
        workItemDrugCodeId: 1,
        workItemId: 1,
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
        drugProcCode: "test",
        denial: "no",
        dosage: 2,
        denialType: 1
    },
    {
            active: true,
            createdDate: "2021-02-07T08:58:46.238Z",
            createdBy: 0,
            modifiedDate: "2021-02-07T08:58:46.238Z",
            modifiedBy: 0,
            workItemDrugCodeId: 2,
            workItemId: 1,
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
            drugProcCode: "test",
            denial: "no",
            dosage: 2,
            denialType: 1
        },
        {
                    active: true,
                    createdDate: "2021-02-07T08:58:46.238Z",
                    createdBy: 0,
                    modifiedDate: "2021-02-07T08:58:46.238Z",
                    modifiedBy: 0,
                    workItemDrugCodeId: 3,
                    workItemId: 1,
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
                    drugProcCode: "test",
                    denial: "no",
                    dosage: 3,
                    denialType: 2
                },
                 {
                             active: true,
                             createdDate: "2021-02-07T08:58:46.238Z",
                             createdBy: 0,
                             modifiedDate: "2021-02-07T08:58:46.238Z",
                             modifiedBy: 0,
                             workItemDrugCodeId: 4,
                             workItemId: 1,
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
                             drugProcCode: "test",
                             denial: "no",
                             dosage: 3,
                             denialType: 2
                         },
                                         {
                                                     active: true,
                                                     createdDate: "2021-02-07T08:58:46.238Z",
                                                     createdBy: 0,
                                                     modifiedDate: "2021-02-07T08:58:46.238Z",
                                                     modifiedBy: 0,
                                                     workItemDrugCodeId: 5,
                                                     workItemId: 1,
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
                                                     drugProcCode: "test",
                                                     denial: "no",
                                                     dosage: 3,
                                                     denialType: 2
                                                 },
                                           {
                                                       active: true,
                                                       createdDate: "2021-02-07T08:58:46.238Z",
                                                       createdBy: 0,
                                                       modifiedDate: "2021-02-07T08:58:46.238Z",
                                                       modifiedBy: 0,
                                                       workItemDrugCodeId: 6,
                                                       workItemId: 1,
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
                                                       drugProcCode: "test",
                                                       denial: "no",
                                                       dosage: 3,
                                                       denialType: 2
                                                   },
                                                   {
                                                               active: true,
                                                               createdDate: "2021-02-07T08:58:46.238Z",
                                                               createdBy: 0,
                                                               modifiedDate: "2021-02-07T08:58:46.238Z",
                                                               modifiedBy: 0,
                                                               workItemDrugCodeId: 7,
                                                               workItemId: 1,
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
                                                               drugProcCode: "test",
                                                               denial: "no",
                                                               dosage: 3,
                                                               denialType: 2
                                                           },
                                                           ,
                                                  {
                                                              active: true,
                                                              createdDate: "2021-02-07T08:58:46.238Z",
                                                              createdBy: 0,
                                                              modifiedDate: "2021-02-07T08:58:46.238Z",
                                                              modifiedBy: 0,
                                                              workItemDrugCodeId: 8,
                                                              workItemId: 1,
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
                                                              drugProcCode: "test",
                                                              denial: "no",
                                                              dosage: 3,
                                                              denialType: 2
                                                          },
                                                      {
                                                                  active: true,
                                                                  createdDate: "2021-02-07T08:58:46.238Z",
                                                                  createdBy: 0,
                                                                  modifiedDate: "2021-02-07T08:58:46.238Z",
                                                                  modifiedBy: 0,
                                                                  workItemDrugCodeId: 9,
                                                                  workItemId: 1,
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
                                                                  drugProcCode: "test",
                                                                  denial: "no",
                                                                  dosage: 3,
                                                                  denialType: 2
                                                              },
                                                  {
                                                              active: true,
                                                              createdDate: "2021-02-07T08:58:46.238Z",
                                                              createdBy: 0,
                                                              modifiedDate: "2021-02-07T08:58:46.238Z",
                                                              modifiedBy: 0,
                                                              workItemDrugCodeId: 10,
                                                              workItemId: 1,
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
                                                              drugProcCode: "test",
                                                              denial: "no",
                                                              dosage: 3,
                                                              denialType: 2
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
const emptyDenialDetails=[{
       active: true,
      createdDate: "",
      createdBy: "",
      modifiedDate: "",
      modifiedBy: "",
      workItemId: "",
      patientId: "",
      providerId: "",
      facilityBillingTypeId: "",
      facilityBillingLevelId: "",
      workItemStatusId: "",
      orderTypeId: "",
      orderDate: "",
      referralNumber: "",
      notes: "",
      generalNotes: "",
      assignedToId: "",
      dateIn: "",
      dateOut: "",
      buyBill: "",
      externalWorkId: "",
      drugCodes: [{workItemDrugCodeId: 1, workItemId: 1},
      {workItemDrugCodeId: 2, workItemId: 1},
      {workItemDrugCodeId: 3, workItemId: 1},
      {workItemDrugCodeId: 4, workItemId: 1},
      {workItemDrugCodeId: 5, workItemId: 1},
      {workItemDrugCodeId: 6, workItemId: 1},
      {workItemDrugCodeId: 7, workItemId: 1},
      {workItemDrugCodeId: 8, workItemId: 1},
      {workItemDrugCodeId: 9, workItemId: 1},
      {workItemDrugCodeId: 10, workItemId: 1}]

}];
  const billingEmptyData=[{
    active: true,
    createdDate: "",
    createdBy: "",
    modifiedDate: "",
    modifiedBy: "",
    workItemId: "",
    patientId: "",
    providerId: "",
    facilityBillingTypeId: "",
    facilityBillingLevelId: "",
    workItemStatusId: "",
    orderTypeId: "",
    orderDate: "",
    referralNumber: "",
    notes: "",
    generalNotes: "",
    assignedToId: "",
    dateIn: "",
    dateOut: "",
    buyBill: "",
    externalWorkId: "",
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
drugCodes: [],
    attachments: [{
        active: true,
        createdDate: "",
        createdBy: 0,
        modifiedDate: "",
        modifiedBy: 0,
        workItemAttachmentId: 0,
        workItemId: 0,
        attachemntPath: ""
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
      declarations: [ BillingComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule,
          FormsModule,NgbModule,TableModule,CalendarModule,MultiSelectModule,NgSelectModule,
          ToastrModule.forRoot(), BrowserAnimationsModule],
      providers:[ReportsService, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillingComponent);
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

  it('[getBillingReport] should fail when form is invalid', async(() => {
    spyOn(component, 'showFailure').and.callFake(()=>"Failed");
    component.getBillingReport();
    expect(component.errorMessage).not.toBeNull();
  }));

  it('[getBillingReport] should get details when form is valid', async(() => {
    component.reportsForm.controls['dateOutFrom'].setValue({year:2021,month:2,day:2});
    component.reportsForm.controls['dateOutTo'].setValue({year:2020,month:12,day:2});
    component.userId=1;

    spyOn(reportsService, 'getBillingDetails').and.returnValue(of({})) ;
    component.getBillingReport();
    expect(component.datasource).not.toBeNull();
  }));

  it('[onReset] should reset form', async(() => {
    component.onReset();
    expect(component.selectedFacilitiesIds.length).toEqual(0);
    expect(component.selectedFacilitiesIds.length).toEqual(0);
    expect(component.reportsForm.invalid).toBeTrue();
  }));

  it('[loadReport] should get billing data', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.datasource=billingData;
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

 /* it('[exportPDF] should export data to pdf file', fakeAsync(() => {
    component.datasource=billingData;
    component.exportPDF();
    flush();
    expect(component.exportPDF).toBeTruthy();
  }));*/

  it('[exportExcel] should export data to excel file', fakeAsync(() => {
    component.datasource=billingData;
    component.exportExcel();
    flush();
    expect(component.exportExcel).toBeTruthy();
    component.datasource=emptyDenialDetails;
    component.exportExcel();
    flush();
    expect(component.exportExcel).toBeTruthy();

  }));

it('[exportExcel] should export data to excel file empty drugcodes', fakeAsync(() => {
    component.datasource=billingEmptyData;
    component.exportExcel();
    flush();
    expect(component.exportExcel).toBeTruthy();
  }));


  it('[onClearAll] triggers when type is facilities', fakeAsync((type:string) => {
    type = 'facilities';
    component.onClearAll(type);
    expect(component.reportsForm.get('selectedFacilitiesIds').value).toEqual([]);
  }));

  it('[onClearAll] triggers when type is facilities', fakeAsync((type:string) => {
    type = 'test';
    component.onClearAll(type);
    expect(component.reportsForm.get('selectedFacilitiesIds').value).not.toEqual([]);
  }));

  it('[getFormattedDate] works', fakeAsync((selectedDate) =>{
    selectedDate = {month:'01',day:'31', year:'2022'};
    component.getFormattedDate(selectedDate);
    expect(component).toBeTruthy();
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

  it('Should check Reports form is valid when values are entered', () => {
      component.reportsForm.controls['dateOutFrom'].setValue({year:2021,month:2,day:2});
      component.reportsForm.controls['dateOutTo'].setValue({year:2020,month:12,day:2});
      component.getBillingReport();
      expect(component.showGrid).toBeFalse();
      expect(component.getBillingReport).toBeTruthy();
      expect(component.reportsForm.valid).toBeFalsy();
      expect(component.sf).toBeTruthy();
    });


  it('[getBillingReport] should get details when form is valid and service return data', async(() => {
    component.reportsForm = new FormGroup({
      selectedFacilitiesIds:new FormControl(''),
      dateOutFrom:new FormControl(''),
      dateOutTo: new FormControl('')
    });
    component.userId=1;
    spyOn(reportsService, 'getBillingDetails').and.returnValue(of(billingData)) ;
    component.getBillingReport();
    expect(component.datasource ).not.toBeNull();

  }));

  it('[getBillingReport] should get details when form is valid and service return  empty data', async(() => {
    component.reportsForm = new FormGroup({
      selectedFacilitiesIds:new FormControl(''),
      dateOutFrom:new FormControl(''),
      dateOutTo: new FormControl('')
    });
    component.userId=1;
    spyOn(reportsService, 'getBillingDetails').and.returnValue(of([])) ;
    component.getBillingReport();
    expect(component.showGrid).toBeFalse;
    expect(component.showError ).toBeFalse;
  }));

  it('[onSelectAll] triggers when type is facilities', () => {
    let type = 'advocacies';
    component.onSelectAll(type);
    expect(component.facilities).toBeTruthy;
  });

  it('[onSelectAll] triggers when type is facilities', () => {
    let type = 'facilities';
    const facilityData =
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
    }
    component.facilities = [facilityData];
    component.onSelectAll(type);
    expect(component.facilities).toBeTruthy;
  });
});
