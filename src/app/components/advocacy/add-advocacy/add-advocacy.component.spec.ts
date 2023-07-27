import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { PatientService } from 'src/app/common/services/http/patient.service';

import { AddAdvocacyComponent } from './add-advocacy.component';
import {FileAttachmentService} from 'src/app/common/services/http/file-attachment.service';

describe('AddAdvocacyComponent', () => {
  let component: AddAdvocacyComponent;
  let fixture: ComponentFixture<AddAdvocacyComponent>;
  let advocacyService: AdvocacyService;
  let patientService: PatientService;
  let fileAttachmentService: FileAttachmentService;
  let toastr: ToastrService;

  const addFormData ={
    patientMrn:'mrn',
    facilityName: "Facility 1",
    advocacyId: 27,
    drugId:9,
    drugCode: 9,
    advocacyStatusId: 3,
    advocacyTypeId: 4,
    advocacySource: "advsource",
    diagnosisCode: 14449,
    workItemId: 8,
    maxAmountAvail: 1000,
    startDate: {year:2021,month:2,day:2},
    endDate: {year:2021,month:2,day:12},
    icdId: 8024,
    lookBack: "Test",
    lookBackStartDate: {year:2021,month:1,day:2},
    createdDate: {year:2021,month:2,day:2},
    createdBy: 1,
    modifiedBy: 1,
    modifiedDate: {year:2021,month:2,day:2},
    notes: "Test",
    patientId: 3
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAdvocacyComponent ],
      imports:[ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule,NgSelectModule,TableModule,
        ToastrModule.forRoot(), BrowserAnimationsModule, NgbModule],
        providers: [AdvocacyService,PatientService, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAdvocacyComponent);
    component = fixture.componentInstance;
    advocacyService = TestBed.inject(AdvocacyService);
    patientService = TestBed.inject(PatientService);
    fileAttachmentService = TestBed.inject(FileAttachmentService);
    toastr = TestBed.inject(ToastrService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check search form is valid when all values are entered', () => {
    component.formSearchPatient.patchValue({
      facilityId: 1,
      mrn: 'mrn'
    });
    expect(component.sf).toBeTruthy();
    expect(component.formSearchPatient.valid).toBeTrue();
  });

  it('should check add workitem form is valid when all values are entered', () => {
    component.advAddformAdvocacy.patchValue(addFormData);
    expect(component.f).toBeTruthy();
    expect(component.advAddformAdvocacy .valid).toBeTrue();
  });

  it('should submit form when all values are set and no attachments', () => {
    component.advAddformAdvocacy.patchValue(addFormData);

    const spy = spyOn(patientService, 'createAdvocacy').and.returnValue(of({}));
    spyOn(FormData.prototype, "append");
    spyOn(component, 'showSuccess').and.callFake(()=>"created successfully");

    component.onSubmit();
    expect(component.submitted).toBeFalse();
    expect(component.showSearchForm).toBeTrue();
    expect(spy).toHaveBeenCalled();
  });

  it('should submit form when all values are set and has attachments', () => {
    component.advAddformAdvocacy.patchValue(addFormData);

    spyOn(FormData.prototype, "append");

    spyOn(component, 'showSuccess').and.callFake(()=>"created successfully");
    const spy = spyOn(patientService, 'createAdvocacy').and.returnValue(of({}));
    component.fileAttachmentData.selectedFiles = [{"fakeData": "fakeData"}];
    spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));

    component.onSubmit();
    expect(component.submitted).toBeFalse();
    expect(component.showSearchForm).toBeTrue();
    expect(spy).toHaveBeenCalled();
  });

  it('[addAdvocacy] should set form data with mrn and facility details',async(() => {
   const patient= {advocacyNeeded: "Y",
    advocacyNotes: "",
    drugCode: "J0135",
    drugId: 2,
    facilityId: 1,
    facilityName: "Facility 1",
    patientId: 3,
    patientMrn: "mrn",
    statusName: "New",
    workItemDrugCodeId: 15,
    workItemId: 22};

    component.addAdvocacy(patient);
    const fac= component.advAddformAdvocacy.controls['facilityName'].value;
    const patientMrn= component.advAddformAdvocacy.controls['patientMrn'].value;
    expect(fac).toEqual(patient.facilityName);
    expect(patientMrn).toEqual(patient.patientMrn);
    }));

    it('[onSubmit] should return false when add form is invalid',async(() => {
      spyOn(component, 'showInfo').and.callFake(()=>"Please correct the errors before you proceed");
      const val = component.onSubmit();
      expect(val).toBeFalse();
      }));

    it('[onCancel] should cancel the add form and go back to the main page', async(() => {
      component.onCancel();
      expect(component.showForm ).toBeFalse();
      expect(component.showSearchForm ).toBeTrue();
    }));

    it('[onClear] should clear form data', async(() => {
      component.onClear();
      expect(component.submitted).toBeFalse();
    }));

    it('[getFacilityList] should get facility list', async(() => {
      spyOn(advocacyService, 'getFacilityList').and.returnValue(of({}));
      component.getFacilityList();
      expect(component.facilities).not.toBeNull();
      expect(advocacyService.getFacilityList).toHaveBeenCalled();
    }));

    it('[getFacilityList] should throw error', async(() => {
      let err="error"
      const spy =spyOn(advocacyService, 'getFacilityList').and.returnValue(throwError(err));
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
      let err="error"
      const spy =spyOn(advocacyService, 'getAllAdvocacyStatus').and.returnValue(throwError(err));
      component.getAdvocacyStatuses();
      expect(spy).toHaveBeenCalled();
    }));

    it('[getAdvocacyTypes] should get advocacy type list', async(() => {
      spyOn(advocacyService, 'getAllAdvocacyTypes').and.returnValue(of({}));
      component.getAdvocacyTypes();
      expect(component.advocacyTypes).not.toBeNull();
      expect(advocacyService.getAllAdvocacyTypes).toHaveBeenCalled();
    }));

    it('[getAdvocacyTypes] should throw error', async(() => {
      let err="error"
      const spy =spyOn(advocacyService, 'getAllAdvocacyTypes').and.returnValue(throwError(err));
      component.getAdvocacyTypes();
      expect(spy).toHaveBeenCalled();
    }));

    it('[loadAdvDetails] should call updateTable', fakeAsync(() => {
      component.formSearchPatient.controls['facilityId'].patchValue(1);
      component.formSearchPatient.controls['mrn'].patchValue("1");
      
      const spy = spyOn(component, 'updateTable').and.stub();
      component.loadAdvDetails({rows: 5, first: 0});

      let params = {
        facilityId: 1,
        mrn: "1",
        advocacyNeeded: "Y",
        pageSize: 5,
        pageNum: 0
      };
      expect(spy).toHaveBeenCalledWith(params);

    }));

    it('[loadICDDetails] should lazy fetch the icd data', fakeAsync(() => {
      let event:LazyLoadEvent ={
        first: 0,
        rows: 1
      };

      const result = [{"active":true,"createdDate":"2021-02-01T17:36:50.927+0000","createdBy":1,"modifiedDate":"2021-02-01T17:36:50.927+0000","modifiedBy":1,"icdId":14007,"icdCode":"J01.0","description":"Acute maxillary sinusitis"},{"active":true,"createdDate":"2021-02-01T17:36:50.927+0000","createdBy":1,"modifiedDate":"2021-02-01T17:36:50.927+0000","modifiedBy":1,"icdId":14008,"icdCode":"J01.00","description":"Acute maxillary sinusitis, unspecified"},{"active":true,"createdDate":"2021-02-01T17:36:50.927+0000","createdBy":1,"modifiedDate":"2021-02-01T17:36:50.927+0000","modifiedBy":1,"icdId":14009,"icdCode":"J01.01","description":"Acute recurrent maxillary sinusitis"}];
      component.icdDatasource  = [result];
      component.loadICDDetails(event);
      tick(500);
      expect(component.icdloading).toBeFalse();
      expect(component.icdSearchResult).not.toBeNull();
    }));

    it('[onSearch] should call update table', async(() => {
      component.formSearchPatient.patchValue({
        facilityId: 1,
        mrn: 'mrn88'
      });
      const spy = spyOn(component, 'updateTable').and.stub();
      component.onSearch();
      expect(spy).toHaveBeenCalled();
      expect(component.searched).toBeTrue();
      expect(component.showError).toBeFalse();
    }));

    it('[updateTable] should get drug codes with advocacy needed', async(() => {
      const params = {
        facilityId:1,
        mrn: 'mrn123',
        advocacyNeeded: 'Y',
        pageSize: 5,
        pageNum: 0
      };
      const result = {
        "content": [{"workItemDrugCodeId":28,"workItemId":8,"advocacyNeeded":"Y","advocacyNotes":"","drugId":9,"drugCode":"J2271","patientId":4,"patientMrn":"mrn8888","facilityId":1,"facilityName":"Facility 1","statusName":"New"}],
        "totalElements": 1
      };

      const spy = spyOn(patientService, 'searchPatientByAny').and.returnValue(of(result));

      component.updateTable(params);
      expect(spy).toHaveBeenCalled();

      expect(component.searchResult).toBe(result["content"]);
      expect(component.totalSearchRecords).toBe(result["totalElements"]);
      expect(component.showGrid).toBeTrue();
      expect(component.resultGridloading).toBeFalse();
    }));
    
    it('[updateTable] empty result', async(() => {
      const params = {
        facilityId:1,
        mrn: 'mrn123',
        advocacyNeeded: 'Y',
        pageSize: 5,
        pageNum: 0
      };
      const result = {
        "content": [],
        "totalElements": 0
      };

      const spy = spyOn(patientService, 'searchPatientByAny').and.returnValue(of(result));

      component.updateTable(params);
      expect(spy).toHaveBeenCalled();

      expect(component.totalSearchRecords).toBe(0);
      expect(component.showError).toBeTrue();
      expect(component.showGrid).toBeFalse();
    }));
    
    it('[updateTable] error', async(() => {
      const params = {
        facilityId:1,
        mrn: 'mrn123',
        advocacyNeeded: 'Y',
        pageSize: 5,
        pageNum: 0
      };

      const spy = spyOn(patientService, 'searchPatientByAny').and.throwError("error");

      try {
        component.updateTable(params);
        expect(spy).toHaveBeenCalled();
        expect(spy).toThrowError();
  
        expect(component.showError).toBeTrue();
        expect(component.showGrid).toBeFalse();
      } catch(err) {
        expect(false);
      }
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

});
