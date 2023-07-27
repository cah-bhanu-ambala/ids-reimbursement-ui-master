import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { userInfo } from 'os';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/common/services/http/authentication.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { Menu } from 'src/app/models/classes/menu';
import { User } from 'src/app/models/classes/user';

import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let patientService: PatientService;
  let authenticationService: AuthenticationService;
  let router: Router;

  const facilityData = [
    {
      active: true,
      createdDate: "2021-02-01T17:54:57.974+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:54:57.974+0000",
      modifiedBy: 1,
      facilityBillingDetailId: 1,
      facilityId: "1",
      facilityName: "facilityName -1",
      billingLevelId: 5,
      billingAmount: 1,
      systemId: "0",
      billingLevelName: "PHARM L1"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:54:57.994+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:54:57.994+0000",
      modifiedBy: 1,
      facilityBillingDetailId: 2,
      facilityId: "100",
      facilityName: "facilityName -100",
      billingLevelId: 6,
      billingAmount: 2,
      systemId: "11",
      billingLevelName: "PHARM L2"
    }
  ];

  const currentUser: any = { "active": true, "createdDate": new Date("2021-05-25T02:27:15.633+00:00"), "createdBy": 53,
    "modifiedDate": new Date("2021-05-25T02:27:15.633+00:00"), "modifiedBy": null,
    "userId": 55, "userName": "Siva", "userEmail": "adminsiva@ch.com", "teamLeadId": 0, "userRoleId": 1,
    "delegateUserId": 0,
    "facilityId": "100",
    "systemId": "11",
    "userWbs": null, "userRole": { "active": true, "createdDate": "2021-05-25T02:27:15.633+00:00", "createdBy": 53, "modifiedDate": "2021-05-25T02:27:15.633+00:00", "modifiedBy": null, "userRoleId": 1, "userRoleName": "Superuser", "roleMenus": [{ "menuId": 1, "mainMenu": "Admin", "subMenu": "", "url": "", "notificationRequired": false }, { "menuId": 2, "mainMenu": "Admin", "subMenu": "Drug Code Maintenance", "url": "/dashboard/admin/drugProcMaintenance", "notificationRequired": false }, { "menuId": 3, "mainMenu": "Admin", "subMenu": "Facility Maintenance", "url": "/dashboard/admin/facilityMaintenance", "notificationRequired": false }, { "menuId": 4, "mainMenu": "Admin", "subMenu": "Facility Approval", "url": "/dashboard/admin/facilityApproval", "notificationRequired": false }, { "menuId": 5, "mainMenu": "Admin", "subMenu": "User Management", "url": "/dashboard/admin/userManagement", "notificationRequired": false }, { "menuId": 42, "mainMenu": "Admin", "subMenu": "Drug Advocacy Management", "url": "/dashboard/admin/drugAdvocacyManagement", "notificationRequired": false }, { "menuId": 6, "mainMenu": "Support", "subMenu": "", "url": "", "notificationRequired": false }, { "menuId": 7, "mainMenu": "Support", "subMenu": "Patient Maintenance", "url": "/dashboard/support/patientMaintenance", "notificationRequired": false }, { "menuId": 8, "mainMenu": "Support", "subMenu": "Provider Maintenance", "url": "/dashboard/support/ProviderMaintenance", "notificationRequired": false }, { "menuId": 9, "mainMenu": "Support", "subMenu": "Contact Maintenance", "url": "/dashboard/support/contactMaintenance", "notificationRequired": false }, { "menuId": 10, "mainMenu": "Work", "subMenu": "", "url": "", "notificationRequired": true }, { "menuId": 11, "mainMenu": "Work", "subMenu": "Add Work Item", "url": "/dashboard/workmenu/addWorkItem", "notificationRequired": false }, { "menuId": 12, "mainMenu": "Work", "subMenu": "Work Item Maintenance", "url": "/dashboard/workmenu/workItemMaintenance", "notificationRequired": false }, { "menuId": 13, "mainMenu": "Work", "subMenu": "Customer Entered Work Items", "url": "/dashboard/workmenu/customerWorkItem", "notificationRequired": true }, { "menuId": 14, "mainMenu": "Work", "subMenu": "View Work Item", "url": "/dashboard/workmenu/viewWorkItem", "notificationRequired": false }, { "menuId": 38, "mainMenu": "Work", "subMenu": "View Patients", "url": "/dashboard/workmenu/viewPatientData", "notificationRequired": false }, { "menuId": 15, "mainMenu": "Advocacy", "subMenu": "", "url": "", "notificationRequired": true }, { "menuId": 16, "mainMenu": "Advocacy", "subMenu": "Add Advocacy", "url": "/dashboard/advocacy/addAdvocacy", "notificationRequired": false }, { "menuId": 17, "mainMenu": "Advocacy", "subMenu": "Advocacy Maintenance", "url": "/dashboard/advocacy/advocacyMaintenance", "notificationRequired": false }, { "menuId": 18, "mainMenu": "Advocacy", "subMenu": "Add Appointment", "url": "/dashboard/advocacy/addAppointment", "notificationRequired": true }, { "menuId": 19, "mainMenu": "Advocacy", "subMenu": "Advocacy Opportunities", "url": "/dashboard/advocacy/opportunities", "notificationRequired": false }, { "menuId": 20, "mainMenu": "Reports", "subMenu": "", "url": "", "notificationRequired": false }, { "menuId": 21, "mainMenu": "Reports", "subMenu": "Work Status", "url": "/dashboard/reports/workstatus", "notificationRequired": false }, { "menuId": 22, "mainMenu": "Reports", "subMenu": "Summary", "url": "/dashboard/reports/summary", "notificationRequired": false }, { "menuId": 23, "mainMenu": "Reports", "subMenu": "Billing", "url": "/dashboard/reports/billing", "notificationRequired": false }, { "menuId": 24, "mainMenu": "Reports", "subMenu": "Delinquency", "url": "/dashboard/reports/delinquency", "notificationRequired": false }, { "menuId": 25, "mainMenu": "Reports", "subMenu": "Advocacy Analysis", "url": "/dashboard/reports/advocacyanalysis", "notificationRequired": false }, { "menuId": 37, "mainMenu": "Reports", "subMenu": "Deleted Work Items", "url": "/dashboard/reports/deletedWorkItems", "notificationRequired": false }, { "menuId": 39, "mainMenu": "Reports", "subMenu": "Boss Invoice", "url": "/dashboard/reports/bossInvoice", "notificationRequired": false }, { "menuId": 26, "mainMenu": "Customer Work", "subMenu": "", "url": "", "notificationRequired": true }, { "menuId": 27, "mainMenu": "Customer Work", "subMenu": "Add Work Item", "url": "/dashboard/customerworkmenu/addCustomerWorkItem", "notificationRequired": false }, { "menuId": 28, "mainMenu": "Customer Work", "subMenu": "Submitted Work Items", "url": "/dashboard/customerworkmenu/viewSubmittedCustomerWork", "notificationRequired": false }, { "menuId": 29, "mainMenu": "Customer Work", "subMenu": "Submit Patient Info", "url": "/dashboard/customerworkmenu/submitPatientInfo", "notificationRequired": false }, { "menuId": 30, "mainMenu": "Customer Work", "subMenu": "View Work Items", "url": "/dashboard/customerworkmenu/viewCompletedCustomerWorkItems", "notificationRequired": false }, { "menuId": 31, "mainMenu": "Customer Work", "subMenu": "Appointment Maintenance", "url": "/dashboard/customerworkmenu/appointmentMaintenance", "notificationRequired": true }, { "menuId": 32, "mainMenu": "Customer Reports", "subMenu": "", "url": "", "notificationRequired": false }, { "menuId": 33, "mainMenu": "Customer Reports", "subMenu": "Orders Completed", "url": "/dashboard/customerReports/ordersCompleted", "notificationRequired": false }, { "menuId": 34, "mainMenu": "Customer Reports", "subMenu": "Advocacy By Type", "url": "/dashboard/customerReports/advocacyByType", "notificationRequired": false }, { "menuId": 35, "mainMenu": "Customer Reports", "subMenu": "Advocacy By Amount", "url": "/dashboard/customerReports/advocacyByAmount", "notificationRequired": false }, { "menuId": 36, "mainMenu": "Customer Reports", "subMenu": "Secured Advocacy", "url": "/dashboard/customerReports/securedAdvocacy", "notificationRequired": false }] } }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [PatientService, AuthenticationService,
      //   {
      //   provide: ActivatedRoute, useValue: activatedRouteMock
      // },
      {
        provide: Router,
        useClass: class {
          navigate = jasmine.createSpy("navigate");
        }
      }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    patientService = TestBed.inject(PatientService);
    authenticationService = TestBed.inject(AuthenticationService);
    component.ngOnInit();
    fixture.detectChanges();

    let store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };

    spyOn(localStorage, 'getItem')
      .and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem')
      .and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem')
      .and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear')
      .and.callFake(mockLocalStorage.clear);

      Object.defineProperty(window, 'localStorage', { value: mockLocalStorage,configurable:true,enumerable:true,writable:true });

      const currentUser = {
        "active": true,
        "createdDate": "2021-04-27T20:52:08.268+00:00",
        "createdBy": 7,
        "modifiedDate": "2021-04-27T20:52:08.268+00:00",
        "modifiedBy": null,
        "userId": 17,
        "systemId": "11",
        "userName": "admin",
        "teamLeadId": 0,
        "userRoleId": 1,
        "delegateUserId": 0,
        "facilityId": 0,
        "userWbs": null,
        "userRole": {
          "active": true,
          "createdDate": "2021-04-27T20:52:08.268+00:00",
          "createdBy": 7,
          "modifiedDate": "2021-04-27T20:52:08.268+00:00",
          "modifiedBy": null,
          "userRoleId": 1,
          "userRoleName": "meghana",
          "roleMenus": [
            {
              "menuId": 1,
              "mainMenu": "Admin",
              "subMenu": "",
              "url": "",
              "notificationRequired": false
            },
            {
              "menuId": 2,
              "mainMenu": "Admin",
              "subMenu": "Drug Code Maintenance",
              "url": "/dashboard/admin/drugProcMaintenance",
              "notificationRequired": false
            },
            {
              "menuId": 3,
              "mainMenu": "Admin",
              "subMenu": "Facility Maintenance",
              "url": "/dashboard/admin/facilityMaintenance",
              "notificationRequired": false
            },
            {
              "menuId": 4,
              "mainMenu": "Admin",
              "subMenu": "Facility Approval",
              "url": "/dashboard/admin/facilityApproval",
              "notificationRequired": false
            },
            {
              "menuId": 5,
              "mainMenu": "Admin",
              "subMenu": "User Management",
              "url": "/dashboard/admin/userManagement",
              "notificationRequired": false
            },
            {
              "menuId": 38,
              "mainMenu": "Admin",
              "subMenu": "Drug Advocacy Management",
              "url": "/dashboard/admin/drugAdvocacyManagement",
              "notificationRequired": false
            },
            {
              "menuId": 40,
              "mainMenu": "Admin",
              "subMenu": "Drug Advocacy Clearance",
              "url": "/dashboard/admin/drugAdvocacyClearance",
              "notificationRequired": false
            },
            {
              "menuId": 6,
              "mainMenu": "Support",
              "subMenu": "",
              "url": "",
              "notificationRequired": false
            },
            {
              "menuId": 7,
              "mainMenu": "Support",
              "subMenu": "Patient Maintenance",
              "url": "/dashboard/support/patientMaintenance",
              "notificationRequired": false
            },
            {
              "menuId": 8,
              "mainMenu": "Support",
              "subMenu": "Provider Maintenance",
              "url": "/dashboard/support/ProviderMaintenance",
              "notificationRequired": false
            },
            {
              "menuId": 9,
              "mainMenu": "Support",
              "subMenu": "Contact Maintenance",
              "url": "/dashboard/support/contactMaintenance",
              "notificationRequired": false
            },
            {
              "menuId": 10,
              "mainMenu": "Work",
              "subMenu": "",
              "url": "",
              "notificationRequired": true
            },
            {
              "menuId": 11,
              "mainMenu": "Work",
              "subMenu": "Add Work Item",
              "url": "/dashboard/workmenu/addWorkItem",
              "notificationRequired": false
            },
            {
              "menuId": 12,
              "mainMenu": "Work",
              "subMenu": "Work Item Maintenance",
              "url": "/dashboard/workmenu/workItemMaintenance",
              "notificationRequired": false
            },
            {
              "menuId": 13,
              "mainMenu": "Work",
              "subMenu": "Customer Entered Work Items",
              "url": "/dashboard/workmenu/customerWorkItem",
              "notificationRequired": true
            },
            {
              "menuId": 14,
              "mainMenu": "Work",
              "subMenu": "View Work Item",
              "url": "/dashboard/workmenu/viewWorkItem",
              "notificationRequired": false
            },
            {
              "menuId": 15,
              "mainMenu": "Advocacy",
              "subMenu": "",
              "url": "",
              "notificationRequired": true
            },
            {
              "menuId": 16,
              "mainMenu": "Advocacy",
              "subMenu": "Add Advocacy",
              "url": "/dashboard/advocacy/addAdvocacy",
              "notificationRequired": false
            },
            {
              "menuId": 17,
              "mainMenu": "Advocacy",
              "subMenu": "Advocacy Maintenance",
              "url": "/dashboard/advocacy/advocacyMaintenance",
              "notificationRequired": false
            },
            {
              "menuId": 18,
              "mainMenu": "Advocacy",
              "subMenu": "Add Appointment",
              "url": "/dashboard/advocacy/addAppointment",
              "notificationRequired": true
            },
            {
              "menuId": 19,
              "mainMenu": "Advocacy",
              "subMenu": "Advocacy Opportunities",
              "url": "/dashboard/advocacy/opportunities",
              "notificationRequired": false
            },
            {
              "menuId": 20,
              "mainMenu": "Reports",
              "subMenu": "",
              "url": "",
              "notificationRequired": false
            },
            {
              "menuId": 21,
              "mainMenu": "Reports",
              "subMenu": "Work Status",
              "url": "/dashboard/reports/workstatus",
              "notificationRequired": false
            },
            {
              "menuId": 22,
              "mainMenu": "Reports",
              "subMenu": "Summary",
              "url": "/dashboard/reports/summary",
              "notificationRequired": false
            },
            {
              "menuId": 23,
              "mainMenu": "Reports",
              "subMenu": "Billing",
              "url": "/dashboard/reports/billing",
              "notificationRequired": false
            },
            {
              "menuId": 24,
              "mainMenu": "Reports",
              "subMenu": "Delinquency",
              "url": "/dashboard/reports/delinquency",
              "notificationRequired": false
            },
            {
              "menuId": 25,
              "mainMenu": "Reports",
              "subMenu": "Advocacy Analysis",
              "url": "/dashboard/reports/advocacyanalysis",
              "notificationRequired": false
            },
            {
              "menuId": 37,
              "mainMenu": "Reports",
              "subMenu": "Boss Invoice",
              "url": "/dashboard/reports/bossInvoice",
              "notificationRequired": false
            },
            {
              "menuId": 39,
              "mainMenu": "Reports",
              "subMenu": "Deleted Work Items",
              "url": "/dashboard/reports/deletedWorkItems",
              "notificationRequired": false
            },
            {
              "menuId": 41,
              "mainMenu": "Reports",
              "subMenu": "Facility Billing",
              "url": "/dashboard/reports/facilityBilling",
              "notificationRequired": false
            },
            {
              "menuId": 42,
              "mainMenu": "Reports",
              "subMenu": "Advocacy Billing",
              "url": "/dashboard/reports/advocacyBilling",
              "notificationRequired": false
            },
            {
              "menuId": 26,
              "mainMenu": "Customer Work",
              "subMenu": "",
              "url": "",
              "notificationRequired": true
            },
            {
              "menuId": 27,
              "mainMenu": "Customer Work",
              "subMenu": "Add Work Item",
              "url": "/dashboard/customerworkmenu/addCustomerWorkItem",
              "notificationRequired": false
            },
            {
              "menuId": 28,
              "mainMenu": "Customer Work",
              "subMenu": "Submitted Work Items",
              "url": "/dashboard/customerworkmenu/viewSubmittedCustomerWork",
              "notificationRequired": false
            },
            {
              "menuId": 29,
              "mainMenu": "Customer Work",
              "subMenu": "Submit Patient Info",
              "url": "/dashboard/customerworkmenu/submitPatientInfo",
              "notificationRequired": false
            },
            {
              "menuId": 30,
              "mainMenu": "Customer Work",
              "subMenu": "View Work Items",
              "url": "/dashboard/customerworkmenu/viewCompletedCustomerWorkItems",
              "notificationRequired": false
            },
            {
              "menuId": 31,
              "mainMenu": "Customer Work",
              "subMenu": "Appointment Maintenance",
              "url": "/dashboard/customerworkmenu/appointmentMaintenance",
              "notificationRequired": true
            },
            {
              "menuId": 32,
              "mainMenu": "Customer Reports",
              "subMenu": "",
              "url": "",
              "notificationRequired": false
            },
            {
              "menuId": 33,
              "mainMenu": "Customer Reports",
              "subMenu": "Orders Completed",
              "url": "/dashboard/customerReports/ordersCompleted",
              "notificationRequired": false
            },
            {
              "menuId": 34,
              "mainMenu": "Customer Reports",
              "subMenu": "Advocacy By Type",
              "url": "/dashboard/customerReports/advocacyByType",
              "notificationRequired": false
            },
            {
              "menuId": 35,
              "mainMenu": "Customer Reports",
              "subMenu": "Advocacy By Amount",
              "url": "/dashboard/customerReports/advocacyByAmount",
              "notificationRequired": false
            },
            {
              "menuId": 36,
              "mainMenu": "Customer Reports",
              "subMenu": "Secured Advocacy",
              "url": "/dashboard/customerReports/securedAdvocacy",
              "notificationRequired": false
            }
          ]
        },
        "firstName": "",
        "lastName": "",
        "preferredUsername": ""
      }
      let menusbyRole = [
        {
          "menuId": 1,
          "mainMenu": "Admin",
          "subMenu": "",
          "url": "",
          "notificationRequired": false
        },
        {
          "menuId": 2,
          "mainMenu": "Admin",
          "subMenu": "Drug Code Maintenance",
          "url": "/dashboard/admin/drugProcMaintenance",
          "notificationRequired": false
        }]
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
  });



  it('should create', () => {
    let currentUser = localStorage.getItem('currentUser');
    let userInfo = new User();
    userInfo.userId = currentUser['userId'];
    userInfo.facilityId = currentUser['facilityId'];
    component.currentUser = userInfo;
    expect(component.currentUser.userId).not.toBeNull();
  });

  it('[SelectMenu] should toggle isAdmin when menu =1', () => {
    component.isAdmin = true;
    component.SelectMenu(1);
    expect(component.isAdmin).toBeTrue();
  });

   it('should get facility list', () => {
    // component.facilities = facilityData;
    spyOn(patientService, 'getFacilityList').and.returnValue(of(facilityData));
    spyOn(component, 'setFacilityLocalStorageInfo');
    component.getFacilityList();
    expect(component.facilities).toEqual(facilityData);
    expect(patientService.getFacilityList).toHaveBeenCalled();
    expect(component.setFacilityLocalStorageInfo).toHaveBeenCalled();
    expect(localStorage.getItem("userId")).toEqual("17");
    expect(localStorage.getItem("userName")).toEqual("admin");
    expect(localStorage.getItem("currentUserRole")).toEqual("meghana");
    expect(localStorage.getItem("systemId")).toEqual("11");
  });

  it('[setFacilityLocalStorageInfo] - should set right value for non external user role Ids', () => {
    spyOn(localStorage, 'getItem').and.callThrough();
    spyOn(localStorage, 'setItem').and.callThrough();

    currentUser.systemId = "0";
    component.currentUser = currentUser;
    component.setFacilityLocalStorageInfo();

    expect(localStorage.getItem("CustomerfacilityId")).toEqual("0");
    expect(localStorage.getItem("CustomerfacilityName")).toEqual("");
  });

  it('[setFacilityLocalStorageInfo] - should set right value for  external user role Ids', () => {
    spyOn(localStorage, 'getItem').and.callThrough();
    spyOn(localStorage, 'setItem').and.callThrough();

    component.currentUser = currentUser;
    component.facilities = facilityData;
    component.currentUser.systemId ="11";


    component.setFacilityLocalStorageInfo();

    expect(localStorage.getItem("CustomerfacilityId")).toEqual("100");
    expect(localStorage.getItem("CustomerfacilityName")).toEqual("facilityName -100");
  });
});
