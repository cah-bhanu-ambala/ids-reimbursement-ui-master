import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule,FormBuilder, FormsModule, FormGroup, FormControl} from '@angular/forms';
import { ReportsService } from 'src/app/common/services/http/reports.service';

import { AdvocacyAnalysisComponent } from './advocacy-analysis.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import 'xlsx';
import * as FileSaver from 'file-saver';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgSelectModule } from '@ng-select/ng-select';

describe('AdvocacyAnalysisComponent', () => {
  let component: AdvocacyAnalysisComponent;
  let fixture: ComponentFixture<AdvocacyAnalysisComponent>;
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

  const advocacyAnalysisData=[{
    grandCount: 0,
    grandAmount: 0,
    details: [{
        advocacyAnalysisReportDetail: 1,
        name: "Application to Clinic",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 2,
        name: "Clinic Declined",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 3,
        name: "Clinic Obtained",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 4,
        name: "Inactive",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 5,
        name: "No Longer Available",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 6,
        name: "No Response",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 7,
        name: "Patient Declined",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 8,
        name: "Patient Not Eligible",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 9,
        name: "Pending",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 10,
        name: "RS Obtained",
        count: 0
    }, {
        advocacyAnalysisReportDetail: 11,
        name: "Approved",
        count: 0
    }]
}];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvocacyAnalysisComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule,
        FormsModule,NgbModule,TableModule,CalendarModule,MultiSelectModule,NgSelectModule,
        ToastrModule.forRoot(), BrowserAnimationsModule],
      providers:[ReportsService ]
      
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvocacyAnalysisComponent);
    component = fixture.componentInstance;
    reportsService=TestBed.inject(ReportsService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    const userId =1;
    expect(component).toBeTruthy();
  });

  it('Should check Reports form is invalid if no values are entered', () => {
    expect(component.reportsForm.valid).toBeFalsy();
  });

  it('[getFacilityList] should get facility list', async(() => {
    spyOn(reportsService, 'getAllFacilities').and.returnValue(of(allFacilityData)); 
    component.getFacilityList();
    expect(component.facilitiesList).toEqual(allFacilityData);
    expect(reportsService.getAllFacilities).toHaveBeenCalled(); 
  })); 

  it('[getFacilityList] should throw error', async(() => {
    let err="error"
    spyOn(reportsService, 'getAllFacilities').and.returnValue(throwError(err)); 
    component.getFacilityList(); 
    expect(reportsService.getAllFacilities).toHaveBeenCalled(); 
  }));
  
  it('[getAdvocacyTypeList] should get advocacy list', async(() => {
    spyOn(reportsService, 'getAllAdvocacyTypes').and.returnValue(of(allFacilityData)); 
    component.getAdvocacyTypeList();
    expect(component.advocacyTypes).toEqual(allFacilityData);
    expect(reportsService.getAllAdvocacyTypes).toHaveBeenCalled(); 
  })); 

  it('[getAdvocacyTypeList] should throw error', async(() => {
    let err="error"
    spyOn(reportsService, 'getAllAdvocacyTypes').and.returnValue(throwError(err)); 
    component.getAdvocacyTypeList(); 
    expect(
      reportsService.getAllAdvocacyTypes).toHaveBeenCalled(); 
  }));

  it('[getAdvocacyAnalysisReport] should fail when form is invalid', async(() => { 
    spyOn(component, 'showFailure').and.callFake(()=>"Failed");
    component.getAdvocacyAnalysisReport(); 
    expect(component.errorMessage).not.toBeNull();   
  }));

  it('[getAdvocacyAnalysisReport] should get details when form is valid', async(() => {     
    component.reportsForm = new FormGroup({
      selectedAdvocacyTypesIds: new FormControl(''),
      selectedFacilitiesIds: new FormControl(''),
      dateCreatedFrom: new FormControl(''),
      dateCreatedTo: new FormControl(''),
    });
    spyOn(reportsService, 'getAdvocacyAlalysisDetails').and.returnValue(of([]));
    component.getAdvocacyAnalysisReport();  
    expect(component.reportsForm.invalid).toBeFalsy();
    expect(component).toBeTruthy;   
  }));

  it('[getAdvocacyAnalysisReport] should get details when form is valid and data is null', async(() => {     
    component.reportsForm = new FormGroup({
      selectedAdvocacyTypesIds: new FormControl(''),
      selectedFacilitiesIds: new FormControl(''),
      dateCreatedFrom: new FormControl(''),
      dateCreatedTo: new FormControl(''),
    });
    spyOn(reportsService, 'getAdvocacyAlalysisDetails').and.returnValue(of(null));
    component.getAdvocacyAnalysisReport();  
    expect(component.reportsForm.invalid).toBeFalsy();
    expect(component).toBeTruthy;   
  }));

  it('[onReset] should reset form', async(() => { 
    component.onReset();  
    expect(component.selectedAdvocacyTypesIds.length).toEqual(0);  
    expect(component.showError).toBeFalse();
    expect(component.showGrid).toBeFalse();
    expect(component.searched).toBeFalse();
    expect(component.reportsForm.markAsPristine).toBeTruthy();
    expect(component.reportsForm.markAsUntouched).toBeTruthy();
  }));

  it('[loadReport] should get advocacyAnalysisList data', fakeAsync(() => { 
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.datasource=advocacyAnalysisData;
    component.loadReport(event);  
    tick(500); 
    expect(component.loading).toBeFalse();
    expect(component.advocacyAnalysisList).not.toBeNull(); 
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
    component.advocacyAnalysisList=advocacyAnalysisData;
    const spy = spyOn(FileSaver, 'saveAs').and.stub();
    component.exportExcel();
    flush();
    expect(spy).toHaveBeenCalled();
  })); 

  it('[onClearAll] triggers when type is facilities', fakeAsync((type:string) => {
    type = 'facilities';
    component.onClearAll(type);
    expect(component.reportsForm.get('selectedFacilitiesIds').value).toEqual([]);   
  }));

  it('[onClearAll] triggers when type is facilities', fakeAsync((type:string) => {
    type = 'advocacyType';
    component.onClearAll(type);
    expect(component.reportsForm.get('selectedAdvocacyTypesIds').value).toEqual([]);   
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

  
  it('[onSelectAll] triggers when type is facilities', async(() => {
    component.reportsForm = new FormGroup({
      selectedAdvocacyTypesIds: new FormControl(''),
      selectedFacilitiesIds: new FormControl(''),
      dateCreatedFrom: new FormControl(''),
      dateCreatedTo: new FormControl(''),
    });
    let type = 'facilities';
    const facilityListdata=[
      {
        "active": true,
        "createdDate": "2021-02-02T08:45:12.587Z",
        "createdBy": 0,
        "modifiedDate": "2021-02-02T08:45:12.587Z",
        "modifiedBy": 0,
        "facilityId": 0,
        "facilityName": "string",
        "facilityNickName": "string",
        "ein": "string",
        "contacts": "string",
        "facilityNPI": "string",
        "address": "string",
        "phone": "string",
        "fax": "string",
        "status": "string",
        "facilityBillingDetails": [
          {
            "active": true,
            "createdDate": "2021-02-02T08:45:12.587Z",
            "createdBy": 0,
            "modifiedDate": "2021-02-02T08:45:12.587Z",
            "modifiedBy": 0,
            "facilityBillingDetailId": 0,
            "facilityId": 0,
            "billingLevelId": 0,
            "billingAmount": 0,
            "billingLevelName": "string"
          }
        ]
      }
    ];
    component.facilitiesList = facilityListdata;
    component.onSelectAll(type);
    expect(component ).toBeTruthy; 
  }));

  it('[onSelectAll] triggers when type is facilities', async(() => {
    component.reportsForm = new FormGroup({
      selectedAdvocacyTypesIds: new FormControl(''),
      selectedFacilitiesIds: new FormControl(''),
      dateCreatedFrom: new FormControl(''),
      dateCreatedTo: new FormControl(''),
    });
    const advocacies = [
      {
        "active": true, "createdDate": "2021-09-23T13:17:38.171+00:00", "createdBy": 17, "modifiedDate": "2021-09-23T13:20:37.613+00:00", "modifiedBy": 17, "advocacyId": 21, "patientId": 5, "workItemId": 37, "advocacyStatusId": 9, "advocacyTypeId": 3, "advocacySource": "", "icdId": 95803, "drugId": 42, "startDate": null, "endDate": null, "maxAmountAvail": 0.0, "lookBack": "", "lookBackStartDate": null, "notes": "", "attachments": [], "drugAdvocacyId": 5, "drugAdvocacy": {
          "active": true, "createdDate": "2021-09-10T14:25:01.374+00:00", "createdBy": 17, "modifiedDate": "2021-09-23T13:15:03.195+00:00", "modifiedBy": 17, "drugAdvocacyId": 5, "drugId": 42, "primaryInsuranceId": 8, "secondaryInsuranceId": "11, 13", "priorAuthStatusId": 2, "notes": "", "icds": "A02.1", "advocacyTypeId": 3, "copay": null, "premium": null, "drugAdvocacyWebsites": [{ "active": true, "createdDate": "2021-09-23T13:15:03.157+00:00", "createdBy": 17, "modifiedDate": "2021-09-23T13:15:03.157+00:00", "modifiedBy": 17, "drugAdvocacyWebsiteId": 1, "website": 'test', "drugAdvocacyId": 5, "createdByName": "admin", "modifiedByName": "admin" },
          {
            "active": true, "createdDate": "2021-09-23T13:15:03.188+00:00", "createdBy": 17, "modifiedDate": "2021-09-23T13:15:03.188+00:00", "modifiedBy": 17, "drugAdvocacyWebsiteId": 2, "website": "test2", "drugAdvocacyId": 5, "createdByName": "admin", "modifiedByName": "admin"
          }], "drugLongDesc": "Lumizyme Dshp 50MG 1 EA    ", "primaryInsName": "Medicare A & B", "drugShortDesc": "Lumizyme injection", "drugProcCode": "J0221", "priorAuthStatusName": "FDA", "createdByName": "admin", "modifiedByName": "admin"
        }, "facilityEin": "456987458", "icdDescription": "Salmonella sepsis", "drugLongDesc": "Lumizyme Dshp 50MG 1 EA    ", "drugShortDesc": "Lumizyme injection", "followUpDateToday": false, "facilityId": 13, "patientMrn": "000001", "drugProcCode": "J0221", "facilityName": "eRecovery Memorial Healthcare", "facilityNPI": "2589632589", "icdCode": "A02.1", "wbsId": 0, "advocacyStatusName": "Pending", "advocacyTypeName": "Commercial Copay - VOB", "createdByName": "admin", "modifiedByName": "admin"
      },
    ]
    let type = 'advocacies';
  
    component.advocacyTypes  = advocacies;
    component.onSelectAll(type);
    expect(component ).toBeTruthy; 
  }));
  
});
