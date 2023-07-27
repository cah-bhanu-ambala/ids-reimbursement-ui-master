import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbActiveModal, NgbModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { of, Subject, throwError } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { CommonService } from 'src/app/common/services/http/common.service';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { EditWorkitemComponent } from './edit-workitem.component';
import { DrugAdvocacyService } from 'src/app/common/services/http/drug-advocacy.service';
import {FileAttachmentService} from "src/app/common/services/http/file-attachment.service";
import { By } from '@angular/platform-browser';

describe('EditWorkitemComponent', () => {
  let component: EditWorkitemComponent;
  let fixture: ComponentFixture<EditWorkitemComponent>;
  let wiService: WorkitemService;
  let commonService: CommonService;
  let drugAdvocacyService: DrugAdvocacyService;
  let fileAttachmentService: FileAttachmentService;

  const wiData = {
    active: true,
    createdDate: "2021-02-22T14:54:53.408+0000",
    createdBy: 1,
    modifiedDate: "2021-02-22T14:54:53.706+0000",
    modifiedBy: 1,
    workItemId: 13,
    facilityBillingLevelId: 1,
    facilityBillingTypeId: 3,
    providerId: 1,
    workItemStatusId: 1,
    patientId: 3,
    orderTypeId: 1,
    orderDate: "2021-02-01T08:00:00.000+0000",
    referralNumber: "123",
    notes: "",
    generalNotes: "",
    assignedToId: 0,
    dateIn: "2021-02-22T08:00:00.000+0000",
    dateOut: null,
    buyBill: "U",
    externalWorkId: "1",
    wiInsurance: {
      active: true,
      createdDate: "2021-02-22T14:54:53.622+0000",
      createdBy: 1,
      modifiedDate: "2021-02-22T14:54:53.622+0000",
      modifiedBy: 1,
      workItemInsId: 7,
      primaryInsRep: "test",
      primaryInsRefNum: "123",
      primaryInNetwork: "U",
      deductibleMax: 1000,
      deductibleMet: 0,
      outOfPocketMax: 0,
      outOfPocketMet: 0,
      coInsurance: 0,
      primaryInsNotes: "",
      primaryInsClassification: 1,
      secondaryInsRep: "",
      secondaryInsRefNum: "",
      secondaryInNetwork: "U",
      secondaryInsNotes: "",
      secondaryInsClassification: 2,
      primaryInsuranceName: "Unknown",
      secondaryInsuranceName: "Unknown"
    },
    icdCodes: [{
      active: true,
      createdDate: "2021-02-01T17:36:50.927+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.927+0000",
      modifiedBy: 1,
      icdId: 2,
      icdCode: "A00.0",
      description: "Cholera due to Vibrio cholerae 01, biovar cholerae"
    }],
    drugCodes: [{
      active: true,
      createdDate: "2021-02-01T17:36:50.881+0000",
      createdBy: 1,
      modifiedDate: "2021-02-17T17:50:17.409+0000",
      modifiedBy: 1,
      drugId: 1,
      drugAdvocacyId:2,
      drugProcCode: "J9025",
      shortDesc: "Adalimumab injection",
      longDesc: "Adalimumab injection",
      brandName: "Humira Pen",
      genericName: "adalimumab",
      lcd: "LCD128",
      notes: "test notes",
      priorAuthFromDate :'2021-03-05T17:01:22.850+0000',
      priorAuthToDate : '2021-03-05T17:01:22.850+0000',
      isCover:'U',
      clearance: 'U',
      priorAuth: 'Y',
      priorAuthApprovalReason: 1,
      priorAuthNo:2,
      drugDosage: "10",
      drugDenied: "Y",
      denialTypeId: "1"
      /* ,
      overrideAdvocacyNeeded :true,
      overrideAdvocacyNotes:'Y' */
    } ,
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.881+0000",
      createdBy: 1,
      drugAdvocacyId:1,
      modifiedDate: "2021-02-17T17:50:17.409+0000",
      modifiedBy: 1,
      drugId: 2,
      drugProcCode: "J0135",
      shortDesc: "Adalimumab injection",
      longDesc: "Adalimumab injection",
      brandName: "Humira Pen",
      genericName: "adalimumab",
      lcd: "LCD1728",
      notes: "test notes",
      priorAuthNo: 1,
      drugDosage: "10",
      drugDenied: "Y",
      denialTypeId: "1"
    }],
    attachments: [],
    providerName: "James12 ",
    facilityBillingTypeName: "PHARM",
    facilityBillingLevelName: "N/A",
    workItemStatusName: "New",
    facilityNPI: "1234567890",
    providerNPi: "1234567891",
    facilityId: 1,
    facilityName: "Facility 1",
    patientMrn: "mrn",
    orderTypeName: "Oncology",
    facilityEin: "1234567890"
  };

  const blob = new Blob([""], { type: "image/png" });
  blob["lastModifiedDate"] = "";
  blob["name"] = 'filename';

  const blob2 = new Blob([""], { type: "text/text" });
  blob2["lastModifiedDate"] = "";
  blob2["name"] = 'filename2';
  const selectedFileObj = [{'file':blob},{'file':blob2}];

  const icdCodes = [{
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 2,
    icdCode: "A00.0",
    description: "Cholera due to Vibrio cholerae 01, biovar cholerae"
  }, {
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 3,
    icdCode: "A00.1",
    description: "Cholera due to Vibrio cholerae 01, biovar eltor"
  }, {
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 4,
    icdCode: "A00.9",
    description: "Cholera, unspecified"
  }];

  const drugCodes = [{
    active: true,
    createdDate: "2021-02-01T17:36:50.881+0000",
    createdBy: 1,
    modifiedDate: "2021-02-17T17:50:17.409+0000",
    modifiedBy: 1,
    drugId: 2,
    drugProcCode: "J9025",
    shortDesc: "Adalimumab injection",
    longDesc: "Adalimumab injection",
    brandName: "Humira Pen",
    genericName: "adalimumab",
    lcd: "LCD1728",
    notes: "test notes",
    priorAuthFromDate :'2021-03-05T17:01:22.850+0000',
    priorAuthToDate : '2021-03-05T17:01:22.850+0000',
    isCover:'U',
    clearance: 'U',
    priorAuth: 'U',
    priorAuthApprovalReason: 'N',
    priorAuthNo:'Y',
    dosage: "10ml",
    drugDenied: "Y",
    denialTypeId: "reason"
  }, {
    active: true,
    createdDate: "2021-02-01T17:36:50.881+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.881+0000",
    modifiedBy: 1,
    drugId: 25,
    drugProcCode: "J0170",
    shortDesc: "Adrenalin epinephrin inject",
    longDesc: "Adrenalin epinephrin inject",
    brandName: "Epinephrine",
    genericName: "epinephrine",
    lcd: "",
    notes: "",
    dosage: "10ml",
    drugDenied: "Y",
    denialTypeId: "reason"
  }];

  const facilityData = [
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

  const billingLevelsData = [
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.907+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.907+0000",
      modifiedBy: 1,
      facilityBillingLevelId: 1,
      facilityBillingLevelName: "N/A"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.907+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.907+0000",
      modifiedBy: 1,
      facilityBillingLevelId: 5,
      facilityBillingLevelName: "PHARM L1"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.907+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.907+0000",
      modifiedBy: 1,
      facilityBillingLevelId: 6,
      facilityBillingLevelName: "PHARM L2"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.907+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.907+0000",
      modifiedBy: 1,
      facilityBillingLevelId: 7,
      facilityBillingLevelName: "PHARM L3"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.907+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.907+0000",
      modifiedBy: 1,
      facilityBillingLevelId: 8,
      facilityBillingLevelName: "RAD L1"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.907+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.907+0000",
      modifiedBy: 1,
      facilityBillingLevelId: 9,
      facilityBillingLevelName: "RAD L2"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.907+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.907+0000",
      modifiedBy: 1,
      facilityBillingLevelId: 2,
      facilityBillingLevelName: "VOB L1"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.907+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.907+0000",
      modifiedBy: 1,
      facilityBillingLevelId: 3,
      facilityBillingLevelName: "VOB L2"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:50.907+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:50.907+0000",
      modifiedBy: 1,
      facilityBillingLevelId: 4,
      facilityBillingLevelName: "VOB L3"
    }
  ];

  const advocacies = [
    {
      "active": true,
      "createdDate": "2021-10-20T19:04:58.736+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T19:04:58.740+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 17,
      "drugId": 456,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "12, 13, 14, 16, 15, 17, 18, 19, 20, 21, 22",
      "priorAuthStatusId": 4,
      "notes": null,
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
         "createdDate": "2021-10-20T19:04:58.738+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-10-20T19:04:58.738+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 13,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 17,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Vidaza Spd 100MG 1 EA    ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J9025",
      "drugShortDesc": "AZACITIDINE",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-10-20T19:03:49.857+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T19:03:49.861+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 16,
      "drugId": 594,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "12, 13, 14, 16, 15, 17, 18, 19, 20, 21, 22",
      "priorAuthStatusId": 4,
      "notes": null,
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-10-20T19:03:49.859+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-10-20T19:03:49.859+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 12,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 16,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Udenyca 6MG/0.6ML 0.6 ML  ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "Q5111",
      "drugShortDesc": "Injection udenyca 0.5 mg",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-10-20T19:02:54.670+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T19:02:54.675+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 15,
      "drugId": 603,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "12, 13, 14, 16, 15, 17, 18, 19, 20, 21, 22",
      "priorAuthStatusId": 4,
      "notes": null,
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-10-20T19:02:54.673+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-10-20T19:02:54.673+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 11,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 15,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Ziextenzo 6MG/0.6ML 0.6 ML  ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "Q5120",
      "drugShortDesc": "Inj pegfilgrastim-bmez 0.5mg",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-10-20T19:01:13.808+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T19:01:13.812+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 14,
      "drugId": 593,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "12, 13, 14, 16, 15, 17, 18, 19, 20, 21, 22",
      "priorAuthStatusId": 4,
      "notes": null,
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-10-20T19:01:13.811+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-10-20T19:01:13.811+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 10,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 14,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Nivestym 480MCG/1.6ML 10X1.6ML",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "Q5110",
      "drugShortDesc": "Nivestym",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-10-20T18:59:33.037+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T18:59:33.044+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 13,
      "drugId": 168,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "12, 13, 14, 16, 15, 17, 18, 19, 20, 21, 22",
      "priorAuthStatusId": 4,
      "notes": null,
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-10-20T18:59:33.042+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-10-20T18:59:33.042+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 9,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 13,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Neupogen Singleject 480MCG/0.8ML .8 ML   ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J1442",
      "drugShortDesc": "Inj filgrastim excl biosimil",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-10-20T18:57:13.817+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T18:57:13.823+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 12,
      "drugId": 297,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "12, 14, 16, 15, 17, 18, 19, 20, 21, 22",
      "priorAuthStatusId": 4,
      "notes": null,
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-10-20T18:57:13.821+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-10-20T18:57:13.821+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 8,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 12,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Leukine                     N+ 250MCG 10X1EA  ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J2820",
      "drugShortDesc": "Sargramostim injection",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-10-20T18:54:15.951+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T18:54:15.956+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 11,
      "drugId": 169,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "22, 21, 20, 19, 18, 17, 15, 16, 14",
      "priorAuthStatusId": 4,
      "notes": null,
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-10-20T18:54:15.954+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-10-20T18:54:15.954+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 7,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 11,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Granix 480MCG/1.6ML 10X1.6ML",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J1447",
      "drugShortDesc": "Inj tbo filgrastim 1 microg",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-10-20T18:52:31.175+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T18:52:31.180+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 10,
      "drugId": 592,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "22",
      "priorAuthStatusId": 4,
      "notes": null,
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-10-20T18:52:31.178+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-10-20T18:52:31.178+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 6,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 10,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Fulphila 6MG/0.6ML 0.6 ML  ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "Q5108",
      "drugShortDesc": "Injection fulphila",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-10-20T18:51:03.353+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T18:51:03.359+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 9,
      "drugId": 587,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "22",
      "priorAuthStatusId": 4,
      "notes": null,
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-10-20T18:51:03.357+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-10-20T18:51:03.357+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 5,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 9,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Zarxio 480MCG/0.8ML 10X0.8ML",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "Q5101",
      "drugShortDesc": "Injection zarxio",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-10-20T18:05:43.709+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-10-20T18:45:39.834+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 8,
      "drugId": 261,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "22",
      "priorAuthStatusId": 4,
      "notes": "",
      "icds": "D70.1",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": null,
          "createdBy": 17,
          "modifiedDate": "2021-10-20T18:45:39.834+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 4,
          "website": 'https://www.healthwellfoundation.org/fund/chemotherapy-induced-neutropenia-medicare-access/',
          "drugAdvocacyId": 8,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Neulasta Phs 6MG/0.6ML .6 ML   ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J2505",
      "drugShortDesc": "Injection pegfilgrastim 6mg",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-09-23T18:01:09.798+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-09-23T18:01:09.808+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 7,
      "drugId": 305,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "11, 12",
      "priorAuthStatusId": 4,
      "notes": "",
      "icds": "C83.50, C83.51",
      "advocacyTypeId": 7,
      "copay": null,
      "premium": null,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-09-23T18:01:09.805+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-09-23T18:01:09.805+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 3,
          "website": "",
          "drugAdvocacyId": 7,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Sublimaze 0.05MG/ML 5X20ML  ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J3010",
      "drugShortDesc": "Fentanyl citrate injection",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-09-10T16:14:34.448+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-09-10T16:14:34.448+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 6,
      "drugId": 545,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "12, 14, 22, 16, 15, 17, 18, 19, 20, 21",
      "priorAuthStatusId": 4,
      "notes": "Notes",
      "icds": "C83.5, C83.50, C83.51, C83.52, C83.53, C83.54, C83.55, C83.56, C83.57, C83.58",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Trodelvy 180MG 1 EA    ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J9317",
      "drugShortDesc": "Sacituzumab govitecan-hziy",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-09-10T14:25:01.374+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-09-23T13:15:03.195+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 5,
      "drugId": 42,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "11, 13",
      "priorAuthStatusId": 2,
      "notes": "",
      "icds": "A02.1",
      "advocacyTypeId": 3,
      "copay": null,
      "premium": null,
      "drugAdvocacyWebsites": [
        {
          "active": true,
          "createdDate": "2021-09-23T13:15:03.157+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-09-23T13:15:03.157+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 1,
          "website": 'www.google.com',
          "drugAdvocacyId": 5,
          "createdByName": "admin",
          "modifiedByName": "admin"
        },
        {
          "active": true,
          "createdDate": "2021-09-23T13:15:03.188+00:00",
          "createdBy": 17,
          "modifiedDate": "2021-09-23T13:15:03.188+00:00",
          "modifiedBy": 17,
          "drugAdvocacyWebsiteId": 2,
          "website": 'www.cardinalhealth.com',
          "drugAdvocacyId": 5,
          "createdByName": "admin",
          "modifiedByName": "admin"
        }
      ],
      "priorAuthStatusName": "FDA",
      "drugLongDesc": "Lumizyme Dshp 50MG 1 EA    ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J0221",
      "drugShortDesc": "Lumizyme injection",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-09-08T14:54:28.574+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-09-10T16:19:09.654+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 4,
      "drugId": 542,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "14, 16, 15, 17, 18, 19, 20, 21, 22",
      "priorAuthStatusId": 4,
      "notes": "",
      "icds": "C83.5, C83.50, C83.51, C83.52, C83.53, C83.54, C83.55, C83.56, C83.57, C83.58, C83.59, C91.00, C91.01, C91.02",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": null,
      "drugAdvocacyWebsites": [],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Rituxan Spd 10MG/ML 50 ML   ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J9312",
      "drugShortDesc": "Inj. rituximab 10 mg",
      "createdByName": "admin",
      "modifiedByName": "admin"
    },
    {
      "active": true,
      "createdDate": "2021-09-07T19:52:22.395+00:00",
      "createdBy": 17,
      "modifiedDate": "2021-09-07T19:52:22.395+00:00",
      "modifiedBy": 17,
      "drugAdvocacyId": 3,
      "drugId": 127,
      "primaryInsuranceId": 8,
      "secondaryInsuranceId": "22",
      "priorAuthStatusId": 4,
      "notes": "Notes.....",
      "icds": "C83.0, C83.00, C83.01, C83.02, C83.06, C83.05, C83.04, C83.03, C83.07, C83.08, C83.10, C83.1, C83.09",
      "advocacyTypeId": 7,
      "copay": true,
      "premium": true,
      "drugAdvocacyWebsites": [],
      "priorAuthStatusName": "NCCN",
      "drugLongDesc": "Procrit 4000U/ML 6X1ML   ",
      "primaryInsName": "Medicare A & B",
      "drugProcCode": "J0885",
      "drugShortDesc": "Epoetin alfa non-esrd",
      "createdByName": "admin",
      "modifiedByName": "admin"
    }
  ]


  const primaryInsurance = [{ "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 3, "insuranceType": "Primary", "insuranceName": "Commercial" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 4, "insuranceType": "Primary", "insuranceName": "Government" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 5, "insuranceType": "Primary", "insuranceName": "Medicaid Managed" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 6, "insuranceType": "Primary", "insuranceName": "Medicaid State" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 7, "insuranceType": "Primary", "insuranceName": "Medicare A" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 8, "insuranceType": "Primary", "insuranceName": "Medicare A & B" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 9, "insuranceType": "Primary", "insuranceName": "Medicare Replacement" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 10, "insuranceType": "Primary", "insuranceName": "Self Pay" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 1, "insuranceType": "Primary", "insuranceName": "Unknown" }];
  const secondaryInsurance = [{ "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 11, "insuranceType": "Secondary", "insuranceName": "Commercial" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 12, "insuranceType": "Secondary", "insuranceName": "Government" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 13, "insuranceType": "Secondary", "insuranceName": "Medicaid State" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 14, "insuranceType": "Secondary", "insuranceName": "Medicare A & B" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 16, "insuranceType": "Secondary", "insuranceName": "Medicare Supp Plan F" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 15, "insuranceType": "Secondary", "insuranceName": "Medicare Supp Plan F - High DED" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 17, "insuranceType": "Secondary", "insuranceName": "Medicare Supp Plan G" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 18, "insuranceType": "Secondary", "insuranceName": "Medicare Supp Plan K" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 19, "insuranceType": "Secondary", "insuranceName": "Medicare Supp Plan L" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 20, "insuranceType": "Secondary", "insuranceName": "Medicare Supp Plan M" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 21, "insuranceType": "Secondary", "insuranceName": "Medicare Supp Plan N" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 22, "insuranceType": "Secondary", "insuranceName": "Self Pay" }, { "active": true, "createdDate": "2021-02-02T01:10:42.837+0000", "createdBy": 1, "modifiedDate": "2021-02-02T01:10:42.837+0000", "modifiedBy": 1, "insuranceId": 2, "insuranceType": "Secondary", "insuranceName": "Unknown" }];

  const editForm = new FormGroup(
    {
      icdCodes: new FormArray([new FormGroup({
        createdBy: new FormControl(''),
        modifiedBy: new FormControl(''),
        icdCode: new FormControl(''),
        icdDescription: new FormControl(''),
        workItemIcdCodeId: new FormControl('')
      })]),
      drugCodes: new FormArray([new FormGroup({
        drugProcCode: new FormControl(''),
        drugShortDesc: new FormControl([{ value: '', disabled: true }]),
        drugLongDesc: new FormControl([{ value: '', disabled: true }]),
        isCover: new FormControl('U'),
        clearance: new FormControl('U'),
        priorAuth: new FormControl('U'),
        priorAuthNo: new FormControl([{ value: '', disabled: true }]),
        priorAuthNotes: new FormControl([{ value: '', disabled: true }]),
        priorAuthFromDate: new FormControl([{ value: null, disabled: true }]),
        priorAuthToDate: new FormControl([{ value: null, disabled: true }]),
        visitsApproved: new FormControl([{ value: '', disabled: true }]),
        unitsApproved: new FormControl([{ value: '', disabled: true }]),
        priorAuthApprovalReason: new FormControl([{ value: 1 }]),
        advocacyNeeded: new FormControl('U'),
        drugAdvocacyId: new FormControl([null]),
        overrideAdvocacyNeeded: new FormControl(false),
        advocacyNotes: new FormControl([null]),
        overrideAdvocacyNotes: new FormControl(null)
      })]),
      wiInsurance: new FormGroup(
        {
          primaryInsRep: new FormControl(''),
          primaryInsRefNum: new FormControl(''),
          primaryInNetwork: new FormControl(''),
          deductibleMax: new FormControl(''),
          deductibleMet: new FormControl(''),
          outOfPocketMax: new FormControl(''),
          outOfPocketMet: new FormControl(''),
          coInsurance: new FormControl(''),
          primaryInsClassification: new FormControl(''),
          primaryInsNotes: new FormControl(''),
          secondaryInsRefNum: new FormControl(''),
          secondaryInsRep: new FormControl(''),
          secondaryInNetwork: new FormControl(''),
          secondaryInsClassification: new FormControl(''),
          secondaryInsNotes: new FormControl(''),
        }
      ),
      drugAdvocacies: new FormControl([])
    });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditWorkitemComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule, NgbModalModule, NgbModule,
        RouterTestingModule, ToastrModule.forRoot(), BrowserAnimationsModule, NgSelectModule,
        TableModule, ButtonModule],
      providers: [WorkitemService, CommonService, DrugAdvocacyService, NgbActiveModal, NgbModal]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWorkitemComponent);
    wiService = TestBed.inject(WorkitemService);
    commonService = TestBed.inject(CommonService);
    drugAdvocacyService = TestBed.inject(DrugAdvocacyService);
    fileAttachmentService = TestBed.inject(FileAttachmentService);
    component = fixture.componentInstance;

    component.wiNumber = 13;
    component.drugCodesFiltered$ = [];
    component.icdCodesFiltered$ = [];
    component.drugCodesInput$ = [];
    component.icdCodesInput$ = [];
    // spyOn(localStorage, 'getItem').and.returnValue("1");
    // spyOn(wiService, 'getWorkItemById').and.returnValue(of(wiData));
    // component.ngOnInit();
    component.wiInfo = wiData;
    component.buildWorkItemForm();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });



  it('should get form', () => {
    expect(component.f).toBeTruthy();
  });

  it('should get form date condition', () => {
    component.wiInfo.dateIn = null;
    component.wiInfo.orderDate = null;
    component.wiInfo.dateOut ='2021-02-22T08:00:00.000+0000';
    component.wiInfo.attachments = [{ active: false, createdDate: "2021-03-05T17:01:22.850+0000", createdBy: 1, modifiedDate: "2021-03-08T09:22:21.712+0000", modifiedBy: 1, advocacyAttachmentId: 5, advocacyId: 10, attachmentPath: "contacts.PNG" }];
    component.buildWorkItemForm();
    component.wiInfo.dateIn ='2021-02-22T08:00:00.000+0000';
    component.wiInfo.orderDate ='2021-02-22T08:00:00.000+0000';
    component.wiInfo.dateOut = null;
    expect(component).toBeTruthy();
  });

  it('[loadEditWorkItem] should load all the workitem data', () => {
    const winum = 22;
    spyOn(wiService, 'getWorkItemById').and.returnValue(of(wiData));
    spyOn(component, 'callDependantEndpoint');
    spyOn(component, 'initializeFormList');

    component.loadEditWorkItem(winum);
    expect(component.wiInfo).toEqual(wiData);
    expect(component.f).not.toBeNull();
    expect(component.icdCodes).not.toBeNull();
    expect(component.drugCodes).not.toBeNull();
    expect(component.callDependantEndpoint).toHaveBeenCalled();
    expect(component.initializeFormList).toHaveBeenCalled();
  });

  it('[callDependantEndpoint] should get all Dependent list in the appropriate order', async(() => {
    //spyOn(commonService, 'getdrugList').and.returnValue(of(drugCodes));
    // spyOn(wiService, 'getApprovedFacilities').and.returnValue(of(facilityData));
    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
    spyOn(wiService, 'getbilligLevels').and.returnValue(of(billingLevelsData));
    spyOn(wiService, 'getPrimaryIns').and.returnValue(of(primaryInsurance));
    spyOn(wiService, 'getSecondaryIns').and.returnValue(of(secondaryInsurance));
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));
    component.viewOnly = true;
    Object.keys(component.formWorkItem.controls).forEach((controlName) => {
      component.formWorkItem.controls[controlName].enable();
    });

    component.callDependantEndpoint();
    //expect(component.drugList).not.toBeNull();
    //expect(component.drugList).not.toBeUndefined();
    //expect(component.drugList).toEqual(drugCodes);
    expect(component.dependantEndpointsLoaded).toBeTrue();
    //expect(commonService.getdrugList).toHaveBeenCalled();

    expect(component.wiStatuses).toEqual(wiStatus);
    expect(wiService.getwiStatuses).toHaveBeenCalled();

    expect(component.wiTeamMembers).not.toBeNull();
    expect(wiService.getAllTeamMembers).toHaveBeenCalled();

    expect(component.billingLevels).toEqual(billingLevelsData);
    expect(wiService.getbilligLevels).toHaveBeenCalled();

    expect(component.primaryInsList).toEqual(primaryInsurance);
    expect(wiService.getPrimaryIns).toHaveBeenCalled();

    expect(component.secondaryInsList).toEqual(secondaryInsurance);
    expect(wiService.getSecondaryIns).toHaveBeenCalled();

    expect(component.wiApprovalReasons).not.toBeNull();
    expect(wiService.getAllApprovalReasons).toHaveBeenCalled();
    Object.keys(component.formWorkItem.controls).forEach((controlName) => {
      expect(component.formWorkItem.controls[controlName].disabled).toBeTrue();
    });

  }));
  it('[callDependantEndpoint] should enable all form controls for edit', async(() => {
    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
    spyOn(wiService, 'getbilligLevels').and.returnValue(of(billingLevelsData));
    spyOn(wiService, 'getPrimaryIns').and.returnValue(of(primaryInsurance));
    spyOn(wiService, 'getSecondaryIns').and.returnValue(of(secondaryInsurance));
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));
    component.viewOnly = false;
    Object.keys(component.formWorkItem.controls).forEach((controlName) => {
      component.formWorkItem.controls[controlName].enable();
    });

    component.callDependantEndpoint();
    Object.keys(component.formWorkItem.controls).forEach((controlName) => {
      expect(component.formWorkItem.controls[controlName].disabled).toBeFalse();
    });

  }));

  it('[getdrugList] should throw error', async(() => {
    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
    spyOn(wiService, 'getbilligLevels').and.returnValue(of(billingLevelsData));
    spyOn(wiService, 'getPrimaryIns').and.returnValue(of(primaryInsurance));
    spyOn(wiService, 'getSecondaryIns').and.returnValue(of(secondaryInsurance));
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));

    component.callDependantEndpoint();
    expect(component.dependantEndpointsLoaded).toBeTrue();
  }));

  it('[getwiStatuses] should throw error', async(() => {
    spyOn(wiService, 'getwiStatuses').and.returnValue(throwError("error"));

    spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
    spyOn(wiService, 'getbilligLevels').and.returnValue(of(billingLevelsData));
    spyOn(wiService, 'getPrimaryIns').and.returnValue(of(primaryInsurance));
    spyOn(wiService, 'getSecondaryIns').and.returnValue(of(secondaryInsurance));
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));

    component.callDependantEndpoint();
    expect(wiService.getwiStatuses).toHaveBeenCalled();
    expect(component.dependantEndpointsLoaded).toBeTrue();
    expect(component.wiStatuses.length).toEqual(0);
  }));

  it('[getTeamMembers] should throw error', async(() => {
   spyOn(wiService, 'getAllTeamMembers').and.returnValue(throwError("error"));

    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    spyOn(wiService, 'getbilligLevels').and.returnValue(of(billingLevelsData));
    spyOn(wiService, 'getPrimaryIns').and.returnValue(of(primaryInsurance));
    spyOn(wiService, 'getSecondaryIns').and.returnValue(of(secondaryInsurance));
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));

    component.callDependantEndpoint();
    expect(wiService.getAllTeamMembers).toHaveBeenCalled();
    expect(component.dependantEndpointsLoaded).toBeTrue();
    expect(component.wiTeamMembers.length).toEqual(0);
  }));

  it('[getbillingLevels] should throw error', async(() => {
    spyOn(wiService, 'getbilligLevels').and.returnValue(throwError("error"));

    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
    spyOn(wiService, 'getPrimaryIns').and.returnValue(of(primaryInsurance));
    spyOn(wiService, 'getSecondaryIns').and.returnValue(of(secondaryInsurance));
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));

    component.callDependantEndpoint();
    expect(wiService.getbilligLevels).toHaveBeenCalled();
    expect(component.dependantEndpointsLoaded).toBeTrue();
    expect(component.billingLevels.length).toEqual(0);
  }));

  it('[getPrimaryIns] should throw error', async(() => {
    spyOn(wiService, 'getPrimaryIns').and.returnValue(throwError("error"));

    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
    spyOn(wiService, 'getbilligLevels').and.returnValue(of(billingLevelsData));
    spyOn(wiService, 'getSecondaryIns').and.returnValue(of(secondaryInsurance));
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));

    component.callDependantEndpoint();
    expect(wiService.getPrimaryIns).toHaveBeenCalled();
    expect(component.dependantEndpointsLoaded).toBeTrue();
    expect(component.primaryInsList.length).toEqual(0);
  }));

  it('[getSecondaryIns] should throw error', async(() => {
    spyOn(wiService, 'getSecondaryIns').and.returnValue(throwError("error"));
    // component.getSecondaryIns();

    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
    spyOn(wiService, 'getbilligLevels').and.returnValue(of(billingLevelsData));
    spyOn(wiService, 'getPrimaryIns').and.returnValue(of(primaryInsurance));
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(of({}));

    component.callDependantEndpoint();
    expect(wiService.getSecondaryIns).toHaveBeenCalled();
    expect(component.dependantEndpointsLoaded).toBeTrue();
    expect(component.secondaryInsList.length).toEqual(0);
  }));

  it('[getApprovalReasons] should throw error', async(() => {
    spyOn(wiService, 'getAllApprovalReasons').and.returnValue(throwError("error"));

    spyOn(wiService, 'getwiStatuses').and.returnValue(of(wiStatus));
    spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}));
    spyOn(wiService, 'getbilligLevels').and.returnValue(of(billingLevelsData));
    spyOn(wiService, 'getPrimaryIns').and.returnValue(of(primaryInsurance));
    spyOn(wiService, 'getSecondaryIns').and.returnValue(of(secondaryInsurance));

    component.callDependantEndpoint();
    expect(wiService.getAllApprovalReasons).toHaveBeenCalled();
    expect(component.dependantEndpointsLoaded).toBeTrue();
    expect(component.wiApprovalReasons.length).toEqual(0);
  }));

  it('[generateDianosisGridRows] should generate diagnosis grid rows noOfICDCodes<10', async(() => {
    component.noOfICDCodes = 5;
    spyOn(component, 'enableUpdateButton').and.returnValue(true);
    component.generateDianosisGridRows();
    expect(component.noOfICDCodes).toEqual(6);
    expect(component.enableUpdateButton).toHaveBeenCalled();
  }));

  it('[generateDianosisGridRows] should generate diagnosis grid rows noOfICDCodes>10', async(() => {
    component.noOfICDCodes = 11;
    spyOn(component, 'enableUpdateButton').and.returnValue(true);
    const spy = spyOn(component, 'showInfo').and.callFake(() => "You can only add max 10 ICD codes");
    component.generateDianosisGridRows();
    expect(spy).toHaveBeenCalled();
    expect(component.enableUpdateButton).toHaveBeenCalled();
  }));

  it('[generateDianosisGridRows] should exit the method call when page is loading', async(() => {
    component.noOfICDCodes = 11;
    spyOn(component, 'enableUpdateButton').and.returnValue(false);
    const spy = spyOn(component, 'showInfo');
    component.generateDianosisGridRows();
    expect(spy).not.toHaveBeenCalledWith("You can only add max 10 ICD codes");
    expect(component.enableUpdateButton).toHaveBeenCalled();
  }));

  // it('[generateDianosisGridRows] should generate diagnosis grid rows icdCodes.length > noOfICDCodes', async(() => {
  //   component.noOfICDCodes = 1;
  //   component.setICDForm(icdCodes);
  //   console.log(component.icdCodes.length);

  //   // spyOn(component, 'showInfo').and.callFake(()=>"You can only add max 10 ICD codes");
  //   component.generateDianosisGridRows();
  // }));

  it('[generateDrugGridRows] should generate diagnosis grid rows noOfdrugCodes<13', async(() => {
    component.noOfdrugCodes = 5;
    spyOn(component, 'enableUpdateButton').and.returnValue(true);
    component.generateDrugGridRows();
    expect(component.noOfdrugCodes).toEqual(6);
  }));

  it('[generateDrugGridRows] should generate diagnosis grid rows noOfdrugCodes>13', async(() => {
    component.noOfdrugCodes = 14;
    spyOn(component, 'enableUpdateButton').and.returnValue(true);
    const spy = spyOn(component, 'showInfo').and.callFake(() => "You can only add max 10 drug codes");
    component.generateDrugGridRows();
    expect(spy).toHaveBeenCalled();
  }));

  it('[generateDrugGridRows] should exit the method call when page is loading', async(() => {
    component.noOfdrugCodes = 14;
    spyOn(component, 'enableUpdateButton').and.returnValue(false);
    const spy = spyOn(component, 'showInfo');
    component.generateDrugGridRows();
    expect(spy).not.toHaveBeenCalledWith("You can only add max 13 Drug codes");
    expect(component.enableUpdateButton).toHaveBeenCalled();
  }));

  // it('[onSubmit] should return false when form is invalid', async(() => {
  //   const val =component.onSubmit();
  //   expect(val).toBeFalse();
  // }));

  it('[loadDenialTypes] should make api call', async(() => {
    const spy = spyOn(wiService, 'getDenialTypes').and.returnValue(of({}));
    component.loadDenialTypes();
    expect(spy).toHaveBeenCalled();
  }))

  it('[loadOrderTypes] should make api call', async(() => {
      const spy = spyOn(wiService, 'getOrderTypes').and.returnValue(of({}));
      component.loadOrderTypes();
      expect(spy).toHaveBeenCalled();
    }));

  it('[onStatusChange] should enable/disable fields', async(() => {
    component.wiStatuses = [{workItemStatusId: 1, workItemStatusName: "Approved"}, {workItemStatusId: 4, workItemStatusName: "Denied"}];
    component.deniedStatus = 4;
    let updateStatus = { workItemStatusId: 1 };
    component.formWorkItem.patchValue(updateStatus);
    component.onStatusChange({target: {value: 1}});
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('isDenied').disabled).toBeTruthy();

    updateStatus = { workItemStatusId: 4 };
    component.formWorkItem.patchValue(updateStatus);
    component.onStatusChange({target: {value: 4}});
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('isDenied').enabled).toBeTruthy();
  }));

  it('[onDenialChange] should enable/disable fields', async(() => {
    let updateDenial = {isDenied: true};
    component.formWorkItem.patchValue(updateDenial);
    component.onDenialChange({target: {value: "true"}}, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('denialTypeId').enabled).toBeTruthy();

    updateDenial = {isDenied: false};
    component.formWorkItem.patchValue(updateDenial);
    component.onDenialChange({target: {value: "false"}}, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('denialTypeId').disabled).toBeTruthy();
  }))

  it('dosage field should disable', async(() => {
    component.wiStatuses = [{workItemStatusId: 4, workItemStatusName: "Denied"}];
    let deny = { workItemStatusId: 4 };
    let enableDenial = {isDenied: "true"};
    let disableDenial = {isDenied: "false"};
    let priorAuthYes = {priorAuth: "Y"};
    let priorAuthNo = {priorAuth: "N"};

    component.formWorkItem.patchValue(deny);
    component.drugCodes.controls[0].patchValue(enableDenial);
    component.drugCodes.controls[0].patchValue(priorAuthYes);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('drugDosage').enabled).toBeTruthy();

    component.drugCodes.controls[0].patchValue(disableDenial);
    component.onDenialChange({target: {value: "false"}}, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('drugDosage').enabled).toBeTruthy();

    component.drugCodes.controls[0].patchValue(priorAuthNo);
    component.OnPirorAuth({target: {value: "N"}}, 0, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('drugDosage').enabled).toBeFalsy();

    component.drugCodes.controls[0].patchValue(enableDenial);
    component.onDenialChange({target: {value: "true"}}, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('drugDosage').enabled).toBeTruthy();

    component.drugCodes.controls[0].patchValue(priorAuthYes);
    component.OnPirorAuth({target: {value: "Y"}}, 0, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('drugDosage').enabled).toBeTruthy();



    component.drugCodes.controls[0].patchValue(priorAuthNo);
    component.OnPirorAuth({target: {value: "N"}}, 0, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('drugDosage').enabled).toBeTruthy();

    component.drugCodes.controls[0].patchValue(disableDenial);
    component.onDenialChange({target: {value: "false"}}, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('drugDosage').enabled).toBeFalsy();

    component.drugCodes.controls[0].patchValue(priorAuthYes);
    component.OnPirorAuth({target: {value: "Y"}}, 0, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('drugDosage').enabled).toBeTruthy();

    component.drugCodes.controls[0].patchValue(enableDenial);
    component.onDenialChange({target: {value: "true"}}, 0);
    fixture.detectChanges();
    expect(component.drugCodes.controls[0].get('drugDosage').enabled).toBeTruthy();
  }))

  it('[onSubmit] should submit form when all value are set', inject([Router], (router: Router) => {
    const editFormReq = { workItemId: 22, teamMemberId: 1, workItemStatusId: 1, facilityBillingLevelId: 7, dateOut: { year: 2021, month: 2, day: 25 }, providerId: 1, orderDate: { year: 2021, month: 2, day: 18 }, buyBill: "Y", externalWorkId: "123", orderTypeId: 1, wiInsurance: { primaryInsRep: "John", primaryInsRefNum: "999", primaryInNetwork: "Y", deductibleMax: 3000, deductibleMet: 1111, outOfPocketMax: 222, outOfPocketMet: 100, coInsurance: 20, primaryInsClassification: 3, primaryInsNotes: "Test", secondaryInsRefNum: "879", secondaryInsRep: "Fed", secondaryInNetwork: "Y", secondaryInsClassification: 22, secondaryInsNotes: "Test" }, generalNotes: "Test", drugCodes: [{ createdBy: 1, modifiedBy: 1, drugProcCode: "J0135", isCover: "Y", priorAuth: "Y", priorAuthApprovalReason: 2, drugDosage: "10.5", drugDenied: "false", denialTypeId: 1, workItemDrugCodeId: 15, workItemId: 22, priorAuthNo: "456", priorAuthFromDate: { year: 2021, month: 3, day: 2 }, priorAuthToDate: { year: 2021, month: 3, day: 13 }, priorAuthNotes: "prior auth", visitsApproved: "2", unitsApproved: "1", advocacyNeeded: "Y", advocayNeededNotes: null }, { createdBy: 1, modifiedBy: 1, drugProcCode: "J0135", isCover: "Y", priorAuth: "Y", priorAuthApprovalReason: 2, drugDosage: "10", drugDenied: "false", denialTypeId: 1, workItemDrugCodeId: 15, workItemId: 22, priorAuthNo: "456", priorAuthFromDate: { year: 2021, month: 3, day: 2 }, priorAuthToDate: { year: 2021, month: 3, day: 13 }, priorAuthNotes: "prior auth", visitsApproved: "2", unitsApproved: "1", advocacyNeeded: "Y", advocayNeededNotes: null }], icdCodes: [{ createdBy: 1, modifiedBy: 1, icdCode: "A00.0", workItemIcdCodeId: 11 }] };
    const editFormResp = { active: true, createdDate: "2021-02-23T22:57:47.616+0000", createdBy: 1, modifiedDate: "2021-02-28T01:17:55.239+0000", modifiedBy: 1, workItemId: 22, patientId: 3, providerId: 1, facilityBillingTypeId: 1, facilityBillingLevelId: 7, workItemStatusId: 1, orderTypeId: 1, orderDate: "2021-02-18T08:00:00.000+0000", referralNumber: "", notes: "", generalNotes: "Test", assignedToId: 0, dateIn: "0191-05-02T08:00:00.000+0000", dateOut: "2021-02-25T08:00:00.000+0000", buyBill: "U", externalWorkId: "123", wiInsurance: { active: true, createdDate: null, createdBy: 1, modifiedDate: "2021-02-28T01:17:55.255+0000", modifiedBy: 1, workItemInsId: 10, primaryInsRep: "John", primaryInsRefNum: "999", primaryInNetwork: "Y", deductibleMax: 3000, deductibleMet: 1111, outOfPocketMax: 222, outOfPocketMet: 100, coInsurance: 20, primaryInsNotes: "Test", primaryInsClassification: 3, secondaryInsRep: "Fed", secondaryInsRefNum: "879", secondaryInNetwork: "Y", secondaryInsNotes: "Testing", secondaryInsClassification: 22, workItemId: 22, secondaryInsuranceName: "", primaryInsuranceName: "" }, icdCodes: [{ active: true, createdDate: null, createdBy: 1, modifiedDate: "2021-02-28T01:17:55.268+0000", modifiedBy: 1, workItemIcdCodeId: 11, workItemId: 22, icdId: 2 }], drugCodes: [{ active: true, createdDate: null, createdBy: 1, modifiedDate: "2021-02-28T01:17:55.262+0000", modifiedBy: 1, workItemDrugCodeId: 15, workItemId: 22, drugId: 2, isCover: "Y", priorAuth: "Y", priorAuthNo: "456", priorAuthFromDate: "2021-03-02T08:00:00.000+0000", priorAuthToDate: "2021-03-13T08:00:00.000+0000", priorAuthNotes: "prior auth", priorAuthApprovalReason: 2, visitsApproved: "2", unitsApproved: "1", advocacyNeeded: "Y", advocacyNotes: "" }] };
    component.wiStatuses = [{workItemStatusId: 1, workItemStatusName: "Approved"}, {workItemStatusId: 4, workItemStatusName: "Denied"}];
    component.deniedStatus = 4;
    let updateStatus = { workItemStatusId: 1 };
    component.formWorkItem.patchValue(updateStatus);
    component.onStatusChange({target: {value: 1}});
    component.onDenialChange({target: {value: "false"}}, 0);
    fixture.detectChanges();

    component.formWorkItem.patchValue(editFormReq);
    component.drugList = drugCodes;
    component.icdList = icdCodes;
    component.formWorkItem.setControl('drugCodes', component.setDrugForm() || []);
    component.formWorkItem.setControl('icdCodes', component.setICDForm() || []);

    spyOn(router, 'navigate').and.stub();
    spyOn(wiService, 'updateWorkItem').and.returnValue(of(editFormResp));
    const spy = spyOn(component, 'showSuccess').and.callFake(() => "Updated successfully");
    spyOn(fileAttachmentService, 'postAttachments').and.returnValue(of({}));
    spyOn(fileAttachmentService, 'deleteAttachments').and.returnValue(of({}));

    component.onSubmit();
    expect(spy).toHaveBeenCalled();
    expect(component.submitted).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/workmenu/workItemMaintenance']);

  }));
  it('[onSubmit] for invalid form true', inject([Router], (router: Router) => {
    const editFormReq = {buyBill: "Y",dateOut: "1212123343"};
    component.formWorkItem.patchValue(editFormReq);
    component.onSubmit();
    expect(component.formWorkItem.invalid).toBeTruthy();
  }));

  it('[onSubmit] shows error messages', inject([Router], (router: Router) => {
    const patchForm = {drugCodes: [{ createdBy: 1, modifiedBy: 1, drugProcCode: "J0135", isCover: "Y", priorAuth: "Y", priorAuthApprovalReason: 2, drugDosage: "0", drugDenied: "false", denialTypeId: 1, workItemDrugCodeId: 15, workItemId: 22, priorAuthNo: "456", priorAuthFromDate: { year: 2021, month: 3, day: 2 }, priorAuthToDate: { year: 2021, month: 3, day: 13 }, priorAuthNotes: "prior auth", visitsApproved: "2", unitsApproved: "1", advocacyNeeded: "Y", advocayNeededNotes: null }, { createdBy: 1, modifiedBy: 1, drugProcCode: "J0135", isCover: "Y", priorAuth: "Y", priorAuthApprovalReason: 2, drugDosage: "10", drugDenied: "true", denialTypeId: null, workItemDrugCodeId: 15, workItemId: 22, priorAuthNo: "456", priorAuthFromDate: { year: 2021, month: 3, day: 2 }, priorAuthToDate: { year: 2021, month: 3, day: 13 }, priorAuthNotes: "prior auth", visitsApproved: "2", unitsApproved: "1", advocacyNeeded: "Y", advocayNeededNotes: null }]};
    component.formWorkItem.patchValue(patchForm);
    component.onSubmit();
    expect(component.formWorkItem.invalid).toBeTruthy();
  }));


  it('[trackByIcdCode] should return val', async(() => {
    const val = { icdId: 'J0170' };
    expect(component.trackByIcdCode(val)).not.toBeNull();
  }));

  it('[trackByDrugCode] should return val', async(() => {
    const val = 'A00.1-Cholera due to Vibrio cholerae 01, biovar eltor';
    expect(component.trackByDrugCode(val)).toEqual(val);
  }));

 it('[onIcdCodeChange] should patch icd value to the form', async(() => {
   const selectedValue= 'JA00.1-Cholera due to Vibrio cholerae 01, biovar eltor';
   const Ctrlidx= 0;
   component.drugList = drugCodes;
   component.icdList = icdCodes;
   const searchResult = [{ "workItemDrugCodeId": 28, "active":true,"primaryInsuranceId":1,"secondaryInsuranceId":"22, 2", "icds":'JA00.1, JA00.12', "workItemId": 8, "advocacyNeeded": "Y", "advocacyNotes": "", "drugId": 9,  "drugProcCode": "J9025", "patientId": 4, "patientMrn": "mrn8888", "priorAuthStatusId": 1, "facilityName": "Facility 1", "statusName": "New" }];
   component.drugAdvocacies = searchResult;
   component.formWorkItem.setControl('drugCodes', component.setDrugForm() || []);
   component.formWorkItem.setControl('icdCodes', component.setICDForm() || []);
   component.onIcdCodeChange(selectedValue, Ctrlidx);
   expect(component.icdCodes).not.toBeNull();
   component.drugAdvocacies = [];
  }));

  it('[onDrugCodeChange] should patch drug value to the form duplicate', async(() => {
    const selectedValue= 'J9025-Adrenalin epinephrin inject-Adrenalin epinephrin inject';
    const Ctrlidx= 0;
    component.drugList = drugCodes;
    component.icdList = icdCodes;
    const searchResult = [{ "workItemDrugCodeId": 28, "active":true,"primaryInsuranceId":1,"secondaryInsuranceId":"22, 2", "icds":'A00.0, JA00.12', "workItemId": 8, "advocacyNeeded": "Y", "advocacyNotes": "", "drugId": 9,  "drugProcCode": "J9025", "patientId": 4, "patientMrn": "mrn8888", "priorAuthStatusId": 1, "facilityName": "Facility 1", "statusName": "New" }];
    component.drugAdvocacies = searchResult;
    component.formWorkItem.setControl('drugCodes', component.setDrugForm() || []);
    component.formWorkItem.setControl('icdCodes', component.setICDForm() || []);
    component.onDrugCodeChange(selectedValue, Ctrlidx);
    expect(component.drugCodes).not.toBeNull();
    component.drugAdvocacies = [];
   }));
  it('[onDrugCodeChange] should patch drug value to the form no duplicate', async(() => {
    const selectedValue= 'J9075-Adrenalin epinephrin inject-Adrenalin epinephrin inject';
    const Ctrlidx= 0;
    component.drugList = drugCodes;
    component.icdList = icdCodes;
    const searchResult = [{ "workItemDrugCodeId": 28, "active":true,"primaryInsuranceId":1,"secondaryInsuranceId":"22, 2", "icds":'A00.0, JA00.12', "workItemId": 8, "advocacyNeeded": "Y", "advocacyNotes": "", "drugId": 9,  "drugProcCode": "J9075", "patientId": 4, "patientMrn": "mrn8888", "priorAuthStatusId": 1, "facilityName": "Facility 1", "statusName": "New" }];
    component.drugAdvocacies = searchResult;
    component.formWorkItem.setControl('drugCodes', component.setDrugForm() || []);
    component.formWorkItem.setControl('icdCodes', component.setICDForm() || []);
    component.onDrugCodeChange(selectedValue, Ctrlidx);
    expect(component.drugCodes).not.toBeNull();
    component.drugAdvocacies = [];
   }));

   it('[OnPriorAuth] enable controls if its value is N', async(() => {
    let event = new Event('change');
    Object.defineProperty(event, 'target', { writable: false, value: 'N' });
    const idx = 0;
    const id = 1;

    component.formWorkItem.patchValue(wiData);
    component.formWorkItem.setControl('drugCodes', component.setDrugForm() || []);
    spyOn(component, 'enableUpdateButton').and.returnValue(true);

    component.generateDrugGridRows();

    component.OnPirorAuth(event, idx, id);
    expect(component.drugCodes.controls).not.toBeNull();
  }));
  it('[OnPriorAuth] enable controls if its value is Y', async(() => {
    let event={'target':{value:'Y'}};
    const idx = 0;
    const id = 1;

    component.formWorkItem.patchValue(wiData);
    component.formWorkItem.setControl('drugCodes', component.setDrugForm() || []);
    spyOn(component, 'enableUpdateButton').and.returnValue(true);
    component.generateDrugGridRows();

    component.OnPirorAuth(event, idx, id);
    expect(component.drugCodes.controls).not.toBeNull();
  }));

  it('[deleteWI] should delete workitem', inject([Router], (router: Router) => {
    const winum = 13;
    spyOn(router, 'navigate').and.stub();
    const spy = spyOn(wiService, 'deleteWorkItem').and.returnValue(of({}));
    spyOn(component, 'showSuccess').and.callFake(() => "deleted successfully");

    component.deleteWI(winum);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/workmenu/workItemMaintenance']);
    expect(spy).toHaveBeenCalled();
  }));

  it('[deleteWI] should throw error', () => {
    const winum = 13;
    const spy = spyOn(wiService, 'deleteWorkItem').and.returnValue(throwError("error"));
    spyOn(component, 'showFailure').and.callFake(() => "Work item is not deleted due to an internal error");

    component.deleteWI(winum);
    expect(spy).toHaveBeenCalled();
  });

  it('load Drug Advocacy', fakeAsync(() => {
    component.drugAdvocacies = advocacies;
    const spy = spyOn(drugAdvocacyService, 'getAllAdvocacies').and.returnValue(of({
    }));
    component.loadDrugAdvocacy();
    expect(spy).toHaveBeenCalled();
  }));

  it('load Drug Advocacy throws error', fakeAsync(() => {
    let err = "error";
    const spy = spyOn(drugAdvocacyService, 'getAllAdvocacies').and.returnValue(throwError(err));
    component.loadDrugAdvocacy();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSearch] should search appointment when form is valid with advocacies', async(() => {
    component.drugList = drugCodes;
    component.icdList = icdCodes;
    const searchResult = [{ "workItemDrugCodeId": 28, "active":true,"primaryInsuranceId":1,"secondaryInsuranceId":"22, 2", "icds":'A00.0, JA00.12', "workItemId": 8, "advocacyNeeded": "Y", "advocacyNotes": "", "drugId": 9,  "drugProcCode": "J9025", "patientId": 4, "patientMrn": "mrn8888", "priorAuthStatusId": 1, "facilityName": "Facility 1", "statusName": "New" }];
    component.drugAdvocacies = searchResult;
    component.formWorkItem.setControl('drugCodes', component.setDrugForm() || []);
    component.formWorkItem.setControl('icdCodes', component.setICDForm() || []);
    component.onInsuranceChange();
    expect(component.drugCodes).toBeTruthy;
    component.drugAdvocacies = [];
  }));

  it('On alphanumericOnly', () => {
    let event = new Event('change');
    Object.defineProperty(event, 'target', { writable: false, value: 'N' });
    component.alphanumericOnly(event);
    expect(component.f).toBeTruthy();
  });

  it('On decimalNumericOnly', () => {
    let event = new Event('change');
    Object.defineProperty(event, 'target', { writable: false, value: '1.1' });
    component.decimalNumericOnly(event);
    expect(component.f).toBeTruthy();
  });

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

  it('[enableUpdateButton] return true', () => {
    component.dependantEndpointsLoaded= true;
    component.drugAdvocacyLoaded= true;
    expect(component.enableUpdateButton()).toBeTruthy();
  });

  it('[enableUpdateButton] return false when dependantEndpointsLoaded is false', () => {
    component.dependantEndpointsLoaded= false;
    component.drugAdvocacyLoaded= true;
    expect(component.enableUpdateButton()).toBeFalse();
  });

  it('[enableUpdateButton] return false when drugAdvocacyLoaded is false', () => {
    component.dependantEndpointsLoaded= true;
    component.drugAdvocacyLoaded= false;
    expect(component.enableUpdateButton()).toBeFalse();
  });

  it('[initializeFormList] set wiStatuses, billingLevels and facilities list', () => {
    component.initializeFormList();
    expect(component.facilities[0].facilityName).toEqual(wiData.facilityName);
  });

  it('[exportPDF] should export data to pdf file', fakeAsync(() => {
    component.wiInfo = wiData;
    let wiNumber = 123;
    spyOn(wiService, 'getWorkItemById').and.returnValue(of(wiData));
    // component.onView(wiNumber);
    component.exportPDF();
    flush();

    expect(component.exportPDF).toBeTruthy();
  }));

  it('[exportPDF] should create new pages', fakeAsync(() => {
    component.wiInfo = wiData;
    component.wiInfo.drugCodes = drugCodes;
    component.wiInfo.icdCodes = icdCodes;
    let wiNumber = 123;
    spyOn(wiService, 'getWorkItemById').and.returnValue(of(wiData));
    // component.onView(wiNumber);
    component.exportPDF();
    flush();

    expect(component.exportPDF).toBeTruthy();
  }));

  it('[getInsuranceClassification] is called with type and id', () => {
    let type = 'primaryInsurance';
    let pi = {
      insuranceId: 123,
      insuranceName: 'primaryIns1'
    }
    component.primaryInsList = [{insuranceId: 123, insuranceName: 'primaryName'}]
    component.getInsuranceClassificationName(type, pi.insuranceId);
    expect(component.getInsuranceClassificationName).toBeTruthy();
  });

  it('[getInsuranceClassification] is called with type and id (case 2)', () => {
    let type = 'primaryInsurance';
    let pi = {
      insuranceId: 123,
      insuranceName: 'primaryIns1'
    }
    component.primaryInsList = [{insuranceId: 465, insuranceName: 'primaryName'}]
    component.getInsuranceClassificationName(type, pi.insuranceId);
    expect(component.getInsuranceClassificationName).toBeTruthy();
  });

  it('[getInsuranceClassification] is called with type and id (secondary)', () => {
    let type = 'secondaryInsurance';
    let pi = {
      insuranceId: 281,
      insuranceName: 'secondaryIns1'
    }
    component.secondaryInsList = [{insuranceId: 281, insuranceName: 'secondaryName'}]
    component.getInsuranceClassificationName(type, pi.insuranceId);
    expect(component.getInsuranceClassificationName).toBeTruthy();
  });

  it('[getInsuranceClassification] is called with type and id (secondary)', () => {
    let type = 'secondaryInsurance';
    let pi = {
      insuranceId: 281,
      insuranceName: 'secondaryIns1'
    }
    component.secondaryInsList = [{insuranceId: 81, insuranceName: 'secondaryName'}]
    component.getInsuranceClassificationName(type, pi.insuranceId);
    expect(component.getInsuranceClassificationName).toBeTruthy();
  });

  it('[getApprovalReasonLabel] gets approved with approvalId', () => {
    let approvalId = 123;
    component.wiApprovalReasons = [
      {priorAuthStatusId: 123, priorAuthStatusName: 'authStatusNameTest'}
    ];
    component.getApprovalReasonValue(approvalId);
    expect(component.getApprovalReasonValue).toBeTruthy();
  });

  it('[getApprovalReasonLabel] gets denied with invalid approvalId', () => {
    let approvalId = 123;
    component.wiApprovalReasons = [
      {priorAuthStatusId: 968, priorAuthStatusName: 'authStatusNameTest'}
    ];
    component.getApprovalReasonValue(approvalId);
    expect(component.getApprovalReasonValue).toBeTruthy();
  });

  it('[getTeamMemberName] get names with teamMemberId', () => {
    let teamMemberId = 345;
    component.wiTeamMembers = [
      {userId: 345, userName: 'teamMemberNameTest'}
    ];
    const spy = spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}))
    component.getTeamMemberNameLabel(teamMemberId);
    expect(component.getTeamMemberNameLabel).toBeTruthy();
  });

  it('[getTeamMemberName] does not get names with teamMemberId', () => {
    let teamMemberId = 345;
    component.wiTeamMembers = [
      {userId: 789, userName: 'teamMemberNameTest'}
    ];
    const spy = spyOn(wiService, 'getAllTeamMembers').and.returnValue(of({}))
    component.getTeamMemberNameLabel(teamMemberId);
    expect(component.getTeamMemberNameLabel).toBeTruthy();
  });

  it('should filter icd input', fakeAsync(() => {
    spyOn(component, "enableUpdateButton").and.returnValue(true);
    let spy = spyOn(wiService, "getIcdDetails").and.callFake(() => of([]));
    component.generateDianosisGridRows();
    fixture.detectChanges();

    component.icdCodesInput$[0].next("A1");
    tick(1000);
    
    expect(spy).toHaveBeenCalledWith("A1");
  }));

  it('should setup icd subscribers', () => {
    component.loadicdCodes();
    expect(component.icdCodesFiltered$.length).toEqual(3);
    expect(component.icdCodesInput$.length).toEqual(3);
  });

  it('should filter drug code input', fakeAsync(() => {
    spyOn(component, "enableUpdateButton").and.returnValue(true);
    let spy = spyOn(wiService, "getDrugDetails").and.callFake(() => of([]));
    component.generateDrugGridRows();
    fixture.detectChanges();

    component.drugCodesInput$[0].next("J1");
    tick(1000);
    
    expect(spy).toHaveBeenCalledWith("J1");
  }));

  it('should setup drug code subscribers', () => {
    component.loadDrugCodes();
    expect(component.drugCodesFiltered$.length).toEqual(2);
    expect(component.drugCodesInput$.length).toEqual(2);
  });
});
