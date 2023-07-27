import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { CommonService } from 'src/app/common/services/http/common.service';
import { PatientService } from 'src/app/common/services/http/patient.service';

import { EditAdvocacyComponent } from './edit-advocacy.component';
import {FileAttachmentService} from 'src/app/common/services/http/file-attachment.service';

describe('EditAdvocacyComponent', () => {
  let component: EditAdvocacyComponent;
  let fixture: ComponentFixture<EditAdvocacyComponent>;
  let advocacyService: AdvocacyService;
  let patientService: PatientService;
  let commonService: CommonService;
  let fileAttachmentService: FileAttachmentService;
  let toastr: ToastrService;
  let mockRouter: any;
  let router: Router


  const activatedRouteMock = {
    queryParams: of({
      advocacyId: '123'
    }),
  };


  const addFormData = {
    patientMrn: 'mrn',
    facilityName: "Facility 1",
    advocacyId: 27,
    drugId: 9,
    drugCode: 9,
    advocacyStatusId: 3,
    advocacyTypeId: 4,
    advocacySource: "advsource",
    diagnosisCode: 14449,
    workItemId: 8,
    maxAmountAvail: 1000,
    startDate: { year: 2021, month: 2, day: 2 },
    endDate: { year: 2021, month: 2, day: 12 },
    icdId: 8024,
    lookBack: "Test",
    lookBackStartDate: { year: 2021, month: 1, day: 2 },
    createdDate: { year: 2021, month: 2, day: 2 },
    createdBy: 1,
    modifiedBy: 1,
    modifiedDate: { year: 2021, month: 2, day: 2 },
    notes: "Test",
    patientId: 3
  }
  const blob = new Blob([""], { type: "image/png" });
  blob["lastModifiedDate"] = "";
  blob["name"] = 'filename';
  const blob2 = new Blob([""], { type: "text/text" });
  blob2["lastModifiedDate"] = "";
  blob2["name"] = 'filename2';
  const selectedFileObj = [{'file':blob},{'file':blob2}];
  const deletedFileObj = [{'file':blob}];

  beforeEach(async(() => {
    mockRouter = { navigate: jasmine.createSpy('navigate') };
    TestBed.configureTestingModule({
      declarations: [EditAdvocacyComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule, NgSelectModule, TableModule,
        ToastrModule.forRoot(), BrowserAnimationsModule, NgbModule],
      providers: [AdvocacyService, PatientService, CommonService, ToastrService,
        {
          provide: Router, useValue: mockRouter
        },
        {
          provide: ActivatedRoute, useValue: activatedRouteMock
        },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAdvocacyComponent);
    component = fixture.componentInstance;
    advocacyService = TestBed.inject(AdvocacyService);
    patientService = TestBed.inject(PatientService);
    commonService = TestBed.inject(CommonService);
    fileAttachmentService = TestBed.inject(FileAttachmentService);
    toastr = TestBed.inject(ToastrService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[getAdvocacyById] should load all the adv data', () => {
    const advData = { active: true, createdDate: "2021-03-02T16:54:37.468+0000", createdBy: 1, modifiedDate: "2021-03-08T09:32:33.782+0000", modifiedBy: 1, advocacyId: 10, patientId: 3, workItemId: 22, advocacyStatusId: 10, advocacyTypeId: 1, advocacySource: "advsource", icdId: 1301, drugId: 2, startDate: "2021-03-01T08:00:00.000+0000", endDate: "2021-03-02T08:00:00.000+0000", maxAmountAvail: 1234567890.12, lookBack: "", lookBackStartDate: "2021-03-01T08:00:00.000+0000", notes: "Test22", attachments: [{ active: false, createdDate: "2021-03-05T17:01:22.850+0000", createdBy: 1, modifiedDate: "2021-03-08T09:22:21.712+0000", modifiedBy: 1, advocacyAttachmentId: 5, advocacyId: 10, attachmentPath: "contacts.PNG" }, { active: false, createdDate: "2021-03-08T09:23:11.285+0000", createdBy: 1, modifiedDate: "2021-03-08T09:23:20.667+0000", modifiedBy: 1, advocacyAttachmentId: 23, advocacyId: 10, attachmentPath: "contacts-grid.PNG" }, { active: false, createdDate: "2021-03-08T09:22:13.446+0000", createdBy: 1, modifiedDate: "2021-03-08T09:23:51.773+0000", modifiedBy: 1, advocacyAttachmentId: 22, advocacyId: 10, attachmentPath: "logo.png" }, { active: true, createdDate: "2021-03-08T09:26:28.310+0000", createdBy: 1, modifiedDate: "2021-03-08T09:26:28.310+0000", modifiedBy: 1, advocacyAttachmentId: 26, advocacyId: 10, attachmentPath: "chart1.jpg" }, { active: false, createdDate: "2021-03-08T09:26:28.292+0000", createdBy: 1, modifiedDate: "2021-03-08T09:26:57.773+0000", modifiedBy: 1, advocacyAttachmentId: 25, advocacyId: 10, attachmentPath: "contacts2.PNG" }, { active: false, createdDate: "2021-03-08T09:26:28.273+0000", createdBy: 1, modifiedDate: "2021-03-08T09:29:21.486+0000", modifiedBy: 1, advocacyAttachmentId: 24, advocacyId: 10, attachmentPath: "chart1.jpg" }], drugProcCode: "J0135", facilityName: "Facility 1", facilityNPI: "1234567890", advocacyTypeName: "Commercial Copay", advocacyStatusName: "Clinic Declined", facilityId: 1, icdCode: "C00.4", patientMrn: "mrn", facilityEin: "1234567890", drugLongDesc: "Adalimumab injection", drugShortDesc: "Adalimumab injection", icdDescription: "Malignant neoplasm of lower lip, inner aspect" };
    const advid = 10;
    spyOn(patientService, 'getAdvocacyById').and.returnValue(of(advData));
    component.getAdvocacyById(advid);
    expect(component.advocacyInfo).toEqual(advData);
    expect(component.f).toBeTruthy();
    expect(component.advocacySources).toBeNull();
  });

  it('[loadICDDetails] should lazy fetch the icd data', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    };

    const result = [{ "active": true, "createdDate": "2021-02-01T17:36:50.927+0000", "createdBy": 1, "modifiedDate": "2021-02-01T17:36:50.927+0000", "modifiedBy": 1, "icdId": 14007, "icdCode": "J01.0", "description": "Acute maxillary sinusitis" }, { "active": true, "createdDate": "2021-02-01T17:36:50.927+0000", "createdBy": 1, "modifiedDate": "2021-02-01T17:36:50.927+0000", "modifiedBy": 1, "icdId": 14008, "icdCode": "J01.00", "description": "Acute maxillary sinusitis, unspecified" }, { "active": true, "createdDate": "2021-02-01T17:36:50.927+0000", "createdBy": 1, "modifiedDate": "2021-02-01T17:36:50.927+0000", "modifiedBy": 1, "icdId": 14009, "icdCode": "J01.01", "description": "Acute recurrent maxillary sinusitis" }];
    component.icdDatasource = [result];
    component.loadICDDetails(event);
    tick(500);
    expect(component.icdloading).toBeFalse();
    expect(component.icdSearchResult).not.toBeNull();
  }));

  it('[onClear] should clear form data', () => {

    component.formAdvocacy = new FormGroup({
      diagnosisCode: new FormControl(''),
      advocacyStatusId: new FormControl(''),
      advocacyTypeId: new FormControl(''),
      advocacySource: new FormControl(''),
      maxAmountAvail: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      lookBack: new FormControl(''),
      lookBackStartDate: new FormControl(''),
      notes: new FormControl('')
    });
    component.onClear();
    component.submitted = false;
    expect(component.submitted).toBe(false);
    expect(component.formAdvocacy.pristine).toBeTrue();
  });

  it('[getAdvocacyStatuses] should get advocacy status list', async(() => {
    spyOn(advocacyService, 'getAllAdvocacyStatus').and.returnValue(of({}));
    component.getAdvocacyStatuses();
    expect(component.advocacyStatuses).not.toBeNull();
    expect(advocacyService.getAllAdvocacyStatus).toHaveBeenCalled();
  }));

  it('[getAdvocacyStatuses] should get advocacy status throw error', async(() => {
    let err = "error"
    const spy = spyOn(advocacyService, 'getAllAdvocacyStatus').and.returnValue(throwError(err));
    component.getAdvocacyStatuses();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getAdvocacyTypes] should get advocacy types', async(() => {
    spyOn(advocacyService, 'getAllAdvocacyTypes').and.returnValue(of({}));
    component.getAdvocacyTypes();
    expect(component.advocacyTypes).not.toBeNull();
    expect(advocacyService.getAllAdvocacyTypes).toHaveBeenCalled();
  }));

  it('[getAdvocacyTypes] should get advocacy types throw error', async(() => {
    let err = "error"
    const spy = spyOn(advocacyService, 'getAllAdvocacyTypes').and.returnValue(throwError(err));
    component.getAdvocacyTypes();
    expect(spy).toHaveBeenCalled();
  }));

  it('should return attachment updated', async(() => {
    component.isAttachmentUpdated();
    expect(component.isListChangedEditAdv).toBeFalse();
  }));

  // it('should submit form when all values are set and no attachments', () => {
  //   component.formAdvocacy = new FormGroup({
  //     diagnosisCode: new FormControl(''),
  //     advocacyStatusId: new FormControl(''),
  //     advocacyTypeId: new FormControl(''),
  //     advocacySource: new FormControl(''),
  //     maxAmountAvail: new FormControl(''),
  //     startDate: new FormControl(''),
  //     endDate: new FormControl(''),
  //     lookBack: new FormControl(''),
  //     lookBackStartDate: new FormControl(''),
  //     notes: new FormControl('')
  //   });
  //   component.fileAttachmentData.filesList = [];
  //   component.fileAttachmentData.selectedFiles = [];
  //   component.fileAttachmentData.deletedFilesList = [{"fakeData": "fakeData"}];
  //   component.submitted = true;
  //   spyOn(component, 'showSuccess').and.callFake(() => "created successfully");
  //   const spy = spyOn(patientService, 'updateAdvocacy').and.returnValue(of([]));
  //   spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));
  //   spyOn(fileAttachmentService, 'deleteAttachments').and.returnValue(of({}));

  //   component.onSubmit();
  //   expect(component.submitted).toBeFalse();
  //   expect(spy).toHaveBeenCalled();
  // });

  //Sukirtha's test cases start here

  // it('[onSubmit] error postAttachment', () => {
  //     component.formAdvocacy = new FormGroup({
  //       diagnosisCode: new FormControl(''),
  //       advocacyStatusId: new FormControl(''),
  //       advocacyTypeId: new FormControl(''),
  //       advocacySource: new FormControl(''),
  //       maxAmountAvail: new FormControl(''),
  //       startDate: new FormControl(''),
  //       endDate: new FormControl(''),
  //       lookBack: new FormControl(''),
  //       lookBackStartDate: new FormControl(''),
  //       notes: new FormControl('')
  //     });
  //     component.submitted = true;
  //     spyOn(component, 'showSuccess').and.callFake(() => "created successfully");
  //     const spy = spyOn(patientService, 'updateAdvocacy').and.returnValue(of([]));
  //     let err = "error";
  //     spyOn(fileAttachmentService, 'postAttachments').and.returnValue(throwError(err)) ;
  //     component.onSubmit();
  //     expect(component.submitted).toBeFalse();
  //     expect(spy).toHaveBeenCalled();
  //   });

    it('[onSubmit] form valid', () => {
      component.formAdvocacy = new FormGroup({
        invalid: new FormControl('false')
      });
      const spy = spyOn(patientService, 'updateAdvocacy').and.returnValue(of([]));
      component.onSubmit();
      expect(component.submitted).toBeFalse();
      expect(spy).toHaveBeenCalled();
    });


  it('[onSubmit] form invalid', () => {
    component.formAdvocacy = new FormGroup({
      diagnosisCode: new FormControl('')
    });
    component.formAdvocacy.setErrors({ 'invalid': true });
    expect(component.onSubmit()).toEqual(false);
    component.formAdvocacy.setErrors(null);
   });
  //Sukirtha's test cases end here

  it('should call comparison validator', async(() => {
    component.formAdvocacy = new FormGroup({
      diagnosisCode: new FormControl(''),
      advocacyStatusId: new FormControl(''),
      advocacyTypeId: new FormControl(''),
      advocacySource: new FormControl(''),
      maxAmountAvail: new FormControl(''),
      startDate: new FormControl('10/28/2021'),
      endDate: new FormControl('11/28/2021'),
      lookBack: new FormControl(''),
      lookBackStartDate: new FormControl(''),
      notes: new FormControl('')
    });
    component.comparisonValidator(component.formAdvocacy);
    expect(component.formAdvocacy.get('startDate').value).toBe('10/28/2021');
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

  it('should return on cancel', async(() => {
    component.onCancel();
    expect(component.submitted).toBeFalse();
    expect(component.onCancel).toBeTruthy();
  }));
});
