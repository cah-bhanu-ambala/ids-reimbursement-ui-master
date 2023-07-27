import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import {  ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { of } from 'rxjs';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { SearchRevenueComponent } from '../../shared/search-revenue/search-revenue.component';

import { ViewWorkitemComponent } from './view-workitem.component';
import {NavigationExtras, Router} from "@angular/router";

describe('ViewWorkitemComponent', () => {
  let component: ViewWorkitemComponent;
  let fixture: ComponentFixture<ViewWorkitemComponent>;
  let wiService: WorkitemService;
  let router: Router;

  const wiData ={
    workItemId: 22,
    teamMemberId: 1,
    workItemStatusId: 1,
    facilityBillingLevelId: "7",
    dateOut: "2021-02-25T08:00:00.000Z",
    providerId: 1,
    orderDate: "2021-02-18T08:00:00.000Z",
    buyBill: "U",
    externalWorkId: "123",
    orderTypeId: "1",
    wiInsurance: {
        primaryInsRep: "John",
        primaryInsRefNum: "999",
        primaryInNetwork: "Y",
        deductibleMax: "3000",
        deductibleMet: "1111",
        outOfPocketMax: "222",
        outOfPocketMet: "100",
        coInsurance: 20,
        primaryInsClassification: "3",
        primaryInsNotes: "Test",
        secondaryInsRefNum: "879",
        secondaryInsRep: "Fed",
        secondaryInNetwork: "Y",
        secondaryInsClassification: "22",
        secondaryInsNotes: "Test",
        workItemId: 22,
        modifiedBy: 1,
        createdBy: 1,
        workItemInsId: 10
    },
    generalNotes: "Test",
    drugCodes: [{
        createdBy: 1,
        modifiedBy: 1,
        drugProcCode: "J0135",
        isCover: "Y",
        priorAuth: "Y",
        priorAuthApprovalReason: "2",
        workItemDrugCodeId: 15,
        workItemId: 22,
        priorAuthNo: "456",
        priorAuthFromDate: "2021-03-02T08:00:00.000Z",
        priorAuthToDate: "2021-03-13T08:00:00.000Z",
        priorAuthNotes: "prior auth",
        visitsApproved: "2",
        unitsApproved: "1",
        advocacyNeeded: "Y",
        advocacyNotes: "Test",
        drugId: 2
    }],
    icdCodes: [{
        createdBy: 1,
        modifiedBy: 1,
        icdCode: "A00.0",
        workItemIcdCodeId: 11,
        workItemId: 22,
        icdId: 2
    }],
    modifiedBy: 1,
    dateIn: "",
    patientId: 3,
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
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewWorkitemComponent, SearchRevenueComponent ],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, NgbModalModule,NgbModule,
        RouterTestingModule.withRoutes([]), BrowserAnimationsModule, NgSelectModule,
        TableModule, ButtonModule, TooltipModule],
        providers:[WorkitemService, NgbActiveModal,NgbModal, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWorkitemComponent);
    component = fixture.componentInstance;
    wiService = TestBed.inject(WorkitemService);
    fixture.detectChanges();
    router = TestBed.get(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[onSearch] should load search results', async() => {
    spyOn(wiService, 'getWorkItemsPage').and.returnValue(of({'content': wiData}));
    spyOn(component, 'onSearch').and.callThrough();
    const winum = 22;
    component.wiDatasource = [];
    component.onSearch(winum);
    expect(component.wiDatasource).toEqual(wiData);
    expect(component.onSearch).toHaveBeenCalledWith(winum);
  });

  it('[onSearch] should load search results empty results', async() => {
    spyOn(wiService, 'getWorkItemsPage').and.returnValue(of({'content': []}));
    const winum = 22;
    component.wiDatasource = [];
    component.onSearch(winum);
    expect(component.wiDatasource).toBeTruthy;
    expect(component.wiDatasource.length).toEqual(0);
  });


  it('[viewLoadWiDetails] should load wi data', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    }
    component.wiDatasource=[wiData];
    component.viewLoadWiDetails(event);  
    tick(500); 
    expect(component.showWorkItem ).toBeFalse();
    expect(component.wiSearchResult  ).not.toBeNull(); 
  }));

    it('[onView] should load the data and set the form ', async(() => {
    const winum = 22;
      let params: NavigationExtras = {
        queryParams: {
          "workItemNumber": winum,
          "viewOnly": true
        }
      }
    spyOn(router, 'navigate');
    component.onView(winum);
      expect(router.navigate).toHaveBeenCalledWith(['/dashboard/workmenu/editWorkItem'], params)
  }));

});
