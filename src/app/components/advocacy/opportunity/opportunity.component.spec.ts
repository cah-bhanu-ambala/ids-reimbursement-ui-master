import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { RouterTestingModule } from "@angular/router/testing";
import { NgbModal, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule, ToastrService } from "ngx-toastr";
import { LazyLoadEvent } from "primeng/api";
import { TableModule } from "primeng/table";
import { of, throwError } from "rxjs";
import { AdvocacyService } from "src/app/common/services/http/advocacy.service";
import { CommonService } from "src/app/common/services/http/common.service";
import { PatientService } from "src/app/common/services/http/patient.service";
// import { MockNgbModalRef } from "../../customer-work-item/add-customer-workitem/add-customer-workitem.component.spec";
import { OpportunityComponent } from "./opportunity.component"

class MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
}

describe('OpportunityComponent', () => {
    let component: OpportunityComponent;
    let fixture: ComponentFixture<OpportunityComponent>;
    let advocacyService: AdvocacyService;
    let patientService: PatientService;
    let commonService: CommonService;
    let modalService: NgbModal;
    let toastr: ToastrService;

    let mockModalRef: MockNgbModalRef = new MockNgbModalRef();

    const addFormData ={ 
      advocacyOpportunityId: 2,
      primaryInsuranceId: 8,
      secondaryInsuranceId: 11,
      advocacyOpportunityTypeId: 1,
      notes:'Test'
    }

    const primaryInsuranceList = [
        {
          "active": true,
          "createdDate": "2021-02-01T17:37:57.740+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:37:57.740+0000",
          "modifiedBy": 1,
          "insuranceId": 3,
          "insuranceType": "Primary",
          "insuranceName": "Commercial"
        },
        {
          "active": true,
          "createdDate": "2021-02-01T17:37:57.740+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:37:57.740+0000",
          "modifiedBy": 1,
          "insuranceId": 4,
          "insuranceType": "Primary",
          "insuranceName": "Government"
        },
        {
          "active": true,
          "createdDate": "2021-02-01T17:37:57.740+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:37:57.740+0000",
          "modifiedBy": 1,
          "insuranceId": 5,
          "insuranceType": "Primary",
          "insuranceName": "Medicaid Managed"
        },
        {
          "active": true,
          "createdDate": "2021-02-01T17:37:57.740+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:37:57.740+0000",
          "modifiedBy": 1,
          "insuranceId": 6,
          "insuranceType": "Primary",
          "insuranceName": "Medicaid State"
        },
        {
          "active": true,
          "createdDate": "2021-02-01T17:37:57.740+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:37:57.740+0000",
          "modifiedBy": 1,
          "insuranceId": 7,
          "insuranceType": "Primary",
          "insuranceName": "Medicare A"
        },
        {
          "active": true,
          "createdDate": "2021-02-01T17:37:57.740+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:37:57.740+0000",
          "modifiedBy": 1,
          "insuranceId": 8,
          "insuranceType": "Primary",
          "insuranceName": "Medicare A & B"
        },
        {
          "active": true,
          "createdDate": "2021-02-01T17:37:57.740+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:37:57.740+0000",
          "modifiedBy": 1,
          "insuranceId": 9,
          "insuranceType": "Primary",
          "insuranceName": "Medicare Replacement"
        },
        {
          "active": true,
          "createdDate": "2021-02-01T17:37:57.740+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:37:57.740+0000",
          "modifiedBy": 1,
          "insuranceId": 10,
          "insuranceType": "Primary",
          "insuranceName": "Self Pay"
        },
        {
          "active": true,
          "createdDate": "2021-02-01T17:37:57.740+0000",
          "createdBy": 1,
          "modifiedDate": "2021-02-01T17:37:57.740+0000",
          "modifiedBy": 1,
          "insuranceId": 1,
          "insuranceType": "Primary",
          "insuranceName": "Unknown"
        }
    ];

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [OpportunityComponent],
            imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, NgSelectModule,TableModule,
            ToastrModule.forRoot(), BrowserAnimationsModule, NgbModule],
            providers: [AdvocacyService, PatientService, CommonService, ToastrService]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(OpportunityComponent);
        component = fixture.componentInstance;
        advocacyService = TestBed.inject(AdvocacyService);
        patientService = TestBed.inject(PatientService);
        commonService =TestBed.inject(CommonService);
        toastr = TestBed.inject(ToastrService);
        modalService = TestBed.inject(NgbModal);
        component.ngOnInit();
        fixture.detectChanges();
    });

    it('[Opportunity] should create', () => {
        expect(component).toBeTruthy();
    });

    it('[ngAfterViewChecked] is called', async(() =>{
    component.ngAfterViewChecked();
    expect(component.ngAfterViewChecked).toBeTruthy();
    }));

    it('[getPrimaryInsuranceList] should get primary insurance list', async(() => {
        let spy = spyOn(advocacyService, 'getPrimaryInsuranceList').and.returnValue(of(primaryInsuranceList));
        component.getPrimaryInsurance();
        expect(spy).toHaveBeenCalled();
        expect(component.fa).toBeTruthy;
    }));
    
    it('[getPrimaryInsuranceList] should throw error', async(() => {
    let err = "error"
    spyOn(advocacyService, 'getPrimaryInsuranceList').and.returnValue(throwError(err));
    component.getPrimaryInsurance();
    expect(component.fa).toBeTruthy;
    }));

    it('[getSecondaryInsuranceList] should get secondary insurance list', async(() => {
    let spy = spyOn(advocacyService, 'getSecondaryInsuranceList').and.returnValue(of(primaryInsuranceList));
    component.getSecondaryInsurance();
    expect(spy).toHaveBeenCalled();
    expect(component.fa).toBeTruthy;
    }));

    it('[getSecondaryInsuranceList] should throw error', async(() => {
      let err = "error"
      spyOn(advocacyService, 'getSecondaryInsuranceList').and.returnValue(throwError(err));
      component.getSecondaryInsurance();
      expect(component.fa).toBeTruthy;
    }));

    // //failed
    // fit('[onSearchByPrimInsAndSecondIns] should search for opportunities', async(() => {
    //   component.formAdvOppSearch.patchValue({
    //     primaryInsuranceId: '8',
    //     secondaryInsuranceId: '11'
    //   })

    //   const searchResult = []

    //   const spy =spyOn(advocacyService, "SearchForOpportunities").and.returnValue(of(searchResult))
    //   component.onSearchByPrimInsAndSecondIns();
    //   // expect(component.showAdvOppGrid).toBeFalsy();
    //   // expect(component.showError).toBeFalsy();
    //   expect(component.advOppDatasource).toEqual(searchResult);
    //   expect(spy).toHaveBeenCalled();

    // }));

    it('[loadAdvOppSearch] should call', async(() => {
      const val = "test";
      let spy = spyOn(advocacyService,'SearchForAllOpportunities').and.returnValue(of(val));
      component.loadAdvOppSearchResults(val);
      expect(component.showError).toBeFalsy();
      expect(spy).toHaveBeenCalled();
    }));

    it('[loadAdvOppDetails] should load data after 500ms', fakeAsync(() => {
      const event: LazyLoadEvent = { "first": 0, "rows": 10, "sortOrder": 1, "filters": {}, "globalFilter": null };
      component.advOppDatasource = [];
      component.loadAdvOppDetails(event);
      tick(500);
      expect(component.advOpploading).toBeFalse();
    }));

    it('[onSubmit] should throw error', async(() => {
      component.formAdvocacyOpportunity.invalid;
      expect(component.onSubmit()).toBeFalsy();
    }));

  it('[onSubmit] should submit form and update advocacy', async(() => {
      component.formAdvocacyOpportunity.patchValue({value: 10});
      component.submitted = true;
      component.isUpdate = true;
      component.advocacyOpportunityId = 10;
      spyOn(component, 'showSuccess').and.callFake(()=>"success");
      const spy = spyOn(advocacyService, 'updateOpportunityType').and.returnValue(of({}));
      component.onSubmit();
      expect(spy).toBeTruthy();
    }));

    it('[onSubmit] should update', async(() => {
      component.formAdvocacyOpportunity.patchValue(addFormData);
      
      let spy1 =spyOn(advocacyService, 'updateOpportunityType').and.returnValue(of({}));
      spyOn(component, 'showSuccess').and.callFake(() => "Updated advocacy opportunity successfully");

      component.onSubmit(); 
      expect(component.submitted).toBeFalse();
      expect(spy1).toHaveBeenCalled();
    }));

    it('[getAdvocacyOpportunityTypes] should get advocacy opportunity types', async(() => {
        let spy = spyOn(advocacyService, 'getAdvocacyOpportunityTypes').and.returnValue(of(primaryInsuranceList));
        component.getAdvocacyOpportunityTypes();
        expect(spy).toHaveBeenCalled();
        expect(component.fa).toBeTruthy;
    }));

    it('[getAdvocacyOpportunityTypes] should throw error', async(() => {
        let err = "error"
        spyOn(advocacyService, 'getAdvocacyOpportunityTypes').and.returnValue(throwError(err));
        component.getAdvocacyOpportunityTypes();
        expect(component.fa).toBeTruthy();
    }));

    it('[onEdit] is called', async(() => {
      const advocacyOpportunity = {
        advocacyOpportunityId: 1,
        primaryInsuranceId: 123,
        secondaryInsuranceId: 456,
        advocacyOpportunityTypeId: 789,
        notes: 'none'
      };
      component.onEdit(advocacyOpportunity);
      expect(component.f).toBeTruthy();
      expect(component.showAdvocacyOpportunityForm).toBeTruthy();
    }));

    it('[onReset] should clear the form', async(() => {
        component.onReset();
        expect(component.submitted).toBeFalse();
    }));

    it('[deleteAdvocacyOpportunity] open modal testing', fakeAsync(() => {
      const testId = 53;
      let spy = spyOn(advocacyService, 'deleteAdvOpp').and.returnValue(of([]));
      component.deleteAdvocacyOpportunity(testId);
      tick(500);
      flush();
      expect(spy).toBeTruthy();
    }));

    it('[onDeleteAdvocacyOpportunity] should delete data', fakeAsync(() => {
        const testId = 45;
        let spy = spyOn(advocacyService, 'deleteAdvOpp').and.returnValue(of([]));
        component.onDeleteAdvocacyOpportunity(testId);
        tick(500);
        flush();
        expect(spy).toHaveBeenCalled();
    }));

    it('[onDeleteAdvocacyOpportunity] should throw error', fakeAsync(() => {
      const testId = 54;
      let err = "error";
      let spy = spyOn(advocacyService, 'deleteAdvOpp').and.returnValue(throwError(err));
      component.onDeleteAdvocacyOpportunity(testId);
      tick(500);
      flush();
      expect(spy).toHaveBeenCalled();
    }));

    it('[onClear] should clear form data', async(() => {
        component.onClear();
        expect(component.submitted).toBe(false);
        expect(component.formAdvocacyOpportunity.pristine).toBeTrue();
    }));

    it('[addAttachment] add the selected file', async(() => {
      let selectedFiles = 'test';
      component.addAttachment(selectedFiles);
      expect(component.selectedFiles).toEqual(selectedFiles);
    }));

    it('[addFileList] add the files list', async(() => {
      let selectedFiles = 'test';
      component.addFileList(selectedFiles);
      expect(component.filesList).toEqual(selectedFiles);
    }));

    it('[addAttachment] add the selected file', async(() => {
      let selectedFiles = '';
      let filesList = '';
      component.deleteSelectedFile(selectedFiles, filesList);
      expect(component.selectedFiles).toEqual(selectedFiles);
      expect(component.filesList).toEqual(filesList);
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
})