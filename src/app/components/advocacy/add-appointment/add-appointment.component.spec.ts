import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { SearchRevenueComponent } from '../../shared/search-revenue/search-revenue.component';
import { AddAppointmentComponent } from './add-appointment.component';
import {FileAttachmentService} from 'src/app/common/services/http/file-attachment.service';
import { UserService } from 'src/app/common/services/http/user.service';
import { userInfo } from 'os';
import { FacilityService } from 'src/app/common/services/http/facility.service';

describe('AddAppointment', () => {
  let component: AddAppointmentComponent;
  let fixture: ComponentFixture<AddAppointmentComponent>;
  let advocacyService: AdvocacyService;
  let patientService: PatientService;
  let userService: UserService;
  let facilityService: FacilityService;
  let fileAttachmentService: FileAttachmentService;
  let toastr: ToastrService;

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
  };

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
      "userRoleId": 1,
      "delegateUserId": 0,
      "facilityId": 0,
      "userRoleName": "Superuser",
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
    "icdCode":'001',
    "icdDescription": 'test description',
    "drugProcCode":'001',
    "drugShortDesc": 'test description',
    "lookBack": 'test',
    "maxAmountAvail": 0.0, "lookBackStartDate": null, "notes": "",
    "attachments":"test.txt", "drugAdvocacyId": 5
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
      declarations: [ AddAppointmentComponent, SearchRevenueComponent ],
      imports:[ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule,NgSelectModule,TableModule,
        ToastrModule.forRoot(), BrowserAnimationsModule, NgbModule],
        providers: [AdvocacyService,PatientService, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue("superuser");
    fixture = TestBed.createComponent(AddAppointmentComponent);
    component = fixture.componentInstance;
    advocacyService = TestBed.inject(AdvocacyService);
    patientService = TestBed.inject(PatientService);
    userService = TestBed.inject(UserService);
    facilityService = TestBed.inject(FacilityService);
    fileAttachmentService = TestBed.inject(FileAttachmentService);
    toastr = TestBed.inject(ToastrService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[getFacilityList] should get facility list', async(() => {
    spyOn(advocacyService, 'getFacilityList').and.returnValue(of({}));
    component.getFacilityList();
    expect(component.facilities).not.toBeNull();
    expect(advocacyService.getFacilityList).toHaveBeenCalled();
  }));

  it('[getAdvocacyTypes] should get advocacy list', async(() => {
    spyOn(advocacyService, 'getAllAdvocacyTypes').and.returnValue(of({}));
    component.getAdvocacyTypes();
    expect(component.addAdvocacyTypes).not.toBeNull();
    expect(advocacyService.getAllAdvocacyTypes).toHaveBeenCalled();
  }));

  it('[getAppointmentTypes] should get Appointment list', async(() => {
    spyOn(advocacyService, 'getAllAppointmentTypes').and.returnValue(of(appointmentTypes));
    component.getAppointmentTypes();
    expect(component.appointemntTypes).not.toBeNull();
    expect(advocacyService.getAllAppointmentTypes).toHaveBeenCalled();
  }));

  it('[getAppoitmentStatusList] should get appointment list', async(() => {
    spyOn(advocacyService, 'getAllAppointmentStatus').and.returnValue(of({}));
    component.getAppoitmentStatusList();
    expect(component.addAppointmentStatusList).not.toBeNull();
    expect(advocacyService.getAllAppointmentStatus).toHaveBeenCalled();
  }));

  it('[loadAdvDetails] should lazy fetch the adv data', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };

    const result = [{"workItemDrugCodeId":28,"workItemId":8,"advocacyNeeded":"Y","advocacyNotes":"","drugId":9,"drugCode":"J2271","patientId":4,"patientMrn":"mrn8888","facilityId":1,"facilityName":"Facility 1","statusName":"New"}];
    component.appointmentDatasource  = [result];
    component.loadAppointmentDetails(event);
    tick(500);
    expect(component.appointmentGridloading  ).toBeFalse();
    expect(component.searchResult ).not.toBeNull();
  }));

  it('[getAppoitmentStatusList] should get appointment list', async(() => {
    spyOn(patientService, 'getAppointmentByPatientId').and.returnValue(of([]));
    component.getAppointmentByPatientId('mrn',1);
    expect(component.getAppointmentByPatientId).not.toBeNull();
    expect(patientService.getAppointmentByPatientId).toHaveBeenCalledWith(1);
  }));

  it('[getAppointmentByPatientIdExcludeClosed] should get appointment list', async(() => {
      spyOn(patientService, 'getAppointmentByPatientIdExcludeClosed').and.returnValue(of([{}]));
      component.getAppointmentByPatientIdExcludeClosed('mrn',1);
      expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
      expect(patientService.getAppointmentByPatientIdExcludeClosed).toHaveBeenCalledWith(1);
      expect(component.appointmentDatasource.length).toEqual(1);
      expect(component.appointmentTotalRecords).toEqual(1);
      expect(component.showAppointmentGrid).toBeTrue();
      expect(component.showNoAppointsError).toBeFalse();
      expect(component.selectedAdvocacyId).toEqual(1);
      expect(component.selectedPatientMrn).toEqual("mrn");
    }));

  it('[getAppointmentByPatientIdExcludeClosed] when the list returned is empty', async(() => {
    spyOn(patientService, 'getAppointmentByPatientIdExcludeClosed').and.returnValue(of([]));
    component.getAppointmentByPatientIdExcludeClosed('mrn',1);
    expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
    expect(patientService.getAppointmentByPatientIdExcludeClosed).toHaveBeenCalledWith(1);
    expect(component.appointmentDatasource.length).toEqual(0);
    expect(component.appointmentTotalRecords).toEqual(0);
    expect(component.showAppointmentGrid).toBeTrue();
    expect(component.showNoAppointsError).toBeFalse();
    expect(component.selectedAdvocacyId).toEqual(1);
    expect(component.selectedPatientMrn).toEqual("mrn");
  }));
  it('[getAppointmentByPatientIdExcludeClosed] when the list returned is undefined', async(() => {
    spyOn(patientService, 'getAppointmentByPatientIdExcludeClosed').and.returnValue(of(undefined));
    component.getAppointmentByPatientIdExcludeClosed('mrn',1);
    expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
    expect(patientService.getAppointmentByPatientIdExcludeClosed).toHaveBeenCalledWith(1);
    expect(component.appointmentDatasource).toBeUndefined();
    expect(component.appointmentTotalRecords).toBeUndefined();
    expect(component.showAppointmentGrid).toBeFalse();
    expect(component.showNoAppointsError).toBeTrue();
    expect(component.selectedAdvocacyId).toEqual(1);
    expect(component.selectedPatientMrn).toEqual("mrn");
  }));

   it('[onShowClosedChanged] should show closed changed', async(() => {
        let showClosedAppointments = true;
        component.onShowClosedChanged(showClosedAppointments);
        spyOn(patientService, 'getAppointmentByPatientId').and.returnValue(of({}));
        component.getAppointmentByPatientId('mrn',1);
        expect(component.getAppointmentByPatientId).not.toBeNull();
        expect(patientService.getAppointmentByPatientId).toHaveBeenCalled();

        showClosedAppointments = false;
        component.onShowClosedChanged(showClosedAppointments);
        spyOn(patientService, 'getAppointmentByPatientIdExcludeClosed').and.returnValue(of({}));
        component.getAppointmentByPatientIdExcludeClosed('mrn',1);
        expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
        expect(patientService.getAppointmentByPatientIdExcludeClosed).toHaveBeenCalled();
    }));
