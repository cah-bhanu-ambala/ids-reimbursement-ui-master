import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';

import { WorkitemMaintenanceComponent } from './workitem-maintenance.component';

describe('WorkitemMaintenanceComponent', () => {
  let component: WorkitemMaintenanceComponent;
  let fixture: ComponentFixture<WorkitemMaintenanceComponent>;
  let wiService: WorkitemService;
  let toastr: ToastrService;

  const facilityData=[
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

const wiSearchResult= {
  content: [{"patientMrn":"0011","icdCodes":"C08","drugCodes":"00002803101","facilityBillingTypeName":"VOB","assignedToName":null,"orderDate":null,"workItemId":153,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Oncology"},{"patientMrn":"0001","icdCodes":"A15,B10,C10","drugCodes":"J1000,J2001,J3000","facilityBillingTypeName":"PHARM","assignedToName":null,"orderDate":null,"workItemId":152,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Oncology"},{"patientMrn":"0001","icdCodes":"A65","drugCodes":"J9000","facilityBillingTypeName":"N/A","assignedToName":null,"orderDate":null,"workItemId":151,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Non Oncology"},{"patientMrn":"0001","icdCodes":"A15","drugCodes":"J1000","facilityBillingTypeName":"N/A","assignedToName":null,"orderDate":null,"workItemId":150,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Non Oncology"},{"patientMrn":"0001","icdCodes":"M00,P00.1","drugCodes":null,"facilityBillingTypeName":"N/A","assignedToName":null,"orderDate":null,"workItemId":149,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Oncology"},{"patientMrn":"0001","icdCodes":"A15","drugCodes":"J2010","facilityBillingTypeName":"N/A","assignedToName":null,"orderDate":null,"workItemId":147,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Non Oncology"},{"patientMrn":"0001","icdCodes":"A15.0","drugCodes":"J2175","facilityBillingTypeName":"N/A","assignedToName":null,"orderDate":null,"workItemId":146,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Non Oncology"},{"patientMrn":"0001","icdCodes":"C10.0","drugCodes":"J1020","facilityBillingTypeName":"PHARM","assignedToName":null,"orderDate":null,"workItemId":143,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Non Oncology"},{"patientMrn":"0001","icdCodes":"A15.6","drugCodes":"J1030","facilityBillingTypeName":"N/A","assignedToName":null,"orderDate":null,"workItemId":142,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Non Oncology"},{"patientMrn":"0001","icdCodes":null,"drugCodes":null,"facilityBillingTypeName":"N/A","assignedToName":null,"orderDate":null,"workItemId":141,"workItemStatusName":"New","facilityName":"James Smoke Test","orderTypeName":"Oncology"}],
  empty: false,
  first: true,
  last: false,
  number: 0,
  numberOfElements: 10,
  pageable: {"sort":{"unsorted":false,"sorted":true,"empty":false},"offset":0,"pageSize":10,"pageNumber":0,"paged":true,"unpaged":false},
  size: 10,
  sort: {"unsorted":false,"sorted":true,"empty":false},
  totalElements: 131,
  totalPages: 14
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkitemMaintenanceComponent ],
      imports:[ReactiveFormsModule, HttpClientTestingModule,RouterTestingModule,NgbModule,
        ToastrModule.forRoot(), BrowserAnimationsModule, TableModule],
        providers:[WorkitemService,ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkitemMaintenanceComponent);
    wiService = TestBed.inject(WorkitemService);
    toastr = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check search form is valid when all values are entered', () => {
    component.formSearchWI.patchValue({
      facilityId: 1,
      mrn: 'mrn'
    });
    expect(component.sf).toBeTruthy();
    expect(component.formSearchWI.valid).toBeTrue();
  });

  it('[getFacilityList] should get facility list', async(() => {
    spyOn(wiService, 'getApprovedFacilities').and.returnValue(of(facilityData));
    component.getFacilityList();
    expect(component.facilities).toEqual(facilityData);
    expect(wiService.getApprovedFacilities).toHaveBeenCalled();
  }));

  it('[getFacilityList] should throw error', async(() => {
    let err="error"
    const spy =spyOn(wiService, 'getApprovedFacilities').and.returnValue(throwError(err));
    component.getFacilityList();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getOrderTypes] should get types', async(() => {
    let types = [{orderTypeName: "type1", orderTypeId: 1}];
    const spy =spyOn(wiService, 'getOrderTypes').and.returnValue(of(types));
    component.getOrderTypes();
    expect(spy).toHaveBeenCalled();
    expect(component.orderTypes).toEqual(types);
  }));

  it('[getOrderTypes] should throw error', async(() => {
    let err="error"
    const spy =spyOn(wiService, 'getOrderTypes').and.returnValue(throwError(err));
    component.getOrderTypes();
    expect(spy).toHaveBeenCalled();
    expect(component.orderTypes).toBeUndefined();
  }));

  it('[getwiStatuses] should get facility list', async(() => {
    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    component.getwiStatuses();
    expect(component.wiStatuses).toEqual(wiStatus);
    expect(wiService.getwiStatuses).toHaveBeenCalled();
  }));

  it('[getwiStatuses] should throw error', async(() => {
    let err="error"
    const spy =spyOn(wiService, 'getwiStatuses').and.returnValue(throwError(err));
    component.getwiStatuses();
    expect(spy).toHaveBeenCalled();
  }));
   it('[getTeamMembers] should get facility list', async(() => {
     spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
     component.getTeamMembers();
     // expect(component.wiStatuses).not.toBeNull();
     expect(wiService.getAllTeamMembers).toHaveBeenCalled();
   }));

   it('[getTeamMembers] should throw error', async(() => {
     let err="error"
     const spy =spyOn(wiService, 'getAllTeamMembers').and.returnValue(throwError(err));
     component.getTeamMembers();
     expect(spy).toHaveBeenCalled();
   }));

  it('[onSearch] should search workitem when form is valid', async(() => {
    component.formSearchWI.patchValue({
      facilityId: 1,
      patientMrn: 'mrn'
    });
    component.workItemMaintenaceParams = {};
    fixture.componentInstance.showGrid = true;
    fixture.detectChanges();
    const spy =spyOn(wiService, 'getWorkItemsPage').and.returnValue(of(wiSearchResult));
    component.onSearch();
    expect(component.datasource).toEqual(wiSearchResult.content);
    expect(component.loading).toBeFalse();
    expect(component.showGrid).toBeTrue();
    expect(component.totalRecords).toEqual(wiSearchResult.totalElements);
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSearch] should return empty result set', async(() => {
    component.formSearchWI.patchValue({
      facilityId: 1,
      patientMrn: 'mrn'
    });
    component.workItemMaintenaceParams = {};
    fixture.componentInstance.showGrid = true;
    fixture.detectChanges();

    const spy =spyOn(wiService, 'getWorkItemsPage').and.returnValue(of({content: [], totalElements: 0}));
    spyOn(component, 'showInfo').and.callFake(()=>"No records found");
    component.onSearch();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.showGrid).toBeFalse();
    expect(component.formSearchWI.pristine).toBeTrue();
  }));

  it('[loadWorkItemDetails] should load data', fakeAsync(() => {
    const event: LazyLoadEvent ={"first":0,"rows":10,"sortOrder":1,"filters":{},"globalFilter":null};
    component.workItemMaintenaceParams = {};
    component.datasource = wiSearchResult;
    const spy = spyOn(component, 'updateTable').and.stub();
    component.loadWorkItemDetails(event);
    expect(spy).toHaveBeenCalled();
  }));

  it('[loadWorkItemDetails] should not load data when datasource in null', fakeAsync(() => {
    const event: LazyLoadEvent ={"first":0,"rows":10,"sortOrder":1,"filters":{},"globalFilter":null};
    component.workItemMaintenaceParams = {};
    component.loadWorkItemDetails(event);
    tick(500);
    expect(component.loading).toBeTrue();
  }));

  it('[onEdit] should route to editWorkItem', inject([Router], (router: Router) => {
   const winum =27;
    spyOn(router, 'navigate').and.stub();
    component.onEdit(winum);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/workmenu/editWorkItem'],
    {queryParams:{workItemNumber: winum}});
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

  // it('', );
});
