import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormsModule, FormGroup, FormControl} from '@angular/forms';

import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { CommonService } from 'src/app/common/services/http/common.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { AdvocacyMaintenanceComponent } from './advocacy-maintenance.component';
import { Router } from '@angular/router';

describe('AdvocacyMaintenanceComponent', () => {
  let component: AdvocacyMaintenanceComponent;
  let fixture: ComponentFixture<AdvocacyMaintenanceComponent>;
  let advocacyService: AdvocacyService;
  let patientService: PatientService;
  let commonService: CommonService;
  let toastr: ToastrService;

const advocacyMaintenanceResult =
    {
      "content": [
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 78,
              "notes": null,
              "lookBack": null,
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T15:47:10.736",
              "icdCode": "A04.72",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 67899.0,
              "advocacyStatusName": "Approved",
              "advocacyTypeName": "Commercial Copay - Pharmacy",
              "lookBackStartDate": null,
              "attachments": "79~00021_Workitem-73.pdf,78~MicrosoftTeams-image (10).png",
              "followUp": false
          },
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 76,
              "notes": "",
              "lookBack": "",
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T16:40:18.643",
              "icdCode": "A04.72",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 23433.0,
              "advocacyStatusName": "Advocacy Identified",
              "advocacyTypeName": "Commercial Copay",
              "lookBackStartDate": null,
              "attachments": "76~00021_Workitem-73.pdf",
              "followUp": false
          },
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 74,
              "notes": "",
              "lookBack": "",
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T10:53:57.719",
              "icdCode": "A04.2",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 67899.0,
              "advocacyStatusName": "Advocacy Identified",
              "advocacyTypeName": "Commercial Copay",
              "lookBackStartDate": null,
              "attachments": "74~MicrosoftTeams-image (10).png",
              "followUp": false
          },
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 73,
              "notes": null,
              "lookBack": null,
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T10:50:10.697",
              "icdCode": "A54.00",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 67899.0,
              "advocacyStatusName": "Advocacy Identified",
              "advocacyTypeName": "Commercial Copay",
              "lookBackStartDate": null,
              "attachments": "73~73482304_Workitem-194 (4).pdf",
              "followUp": false
          },
          {
              "facilityId": 14,
              "startDate": null,
              "advocacySource": "www.abc.com",
              "advocacyId": 72,
              "notes": "",
              "lookBack": "",
              "endDate": null,
              "patientMrn": "0003",
              "drugProcCode": "J0897",
              "createdDate": "2023-05-09T10:48:58.006",
              "icdCode": "A54.00",
              "facilityName": "Hogwarts Medical Center",
              "insuranceType": "Primary",
              "insuranceName": "UNKNOWN",
              "maximumAmountAvail": 67899.0,
              "advocacyStatusName": "Advocacy Identified",
              "advocacyTypeName": "Commercial Copay",
              "lookBackStartDate": null,
              "attachments": "72~73482304_Workitem-194 (4).pdf",
              "followUp": false
          }
      ],
      "pageable": {
          "sort": {
              "sorted": true,
              "unsorted": false,
              "empty": false
          },
          "pageSize": 5,
          "pageNumber": 0,
          "offset": 0,
          "unpaged": false,
          "paged": true
      },
      "totalPages": 9,
      "totalElements": 45,
      "last": false,
      "numberOfElements": 5,
      "size": 5,
      "number": 0,
      "sort": {
          "sorted": true,
          "unsorted": false,
          "empty": false
      },
      "first": true,
      "empty": false
  };

