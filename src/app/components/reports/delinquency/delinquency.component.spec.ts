import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing'; 
import { DelinquencyComponent } from './delinquency.component';
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

describe('DelinquencyComponent', () => {
  let component: DelinquencyComponent;
  let fixture: ComponentFixture<DelinquencyComponent>;
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
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelinquencyComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule,
          FormsModule,NgbModule,TableModule,CalendarModule,MultiSelectModule,
          ToastrModule.forRoot(), BrowserAnimationsModule, NgSelectModule],
      providers:[ReportsService ]
    })
    .compileComponents();
  }));
  
  const delinquencyData=[{
    active: true,
    createdDate: "2021-02-07T19:18:17.640Z",
    createdBy: 0,
    modifiedDate: "2021-02-07T19:18:17.640Z",
    modifiedBy: 0,
    workItemId: 0,
    patientId: 0,
    providerId: 0,
    facilityBillingTypeId: 0,
    facilityBillingLevelId: 0,
    workItemStatusId: 0,
    orderTypeId: 0,
    orderDate: "2021-02-07T19:18:17.640Z",
    referralNumber: "test",
    notes: "test",
    generalNotes: "test",
    assignedToId: 0,
    dateIn: "2021-02-07T19:18:17.640Z",
    dateOut: "2021-02-07T19:18:17.640Z",
    buyBill: "test",
    externalWorkId: "test",
    wiInsurance: {
        active: true,
        createdDate: "2021-02-07T19:18:17.640Z",
        createdBy: 0,
        modifiedDate: "2021-02-07T19:18:17.640Z",
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
        primaryInsuranceName: "test",
        secondaryInsuranceName: "test"
    },
    icdCodes: [{
        active: true,
        createdDate: "2021-02-07T19:18:17.640Z",
        createdBy: 0,
        modifiedDate: "2021-02-07T19:18:17.640Z",
        modifiedBy: 0,
        workItemIcdCodeId: 0,
        workItemId: 0,
        icdId: 0,
        icdCode: "test",
        icdDescription: "test"
    }],
    drugCodes: [{
        active: true,
        createdDate: "2021-02-07T19:18:17.640Z",
        createdBy: 0,
        modifiedDate: "2021-02-07T19:18:17.640Z",
        modifiedBy: 0,
        workItemDrugCodeId: 0,
        workItemId: 0,
        drugId: 0,
        isCover: "test",
        priorAuth: "test",
        priorAuthNo: "test",
        priorAuthFromDate: "2021-02-07T19:18:17.641Z",
        priorAuthToDate: "2021-02-07T19:18:17.641Z",
        priorAuthNotes: "test",
        priorAuthApprovalReason: 0,
        visitsApproved: "test",
        unitsApproved: "test",
        advocacyNeeded: "test",
        advocacyNotes: "test",
        drugProcCode: "test",
        drugLongDesc: "test",
        drugShortDesc: "test"
    }],
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
    providerName: "test",
    patientMrn: "test",
    facilityName: "test",
    orderTypeName: "test",
    facilityNPI: "test",
    workItemStatusName: "test",
    facilityEin: "test",
    providerNPi: "test",
    facilityBillingLevelName: "test",
    facilityBillingTypeName: "test"
}];

  beforeEach(() => {
    fixture = TestBed.createComponent(DelinquencyComponent);
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

  it('Should check Reports form is valid when values are entered', () => {
    component.reportsForm.controls['dateIn'].setValue({year:2021,month:2,day:2});
    component.getDelinquencyReport();
    expect(component.showGrid).toBeFalse();
    expect(component.getDelinquencyReport).toBeTruthy();
    expect(component.sf).toBeTruthy();
  });

  it('[getFacilityList] should get facility list', async(() => {
    spyOn(reportsService, 'getAllFacilities').and.returnValue(of(allFacilityData)); 
    component.getFacilityList();
    expect(component.delinquencyFacilities).toEqual(allFacilityData);
    expect(reportsService.getAllFacilities).toHaveBeenCalled(); 
  })); 

  it('[getFacilityList] should throw error', async(() => {
    let err="error"
    spyOn(reportsService, 'getAllFacilities').and.returnValue(throwError(err)); 
    component.getFacilityList(); 
    expect(reportsService.getAllFacilities).toHaveBeenCalled(); 
  }));

  it('[getDelinquencyReport] should fail when form is invalid', async(() => { 
    spyOn(component, 'showFailure').and.callFake(()=>"Failed");
    component.getDelinquencyReport();  
    expect(component.errorMessage).not.toBeNull();   
  }));

  it('[onFormReset] should reset form', async(() => { 
    component.onFormReset();  
    expect(component.delinquencySelectedFacilitiesIds.length).toEqual(0);
    expect(component.delinquencySelectedFacilitiesIds.length).toEqual(0);
    expect(component.reportsForm.invalid).toBeTrue();
  }));

  it('[loadReport] should get advocacyAnalysisList data', fakeAsync(() => { 
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.datasource=delinquencyData;
    component.loadReport(event);  
    tick(500); 
    expect(component.loading).toBeFalse();
    expect(component.delinquencyList).not.toBeNull(); 
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

  it('[onSelectAll] triggers when type is different', () => {
    let type = 'advocacies';
    component.onSelectAll(type);
    expect(component.delinquencyFacilities).toBeTruthy;   
  });
  
  it('[onSelectAll] triggers when type is delinquencyFacilities', () => {
    let type = 'delinquencyFacilities';
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
    component.delinquencyFacilities = [facilityData];
    component.onSelectAll(type);
    expect(component.delinquencyFacilities).toBeTruthy;   
  });

  it('[exportDelinquencyExcel] should export data to excel file', () => {
     component.datasource=delinquencyData;     
    component.exportDelinquencyExcel();    
    expect(component).toBeTruthy;
  }); 
  

  it('[onClearAll] triggers when type is delinquencyFacilities', fakeAsync((type:string) => {
    type = 'delinquencyFacilities';
    component.onClearAll(type);
    expect(component.reportsForm.get('delinquencySelectedFacilitiesIds').value).toEqual([]);   
  }));

  it('[onClearAll] not triggers when type is not delinquencyFacilities', fakeAsync((type:string) => {
    type = 'test';
    component.onClearAll(type);
    expect(component.reportsForm.get('delinquencySelectedFacilitiesIds').value).not.toEqual([]);   
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
    component.reportsForm.controls['dateIn'].setValue({year:2021,month:2,day:2});
    component.getDelinquencyReport();
    expect(component.showGrid).toBeFalse();
    expect(component.getDelinquencyReport).toBeTruthy();
    expect(component.sf).toBeTruthy();
  });

it('[getDelinquencyReport] should get details when form is valid', async(() => { 
    component.reportsForm.controls['dateIn'].setValue({year:2021,month:2,day:2});
    component.userId=1;
    component.getDelinquencyReport(); 
    expect(component.showGrid).toBeFalse();

  }));

  it('[getDelinquencyReport] should get details when form is valid and service return data', async(() => { 
    component.reportsForm = new FormGroup({
      dateIn:new FormControl(''),
      delinquencySelectedFacilitiesIds: new FormControl('') 
    });
    component.userId=1;
    spyOn(reportsService, 'getDelinquencyDetails').and.returnValue(of(delinquencyData)) ;
    component.getDelinquencyReport(); 
    expect(component.datasource ).not.toBeNull();

  }));

  it('[getDelinquencyReport] should get details when form is valid and service return  empty data', async(() => { 
    component.reportsForm = new FormGroup({
      dateIn:new FormControl(''),
      delinquencySelectedFacilitiesIds: new FormControl('') 
    });
    component.userId=1;
    spyOn(reportsService, 'getDelinquencyDetails').and.returnValue(of([])) ;
    component.getDelinquencyReport(); 
    expect(component.showGrid).toBeFalse;
    expect(component.showError ).toBeFalse;
  }));

});
