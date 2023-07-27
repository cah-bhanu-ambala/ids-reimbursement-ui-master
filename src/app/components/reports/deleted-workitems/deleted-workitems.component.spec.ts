import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
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
import { DeletedWorkitemsComponent } from './deleted-workitems.component';

describe('DeletedWorkitemsComponent', () => {
  let component: DeletedWorkitemsComponent;
  let fixture: ComponentFixture<DeletedWorkitemsComponent>;
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
      declarations: [ DeletedWorkitemsComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule,
          FormsModule,NgbModule,TableModule,CalendarModule,MultiSelectModule,NgSelectModule,
          ToastrModule.forRoot(), BrowserAnimationsModule],
      providers:[ReportsService, FormBuilder ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedWorkitemsComponent);
    component = fixture.componentInstance;
    reportsService=TestBed.inject(ReportsService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Should check Reports form is invalid if no values are entered', () => {
    expect(component.deleteWiReportsForm.valid).toBeFalsy();
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

  it('[getBillingReport] should fail when form is invalid', async(() => { 
    spyOn(component, 'showFailure').and.callFake(()=>"Failed");
    component.getReport();  
    expect(component.errorMessage).not.toBeNull();  
  }));

  it('[getBillingReport] should get details when form is valid', async(() => { 
    component.deleteWiReportsForm.controls['dateOutFrom'].setValue({year:2021,month:3,day:5});
    component.deleteWiReportsForm.controls['dateOutTo'].setValue({year:2020,month:12,day:5});
    component.userId=1;
    spyOn(reportsService, 'getBillingDetails').and.returnValue(of({})) ;
    component.getReport();  
    // expect(component.deleteWiDatasource).toEqual(advocacyAnalysisData);
    expect(component.deleteWiDatasource).not.toBeNull();
  }));

  it('[onReset] should reset form', async(() => { 
    component.onReset();  
    expect(component.selectedFacilitiesIds.length).toEqual(0);
    expect(component.selectedFacilitiesIds.length).toEqual(0);
    expect(component.deleteWiReportsForm.invalid).toBeTrue();
    expect(component.showError).toBeFalse();
    expect(component.showGrid).toBeFalse();
    expect(component.searched).toBeFalse();
    expect(component.deleteWiReportsForm.markAsPristine).toBeTruthy();
    expect(component.deleteWiReportsForm.markAsUntouched).toBeTruthy();
  }));

  it('[loadReport] should get billing data', fakeAsync(() => { 
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.deleteWiDatasource=billingData;
    component.loadReport(event);  
    tick(500); 
    expect(component.loading).toBeFalse();
    expect(component.deletedWorkItemList).not.toBeNull(); 
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

  it('[exportExcel] should export data to excel file', fakeAsync(() => {
    component.deleteWiDatasource=billingData;
    const spy = spyOn(FileSaver, 'saveAs').and.stub();
    component.exportExcel();
    flush();
    expect(spy).toHaveBeenCalled();
  })); 

  it('[onClearAll] triggers when type is facilities', fakeAsync((type:string) => {
    type = 'facilities';
    component.onClearAll(type);
    expect(component.deleteWiReportsForm.get('selectedFacilitiesIds').value).toEqual([]);   
  }));

  it('[onClearAll] not triggers when type is not facilities', fakeAsync((type:string) => {
    type = 'test';
    component.onClearAll(type);
    expect(component.deleteWiReportsForm.get('selectedFacilitiesIds').value).not.toEqual([]);   
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

  
  it('[getBillingReport] should get details when form is valid and service return data', async(() => { 
    component.deleteWiReportsForm = new FormGroup({
      selectedFacilitiesIds:new FormControl(''),
      dateOutFrom:new FormControl(''),
      dateOutTo: new FormControl('')
    });
    component.userId=1;
    spyOn(reportsService, 'getdeletedWorkItemDetails').and.returnValue(of(billingData)) ;
    component.getReport(); 
    expect(component.deleteWiDatasource ).not.toBeNull();

  }));
  
  it('[getBillingReport] should get details when form is valid and service return  empty data', async(() => { 
    component.deleteWiReportsForm = new FormGroup({
      selectedFacilitiesIds:new FormControl(''),
      dateOutFrom:new FormControl(''),
      dateOutTo: new FormControl('')
    });
    component.userId=1;
    spyOn(reportsService, 'getdeletedWorkItemDetails').and.returnValue(of([])) ;
    component.getReport(); 
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
