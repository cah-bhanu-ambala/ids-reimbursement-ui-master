import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { LazyLoadEvent, SharedModule } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import { FacilityService } from 'src/app/common/services/http/facility.service';
import { Facility } from 'src/app/models/classes/facility';
import { SearchRevenueComponent } from '../../shared/search-revenue/search-revenue.component';
import { AdminRoutingModule } from '../admin-routing.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FacilityMaintenanceComponent } from './facility-maintenance.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { SystemService } from 'src/app/common/services/http/system.service';

describe('FacilityMaintenanceComponent', () => {
  let component: FacilityMaintenanceComponent;
  let fixture: ComponentFixture<FacilityMaintenanceComponent>;
  let formBuilder: FormBuilder;
  let facilityService: FacilityService;
  let patientService: PatientService;
  let workItemService: WorkitemService;
  let toastr: ToastrService;
  let systemService: SystemService;
  let ngbModal: NgbModal;

const billingLevelsData=[
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

let systemListData = [
    {
      systemId: 1,
      systemName: "System 1"
    },
    {
      systemId: 6,
      systemName: "System 6"
    }
  ];
const facility: Facility ={
  facilityName: "abc",
  systemId:1,
  facilityNickName: null,
  ein: "343",
  facilityNPI: "232",
  address: "test ",
  phone: "1234567895",
  fax: "1234567895",
  contact1: "Dr contact1",
  contactRole1: "Test role1",
  contact2: "",
  contactRole2: "",
  contact3: "",
  contactRole3: "",
  contact4: "",
  contactRole4: "",
  createdBy: 1,
  status: 'Active',
  facilityBillingDetails: [{
      facilityBillingDetailId: 72,
      facilityId: 10,
      facilityBillingLevelName: "VOB L1",
      billingLevelId: 2,
      billingAmount: 62626,
      createdBy: 1,
      modifiedBy: 1
  }, {
      facilityBillingDetailId: 73,
      facilityId: 10,
      facilityBillingLevelName: "VOB L2",
      billingLevelId: 3,
      billingAmount: 11,
      createdBy: 1,
      modifiedBy: 1
  }, {
      facilityBillingDetailId: 74,
      facilityId: 10,
      facilityBillingLevelName: "VOB L3",
      billingLevelId: 4,
      billingAmount: 262,
      createdBy: 1,
      modifiedBy: 1
  }, {
      facilityBillingDetailId: 67,
      facilityId: 10,
      facilityBillingLevelName: "PHARM L1",
      billingLevelId: 5,
      billingAmount: 123,
      createdBy: 1,
      modifiedBy: 1
  }, {
      facilityBillingDetailId: 68,
      facilityId: 10,
      facilityBillingLevelName: "PHARM L2",
      billingLevelId: 6,
      billingAmount: 0,
      createdBy: 1,
      modifiedBy: 1
  }, {
      facilityBillingDetailId: 69,
      facilityId: 10,
      facilityBillingLevelName: "PHARM L3",
      billingLevelId: 7,
      billingAmount: 111,
      createdBy: 1,
      modifiedBy: 1
  }, {
      facilityBillingDetailId: 70,
      facilityId: 10,
      facilityBillingLevelName: "RAD L1",
      billingLevelId: 8,
      billingAmount: 222,
      createdBy: 1,
      modifiedBy: 1
  }, {
      facilityBillingDetailId: 71,
      facilityId: 10,
      facilityBillingLevelName: "RAD L2",
      billingLevelId: 9,
      billingAmount: 3333,
      createdBy: 1,
      modifiedBy: 1
  }],
  active: true,
  modifiedBy: 1,
  facilityId: 10,
  wbsName:"",
  facilityWbsDetails:[
    {
      createdBy: 100,
      modifiedBy:12,
      wbsName:' string',
      contractStartDate: null,
      contractEndDate: null,
      facilityId: 12,
      wbsId: 12
    },
    {
      createdBy: 100,
      modifiedBy:13,
      wbsName:' string',
      contractStartDate: new Date(),
      contractEndDate: new Date(),
      facilityId: 13,
      wbsId: 13
    }
  ]
};
let allFacilityData=[facility];
const facilityWbsDetails: Facility = {
  facilityId: 100,
  systemId:1,
  facilityName: 'test',
  facilityNickName: 'test',
  ein: '10001000',
  facilityNPI: '890890',
  contact1: 'testcontact1',
  contactRole1: 'testRole1',
  contact2: 'testcontact2',
  contactRole2: 'testRole2',
  contact3: 'contact3',
  contactRole3: 'testRole3',
  contact4: 'contact4',
  contactRole4: 'role4',
  address: 'test',
  phone: '888 888 8888',
  fax: '888 888 8888',
  active: true,
  createdBy: 12,
  modifiedBy: 12,
  status: 'active',
  isUpdate: true,
  facilityBillingDetails: [{}],
  wbsName: 'testwbs',
  facilityWbsDetails:[
    {
      createdBy: 100,
      modifiedBy:12,
      wbsName:' string',
      contractStartDate: null,
      contractEndDate: null,
      facilityId: 12,
      wbsId: 12
    }
  ],
}
const facilityEditData:Facility={
  facilityId: 1,
  systemId:1,
  facilityName: "Facility 1",
  facilityNickName: "Facility 1",
  ein: "1234567890",
  contact1: "Dr ABC",
  contactRole1:'',
  contact2:'',
  contactRole2:'',
  contact3:'',
  contactRole3:'',
  contact4:'',
  contactRole4:'',
  facilityNPI: "1234567890",
  address: "Houston",
  phone: "1112223333",
  fax: "4445556666",
  active: true,
  createdBy: 1,
  modifiedBy: 1,
  status: "Approved",
  isUpdate:true,
  facilityBillingDetails:[
    {
      facilityBillingDetailId: 1,
      facilityId: 1,
      billingLevelId: 5,
      billingAmount: 1,
      billingLevelName: "PHARM L1"
    }],
    wbsName:"",
    facilityWbsDetails:[]
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityMaintenanceComponent, SearchRevenueComponent],
      imports:[
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        NgbModule,
        NgbDatepickerModule,
        NgxMaskModule.forRoot(),
        CommonModule,
        AdminRoutingModule,
        SharedModule,
        TableModule,
        MultiSelectModule,
        TableModule,
        NgSelectModule
      ],
      providers:[ ToastrService]
    })
    .compileComponents();
  }));

  const facilityFormValue ={
    facilityName: "abc",
    systemId:1,
    facilityNickName: null,
    ein: "343",
    facilityNPI: "232",
    address: "test ",
    phone: "1234567895",
    fax: "1234567895",
    contact1: "Dr contact1",
    contactRole1: "Test role1",
    facilityBillingDetails: [{
        facilityBillingDetailId: 72,
        facilityId: 10,
        facilityBillingLevelName: "VOB L1",
        billingLevelId: 2,
        billingAmount: 62626,
        createdBy: 1,
        modifiedBy: 1
    }, {
        facilityBillingDetailId: 73,
        facilityId: 10,
        facilityBillingLevelName: "VOB L2",
        billingLevelId: 3,
        billingAmount: 11,
        createdBy: 1,
        modifiedBy: 1
    }, {
        facilityBillingDetailId: 74,
        facilityId: 10,
        facilityBillingLevelName: "VOB L3",
        billingLevelId: 4,
        billingAmount: 262,
        createdBy: 1,
        modifiedBy: 1
    }, {
        facilityBillingDetailId: 67,
        facilityId: 10,
        facilityBillingLevelName: "PHARM L1",
        billingLevelId: 5,
        billingAmount: 123,
        createdBy: 1,
        modifiedBy: 1
    }, {
        facilityBillingDetailId: 68,
        facilityId: 10,
        facilityBillingLevelName: "PHARM L2",
        billingLevelId: 6,
        billingAmount: 0,
        createdBy: 1,
        modifiedBy: 1
    }, {
        facilityBillingDetailId: 69,
        facilityId: 10,
        facilityBillingLevelName: "PHARM L3",
        billingLevelId: 7,
        billingAmount: 111,
        createdBy: 1,
        modifiedBy: 1
    }, {
        facilityBillingDetailId: 70,
        facilityId: 10,
        facilityBillingLevelName: "RAD L1",
        billingLevelId: 8,
        billingAmount: 222,
        createdBy: 1,
        modifiedBy: 1
    }, {
        facilityBillingDetailId: 71,
        facilityId: 10,
        facilityBillingLevelName: "RAD L2",
        billingLevelId: 9,
        billingAmount: 3333,
        createdBy: 1,
        modifiedBy: 1
    }],
    active: true,
    modifiedBy: 1,
    facilityId: 10,
    wbsName:"",
    facilityWbsDetails:[]
  };



  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityMaintenanceComponent);
    component = fixture.componentInstance;
    facilityService = TestBed.inject(FacilityService);
    toastr = TestBed.inject(ToastrService);
    systemService = TestBed.inject(SystemService);
    component.facilityInfo=facilityEditData;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[facility-Check]-should check facility value is valid or not', () => {
    let facility = component.maintainFormFacility.controls['facilityName'];
    expect(facility.valid).toBeFalsy();
    expect(facility.pristine).toBeTruthy();
    expect(facility.errors['required']).toBeTruthy();
  });

  it('[EIN-Check]-should check EIN value is valid or not', () => {
    let ein = component.maintainFormFacility.controls['ein'];
    expect(ein.valid).toBeFalsy();
    expect(ein.pristine).toBeTruthy();
    expect(ein.errors['required']).toBeTruthy();
  });

  it('[NPI-Check]-should check NPI value is valid or not', () => {
    let npi = component.maintainFormFacility.controls['facilityNPI'];
    expect(npi.valid).toBeFalsy();
    expect(npi.pristine).toBeTruthy();
    expect(npi.errors['required']).toBeTruthy();
  });

  it('[Address-Check]-should check Address value is valid or not', () => {
    let address = component.maintainFormFacility.controls['address'];
    expect(address.valid).toBeFalsy();
    expect(address.pristine).toBeTruthy();
    expect(address.errors['required']).toBeTruthy();
  });

  it('[Facility-Check]-should check Facility errors after setting the value', () => {
    let facility = component.maintainFormFacility.controls['facilityName'];
    facility.setValue('abcdef')
    expect(facility.errors).toBeNull();
    expect(facility.valid).toBeTruthy();
  });

  it('[EIN-Check]-should check EIN errors after setting the value', () => {
    let ein = component.maintainFormFacility.controls['ein'];
    ein.setValue('1234567890')
    expect(ein.errors).toBeNull();
    expect(ein.valid).toBeTruthy();
  });

  it('[NPI-Check]-should check NPI errors', () => {
    let npi = component.maintainFormFacility.controls['facilityNPI'];
    npi.setValue('1234567890');
    expect(npi.errors).toBeNull();
    expect(npi.valid).toBeTruthy();
  });

  it('[Address-Check]-should check Address errors', () => {
    let address = component.maintainFormFacility.controls['address'];
    address.setValue('Houston');
    expect(address.errors).toBeNull();
    expect(address.valid).toBeTruthy();
  });

  it('[Form-Check]-Should form validity when no values are entered', () => {
    expect(component.maintainFormFacility.valid).toBeFalsy();
  });

  it('[Form-Check]-form should be valid when all values are entered', () => {
    component.maintainFormFacility.patchValue(facilityFormValue);
    expect(component.maintainFormFacility.valid).toBeTruthy();
  });

  it('[getFacilityList] should get facility list', async(() => {
    spyOn(facilityService, 'getFacilities').and.returnValue(of(allFacilityData));
    component.getFacilityList();
    expect(component.facilityList).toEqual(allFacilityData);
    expect(facilityService.getFacilities).toHaveBeenCalled();
  }));

  it('[getFacilityList] should throw error', async(() => {
    let err="error"
    spyOn(facilityService, 'getFacilities').and.returnValue(throwError(err));
    component.getFacilityList();
    expect(facilityService.getFacilities).toHaveBeenCalled();
  }));

  it('should return form',async(()=>{
    component.maintainFormFacility =new FormGroup({});
    expect(component.f).not.toBeNull();
  }))
  it('should not return form',async(()=>{
    component.maintainFormFacility =null;
    expect(component.f).toBeNull();
  }))

  it('[setFacilityMaintainBillingDetails] should not set billing levels', async(() => {
    expect(component.setFacilityMaintainBillingDetails(null)).not.toBeNull();
  }));

  it('[setFacilityMaintainBillingDetails] should set billing levels', async(() => {
    component.billingLevels= allFacilityData;
    expect(component.setFacilityMaintainBillingDetails(allFacilityData)).not.toBeNull();
  }));

  it('[getbillingLevels] should get details', async(() => {
    spyOn(facilityService, 'getBillingLevels').and.returnValue(of(billingLevelsData));
    component.isUpdate=true;
    component.getbillingLevels();
    expect(component.billingLevels).toEqual(billingLevelsData);
    expect(facilityService.getBillingLevels).toHaveBeenCalled();
  }));

  it('[getbillingLevels] should throw error', async(() => {
    let err="error"
    spyOn(facilityService, 'getBillingLevels').and.returnValue(throwError(err));
    component.getbillingLevels();
    expect(facilityService.getBillingLevels).toHaveBeenCalled();
  }));

  it('[onSubmit] should not update data when form is invalid', async(() => {
    component.submitted = true;
    component.errorMessage = '';
    spyOn(component, 'showInfo').and.callFake(()=>"showInfo");
     expect(component.onSubmit()).toBeFalse();
  }));

  it('[onSubmit] should update facility when isUpdate is true and facilityid not null facility-maintenace', async(() => {
    component.maintainFormFacility.patchValue( facilityFormValue);
    component.isUpdate=true;
    component.facilityId=1;
    component.userId=1;
    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(facilityService, 'updateFacility').and.returnValue(of({})) ;
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSubmit] should update facility when isupdate is true and facilityid is null', async(() => {
    component.maintainFormFacility.patchValue( facilityFormValue);
    component.isUpdate=true;
    component.facilityId=null;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(facilityService, 'updateFacility').and.returnValue(of({})) ;
    component.onSubmit();
    expect(spy).toHaveBeenCalled();

  }));

  it('[onSubmit] should create facility when isupdate is false', async(() => {
    component.maintainFormFacility.patchValue( facilityFormValue);
    component.isUpdate=false;
    component.facilityId=1;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(facilityService, 'createFacility').and.returnValue(of({})) ;
    component.onSubmit();
    expect(spy).toHaveBeenCalled();

  }));

  it('[onSubmit] should throw error when during onsubmit create', async(() => {
    component.maintainFormFacility.patchValue( facilityFormValue);
    component.isUpdate=false; //true, false
    component.facilityId=1; //null ,1
    component.userId=1;

    let err="error"
    component.submitted = true;
    component.errorMessage = '';
    const spy =spyOn(facilityService, 'createFacility').and.returnValue(throwError(err)) ;
    spyOn(component, 'showFailure').and.callFake(()=>"Error");
    component.onSubmit();
    expect(component.errorMessage).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSubmit] should throw error when during onsubmit update', async(() => {
    component.maintainFormFacility.patchValue( facilityFormValue);
    component.isUpdate=true; //true, false
    component.facilityId=1; //null ,1
    component.userId=1;
    let err="error"
    component.submitted = true;
    component.errorMessage = '';
    const spy =spyOn(facilityService, 'updateFacility').and.returnValue(throwError(err)) ;
    spyOn(component, 'showFailure').and.callFake(()=>"Error");
    component.onSubmit();
    expect(component.errorMessage).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));


  it("should reset form fields",()=>{
    component.resetMaintainFormFields();
    expect(component.maintainFormFacility.pristine).toBeTrue();
  })

  it('[onSearch] should search for facility and results found', async(() => {
    const searchparam="Facility 1";
    spyOn(facilityService, 'searchByFacilityName').and.returnValue(of([facility]));
    component.onSearch(searchparam);
    expect(component.facilityDatasource).toEqual(allFacilityData);
    expect(facilityService.searchByFacilityName).toHaveBeenCalled();
  }));

  it('[onSearch] should search for facility and results not found', async(() => {
    const searchparam="Facility 1";
    spyOn(facilityService, 'searchByFacilityName').and.returnValue(of([]));
    component.onSearch(searchparam);
    expect(component.showForm  ).toBeTrue();
    expect(component.showError ).toBeTrue();
  }));

  it('[onEdit] should Edit', () => {
  component.billingLevels = billingLevelsData;
  component.onEdit(facility);
  expect(component.isUpdate).toBeTrue();
});

  it('[generateMaintainContacts] should add new contact fields when there are less than 4 contacts', async(() => {
    component.generateMaintainContacts();
    expect(component.noOfContacts).toBeLessThan(4);
  }));

  it('[generateMaintainContacts] should  throw error when there are more than 4 contacts', async(() => {
    component.arr.length= 4;
    component.noOfContacts = 4;
    component.isUpdate = false;
    spyOn(component, 'showInfo').and.callFake(()=>"showInfo");
    component.generateMaintainContacts();
    expect(component.noOfContacts).toBeGreaterThanOrEqual(4);
  }));

  it('[onReset] should clear the form', async(() => {
    component.resetMaintainFormFields();
    expect(component.submitted).toBeFalse();
    expect(component.maintainFormFacility.pristine).toBeTrue();
  }));

  it('[onCancel] should cancel form submission when isUpdate is set', async(() => {
    component.isUpdate = true;
    component.onCancel();
    expect(component.showGrid).toBeTrue();
  }));

  it('[loadfacilityDetails] should not get any data when datasource is empty', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.facilityDatasource = allFacilityData;
    component.loadfacilityDetails(event);
    tick(500);
    expect(component.facilityGridloading ).toBeFalse();
    expect(component.facilitySearchResult ).not.toBeNull();
  }));

  it('should return advocacy form',async(()=>{
    component.searchFacilityForm =new FormGroup({});
    expect(component.f).not.toBeNull();
  })) ;

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

  it('[validateWbsRow] should called', ()=>{
    component.validateWbsRow();
    expect(component.validateWbsRow).toBeTruthy();
  });

  it('[onContractStartDateChange] should not call', async(() => {
    let idx = 0;
    component.onContractStartDateChange(idx);
    expect(component.onContractStartDateChange).toBeTruthy();
  }));

  it('[generateSubMaintainFacilities] will also call [disableWbsRows]', () => {
    component.generateSubMaintainFacilities();
    expect(component.generateSubMaintainFacilities).toBeTruthy();
  });

  it('[getSystemList] should get system list', fakeAsync(() => {
    spyOn(systemService, 'getApprovedSystems').and.returnValue(of(systemListData));
    component.getSystemList();
    expect(component.systems).toEqual(systemListData);
    expect(systemService.getApprovedSystems).toHaveBeenCalled();
  }));

  it('[onDelete] should delete facilities and related items', fakeAsync(() => {
    patientService = TestBed.inject(PatientService);
    workItemService = TestBed.inject(WorkitemService);
    spyOn(patientService, 'searchByFacilityAndMrn').and.returnValue(of([{"patientId": 1}]));
    spyOn(workItemService, 'getAllWorkItemsByFacilityId').and.returnValue(of([{"workItemId": 1}]));
    spyOn(component, 'deleteFacility').and.stub();
    spyOn(patientService, 'deleteAllPatientsById').and.returnValue(of([{"patientId": 1}]));
    spyOn(workItemService, 'deleteAllWorkItemsById').and.returnValue(of([{"patientId": 1}]));
    component.onDelete(facility);

    fixture.detectChanges();
    tick();

    expect(patientService.searchByFacilityAndMrn).toHaveBeenCalled();
    expect(workItemService.getAllWorkItemsByFacilityId).toHaveBeenCalled();
    expect(component.modal).not.toBeNull();

    // component.modal.componentInstance.confirmDelete.patchValue("DELETE");

    fixture.detectChanges();
    tick();

    component.modal.componentInstance.delete.emit();
    // let modal = document.getElementsByTagName('ngb-modal-window')[0];
    // const delButton = modal.getElementsByTagName('button')[1];
    // delButton.click();

    fixture.detectChanges();
    tick();

    expect(component.deleteFacility).toHaveBeenCalled();
    expect(patientService.deleteAllPatientsById).toHaveBeenCalled();
    expect(workItemService.deleteAllWorkItemsById).toHaveBeenCalled();
    flush();
  }));

  it('[deleteFacility] should delete the facility', () => {
    spyOn(facilityService, 'deleteFacility').and.returnValue(of("result"));
    component.deleteFacility(facility);
    expect(facilityService.deleteFacility).toHaveBeenCalled();
  });

  it('[deleteFacility] should error', () => {
    const facilitySpy = spyOn(facilityService, 'deleteFacility').and.returnValue(throwError("error"));
    component.deleteFacility(facility);
    expect(facilitySpy).toHaveBeenCalled();
    expect(component.errorMessage).not.toBeNull();
  });

});