it('getAppointmentByPatientIdExcludeClosed', async(() => {
      spyOn(patientService, 'getAppointmentByPatientIdExcludeClosed').and.returnValue(of([{}]));
      component.getAppointmentByPatientIdExcludeClosed('mrn',1);
      expect(component.getAppointmentByPatientIdExcludeClosed).not.toBeNull();
      expect(patientService.getAppointmentByPatientIdExcludeClosed).toHaveBeenCalled();
  }));
  it('should toggle index', async(() => {
    let index = 1;
    expect(component.toggle(index)).not.toBeNull();
    expect(component.activeState).not.toBeNull();
  }));


  it('should return advocacy form',async(()=>{
    component.addFormSearchAdvocacy =new FormGroup({});
    expect(component.sf).not.toBeNull();
  }))

  it('should return advocacy form',async(()=>{
    component.addFormAppointment =new FormGroup({});
    expect(component.f).not.toBeNull();
  }))

  it('should get facility list', async(() => {
    spyOn(advocacyService, 'getFacilityList').and.returnValue(of([facilityData]));
    component.getFacilityList();
    expect(component.facilities).toEqual([facilityData]);
    expect(advocacyService.getFacilityList).toHaveBeenCalled();
  }));

  it('should return  calculate Total Cost', async(() => {
    const form = {"totalCostOfMedicationInfused": 100, "unitsUsedAtInfusion": 2, "pricePerUnitInfusion": 100}
    component.addFormAppointment.patchValue(form);
    expect(component.calculateTotalCost()).not.toBeNull();
    expect(component.addFormAppointment).not.toBeNull();

  }));


  it('should get aappointments by advocacy id', async(() => {
    const patientMrn = 'mrn001';
    const advocacyId = 1;

    const spy = spyOn(patientService, 'getAppointmentByPatientId').and.returnValue(of(advocacies));
    component.getAppointmentByPatientId(patientMrn, advocacyId);
    expect(component.appointmentDatasource).toEqual(advocacies);
    expect(component.appointmentGridloading).toEqual(false);
    expect(component.appointmentTotalRecords).toEqual(advocacies.length);
    expect(component.showAppointmentGrid).toBeTrue();
    expect(component.showNoAppointsError).toEqual(false);
    expect(spy).toHaveBeenCalledWith(advocacyId);
  }));

  it('getAppointmentByPatientId - when the return list is empty', async(() => {
    const patientMrn = 'mrn001';
    const advocacyId = 1;

    const spy = spyOn(patientService, 'getAppointmentByPatientId').and.returnValue(of([]));
    component.getAppointmentByPatientId(patientMrn, advocacyId);
    expect(component.appointmentDatasource).toEqual([]);
    expect(component.appointmentGridloading).toEqual(false);
    expect(component.appointmentTotalRecords).toEqual(0);
    expect(component.showAppointmentGrid).toBeTrue();
    expect(component.showNoAppointsError).toEqual(false);
    expect(spy).toHaveBeenCalledWith(advocacyId);
  }));

  it('getAppointmentByPatientId - when the return list is undefined', async(() => {
    const patientMrn = 'mrn001';
    const advocacyId = 1;

    const spy = spyOn(patientService, 'getAppointmentByPatientId').and.returnValue(of(undefined));
    component.getAppointmentByPatientId(patientMrn, advocacyId);
    expect(component.appointmentDatasource).toBeUndefined();
    expect(component.appointmentGridloading).toBeUndefined();
    expect(component.appointmentTotalRecords).toBeUndefined();
    expect(component.showAppointmentGrid).toBeFalse();
    expect(component.showNoAppointsError).toBeTrue();
    expect(spy).toHaveBeenCalledWith(advocacyId);
  }));

  it('should return Eob Submited Date val', async(() => {
    const val = 'Y';
    expect(component.onEobSubmited(val)).not.toBeNull();
    expect(component.showAddEobSubmitedDate).toBeTrue();
  }));

  it('should return  Eob Submited Date val', async(() => {
    const val = 'N';
    expect(component.onEobSubmited(val)).not.toBeNull();
    expect(component.showAddEobSubmitedDate).toBeFalse();
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

  it('should load master advocacy details ', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    }
    component.advocacyDatasource = [masterAdvocacy];
    component.loadAdvocacyDetails(event);
    tick(500);
    expect(component.advocacyGridloading).toBeFalse();
    expect(component.loadAdvocacyDetails).not.toBeNull();
  }));

  it('should set Commercial CoPay Pharmacy Validators', async(() => {
    component.setCommercialCoPayPharmacyValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));

  it('should set Commercial CoPay Vob Validators', async(() => {
    component.setCommercialCoPayVobValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));


  it('should set Free Medication After Infusion Validators', async(() => {
    component.setFreeMedicationAfterInfusionValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));


  it('should set Free Medication Before Infusion Validators', async(() => {
    component.setFreeMedicationBeforeInfusionValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));

  it('should set Grant Pharmacy Validators', async(() => {
    component.setGrantVobValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));

  it('should set Grant Vob Validators', async(() => {
    component.setGrantVobValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));

  it('should set MCD Monitor Validators', async(() => {
    component.setMCDMonitorValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));

  it('should premium Assist Validators', async(() => {
    component.premiumAssistValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));

  it('should set MCD Monitor Vob Validators', async(() => {
    component.setMCDMonitorVobValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));


  it('should set Grant Pharmacy Validators', async(() => {
    component.setGrantPharmacyValidators();
    expect(component.addFormAppointment).not.toBeNull();

  }));


  it('should reset form fields', async(() => {
    component.resetAllFields();
    expect(component.addFormAdvocacy.pristine).toBeTrue();
  }));


  it('should show Advocacies', async(() => {
    expect(component.showAdvocacies()).not.toBeNull();

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

  it('[onSearch] is called', fakeAsync(() =>{
    let val = 'Test';
    component.onSearch(val);
    expect(component.onSearch).toBeTruthy();
    //expect(component.updateTable).toBeTruthy();
  }));

  /*it('[loadSearchResults] is called when val is fulfilled', async(() => {
    let val = 'Test';
    component.loadSearchResults(val);
    expect(component.showGrid).toBeFalse();
    expect(component.advocacyGridloading).toBeTrue();
    expect(component.showError).toBeFalse();
  }));*/


  it('should reset Advocacy Type', async(() => {
    expect(component.onResetAdvocacyType()).not.toBeNull();
    expect(component.showCommercialCopayVob).toBeFalse();
    expect(component.showCommercialCopayPharmacy).toBeFalse();

  }));


  it('should on clear appointment fields', async(() => {
    expect(component.OnClearAppointmentFields()).not.toBeNull();
  }));

/*   it('should on advocacy type selected', async(() => {
    component.appointemntTypes = appointmentTypes;
    expect(component.onAdvocacyTypeSelected(1)).not.toBeNull();
    expect(component.submitted).toBeFalse();
    expect(component.showSubmitBtn).toBeTrue();

  })); */
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
    expect(component.showAddGrantPharmacyDisplay).toEqual(true);
    component.onAdvocacyTypeSelected(7);
    expect(component.showMcdMonitorPharmacyDisplay).toEqual(true);
    component.onAdvocacyTypeSelected(8);
    expect(component.showMcdMonitorVobDIsplay).toEqual(true);
    component.onAdvocacyTypeSelected(9);
    expect(component.showPremiumAssistanceDisplay).toEqual(true);
  }));

  it('[onSubmit] form invalid', async(() => {
    component.addFormAppointment.setErrors({ 'invalid': true });
    expect(component.onSubmit()).toEqual(false);
    component.addFormAppointment.setErrors(null);
  }));

  it('should submit form', async(() => {
    const appointment = {"active":true,"createdDate":"2021-08-30T15:41:12.232+00:00","createdBy":17,"modifiedDate":"2021-08-30T15:41:37.243+00:00","modifiedBy":17,"appointmentId":47,"patientId":5,"advocacyId":16,"appointmentStatusId":7,"appointmentTypeId":2,"scheduledAppointmentDate":"2021-08-30T05:00:00.000+00:00","dateInfused":"2021-08-30T05:00:00.000+00:00","frequency":null,"dosage":null,"prescriptionNumber":null,"copayCovered":905.0,"copayRemaining":50.0,"eobSubmittedToIns":"","eobSubmittedToInsDate":"2021-08-30T05:00:00.000+00:00","eobReceivedFromIns":"","eobReceivedFromInsDate":null,"indicatedCopay":0.0,"eobSubmittedToCopay":"","eobSubmittedToCopayDate":null,"amountReceivedFromCopay":0.0,"freeMedicationOrdered":null,"dateAdvocacyReceived":null,"unitsUsedAtInfusion":0.0,"pricePerUnitInfusion":0.0,"totalCostOfMedicationInfused":0.0,"replacementOrdered":null,"replacementReceived":null,"eobSubmittedToGrant":"","eobSubmittedToGrantDate":"2021-09-30T05:00:00.000+00:00","amountReceivedFromGrant":0.0,"patientNotified":"","patientNotifiedDate":null,"notes":null,"externalCustomerRequestedToDelete":"N","rejectedReasonNotes":"","followUpDate":"2021-09-12T04:00:00.000+00:00","attachments":[{"attachmentId": 1, "name": "test1", active: true}],"facilityEin":"456987458","patientMrn":"000001","facilityName":"eRecovery Memorial Healthcare","facilityNPI":"2589632589","wbsId":0,"appointmentStatusName":"Rec from Advocacy","appointmentTypeName":"Commercial Copay - Pharmacy","createdByName":"admin","modifiedByName":"admin"}
    const attachmentResp = { active: true, createdDate: "2021-02-28T02:34:05.131+0000", createdBy: 1, modifiedDate: "2021-02-28T02:34:05.131+0000", modifiedBy: 1, workItemAttachmentId: 1, workItemId: 27, attachmentPath: "keyboard-shortcuts-windows.pdf" };

    component.isUpdate = true;
    component.addFormAppointment.patchValue(appointment);
    spyOn(FormData.prototype, "append");

    const spy = spyOn(advocacyService, 'postAttachment').and.returnValue(of(attachmentResp));
    spyOn(toastr, 'success');
    expect(spy).toBeTruthy();
    expect(component.onSubmit()).not.toBeNull();
    expect(component.submitted ).toBeTrue();

  }));

  it('[onSubmit] not isUpdate', () => {
    initializeComponentForOnSubmit();
    component.isUpdate = false;
    const spy =spyOn(patientService, 'createAppointment').and.returnValue(of({'appointmentId':1})) ;
    component.fileAttachmentData.selectedFiles = selectedFileObj;
    const spy1 =spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));
       component.onSubmit();

     expect(spy).toHaveBeenCalled();
       expect(spy1).toHaveBeenCalled();
  });

  it('[onSubmit] not isUpdate No selected files', () => {
      initializeComponentForOnSubmit();
      component.isUpdate = false;
      const spy =spyOn(patientService, 'createAppointment').and.returnValue(of({'appointmentId':1})) ;
      component.onSubmit();
       expect(spy).toHaveBeenCalled();
    });

  it('[onSubmit] should submit form appointment with files', async(() => {
    initializeComponentForOnSubmit();

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy2 =spyOn(patientService, 'updateAppointment').and.returnValue(of({'appointmentId':1})) ;
    const spy3 =spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));

    component.onSubmit();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  }));

  it('[onSubmit] should submit and updated form appointment with files', async(() => {
    initializeComponentForOnSubmit();
    component.isUpdate = true;
    component.fileAttachmentData.deletedFilesList = [{"fakeData": "fakeData"}];

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy2 =spyOn(patientService, 'updateAppointment').and.returnValue(of({'appointmentId':1})) ;
    const spy3 =spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));
    spyOn(fileAttachmentService, 'deleteAttachments').and.returnValue(of({})) ;

    component.onSubmit();
    expect(spy2).toHaveBeenCalled();
    expect(spy3).toHaveBeenCalled();
  }));

       it('[onSubmit] should submit form appointment throw error', fakeAsync(() => {
         component.addFormAppointment.patchValue({});
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
  function initializeComponentForOnSubmit() {
    component.addFormAppointment.patchValue({});
    component.submitted =true;
    component.appointmentId =1;
    component.isUpdate = true;
    component.userId=1;
  };
  it('should reset appointment form', async(() => {
    expect(component.resetAppointmentForm()).not.toBeNull();
    expect(component.isUpdate).toBeFalse();

  }));

  it('should on add Advocacy', inject([Router], (router: Router) => {
    const advid=13;

    spyOn(router, 'navigate').and.stub();
    let spy = spyOn(patientService, 'getAdvocacyById').and.returnValue(of(masterAdvocacy));
    let spy1 = spyOn(facilityService, 'getById').and.returnValue(of(facilityData));
    let spy2 = spyOn(component, 'getTeamMemberList').and.stub();
    component.onAdd(masterAdvocacy)
    expect(spy).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/advocacy/addAppointment']);
    expect(spy1).toHaveBeenCalled();
    expect(component.systemId).toBe(facilityData.systemId);
    expect(spy2).toHaveBeenCalled();
    expect(component.addFormAdvocacy.get("diagnosisCode").value).toEqual('001 - test description');
    expect(component.addFormAdvocacy.get("drugForAdvocacy").value).toEqual('001 - test description');
    expect(component.addFormAdvocacy.get("lookBack").value).toEqual('test');
    expect(component.advocacyAttachments).toEqual('test.txt');

  }));

  it('[onSearch] is called', fakeAsync(() =>{
    let val = 'Test';
    component.onSearch(val);
    expect(component.onSearch).toBeTruthy();
  }));

  /*it('[loadSearchResults] is called when val is fulfilled', async(() => {
    let val = 'Test';
    component.loadSearchResults(val);
    expect(component.showGrid).toBeFalse();
    expect(component.advocacyGridloading).toBeTrue();
    expect(component.showError).toBeFalse();
  }));*/


  it('[loadAdvocacyMasterList] should load data', fakeAsync(() => {
    const event: LazyLoadEvent ={"first":0,"rows":10,"sortOrder":1,"filters":{},"globalFilter":null};
    component.advocacySearchParams = {};
    //component.datasource = wiSearchResult;
    const spy = spyOn(component, 'updateTable').and.stub();
    component.loadAdvocacyMasterList(event);
    expect(spy).toHaveBeenCalled();
  }));

  it('[loadAdvocacyMasterList] should not load data when datasource in null', fakeAsync(() => {
    const event: LazyLoadEvent ={"first":0,"rows":10,"sortOrder":1,"filters":{},"globalFilter":null};
    component.advocacySearchParams = {};
    component.loadAdvocacyMasterList(event);
    tick(500);
    expect(component.loading).toBeTrue();
  }));

  it('should edit appointment', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();
    component.onEditAppointment(appointment)
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/advocacy/addAppointment']);
  }));
  it('should edit appointment dates not null', inject([Router], (router: Router) => {
    spyOn(router, 'navigate').and.stub();
    component.onEditAppointment({"attachments":[{"attachmentId": 1, "name": "test1", active: true}]});
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/advocacy/addAppointment']);
  }));
  it('should delete appointment', fakeAsync(() => {
    const appointmentId=25;
    let spy= spyOn(patientService, 'deleteAppointmentById').and.returnValue(of([]));
    component.onDeleteAppointmentId(appointmentId);
    tick(500);
    flush();
    expect(spy).toHaveBeenCalled();
  }));

  it("should download pdf File", () => {
    let attachmentId = 1;
    let name = "tesfpr.pdf"
    const mBlob = { size: 1024, type: "application/pdf" };
    const spy = spyOn(patientService, 'getAttachmentById').and.returnValue(of({}));
    component.openAdvAttachment(attachmentId, name);
    expect(spy).toHaveBeenCalled();
  });

  it("should download img jpeg File", () => {
      let attachmentId = 1;
      let name = "tesfpr.pdf"
      const mBlob = { size: 1024, type: "image/jpeg" };
      const spy = spyOn(patientService, 'getAttachmentById').and.returnValue(of({}));
      component.openAdvAttachment(attachmentId, name);
      expect(spy).toHaveBeenCalled();
    });

    it("should download img png File", () => {
          let attachmentId = 1;
          let name = "tesfpr.pdf"
          const mBlob = { size: 1024, type: "image/png" };
          const spy = spyOn(patientService, 'getAttachmentById').and.returnValue(of({}));
          component.openAdvAttachment(attachmentId, name);
          expect(spy).toHaveBeenCalled();
        });

  it('[onSearch] should search appointment when form is valid with empty advocacies', async(() => {
    component.addFormAdvocacy.patchValue({
      facilityId: 1,
      facilityName: 'facility1',
      mrn: 'mrn001'

    });
    const val = 'test';
    const spy = spyOn(advocacyService, 'getPagedAdvocaciesBySearchParam').and.returnValue(of([]));
    component.onSearch(val);
    //expect(component.showGrid).toEqual(false);
    //expect(component.showSearch).toEqual(true);
    //expect(component.advocacyTotalRecords).not.toBeNull();
    //expect(component.loading).toEqual(true);

    expect(spy).toHaveBeenCalled();
  }));

  it('[onSearch] should search appointment when form is valid with advocacies', async(() => {
    component.addFormAdvocacy.patchValue({
      facilityId: 1,
      facilityName: 'facility1',
      mrn: 'mrn001'

    });
    const val = 'test';
    const spy = spyOn(advocacyService, 'getPagedAdvocaciesBySearchParam').and.returnValue(of(advocacies));
    component.onSearch(val);
    //expect(component.showGrid).toEqual(true);
    //expect(component.showSearch).toEqual(true);
    //expect(component.advocacyTotalRecords).not.toBeNull();
   // expect(component.advocacyGridloading).toEqual(false);

    expect(spy).toHaveBeenCalled();
  }));

  it('should delete appointment Id', fakeAsync(() => {
    const appointmentId=25;
    const err = "error";
    let spy= spyOn(patientService, 'deleteAppointmentById').and.returnValue(throwError(err));
    component.onDeleteAppointmentId(appointmentId);
    tick(500);
    flush();
    expect(spy).toHaveBeenCalled();
  }));

  it('should delete appointment', fakeAsync((msg: any) => {
    msg = 'error';
    const appointmentId=25;
    component.onDeleteAppointment(appointmentId);
    flush();
    expect(component.showFailure).toBeTruthy();
  }));

  it('should reject to delete', fakeAsync(() => {
    const appointmentId= 25;
    const err = "error";
    let spy= spyOn(patientService, 'deleteAppointmentById').and.returnValue(throwError(err));

    component.rejectDelete(appointmentId);
    tick(500);
    flush();
    expect(spy).toBeTruthy();
  }));

  it('should get users to assign', async(() => {
    let spy1 = spyOn(userService, 'getBySystemId').and.returnValue(of([userdata[0]]));
    let spy2 = spyOn(userService, 'getInternalUsers').and.returnValue(of([userdata[1]]));

    component.getTeamMemberList();

    expect(spy1).toHaveBeenCalled();
    expect(spy2).toHaveBeenCalled();

    expect(component.teamMembers.length).toBe(2);
  }))

});