const exportExcelResult =
   {
       "content": [
           {
               "advocacyStatusName": "Approved",
               "lookBackStartDate": "2021-02-01",
               "advocacyTypeName": "Grant - VOB",
               "attachments": "39~test2.docx,38~test.docx,35~test.docx",
               "facilityId": 13,
               "advocacyId": 14,
               "notes": "test",
               "startDate": "2021-04-01",
               "advocacySource": "cancer care",
               "endDate": "2021-12-30",
               "lookBack": "60",
               "drugProcCode": "J9176",
               "patientMrn": "000003",
               "createdDate": "2021-04-07T13:21:17.231",
               "facilityName": "eRecovery Memorial Healthcare",
               "icdCode": "C34.90",
               "insuranceName": "UNKNOWN",
               "insuranceType": "Primary",
               "followUp": true,
               "maximumAmountAvail": 50000.0
           }
       ],
       "pageable": "INSTANCE",
       "last": true,
       "totalPages": 1,
       "totalElements": 1,
       "size": 1,
       "number": 0,
       "sort": {
           "sorted": false,
           "unsorted": true,
           "empty": true
       },
       "first": true,
       "numberOfElements": 1,
       "empty": false
   };

 beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdvocacyMaintenanceComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, NgSelectModule, TableModule,
        ToastrModule.forRoot(), BrowserAnimationsModule, NgbModule],
      providers: [AdvocacyService, PatientService, CommonService, ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvocacyMaintenanceComponent);
    component = fixture.componentInstance;
    advocacyService = TestBed.inject(AdvocacyService);
    patientService = TestBed.inject(PatientService);
    commonService = TestBed.inject(CommonService);
    toastr = TestBed.inject(ToastrService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check search form is valid when all values are entered', () => {
    component.formSearchAdvocacy.patchValue({
      patientMrn: 'mrn',
      facilityId: 1
    });
    expect(component.sf).toBeTruthy();
    expect(component.formSearchAdvocacy.valid).toBeTrue();
  });

  it('[getFacilityList] should get facility list', async(() => {
    spyOn(advocacyService, 'getFacilityList').and.returnValue(of({}));
    component.getFacilityList();
    expect(component.facilities).not.toBeNull();
    expect(advocacyService.getFacilityList).toHaveBeenCalled();
  }));

  it('[getFacilityList] should throw error', async(() => {
    let err = "error"
    const spy = spyOn(advocacyService, 'getFacilityList').and.returnValue(throwError(err));
    component.getFacilityList();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getAdvocacyStatuses] should get facility list', async(() => {
    spyOn(advocacyService, 'getAllAdvocacyStatus').and.returnValue(of({}));
    component.getAdvocacyStatuses();
    expect(component.facilities).not.toBeNull();
    expect(advocacyService.getAllAdvocacyStatus).toHaveBeenCalled();
  }));

  it('[getAdvocacyStatuses] should throw error', async(() => {
    let err = "error"
    const spy = spyOn(advocacyService, 'getAllAdvocacyStatus').and.returnValue(throwError(err));
    component.getAdvocacyStatuses();
    expect(spy).toHaveBeenCalled();
  }));

 it('[onSearch] should search for advocacy', async(() => {
  component.formSearchAdvocacy.patchValue({
            patientMrn: '0003',
            selectedFacilitiesIds: '19',
            selectedAdvocacyStatusIds: '11'
          });

      let advocacyParams={
      patientMrnsearchParam: '0003',
      facilityIdSearchParam: '19',
      advStatusIdSearchParam: '11',
      pageNum: 0,
      pageSize: 5,
      orderBy: ['advocacyId -1'],
      pagination:true
    }
    component.loading = true;
    component.advocacyDatasource = [];
    const spy = spyOn(advocacyService, 'getAdvocacyMaintenanceSearchParamsForPagination').and.returnValue(of(advocacyMaintenanceResult));
    component.onSearch();
    expect(component.totalRecords ).toEqual(advocacyMaintenanceResult.totalElements);
    expect(component.advocacyDatasource ).toEqual(advocacyMaintenanceResult.content);
    expect(spy).toHaveBeenCalledWith(advocacyParams);
    expect(spy).toHaveBeenCalled();

  }));

  it('[getDataSetForExcel] should export to excel', async(() => {
    component.formSearchAdvocacy.patchValue({
              patientMrn: '0003',
              selectedFacilitiesIds: '13',
              selectedAdvocacyStatusIds: '11'
     });

    let advocacyParamsSearch={
      patientMrnsearchParam: '0003',
      facilityIdSearchParam: '13',
      advStatusIdSearchParam: '11',
      pageNum: 0,
      pageSize: 5,
      orderBy: ['advocacyId -1'],
      pagination:false
    }
    let advocacyParamsExcel={
      patientMrnsearchParam: '0003',
      facilityIdSearchParam: '13',
      advStatusIdSearchParam: '11',
      pageNum: 0,
      pageSize: 5,
      orderBy: ['advocacyId -1'],
      pagination:false
    }

    component.loading = false;
    component.dataSourceForExcelExport = [];
    component.totalRecords = 0;
    const spy = spyOn(advocacyService, 'getAdvocacyMaintenanceSearchParamsForPagination').and.returnValue(of(exportExcelResult));
    spyOn(component, 'saveAsExcelFile').and.stub();

    component.onSearch();
    component.getDataSetForExcel();

    expect(spy).toHaveBeenCalledWith(advocacyParamsSearch);
    expect(spy).toHaveBeenCalledWith(advocacyParamsExcel);
  }));


  it('[onSearch] should search for advocacy', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 5,
      sortOrder:1,
      filters:{}
    }
    component.advocacyDatasource= [advocacyMaintenanceResult];
    component.loadAdvocacyMaintenancePage(event);
    expect(component.loading).toBeTrue();
    expect(component.loadAdvocacyMaintenancePage).not.toBeNull();

  }));

  it('[onSearch] should search for advocacy', async(() => {
    component.formSearchAdvocacy.patchValue({
      patientMrn: 'mrn88',
      facilityId: 1,
      advocacyStatusId: 11
    });
    const spy = spyOn(advocacyService, 'getAdvocacyMaintenanceSearchParamsForPagination').and.returnValue(of([]));
    component.onSearch();
    expect(spy).toHaveBeenCalled();
   }));

   it('[onResetSF] should reset search form', async(() => {
    component.onResetSF();
    expect(component.searched).toBeFalse();
  }));

  it('[onEdit] should navigate to editAdvocacy', inject([Router], (router: Router) => {
    const advid = 13;
    spyOn(router, 'navigate').and.stub();
    component.onEdit(advid);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/advocacy/editAdvocacy'],
      { queryParams: { advocacyId: advid } });
  }));

  it('[deleteAdvocacy] should delete advocacy', fakeAsync(() => {
    const advid = 13;
    const spy = spyOn(patientService, 'deleteAdvocacyById').and.returnValue(of({}));
    spyOn(component, 'showSuccess').and.callFake(() => "deleted successfully");

    component.deleteAdvocacy(advid);
    expect(spy).toHaveBeenCalled();
  }));

  it('[deleteAdvocacy] should delete advocacy', fakeAsync(() => {
    const advid = 13;
    let err = "error";
    const spy = spyOn(patientService, 'deleteAdvocacyById').and.returnValue(throwError(err));
    spyOn(component, 'showSuccess').and.callFake(() => "deleted successfully");
    component.deleteAdvocacy(advid);
    flush();
    tick(500);
    expect(spy).toHaveBeenCalled();
  }));

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

  it('[showInfo] works', fakeAsync((msg: any) => {
    msg = 'info';
    component.showInfo(msg);
    flush();
    expect(component.showInfo).toBeTruthy();
  }));

  it("should open File", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf"
    const mBlob = { size: 1024, type: "application/pdf" };
    const spy = spyOn(patientService, 'getAttachmentById').and.returnValue(of({}));
    component.openFile(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });

  it("should open File throws error", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf"
    let err = "error";
    const mBlob = { size: 1024, type: "application/pdf" };
    const spy = spyOn(patientService, 'getAttachmentById').and.returnValue(throwError(err));
    component.openFile(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });


  it("should download File", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf"
    const mBlob = { size: 1024, type: "application/pdf" };
    const spy = spyOn(patientService, 'getAttachmentById').and.returnValue(of({}));
    component.downloadFile(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });

  it("should download File throws error", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf"
    let err = "error";
    const mBlob = { size: 1024, type: "application/pdf" };
    const spy = spyOn(patientService, 'getAttachmentById').and.returnValue(throwError(err));
    component.downloadFile(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });

  it('should delete advocacy', fakeAsync(() => {
    const advocacyId = 25;
    let spy = spyOn(patientService, 'deleteAdvocacyById').and.returnValue(of([]));
    component.onDelete(advocacyId);
    tick(500);
    flush();
    expect(spy).toBeTruthy();
  }));

  it('[exportDataToExcel] should export data to excel file', () => {
    component.exportDataToExcel(exportExcelResult.content);
    expect(component).toBeTruthy;
  });

  it('[setExportFlag] works', fakeAsync((msg: any) => {
      component.currentUserRole = 'randomRole';
      component.setExportFlag();
      expect(component.showExport).toBeFalse();
      component.currentUserRole = 'Superuser';
      component.setExportFlag();
      expect(component.showExport).toBeTrue();
      component.currentUserRole = 'Team Lead';
      component.setExportFlag();
      expect(component.showExport).toBeTrue();
    }));
 it('[onClearAll] triggers when type is facilities', fakeAsync((type:string) => {
    type = 'facilities';
    component.onClearAll(type);
    expect(component.formSearchAdvocacy.get('selectedFacilitiesIds').value).toEqual([]);
  }));

  it('[onClearAll] triggers when type is not facilities', fakeAsync((type:string) => {
    type = 'test';
    component.onClearAll(type);
    expect(component.formSearchAdvocacy.get('selectedFacilitiesIds').value).not.toEqual([]);
  }));

  it('[onClearAll] triggers when type is advocacyStatuses', fakeAsync((type:string) => {
      type = 'advocacyStatuses';
      component.onClearAll(type);
      expect(component.formSearchAdvocacy.get('selectedAdvocacyStatusIds').value).toEqual([]);
    }));

    it('[onClearAll] triggers when type is not advocacyStatuses', fakeAsync((type:string) => {
      type = 'test';
      component.onClearAll(type);
      expect(component.formSearchAdvocacy.get('selectedAdvocacyStatusIds').value).not.toEqual([]);
    }));

  it('[onSelectAll] triggers when type is not facilities', fakeAsync((type: string) => {
    type = 'notfacilities';
    component.onSelectAll(type);
    expect(component.onSelectAll(type)).toBeFalse;
  }));

  it('[onSelectAll] triggers when type is facilities', async(() => {
      component.formSearchAdvocacy = new FormGroup({
        selectedFacilitiesIds: new FormControl('')
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

    it('[onSelectAll] triggers when type is advocacy status', async(() => {
          component.formSearchAdvocacy = new FormGroup({
            selectedAdvocacyStatusIds: new FormControl('')
          });
          let type = 'advocacyStatuses';
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
          component.advocacyStatuses = facilityListdata;
          component.onSelectAll(type);
          expect(component ).toBeTruthy;
        }));
});
