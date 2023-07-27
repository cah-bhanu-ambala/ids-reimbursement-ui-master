import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbDatepickerModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { LazyLoadEvent, SharedModule } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { of, throwError } from 'rxjs';
import { AppointmentMaintenanceComponent } from './appointment-maintenance.component';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { CustomerService } from 'src/app/common/services/http/customer.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import {FileAttachmentService} from "../../../common/services/http/file-attachment.service";
import { UserService } from 'src/app/common/services/http/user.service';

describe('AppointmentMaintenance', () => {
  let component: AppointmentMaintenanceComponent;
  let fixture: ComponentFixture<AppointmentMaintenanceComponent>;
  let toastr: ToastrService;
  let advocacyService: AdvocacyService;
  let customerService: CustomerService;
  let patientService: PatientService;
  let userService: UserService;
  let fileAttachmentService: FileAttachmentService;
  let router: Router;

  const userdata=[
    {
      "active": true,
      "createdDate": "2021-02-01T17:36:49.437+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:36:49.437+0000",
      "modifiedBy": 1,
      "userId": 1,
      "userName": "admin",
      "userEmail": "admin@infodatinc.com",
      "teamLeadId": 1,
      "userRoleId": 4,
      "delegateUserId": 0,
      "facilityId": 0,
      "userRoleName": "External User",
      "systemId": 1
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:57:56.509+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:57:56.509+0000",
      "modifiedBy": null,
      "userId": 2,
      "userName": "Team Leader",
      "userEmail": "tl@abc.com",
      "teamLeadId": 1,
      "userRoleId": 2,
      "delegateUserId": 0,
      "facilityId": 0,
      "userRoleName": "Team Lead",
      "systemId": 1
    }
  ];

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
    billingLevelName: "PHARM L1",
    systemId: 1
  }
    ;
  const blob = new Blob([""], { type: "image/png" });
  blob["lastModifiedDate"] = "";
  blob["name"] = 'filename';

  const blob2 = new Blob([""], { type: "text/text" });
  blob2["lastModifiedDate"] = "";
  blob2["name"] = 'filename2';
  const selectedFileObj = [{'file':blob},{'file':blob2}];
  const deletedFileObj = [{'file':blob}];

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

  const masterAdvocacy =
  {
    "active": "true",
    "createdDate": "2021-09-23T13:17:38.171+00:00",
    "createdBy": 17,
    "modifiedDate": "2021-09-23T13:20:37.613+00:00",
    "modifiedBy": 17,
    "advocacyId": 21,
    "patientId": 5,
    "workItemId": 37,
    "advocacyStatusId": 9,
    "advocacyTypeId": 3,
    "advocacySource": "",
    "icdId": 95803,
    "drugId": 42,
    "startDate": null,
    "endDate": null,
    "maxAmountAvail": 0.0, "lookBack": "", "lookBackStartDate": null, "notes": "", "attachments": [], "drugAdvocacyId": 5
  }


  const appointmentTypes = [];

  appointmentTypes.push(
    {
      "active": true,
      "appointmentTypeId": 1,
      "appointmentTypeName": "Commercial Copay - Pharmacy",
    },
    {
      "active": true,
      "appointmentTypeId": 2,
      "appointmentTypeName": "Commercial Copay - VOB",
    },
    {
      "active": true,
      "appointmentTypeId": 3,
      "appointmentTypeName": "Free Medication - After Infusion",
    },
    {
      "active": true,
      "appointmentTypeId": 4,
      "appointmentTypeName": "Free Medication - Before Infusion",
    },
    {
      "active": true,
      "appointmentTypeId": 5,
      "appointmentTypeName": "Grant - VOB",
    },
    {
      "active": true,
      "appointmentTypeId": 6,
      "appointmentTypeName": "Grant - Pharmacy",
    },
    {
      "active": true,
      "appointmentTypeId": 7,
      "appointmentTypeName": "MCD Monitoring - Pharmacy",
    },
    {
      "active": true,
      "appointmentTypeId": 8,
      "appointmentTypeName": "MCD Monitoring - VOB",
    },
    {
      "active": true,
      "appointmentTypeId": 9,
      "appointmentTypeName": "Premium Assist",
    }
  )

  const appointment = {"active":true,"createdDate":"2021-08-30T15:41:12.232+00:00","createdBy":17,"modifiedDate":"2021-08-30T15:41:37.243+00:00","modifiedBy":17,"appointmentId":47,"patientId":5,"advocacyId":16,"appointmentStatusId":7,"appointmentTypeId":2,"scheduledAppointmentDate":"2021-08-30T05:00:00.000+00:00","dateInfused":"2021-08-30T05:00:00.000+00:00","frequency":null,"dosage":null,"prescriptionNumber":null,"copayCovered":905.0,"copayRemaining":50.0,"eobSubmittedToIns":"","eobSubmittedToInsDate":"2021-08-30T05:00:00.000+00:00","eobReceivedFromIns":"","eobReceivedFromInsDate":"2021-08-30T05:00:00.000+00:00","indicatedCopay":0.0,"eobSubmittedToCopay":"","eobSubmittedToCopayDate":"2021-08-30T05:00:00.000+00:00","amountReceivedFromCopay":0.0,"freeMedicationOrdered":"2021-08-30T05:00:00.000+00:00","dateAdvocacyReceived":"2021-08-30T05:00:00.000+00:00","unitsUsedAtInfusion":0.0,"pricePerUnitInfusion":0.0,"totalCostOfMedicationInfused":0.0,"replacementOrdered":"2021-08-30T05:00:00.000+00:00","replacementReceived":"2021-08-30T05:00:00.000+00:00","eobSubmittedToGrant":"","eobSubmittedToGrantDate":"2021-08-30T05:00:00.000+00:00","amountReceivedFromGrant":0.0,"patientNotified":"","patientNotifiedDate":"2021-08-30T05:00:00.000+00:00","notes":null,"externalCustomerRequestedToDelete":"N","rejectedReasonNotes":"","followUpDate":"2021-09-12T04:00:00.000+00:00","attachments":[{"attachmentId": 1, "name": "test1", active: true}],"facilityEin":"456987458","patientMrn":"000001","facilityName":"eRecovery Memorial Healthcare","facilityNPI":"2589632589","wbsId":0,"appointmentStatusName":"Rec from Advocacy","appointmentTypeName":"Commercial Copay - Pharmacy","createdByName":"admin","modifiedByName":"admin"}

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentMaintenanceComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        NgbModule,
        NgbDatepickerModule,
        SharedModule,
        TableModule,
        TooltipModule,
        NgSelectModule,
        TableModule
      ],
      providers: [AdvocacyService, CustomerService, PatientService, ToastrService,
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy("navigate");
          }
        },
        {
          provide: ChangeDetectorRef, useValue: {}
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue("superuser");
    fixture = TestBed.createComponent(AppointmentMaintenanceComponent);
    component = fixture.componentInstance;
    advocacyService = TestBed.inject(AdvocacyService);
    customerService = TestBed.inject(CustomerService);
    patientService = TestBed.inject(PatientService);
    userService = TestBed.inject(UserService);
    fileAttachmentService = TestBed.inject(FileAttachmentService);
    toastr = TestBed.inject(ToastrService);
    component.ngOnInit();
    fixture.detectChanges();
  });


  it('should have a defined component', () => {
    expect(component).toBeDefined();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should check form is valid when all values are entered', () => {
  //   const form = {
  //     appointmentTypeId: '',
  //     scheduledAppointmentDate: [null],
  //     dateInfused: [null],
  //     frequency: [''],
  //     dosage: [''],
  //     appointmentStatusId: [''],
  //     unitsUsedAtInfusion: [''],
  //     pricePerUnitInfusion: [''],
  //     totalCostOfMedicationInfused: [{ value: 0, disabled: true }],
  //     freeMedicationOrdered: [null],
  //     dateAdvocacyReceived: [null],
  //     prescriptionNumber: [''],
  //     copayCovered: [''],
  //     copayRemaining: [''],
  //     notes: [''],
  //     indicatedCopay: [''],
  //     replacementOrdered: [null],
  //     eobSubmittedToIns: [''],
  //     eobSubmittedToInsDate: '',
  //     eobReceivedFromIns: [''],
  //     eobReceivedFromInsDate: '',
  //     eobSubmittedToCopay: [''],
  //     eobSubmittedToCopayDate: '',
  //     amountReceivedFromGrant: [''],
  //     amountReceivedFromCopay: [''],
  //     replacementReceived: [null],
  //     eobSubmittedToGrant: [''],
  //     eobSubmittedToGrantDate: '',
  //     patientNotifiedDate: '',
  //     patientNotified: [''],
  //     attachment1: [''],
  //     attachment2: [''],
  //     attachment3: [''],
  //     attachment4: [''],
  //     followUpDate: [null]

  //   };
  //   component.maintainFormAppointment.patchValue(form);
  //   expect(component.f).toBeTruthy();
  //   expect(component.maintainFormAppointment.valid).toBeTrue();
  // });


  // it('should check form is valid when all values are empty', () => {
  //   const form = {
  //     appointmentTypeId: '',
  //     scheduledAppointmentDate: [null],
  //     dateInfused: [null],
  //     frequency: [''],
  //     dosage: [''],
  //     appointmentStatusId: [''],
  //     unitsUsedAtInfusion: [''],
  //     pricePerUnitInfusion: [''],
  //     totalCostOfMedicationInfused: [{ value: 0, disabled: true }],
  //     freeMedicationOrdered: [null],
  //     dateAdvocacyReceived: [null],
  //     prescriptionNumber: [''],
  //     copayCovered: [''],
  //     copayRemaining: [''],
  //     notes: [''],
  //     indicatedCopay: [''],
  //     replacementOrdered: [null],
  //     eobSubmittedToIns: ['Y'],
  //     eobSubmittedToInsDate:[null] ,
  //     eobReceivedFromIns: ['Y'],
  //     eobReceivedFromInsDate: '',
  //     eobSubmittedToCopay: ['Y'],
  //     eobSubmittedToCopayDate: '',
  //     amountReceivedFromGrant: [''],
  //     amountReceivedFromCopay: [''],
  //     replacementReceived: [null],
  //     eobSubmittedToGrant: ['Y'],
  //     eobSubmittedToGrantDate: '',
  //     patientNotifiedDate: '',
  //     patientNotified: ['Y'],
  //     attachment1: [''],
  //     attachment2: [''],
  //     attachment3: [''],
  //     attachment4: [''],
  //     followUpDate: [null]

  //   };
  //   component.maintainFormAppointment.patchValue(form);
  //   expect(component.f).toBeTruthy();
  //   expect(component.maintainFormAppointment.valid).toBeTrue();
  // });


  // it('should get facility list', async(() => {
  //   spyOn(advocacyService, 'getFacilityList').and.returnValue(of([facilityData]));
  //   component.getFacilityList();
  //   expect(component.facilities).toEqual([facilityData]);
  //   expect(advocacyService.getFacilityList).toHaveBeenCalled();
  // }));

  it('should get advocacy types', async(() => {
    spyOn(advocacyService, 'getAllAdvocacyTypes').and.returnValue(of({}));
    component.getAdvocacyTypes();
    expect(component.facilities).not.toBeNull();
    expect(advocacyService.getAllAdvocacyTypes).toHaveBeenCalled();
  }));

   it('should get Appointment types list', async(() => {
    spyOn(advocacyService, 'getAllAppointmentTypes').and.returnValue(of(appointmentTypes));
    component.getAppointmentTypes();
    expect(component.appointemntTypes).not.toBeNull();
    expect(advocacyService.getAllAppointmentTypes).toHaveBeenCalled();
  }));

  it('should get Appointment types list throws error', async(() => {
    let err = "error"
    const spy = spyOn(advocacyService, 'getAllAppointmentTypes').and.returnValue(of(err));
    component.getAppointmentTypes();
    expect(spy).toHaveBeenCalled();
  }));

  it('should get appointment list', async(() => {
    spyOn(advocacyService, 'getAllAppointmentStatus').and.returnValue(of({}));
    component.getAppoitmentStatusList();
    expect(component.appointmentStatusList).not.toBeNull();
    expect(advocacyService.getAllAppointmentStatus).toHaveBeenCalled();
  }));

  it('should get appointment list list throws error', async(() => {
    let err = "error"
    const spy = spyOn(advocacyService, 'getAllAppointmentStatus').and.returnValue(of(err));
    component.getAppoitmentStatusList();
    expect(spy).toHaveBeenCalled();
  }));


  it('should clear the form', async(() => {
    component.onResetSF();
    expect(component.showGrid).toBeFalse();
    expect(component.maintainFormAppointment.pristine).toBeTrue();
  }));

  it('should reset form fields', async(() => {
    component.resetAllFields();
    expect(component.formAdvocacy.pristine).toBeTrue();
  }));

  it('should return search form', async(() => {
    component.formSearch = new FormGroup({});
    expect(component.sf).not.toBeNull();
  }))

  it('should not return search form', async(() => {
    component.formSearch = null;
    expect(component.sf).toBeNull();
  }))

  it('should return appointment form', async(() => {
    component.maintainFormAppointment = new FormGroup({});
    expect(component.f).not.toBeNull();
  }))

  it('should not return appointment form', async(() => {
    component.maintainFormAppointment = null;
    expect(component.f).toBeNull();
  }))


  it('should list of appointments ', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    }
    component.appointmentDatasource = [];
    component.loadAppointmentDetails(event);
    tick(500);
    expect(component.appointmentGridloading).toBeFalse();
    expect(component.loadAppointmentDetails).not.toBeNull();
  }));

  it('should return Eob Submited Date val', async(() => {
    const val = 'Y';
    expect(component.onEobSubmited(val)).not.toBeNull();
    expect(component.showEobSubmitedDate).toBeTrue();
  }));

  it('should return  Eob Submited Date val', async(() => {
    const val = 'N';
    expect(component.onEobSubmited(val)).not.toBeNull();
    expect(component.showEobSubmitedDate).toBeFalse();
  }));

  it('should return Eob Received Date  val', async(() => {
    const val = 'Y';
    expect(component.onEobReceived(val)).not.toBeNull();
    expect(component.showEobReceivedDate).toBeTrue();
  }));

  it('should return  Eob Received Date  val', async(() => {
    const val = 'N';
    expect(component.onEobReceived(val)).not.toBeNull();
    expect(component.showEobReceivedDate).toBeFalse();
  }));

  it('should return Eob Submitted To Grant Date   val', async(() => {
    const val = 'Y';
    expect(component.onEobSubmittedToGrantDate(val)).not.toBeNull();
    expect(component.showEobSubmittedToGrantDate).toBeTrue();
  }));

  it('should return  Eob Submitted To Grant Date   val', async(() => {
    const val = 'N';
    expect(component.onEobSubmittedToGrantDate(val)).not.toBeNull();
    expect(component.showEobSubmittedToGrantDate).toBeFalse();
  }));

  it('should return patient Notified Date val', async(() => {
    const val = 'Y';
    expect(component.onPatientNotified(val)).not.toBeNull();
    expect(component.showPatientNotifiedDate).toBeTrue();
  }));

  it('should return  patient Notified Date val', async(() => {
    const val = 'N';
    expect(component.onPatientNotified(val)).not.toBeNull();
    expect(component.showPatientNotifiedDate).toBeFalse();
  }));

  it('should return  calculate Total Cost', async(() => {
    const form = {"totalCostOfMedicationInfused": 100}
    component.maintainFormAppointment.patchValue(form);
    expect(component.calculateTotalCost()).not.toBeNull();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));

  it('[onSearch] should search appointment when form is valid', async(() => {
    component.formSearch.patchValue({
      facilityId: 1,
      intFacilityId: 1,
      facilityName: 'facility1',
      mrn: 'mrn001'

    });

    const spy = spyOn(customerService, 'SearchForCustAdvocacies').and.returnValue(of(advocacies));
    spyOn(component, 'loadSearchResults').and.callThrough();

    component.onSearchAdv();
    expect(component.loadSearchResults).toHaveBeenCalledWith('mrn001', 1);
    expect(component.showGrid).toEqual(true);
    expect(component.showSearch).toEqual(true);
    expect(component.advocacyDatasource).toEqual(advocacies);
    expect(component.advocacyTotalRecords).toEqual(advocacies.length);
    expect(component.advocacyGridloading).toEqual(false);
    expect(component.showAdvocacyMasterDetails).toEqual(false);
    expect(spy).toHaveBeenCalled();
  }));

  it('should get aappointments by advocacy id', async(() => {
    const patientMrn = 'mrn001';
    const advocacyId = 1;

    const spy = spyOn(customerService, 'getAllAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(of(advocacies));
    component.getAppointmentByPatientId(patientMrn, advocacyId);
    expect(component.appointmentDatasource).toEqual(advocacies);
    expect(component.appointmentGridloading).toEqual(false);
    expect(component.appointmentTotalRecords).toEqual(advocacies.length);
    expect(component.showAppointmentGrid).toEqual(true);
    expect(component.showNoAppointsError).toEqual(false);
    expect(spy).toHaveBeenCalledWith(advocacyId);
  }));

  it('getAppointmentByPatientId - when the return list is empty', async(() => {
    const patientMrn = 'mrn001';
    const advocacyId = 1;

    const spy = spyOn(customerService, 'getAllAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(of([]));
    component.getAppointmentByPatientId(patientMrn, advocacyId);
    expect(component.appointmentDatasource.length).toEqual(0);
    expect(component.appointmentGridloading).toEqual(false);
    expect(component.appointmentTotalRecords).toEqual(0);
    expect(component.showAppointmentGrid).toEqual(true);
    expect(component.showNoAppointsError).toEqual(false);
    expect(spy).toHaveBeenCalledWith(advocacyId);
  }));

  it('getAppointmentByPatientId - when the return list is undefined', async(() => {
    const patientMrn = 'mrn001';
    const advocacyId = 1;

    const spy = spyOn(customerService, 'getAllAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(of(undefined));
    component.getAppointmentByPatientId(patientMrn, advocacyId);
    expect(component.appointmentDatasource).toBeUndefined();
    expect(component.appointmentGridloading).toBeUndefined();
    expect(component.appointmentTotalRecords).toBeUndefined();
    expect(component.showAppointmentGrid).toEqual(false);
    expect(component.showNoAppointsError).toEqual(true);
    expect(spy).toHaveBeenCalledWith(advocacyId);
  }));

  it('should get aappointments by advocacy id throw error', async(() => {
    const patientMrn = 'mrn001';
    const advocacyId = 1;
    let err = "error";
    const spy = spyOn(customerService, 'getAllAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(throwError(err));
    component.getAppointmentByPatientId(patientMrn, advocacyId);
    expect(spy).toHaveBeenCalled();
  }));
  it('[getAppointmentByPatientIdExcludeClosed] should get appointment list for external customer', async(() => {
      spyOn(customerService, 'getOpenAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(of([{}]));
      component.getAppointmentByPatientIdExcludeClosed('mrn',1);
      expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
      expect(customerService.getOpenAppointmentsByAdvocacyIdForExternalCustomer).toHaveBeenCalledWith(1);
      expect(component.appointmentDatasource.length).toEqual(1);
      expect(component.appointmentTotalRecords).toEqual(1);
      expect(component.showAppointmentGrid).toBeTrue();
      expect(component.showNoAppointsError).toBeFalse();
    }));

  it('[getAppointmentByPatientIdExcludeClosed] when the list returned is empty', async(() => {
    spyOn(customerService, 'getOpenAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(of([]));
    component.getAppointmentByPatientIdExcludeClosed('mrn',1);
    expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
    expect(customerService.getOpenAppointmentsByAdvocacyIdForExternalCustomer).toHaveBeenCalledWith(1);
    expect(component.appointmentDatasource.length).toEqual(0);
    expect(component.appointmentTotalRecords).toEqual(0);
    expect(component.showAppointmentGrid).toBeTrue();
    expect(component.showNoAppointsError).toBeFalse();
  }));

  it('[getAppointmentByPatientIdExcludeClosed] when the list returned is undefined', async(() => {
    spyOn(customerService, 'getOpenAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(of(undefined));
    component.getAppointmentByPatientIdExcludeClosed('mrn',1);
    expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
    expect(customerService.getOpenAppointmentsByAdvocacyIdForExternalCustomer).toHaveBeenCalledWith(1);

    expect(component.appointmentDatasource).toBeUndefined();
    expect(component.appointmentTotalRecords).toBeUndefined();
    expect(component.showAppointmentGrid).toBeFalse();
    expect(component.showNoAppointsError).toBeTrue();
  }));

     it('[onShowClosedChanged] should show closed changed', async(() => {
          let showClosedAppointments = true;
          component.onShowClosedChanged(showClosedAppointments);
          spyOn(customerService, 'getAllAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(of({}));
          component.getAppointmentByPatientId('mrn',1);
          expect(component.getAppointmentByPatientId).not.toBeNull();
          expect(customerService.getAllAppointmentsByAdvocacyIdForExternalCustomer).toHaveBeenCalled();

          showClosedAppointments = false;
          component.onShowClosedChanged(showClosedAppointments);
          spyOn(customerService, 'getOpenAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(of({}));
          component.getAppointmentByPatientIdExcludeClosed('mrn',1);
          expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
          expect(customerService.getOpenAppointmentsByAdvocacyIdForExternalCustomer).toHaveBeenCalled();


      }));
  it('getAppointmentByPatientIdExcludeClosed', async(() => {
      spyOn(customerService, 'getOpenAppointmentsByAdvocacyIdForExternalCustomer').and.returnValue(of([{}]));
      component.getAppointmentByPatientIdExcludeClosed('mrn',1);
      expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
      expect(customerService.getOpenAppointmentsByAdvocacyIdForExternalCustomer).toHaveBeenCalled();
  }));

  it('should toggle index', async(() => {
    let index = 1;
    expect(component.toggle(index)).not.toBeNull();
    expect(component.activeState).not.toBeNull();
  }));


  it('should add master advocacy', async(() => {
    component.onAdd(masterAdvocacy);
    expect(component.onAdd(masterAdvocacy)).not.toBeNull();
    expect(component.showGrid).toEqual(false);
    expect(component.showSearch ).toEqual(false);
    expect(component.showAdvocacyDetails ).toEqual(true);
    expect(component.showAdvocacyMasterDetails  ).toEqual(true);
  }));

  it('should edit appointment', async(() => {
    component.onEditAppointment(appointment);
    expect(component.onEditAppointment(masterAdvocacy)).not.toBeNull();
    expect(component.attachmentsLength ).not.toBeNull();
  }));
/*  it('should edit appointment dates not null', async(() => {
    component.onEditAppointment({"attachments":[{"attachmentId": 1, "name": "test1", active: true}]});
  })); */

  it('should reset  advocacy type', async(() => {
    component.onResetAdvocacyType();
    expect(component.showCommercialCopayVob).toEqual(false);
    expect(component.showCommercialCopayPharmacy).toEqual(false);
    expect(component.showFreeMedicationBeforeInfusion).toEqual(false);
    expect(component.showGrantPharmacyDisplay).toEqual(false);
    expect(component.showGrantVobDisplay).toEqual(false);
    expect(component.showMcdMonitorPharmacyDisplay).toEqual(false);
    expect(component.showMcdMonitorVobDIsplay).toEqual(false);
    expect(component.showPremiumAssistanceDisplay).toEqual(false);

  }));

  it('should clear appointment fields', async(() => {
    component.OnClearAppointmentFields();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));

  it('should clear appointment fields', async(() => {
    component.resetAppointmentForm();
    expect(component.maintainFormAppointment).not.toBeNull();
  }));

  it('should return to search', async(() => {
    component.returnToSearch();
    expect(component.showSearch).toEqual(true);
  }));

  it('[onSubmit] form invalid', async(() => {
    component.maintainFormAppointment.setErrors({ 'invalid': true });
    ;
    expect(component.onSubmit()).toEqual(false);
    component.maintainFormAppointment.setErrors(null);
  }));

  it('[onSubmit] should submit form appointment', async(() => {
    initializeComponentForOnSubmit();
    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(patientService, 'updateAppointment').and.returnValue(of({})) ;
    component.fileAttachmentData.selectedFiles = [{"fakeData": "fakeData"}];
    component.fileAttachmentData.deletedFilesList = [{"fakeData": "fakeData"}];
    spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));
    spyOn(fileAttachmentService, 'deleteAttachments').and.returnValue(of({}));

    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  }));

  function initializeComponentForOnSubmit() {
    component.maintainFormAppointment.patchValue({});
    component.submitted =true;
    component.appointmentId =1;
    component.isUpdate = true;
    component.userId=1;
  };

it('[onSubmit] not isUpdate', () => {
    initializeComponentForOnSubmit();
    component.isUpdate = false;
    const spy =spyOn(patientService, 'createAppointment').and.returnValue(of({'appointmentId':1})) ;
       component.onSubmit();

     expect(spy).toHaveBeenCalled();
  });
it('[onSubmit] not isUpdate No selected files', () => {
    initializeComponentForOnSubmit();
    component.isUpdate = false;
    const spy =spyOn(patientService, 'createAppointment').and.returnValue(of({'appointmentId':1})) ;
    component.onSubmit();
     expect(spy).toHaveBeenCalled();
  });

  it('[onSubmit] should submit form appointment throw error', fakeAsync(() => {
    component.maintainFormAppointment.patchValue({});
    component.submitted =true;
    component.appointmentId =1;
    component.isUpdate = true;
    component.userId=1;
    let err = "error";

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(patientService, 'updateAppointment').and.returnValue(throwError(err)) ;
    component.onSubmit();
    flush();
    expect(spy).toHaveBeenCalled();
  }));


  it('should delete appointment', fakeAsync(() => {
    const appointmentId=25;
    let spy= spyOn(customerService, 'deleteAppointmentByCust').and.returnValue(of([]));
    component.onDeleteAppointmentId(appointmentId);
    tick(500);
    flush();
    expect(spy).toHaveBeenCalled();
  }));


  it('should delete appointment throw error', fakeAsync(() => {
    const appointmentId=25;
    let err = "error";
    let spy= spyOn(customerService, 'deleteAppointmentByCust').and.returnValue(throwError(err));
    component.onDeleteAppointmentId(appointmentId);
    tick(500);
    flush();
    expect(spy).toHaveBeenCalled();
  }));

  it('should set Commercial CoPay Pharmacy Validators', async(() => {
    component.setCommercialCoPayPharmacyValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));

  it('should set Commercial CoPay Vob Validators', async(() => {
    component.setCommercialCoPayVobValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));


  it('should set Free Medication After Infusion Validators', async(() => {
    component.setFreeMedicationAfterInfusionValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));

  it('should set Free Medication Before Infusion Validators', async(() => {
    component.setFreeMedicationBeforeInfusionValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));

  it('should set Grant Pharmacy Validators', async(() => {
    component.setGrantVobValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));

  it('should set Grant Vob Validators', async(() => {
    component.setGrantVobValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));

  it('should set MCD Monitor Validators', async(() => {
    component.setMCDMonitorValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));

  it('should premium Assist Validators', async(() => {
    component.premiumAssistValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));

  it('should set MCD Monitor Vob Validators', async(() => {
    component.setMCDMonitorVobValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));


  it('should set Grant Pharmacy Validators', async(() => {
    component.setGrantPharmacyValidators();
    expect(component.maintainFormAppointment).not.toBeNull();

  }));


  it('should get Advocacy by Type Selected', async(() => {
    component.appointemntTypes = appointmentTypes;
    component.onAdvocacyTypeSelected(1);
    expect(component.showCommercialCopayPharmacy).toEqual(true);
    component.onAdvocacyTypeSelected(2);
    expect(component.showCommercialCopayVob).toEqual(true);
    component.onAdvocacyTypeSelected(3);
    expect(component.showFreeMedicationAfterInfusion).toEqual(true);
    component.onAdvocacyTypeSelected(4);
    expect(component.showFreeMedicationBeforeInfusion).toEqual(true);
    component.onAdvocacyTypeSelected(5);
    expect(component.showGrantVobDisplay).toEqual(true);
    component.onAdvocacyTypeSelected(6);
    expect(component.showGrantPharmacyDisplay).toEqual(true);
    component.onAdvocacyTypeSelected(7);
    expect(component.showMcdMonitorPharmacyDisplay).toEqual(true);
    component.onAdvocacyTypeSelected(8);
    expect(component.showMcdMonitorVobDIsplay).toEqual(true);
    component.onAdvocacyTypeSelected(9);
    expect(component.showPremiumAssistanceDisplay).toEqual(true);
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

    it('should load master advocacy details ', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    }
    component.advocacyDatasource = [masterAdvocacy];
    component.loadAdvocacyDetails(event);
    tick(500);
    flush();
    expect(component.advocacyGridloading).toBeFalse();
    expect(component.loadAdvocacyDetails).not.toBeNull();
  }));

      it('should load master advocacy details else ', fakeAsync(() => {
      let event: LazyLoadEvent = {
        first: 0,
        rows: 1
      }
      component.advocacyDatasource = [];
      component.loadAdvocacyDetails(event);
      tick(500);
      flush();
      /* expect(component.advocacyGridloading).toBeFalse();
      expect(component.loadAdvocacyDetails).not.toBeNull(); */
    }));

  it("should open attachment", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf"
    const mBlob = { size: 1024, type: "application/pdf" };
    const spy = spyOn(patientService, 'getAttachmentById').and.returnValue(of({}));
    component.openAdvAttachment(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });

  it("should open atachment throws error", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf";
    let err = "error"
    const mBlob = { size: 1024, type: "application/pdf" };
    const spy = spyOn(patientService, 'getAttachmentById').and.returnValue(throwError(err));
    component.openAdvAttachment(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });

  it('[onSearch] should search appointment when form is valid empty', async(() => {
    component.formSearch.patchValue({
      facilityId: 1,
      intFacilityId: 1,
      facilityName: 'facility1',
      mrn: 'mrn001'

    });
    spyOn(customerService, 'SearchForCustAdvocacies').and.returnValue(of([]));
    component.onSearchAdv();
    expect(component.showGrid).toEqual(false);
    expect(component.showError).toEqual(true);
  }));

  it('[onSearch] should search appointment when form is invalid', async(() => {
    component.formSearch.setErrors({ 'invalid': true });
    component.onSearchAdv();
    expect(component.searched).toEqual(true);
    component.formSearch.setErrors(null);

  }));

  it('should get users to assign', async(() => {
    let spy = spyOn(userService, 'getBySystemId').and.returnValue(of(userdata));
    component.getTeamMemberList();
    expect(spy).toHaveBeenCalled();
    expect(component.teamMembers.length).toBe(1);
  }))


});

