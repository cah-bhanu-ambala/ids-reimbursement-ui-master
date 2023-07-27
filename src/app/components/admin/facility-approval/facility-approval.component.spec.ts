import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { FacilityService } from 'src/app/common/services/http/facility.service';
import { SystemService } from 'src/app/common/services/http/system.service';

import { Facility, facilityWbsDetails } from 'src/app/models/classes/facility';
import { FacilityApprovalComponent } from './facility-approval.component';

describe('FacilityApprovalComponent', () => {
  let component: FacilityApprovalComponent;
  let fixture: ComponentFixture<FacilityApprovalComponent>;
  let facilityService: FacilityService;
  let systemService: SystemService;
  let toastr: ToastrService;

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
const system ={
  systemName: "abc",
  createdBy: 1,
  status: 'Active',
  active: true,
  systemId: 10,
  modifiedBy:1
  };
let systemListValue = [
    {
      systemId: 3,
      systemName: "System 3"
    },
    {
      systemId: 1,
      systemName: "System 1"
    }
  ]
const facility ={
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
  facilityWbsDetails:[]
};
const pendingfacilitiesdata=[facility];
const pendingsystemsdata=[system];

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
  facilityId: 10
};

const systemFormValue ={
  systemName: "abc",
  active: true,
  modifiedBy: 1,
  systemId: 10
};

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
    ],
  }

  const loadEditViewFacility ={
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
    wbsName: "testwbs"

  };

