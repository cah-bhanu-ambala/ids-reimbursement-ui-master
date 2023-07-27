import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { WorkstatusComponent } from './workstatus.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as FileSaver from 'file-saver';
import { NgSelectModule } from '@ng-select/ng-select';

describe('WorkstatusComponent', () => {
  let component: WorkstatusComponent;
  let fixture: ComponentFixture<WorkstatusComponent>;
  let reportsService: ReportsService;
  let allFacilityData = [
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

  const workStatusData = [{
    grandCount: 1,
    grandAmount: 0,
    facilities: [{
      facilityId: 1,
      facilityName: "Facility 1",
      totalCount: 1,
      totalAmount: 0,
      workItemStatuses: [{
        facilityWorkItemDetailId: 2,
        name: "Approved",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 4,
        name: "Denied",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 3,
        name: "In Process",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 1,
        name: "New",
        count: 1,
        amount: 0
      }, {
        facilityWorkItemDetailId: 5,
        name: "Pending",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 6,
        name: "Reviewed for Advocacy",
        count: 0,
        amount: 0
      }]
    }]
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorkstatusComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule,
        FormsModule, NgbModule, TableModule, CalendarModule, MultiSelectModule, NgSelectModule,
        ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [ReportsService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkstatusComponent);
    component = fixture.componentInstance;
    reportsService = TestBed.inject(ReportsService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[getFacilityList] should get facility list', async(() => {
    spyOn(reportsService, 'getAllFacilities').and.returnValue(of(allFacilityData));
    component.getFacilityList();
    expect(component.facilitiesList).toEqual(allFacilityData);
    expect(reportsService.getAllFacilities).toHaveBeenCalled();
  }));

  it('[getFacilityList] should throw error', async(() => {
    let err = "error"
    spyOn(reportsService, 'getAllFacilities').and.returnValue(throwError(err));
    component.getFacilityList();
    expect(reportsService.getAllFacilities).toHaveBeenCalled();
  }));

  it('[getWorkstatusReport] should fail when form is invalid', async(() => {
    component.getWorkstatusReport();
    expect(component.errorMessage).not.toBeNull();
  }));

  // it('[getWorkstatusReport] should get details when form is valid', async(() => {
  //   component.userId=1;
  //   component.selectedFacilitiesIds=[1,2];
  //   spyOn(reportsService, 'getWorkstatusDetails').and.returnValue(of(workStatusData)) ;
  //   component.getWorkstatusReport();
  //   expect(component.datasource).toEqual(workStatusData);
  //   expect(reportsService.getWorkstatusDetails).toHaveBeenCalled();
  // }));

  it('[onReset] should reset form', async(() => {
    component.onReset();
    expect(component.selectedFacilitiesIds.length).toEqual(0);
  }));

  it('[loadReport] should get workstatusList data', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    }
    component.datasource = workStatusData;
    component.loadReport(event);
    tick(500);
    expect(component.loading).toBeFalse();
    expect(component.workstatusList).not.toBeNull();
  }));

  it('[loadReport] should not get any data when datasource is empty', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    }
    component.loadReport(event);
    tick(500);
    expect(component.loading).toBeTrue();
  }));

  it('[exportExcel] should export data to excel file', () => {
    component.facilities = workStatusData[0].facilities;
    component.exportExcel();
    expect(component).toBeTruthy;
  });


  it('[showSuccess] works', fakeAsync((msg: any) => {
    msg = 'success';
    component.showSuccess(msg);
    flush();
    expect(component.showSuccess).toBeTruthy();
  }));

  it('[showFailure] works', fakeAsync((msg: any) => {
    msg = 'error';
    component.showFailure(msg);
    flush();
    expect(component.showFailure).toBeTruthy();
  }));

  it('Should check if Reports form is valid when all the values are entered', () => {
    component.buildSearchForm();
    component.getWorkstatusReport();
    expect(component.showGrid).toBeFalse();
    expect(component.buildSearchForm).toBeTruthy();
    expect(component.getWorkstatusReport).toBeTruthy();
    expect(component.sf).toBeTruthy();
  });

  it('[getWorkstatusReport] should get details when form is valid', async(() => {
    component.userId = 1;
    component.selectedFacilitiesIds = [1, 2];
    component.getWorkstatusReport();
    expect(component.showGrid).toBeFalse();
    expect(component.getWorkstatusReport).toBeTruthy();
  }));

  it('[onClearAll] triggers when type is facilities', fakeAsync((type: string) => {
    type = 'facilities';
    component.onClearAll(type);
    expect(component.reportsForm.get('selectedFacilitiesIds').value).toEqual([]);
  }));


  it('[onSelectAll] triggers when type is different', () => {
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
    component.facilitiesList = [facilityData];
    component.onSelectAll(type);
    expect(component.facilities).toBeTruthy;
  });

  it('[getWorkstatusReport] should get details when form is valid and service return data', async(() => {
    const data = {
      facilities : [{
        facilityId: 1,
        facilityName: "Facility 1",
        totalCount: 1,
        totalAmount: 0,
        workItemStatuses: [{
          facilityWorkItemDetailId: 2,
          name: "Approved",
          count: 0,
          amount: 0
        }, {
          facilityWorkItemDetailId: 4,
          name: "Denied",
          count: 0,
          amount: 0
        }, {
          facilityWorkItemDetailId: 3,
          name: "In Process",
          count: 0,
          amount: 0
        }, {
          facilityWorkItemDetailId: 1,
          name: "New",
          count: 1,
          amount: 0
        }, {
          facilityWorkItemDetailId: 5,
          name: "Pending",
          count: 0,
          amount: 0
        }, {
          facilityWorkItemDetailId: 6,
          name: "Reviewed for Advocacy",
          count: 0,
          amount: 0
        }]
      }]
    }
    component.reportsForm = new FormGroup({
      selectedFacilitiesIds: new FormControl(''),
      dateOutFrom:new FormControl(''),
      dateOutTo: new FormControl('')
    });
    component.userId = 1;
    spyOn(reportsService, 'getWorkstatusDetails').and.returnValue(of(data));
    component.getWorkstatusReport();
    expect(component.datasource).not.toBeNull();
    expect(component.showGrid).toBeTrue;

  }));

  it('[getWorkstatusReport] should get details when form is valid and service return  empty data', async(() => {
    component.reportsForm = new FormGroup({
      selectedFacilitiesIds: new FormControl(''),
      dateOutFrom:new FormControl(''),
      dateOutTo: new FormControl('')
    });
    component.userId = 1;
    spyOn(reportsService, 'getWorkstatusDetails').and.returnValue(of(null));
    component.getWorkstatusReport();
    expect(component.showGrid).toBeFalse;
    expect(component.showError).toBeTrue;
  }));


});
