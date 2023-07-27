import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { SummaryComponent } from './summary.component';
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
import { UserService } from 'src/app/common/services/http/user.service';


describe('SummaryComponent', () => {
  let component: SummaryComponent;
  let fixture: ComponentFixture<SummaryComponent>;
  let reportsService: ReportsService;
  let userService: UserService;

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

const teamMemberData=[
    {
      "active": true,
      "createdDate": "2022-02-01T17:36:49.437+0000",
      "createdBy": 1,
      "modifiedDate": "2022-02-01T17:36:49.437+0000",
      "modifiedBy": 1,
      "userId": 1,
      "userName": "admin",
      "userEmail": "admin@cardinalhealth.com",
      "teamLeadId": 1,
      "userRoleId": 1,
      "delegateUserId": 0,
      "facilityId": 0,
      "userRoleName": "Superuser",
      "systemId": 1
    },
    {
      "active": true,
      "createdDate": "2023-02-01T17:57:56.509+0000",
      "createdBy": 1,
      "modifiedDate": "2023-02-01T17:57:56.509+0000",
      "modifiedBy": null,
      "userId": 2,
      "userName": "Team Leader",
      "userEmail": "teamlead@abc.com",
      "teamLeadId": 1,
      "userRoleId": 2,
      "delegateUserId": 0,
      "facilityId": 0,
      "userRoleName": "Team Lead",
      "systemId": 1
    }
  ];

  const summaryDetailsData = [{
    grandCount: 0,
    grandAmount: 0,
    facilities: [{
      facilityId: 1,
      facilityName: "Facility 1",
      totalCount: 0,
      totalAmount: 0,
      workItemStatuses: [{
        facilityWorkItemDetailId: 5,
        name: "PHARM L1",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 6,
        name: "PHARM L2",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 7,
        name: "PHARM L3",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 8,
        name: "RAD L1",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 9,
        name: "RAD L2",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 2,
        name: "VOB L1",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 3,
        name: "VOB L2",
        count: 0,
        amount: 0
      }, {
        facilityWorkItemDetailId: 4,
        name: "VOB L3",
        count: 0,
        amount: 0
      }]
    }]
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SummaryComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule,
        NgbModule, TableModule, CalendarModule, MultiSelectModule, NgSelectModule,
        ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [ReportsService, UserService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryComponent);
    component = fixture.componentInstance;
    reportsService = TestBed.inject(ReportsService);
    userService = TestBed.inject(UserService);
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
    expect(component.facilitiesList).toEqual(allFacilityData);
    expect(reportsService.getAllFacilities).toHaveBeenCalled();
  }));

  it('[getFacilityList] should throw error', async(() => {
    let err = "error"
    spyOn(reportsService, 'getAllFacilities').and.returnValue(throwError(err));
    component.getFacilityList();
    expect(reportsService.getAllFacilities).toHaveBeenCalled();
  }));

   it('should get users to assign', async(() => {
      let spy1 = spyOn(userService, 'getBySystemId').and.returnValue(of([teamMemberData[0]]));
      let spy2 = spyOn(userService, 'getInternalUsers').and.returnValue(of([teamMemberData[1]]));

      component.getTeamMemberList();

      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();

      expect(component.teamMembers.length).toBe(2);
    }))

  it('[getTeamMemberList] should throw error', async(() => {
    let err = "error"
    spyOn(userService, 'getInternalUsers').and.returnValue(throwError(err));
    component.getTeamMemberList();
    expect(userService.getInternalUsers).toBeTruthy();
  }));

  it('[getSummaryReport] should fail when form is invalid', async(() => {
    component.getSummaryReport();
    expect(component.errorMessage).not.toBeNull();
  }));

  it('[onReset] should reset form', async(() => {
    component.onReset();
    expect(component.selectedTeamMembersIds.length).toEqual(0);
    expect(component.selectedFacilitiesIds.length).toEqual(0);
    expect(component.reportsForm.invalid).toBeTrue();
  }));

  it('[loadReport] should get summaryList data', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    }
    component.datasource = summaryDetailsData;
    component.loadReport(event);
    tick(500);
    expect(component.loading).toBeFalse();
    expect(component.summaryList).not.toBeNull();
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
    component.facilities=summaryDetailsData[0].facilities;
    component.exportExcel();
    expect(component).toBeTruthy;
  });


  it('[onClearAll] triggers when type is facilities', fakeAsync((type: string) => {
    type = 'facilities';
    component.onClearAll(type);
    expect(component.reportsForm.get('selectedFacilitiesIds').value).toEqual([]);
  }));

  it('[onClearAll] triggers when type is facilities', fakeAsync((type: string) => {
    type = 'teamMember';
    component.onClearAll(type);
    expect(component.reportsForm.get('selectedTeamMembersIds').value).toEqual([]);
  }));

  it('Should check Reports form is valid when values are entered', () => {
    component.reportsForm.controls['fromDate'].setValue({ year: 2021, month: 2, day: 2 });
    component.reportsForm.controls['toDate'].setValue({ year: 2021, month: 2, day: 5 });
    component.getSummaryReport();
    expect(component.showGrid).toBeFalse();
    expect(component.getSummaryReport).toBeTruthy();
    expect(component.sf).toBeTruthy();
  });

  it('[getSummaryReport] should get details when form is valid', async(() => {
    component.reportsForm.controls['fromDate'].setValue({ year: 2021, month: 2, day: 2 });
    component.reportsForm.controls['toDate'].setValue({ year: 2021, month: 2, day: 5 });
    component.userId = 1;
    component.getSummaryReport();
    expect(component.showGrid).toBeFalse();
    expect(component.getSummaryReport).toBeTruthy();
  }));

  it('[onSelectAll] triggers when type is teammember', () => {
    let type = 'teamMember';
    component.teamMembers = [{userRoleId: 1}];
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


  it('[getSummaryReport] should get details when form is valid and service return data', async(() => {
    component.reportsForm = new FormGroup({
      selectedFacilitiesIds: new FormControl(''),
      selectedTeamMembersIds: new FormControl(''),
      fromDate:new FormControl(''),
      toDate: new FormControl(''),
      selectedDateType: new FormControl('')
    });
    component.userId=1;
    spyOn(reportsService, 'getSummaryDetails').and.returnValue(of(summaryDetailsData)) ;
    component.getSummaryReport();
    expect(component.datasource ).not.toBeNull();

  }));

  it('[getSummaryReport] should get details when form is valid and service return  empty data', async(() => {
    component.reportsForm = new FormGroup({
      selectedFacilitiesIds: new FormControl(''),
      selectedTeamMembersIds: new FormControl(''),
      fromDate:new FormControl(''),
      toDate: new FormControl(''),
      selectedDateType: new FormControl('')
    });
    component.userId=1;
    spyOn(reportsService, 'getSummaryDetails').and.returnValue(of(null)) ;
    component.getSummaryReport();
    expect(component.showGrid).toBeFalse;
    expect(component.showError ).toBeFalse;
  }));

});