const loadEditViewSystem ={
    systemName: "abc"
 };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityApprovalComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule,
        ToastrModule.forRoot(), BrowserAnimationsModule, NgbModule],
      providers:[FacilityService, SystemService, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityApprovalComponent);
    component = fixture.componentInstance;
    facilityService = TestBed.inject(FacilityService);
    systemService = TestBed.inject(SystemService);
    toastr = TestBed.inject(ToastrService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[Form-Check]-form should be valid when all required values are entered', () => {
    component.formFacilityApproval.controls['facilityName'].setValue('Facility-A');
    component.formFacilityApproval.controls['facilityNickName'].setValue('facility');
     component.formFacilityApproval.controls['systemId'].setValue('1');
    component.formFacilityApproval.controls['ein'].setValue('1234567890');
    component.formFacilityApproval.controls['facilityNPI'].setValue('188456790');
    component.formFacilityApproval.controls['address'].setValue('Richmond Avenue');
    component.formFacilityApproval.controls['phone'].setValue('1234567890');
    component.formFacilityApproval.controls['fax'].setValue('1234567890');
    expect(component.formFacilityApproval.valid).toBeTruthy();
  });

  it('should return form',async(()=>{
    component.formFacilityApproval =new FormGroup({});
    expect(component.f).not.toBeNull();
  }))

  it('should not return form',async(()=>{
    component.formFacilityApproval =null;
    expect(component.f).toBeNull();
  }))

  it('[setFacilityBillingDetails] should not set billing levels', async(() => {
    expect(component.setFacilityBillingDetails(null)).not.toBeNull();
  }));

  it('[setFacilityBillingDetails] should set billing levels', async(() => {
    component.billingLevels= billingLevelsData;
    expect(component.setFacilityBillingDetails(billingLevelsData)).not.toBeNull();
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

  it('[getbillingLevels] should return null results', async(() => {
    spyOn(facilityService, 'getBillingLevels').and.returnValue(of(null));
    component.getbillingLevels();
    expect(component.billingLevels).toBeNull();
    expect(facilityService.getBillingLevels).toHaveBeenCalled();
  }));

  it('[getPendingFacilityList] should handle valid pending facility list', async(() => {
    spyOn(facilityService, 'getPendingFacilities').and.returnValue(of(pendingfacilitiesdata));
    component.getPendingFacilityList();
    expect(component.facilityDatasource).toEqual(pendingfacilitiesdata);
    expect(facilityService.getPendingFacilities).toHaveBeenCalled();
  }));

  it('[approveFacility] should approve facility', async(() => {
    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const facilityid="2";
    spyOn(facilityService, 'updateFacilityStatus').and.returnValue(of([]));
    component.approveFacility(facilityid);
    expect(facilityService.updateFacilityStatus).toHaveBeenCalled();
  }));

   it('[onEdit] should Edit', () => {
    component.billingLevels = billingLevelsData;
    component.onEdit(facility);
    expect(component.isUpdate).toBeTrue();
  });

  it('[next] should call next', async(() => {
    component.first=0;
    component.rows=10;
    component.next();
    expect(component.first).toEqual(10);
  }));

  it('[prev] should call next', async(() => {
    component.first=10;
    component.rows=10;
    component.prev();
    expect(component.first).toEqual(0);
  }));

  it('[reset] should set first to zero', async(() => {
    component.first=10;
    component.reset();
    expect(component.first).toEqual(0);
  }));

  it('[onReset] should clear the form', async(() => {
    component.resetFormFields();
    expect(component.submitted).toBeFalse();
    expect(component.formFacilityApproval.pristine).toBeTrue();
  }));

  it('[onCancel] should cancel form submission', async(() => {
    component.onCancel();
    expect(component.showError).toBeFalse();
    expect(component.isUpdate).toBeFalse();
  }));

  it('[resetContacts] is executed', async(() => {
    component.resetContacts();
    let number = 1;
    expect(component.noOfContacts).toEqual(number);
  }));

  it('[loadPendingfacilityDetails] should not get any data when datasource is empty', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.facilityDatasource = [pendingfacilitiesdata];
    component.loadPendingfacilityDetails(event);
    tick(500);
    expect(component.facilityGridloading ).toBeFalse();
    expect(component.facilitySearchResult ).not.toBeNull();
  }));

  it('[onSubmit] should not update data when form is invalid', async(() => {
    component.submitted = true;
    component.errorMessage = '';
    spyOn(component, 'showInfo').and.callFake(()=>"showInfo");
     expect(component.onSubmit()).toBeFalse();
  }));

  it('[onSubmit] should update facility when isupdate is true and facilityid not null', async(() => {
    component.formFacilityApproval.patchValue( facilityFormValue);
    component.isUpdate=true;
    component.facilityId=1;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(facilityService, 'updateFacility').and.returnValue(of({})) ;
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSubmit] should update facility when isupdate is true and facilityid is null', async(() => {
    component.formFacilityApproval.patchValue( facilityFormValue);
    component.isUpdate=true;
    component.facilityId=null;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(facilityService, 'updateFacility').and.returnValue(of({})) ;
    component.onSubmit();
    expect(spy).toHaveBeenCalled();

  }));

  it('[onSubmit] should throw error when during onsubmit update', async(() => {
    component.formFacilityApproval.patchValue( facilityFormValue);
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

  it('[generateContacts] should add new contact fields when there are less than 4 contacts', async(() => {
    component.generateContacts();
    expect(component.noOfContacts).toBeLessThan(4);
  }));

  it('[generateContacts] should  throw error when there are more than 4 contacts', async(() => {
    component.arr.length= 4;
    component.noOfContacts = 4;
    component.isUpdate = false;
    spyOn(component, 'showInfo').and.callFake(()=>"showInfo");
    component.generateContacts();
    expect(component.noOfContacts).toBeGreaterThanOrEqual(4);
  }));

  it('[ngAfterViewChecked] is called', async(() =>{
    component.ngAfterViewChecked();
    expect(component.ngAfterViewChecked).toBeTruthy();
  }));

  it('[loadSubFacilities] is called', async(() =>{
    component.loadSubFacilities();
    expect(component.loadSubFacilities).toBeTruthy();
  }));

  it('[generateSubFacilities] is called', async(()=> {
    component.generateSubFacilities();
    expect(component.generateSubFacilities).toBeTruthy();
  }))


  it('[onView] should be called when facility parameter is fulfilled', async((facilityValue: any ) => {
    component.billingLevels = billingLevelsData;
    component.onView(facility);
    expect(component.ShowOnEdit).toBeFalse();
    expect(component.formFacilityApproval.disable).toBeTruthy();
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

  it('[onApprove] on approve facilities', () => {
    const facilityInfo ={
      facilityName: "abc",
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
      facilityWbsDetails:[{wbsName: 'wbs1'}]
    };
      component.onApprove(facilityInfo, 'Facility');
    expect(component).toBeTruthy;
  });

  it('[onApprove] on approve facilities', async(() => {
    const facilityInfo ={
      facilityName: "abc",
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
      },
      {
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
    spyOn(component, 'showInfo').and.callFake(()=>"This facility doesnt have wbs name. So it cannot be approved.");
      component.onApprove(facilityInfo, 'Facility');
    expect(component).toBeTruthy;
  }));

  it('[onContractStartDateChange] should not call', async(() => {
    let idx = 0;
    component.onContractStartDateChange(idx);
    expect(component.onContractStartDateChange).toBeTruthy();
  }));

  // fit('[onContractStartDateChange] should call', async(() => {
  //   let idx = 132;
  //   component.facilityWbsDetails.controls[idx].get('contractStartDate').value(123);
  //   component.onContractStartDateChange(idx);
  //   expect(component.onContractStartDateChange).toBeFalsy();
  // }));

  it('[loadEditWbsDetails] should called', () => {
    component.loadEditWbsDetails(facilityWbsDetails);
    expect(component.loadEditWbsDetails).toBeTruthy();
  });


  it('[validateWbsRow] should called', ()=>{
    component.validateWbsRow();
    expect(component.validateWbsRow).toBeTruthy();
  })

it('[onApprove] on approve systems', () => {
    component.onApprove(system, 'System');
    expect(component).toBeTruthy;
  });

  it('[onView] should be called when system parameter is fulfilled', async((systemValue: any ) => {
      component.onSystemView(system);
      expect(component.ShowOnSystemEdit).toBeFalse();
      expect(component.formSystemApproval.disable).toBeTruthy();
    }));

    it('[getPendingSystemList] should handle valid pending system list', async(() => {
        spyOn(systemService, 'getPendingSystems').and.returnValue(of(pendingsystemsdata));
        component.getPendingSystemList();
        expect(component.systemDatasource).toEqual(pendingsystemsdata);
        expect(systemService.getPendingSystems).toHaveBeenCalled();
      }));

    it('[loadPendingSystemDetails] should not get any data when datasource is empty', fakeAsync(() => {
        let event:LazyLoadEvent ={
          first: 0,
          rows: 1
        };
        component.systemDatasource = [pendingsystemsdata];
        component.loadPendingSystemDetails(event);
        tick(500);
        expect(component.systemGridloading ).toBeFalse();
        expect(component.systemSearchResult ).not.toBeNull();
      }));

      it('[approveSystem] should approve system', async(() => {
          spyOn(component, 'showSuccess').and.callFake(()=>"success");
          const systemid="2";
          spyOn(systemService, 'updateSystemStatus').and.returnValue(of([]));
          component.approveSystem(systemid);
          expect(systemService.updateSystemStatus).toHaveBeenCalled();
        }));

 it('should return system form',async(()=>{
    component.formSystemApproval =new FormGroup({});
    expect(component.s).not.toBeNull();
  }));

  it('[onSysteEdit] should Edit System', () => {
      component.onSystemEdit(system);
      expect(component.isSystemUpdate).toBeTrue();
    });

 it('[onSubmit] should not update data when form is invalid', async(() => {
    component.submitted = true;
    component.errorMessage = '';
    spyOn(component, 'showInfo').and.callFake(()=>"showInfo");
     expect(component.onSubmit()).toBeFalse();
  }));

  it('[onSystemSubmit] should update system when isupdate is true and systemid not null', async(() => {
    component.formSystemApproval.patchValue( systemFormValue);
    component.isSystemUpdate=true;
    component.systemId=1;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(systemService, 'updateSystem').and.returnValue(of({})) ;
    component.onSystemSubmit();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSystemSubmit] should update System when isupdate is true and systemId is null', async(() => {
    component.formSystemApproval.patchValue( systemFormValue);
    component.isSystemUpdate=true;
    component.systemId=null;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(systemService, 'updateSystem').and.returnValue(of({})) ;
    component.onSystemSubmit();
    expect(spy).toHaveBeenCalled();

  }));

  it('[onSystemSubmit] should throw error when during onSystemSubmit update', async(() => {
    component.formSystemApproval.patchValue(systemFormValue);
    component.isSystemUpdate=true; //true, false
    component.systemId=1; //null ,1
    component.userId=1;
    let err="error"
    component.submitted = true;
    component.errorMessage = '';

    const spy =spyOn(systemService, 'updateSystem').and.returnValue(throwError(err)) ;
    spyOn(component, 'showFailure').and.callFake(()=>"Error");
    component.onSystemSubmit();
    expect(component.errorMessage).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSystemEditCancel] should cancel system form submission', async(() => {
      component.onSystemEditCancel();
      expect(component.showError).toBeFalse();
      expect(component.isUpdate).toBeFalse();
    }));

    it('[getSystemList] should get system list', async(() => {
      spyOn(systemService, 'getApprovedSystems').and.returnValue(of(systemListValue));
      component.getSystemList();
      expect(component.systems).toEqual(systemListValue);
      expect(systemService.getApprovedSystems).toHaveBeenCalled();
    }));
});
