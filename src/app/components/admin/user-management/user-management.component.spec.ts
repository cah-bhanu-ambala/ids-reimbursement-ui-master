import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

import { UserService } from 'src/app/common/services/http/user.service';
import { UserManagementComponent } from './user-management.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SearchRevenueComponent } from '../../shared/search-revenue/search-revenue.component';
import { LazyLoadEvent } from 'primeng/api';
import { User } from 'src/app/models/classes/user';
import { SystemService } from 'src/app/common/services/http/system.service';

describe('UserManagement', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let service: UserService;
  let systemService: SystemService;
  let toastr: ToastrService;

  let userRoleData = [
    {
      active: true,
      createdDate: "2021-02-01T17:36:49.427+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:49.427+0000",
      modifiedBy: 1,
      userRoleId: 1,
      userRoleName: "Superuser"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:49.427+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:49.427+0000",
      modifiedBy: 1,
      userRoleId: 3,
      userRoleName: "Business Analyst"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:49.427+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:49.427+0000",
      modifiedBy: 1,
      userRoleId: 4,
      userRoleName: "External User"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:36:49.427+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:36:49.427+0000",
      modifiedBy: 1,
      userRoleId: 2,
      userRoleName: "Team Lead"
    }
  ];

  let systemData = [
    {
      systemId: 1,
      systemName: "System 1"
    },
    {
      systemId: 2,
      systemName: "System 2"
    }
  ]

  const userData = [{
    active: true,
    createdDate: "2021-02-01T17:36:49.437+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:49.437+0000",
    modifiedBy: 1,
    userId: 1,
    userName: "admin",
    userEmail: "admin@infodatinc.com",
    teamLeadId: 1,
    userRoleId: 1,
    delegateUserId: 0,
    facilityId: 0,
    userRoleName: "Superuser"
  },
  {
    active: true,
    createdDate: "2021-02-01T17:57:56.509+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:57:56.509+0000",
    modifiedBy: null,
    userId: 2,
    userName: "Team Leader",
    userEmail: "tl@abc.com",
    teamLeadId: 1,
    userRoleId: 2,
    delegateUserId: 0,
    facilityId: 0,
    userRoleName: "Team Lead"
  }];

  const searchdata = [
    {
      active: true,
      createdDate: "2021-02-01T17:57:56.509+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:57:56.509+0000",
      modifiedBy: null,
      userId: 2,
      userName: "Team Leader",
      userEmail: "tl@abc.com",
      teamLeadId: 1,
      userRoleId: 2,
      delegateUserId: 0,
      facilityId: 0,
      userRoleName: "Team Lead"
    }
  ];

  const onSubmitdata = {
    active: true,
    createdDate: "2021-02-01T17:57:56.509+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:57:56.509+0000",
    modifiedBy: null,
    userId: 2,
    userName: "Team Leader",
    userEmail: "tl@abc.com",
    teamLeadId: 1,
    userRoleId: 2,
    delegateUserId: 0,
    facilityId: 0,
    userRoleName: "Team Lead"
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserManagementComponent, SearchRevenueComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule, RouterTestingModule,
        ToastrModule.forRoot(), BrowserAnimationsModule],
      providers: [UserService, ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(UserService);
    systemService = TestBed.inject(SystemService);
    toastr = TestBed.inject(ToastrService);
    component.userRoleList = userRoleData;
    component.ngOnInit();
    fixture.detectChanges();
  });

  afterEach(() => {
    service = null;
    component = null;
  });

  it('should create an instance of usermanagement component', () => {
    expect(component).toBeTruthy();
  });
  it('[User Name-Check]-should check User Name is disabled', () => {
    let username = component.formUserMgntUserMgt.controls['userName'];
    expect(username.disabled).toBeTruthy();
    expect(username.pristine).toBeTruthy();
  });

  it('[User email check]-should check User email value is required', () => {
    let userEmail = component.formUserMgntUserMgt.controls['userEmail'];
    expect(userEmail.valid).toBeFalsy();
    expect(userEmail.pristine).toBeTruthy();
    expect(userEmail.errors['required']).toBeTruthy();
  });

  it('[User Role id]-should check User Role Id value is required', () => {
    let userRoleId = component.formUserMgntUserMgt.controls['userRoleId'];
    expect(userRoleId.valid).toBeFalsy();
    expect(userRoleId.pristine).toBeTruthy();
    expect(userRoleId.errors['required']).toBeTruthy();
  });

  it('form should be invalid', async(() => {
    component.formUserMgntUserMgt.controls['userName'].setValue('');
    component.formUserMgntUserMgt.controls['userEmail'].setValue('');
    component.formUserMgntUserMgt.controls['userRoleId'].setValue('');
    expect(component.formUserMgntUserMgt.valid).toBeFalsy();
  }));

  it('should return form', async(() => {
    component.userRoleList = userRoleData;
    component.formUserMgntUserMgt.controls['userName'].setValue('Superuser');
    component.formUserMgntUserMgt.controls['userEmail'].setValue('tl@abc.com');
    component.formUserMgntUserMgt.controls['userRoleId'].setValue('1');
    expect(component.f).not.toBeNull();
  }));

  it('should not return form when no values set', async(() => {
    component.formUserMgntUserMgt = null;
    expect(component.f).toBeNull();
  }));

  it('should check systemId exists when userRoleName is External User', () => {
    component.userRoleList = userRoleData;
    component.formUserMgntUserMgt.controls['userName'].setValue('externaluser');
    component.formUserMgntUserMgt.controls['userEmail'].setValue('eu@abc.com');
    component.formUserMgntUserMgt.controls['userRoleId'].setValue('4');
    expect(component.formUserMgntUserMgt.controls['systemId']).not.toBeNull();
  });

  it('should check teamLeadId exists when userRoleName is Team Lead', () => {
    component.userRoleList = userRoleData;
    component.formUserMgntUserMgt.controls['userName'].setValue('teamlead');
    component.formUserMgntUserMgt.controls['userEmail'].setValue('tl@abc.com');
    component.formUserMgntUserMgt.controls['userRoleId'].setValue('2');
    expect(component.formUserMgntUserMgt.controls['teamLeadId']).not.toBeNull();
  });

  it('should check teamLeadId exists when userRoleName is Buisiness Analyst', () => {
    component.userRoleList = userRoleData;
    component.formUserMgntUserMgt.controls['userName'].setValue('ba');
    component.formUserMgntUserMgt.controls['userEmail'].setValue('ba@abc.com');
    component.formUserMgntUserMgt.controls['userRoleId'].setValue('3');
    expect(component.formUserMgntUserMgt.controls['teamLeadId']).not.toBeNull();
  });

  it('[getUserRole] should get user roles', async(() => {
    spyOn(service, 'getUserRole').and.returnValue(of(userRoleData));
    component.getUserRole();
    expect(component.userRoleList).toEqual(userRoleData);
    expect(service.getUserRole).toHaveBeenCalled();
  }));

  it('[getUserRole] should throw error', async(() => {
    let err = "error"
    spyOn(service, 'getUserRole').and.returnValue(throwError(err));
    component.getUserRole();
    expect(service.getUserRole).toHaveBeenCalled();
  }));

  it('[getSystemList] should get system list', async(() => {
    spyOn(systemService, 'getApprovedSystems').and.returnValue(of(systemData));
    component.getSystemList();
    expect(component.systems).toEqual(systemData);
    expect(systemService.getApprovedSystems).toHaveBeenCalled();
  }));


  it('[getUserList] should get user list', async(() => {
    spyOn(service, 'getAllUsers').and.returnValue(of(userData));
    component.getUserList();
    expect(component.userList).toEqual(userData);
    expect(service.getAllUsers).toHaveBeenCalled();
  }));

  it('[getUserList] should throw error', async(() => {
    let err = "error"
    spyOn(service, 'getAllUsers').and.returnValue(throwError(err));
    component.getUserList();
    expect(service.getAllUsers).toHaveBeenCalled();
  }));

  it('[getReportingUserList] should get reporting user list', async(() => {
    let spy = spyOn(service, 'getReportingUserList').and.returnValue(of(userData));
    component.getReportingUserList("getReportingUserList");
    expect(component.userReportingUserList).toEqual(userData);
    expect(spy).toHaveBeenCalled();
  }));
  it('[getReportingUserList] should throw error', async(() => {
    let err = "error"
    let spy = spyOn(service, 'getReportingUserList').and.returnValue(throwError(err));
    component.getReportingUserList("getReportingUserList");
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSearch] should search for username and email', async(() => {
    const searchparam = "team leader";
    component.userList = userData;
    spyOn(service, 'onSearch').and.returnValue(of(searchdata));
    component.onSearch(searchparam);
    expect(component.searchResult).toEqual(searchdata);
    expect(service.onSearch).toHaveBeenCalled();
  }));

  it('[onSearch] should not show grid when search value is empty', async(() => {
    const searchparam = "";
    component.onSearch(searchparam);
    expect(component.showGrid).toBeFalse();
    expect(component.showForm).toBeTrue();
  }));

  it('[onSearch] should throw error', async(() => {
    const searchparam = "team leader";
    component.userList = userData;
    spyOn(service, 'onSearch').and.returnValue(of(throwError("error")));
    spyOn(component, 'showFailure').and.callFake(() => "Error");
    component.onSearch(searchparam);
    expect(component.userSearchParam).toEqual(searchparam);
  }));

  it('[onSearch] should show empty results', async(() => {
    const searchparam = "team leader";
    component.searchResult = [];
    component.userSearchParam = searchparam;
    spyOn(service, 'onSearch').and.returnValue(of([searchdata]));
    component.onSearch(searchparam);
    expect(component.showError ).toBeFalse;
    expect(component.showGrid ).toBeFalse;
  }));

  it('[onSubmit] should not update data when form is invalid', async(() => {
    spyOn(service, 'updateUser').and.returnValue(of(onSubmitdata));
    expect(component.onSubmit()).toBeFalse();
  }));

  it('[onSubmit] should create data when isUpdate is set to true', async(() => {
    component.formUserMgntUserMgt = new FormGroup({});
    component.isUpdate = true;
     component.onSubmit();
    expect(component.submitted).toBeTrue();
  }));


  it('[onSubmit] should create data when isUpdate is not set', () => {
    let err = "error";
    component.formUserMgntUserMgt = new FormGroup({});
    component.isUpdate = false;
    const spy = spyOn(service, 'createUser').and.returnValue(throwError(err));
     component.onSubmit();
     expect(spy).toHaveBeenCalled();
  });

  it('[onSubmit] should create data when isUpdate is not set', () => {
    let err = "error";
    let user = new User;
    component.formUserMgntUserMgt = new FormGroup({});
    component.isUpdate = true;
    component.userIdMgnt = 1;
    component.loggedInUser = 'sp';
    const spy = spyOn(service, 'updateUser').and.returnValue(throwError(err));
     component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });


  it('[onEdit] should edit form', inject([Router], (router: Router) => {
    const user = {
      userName: "Team Leader",
      userEmail: "tl@abc.com",
      userRoleId: 2,
      teamLeadId: 1,
      systemId: 0
    };
    spyOn(router, 'navigate').and.stub();
    component.onEdit(user);
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard/admin/userManagement']);
    expect(component.isUpdate).toEqual(true);
    expect(component.userEmail.disabled).toBeTrue();
  }));

  it('[onCancel] should cancel form submission', async(() => {
    component.onCancel();
    expect(component.isUpdate).toBeFalse();
    expect(component.userEmail.disabled).toBeFalse();
    expect(component.submitted).toBeFalse();
  }));

  it('[loadUserDetails] should not get any data when datasource is empty', fakeAsync(() => {
    let event: LazyLoadEvent = {
      first: 0,
      rows: 1
    };
    component.userDatasource = userData;
    component.loadUserDetails(event);
    tick(500);
    expect(component.userGridloading).toBeFalse();
    expect(component.userSearchResult).not.toBeNull();
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

  it("[onReset] should called", () => {
    component.onReset();
    expect(component.formUserMgntUserMgt.pristine).toBeTruthy();
    expect(component.formUserMgntUserMgt.untouched).toBeTruthy();
    expect(component.showSystems).toBeFalse();
    expect(component.showReportingTo).toBeFalse();
    expect(component.submitted).toBeFalse();

  })

  it('should return true if the form control is valid', () => {
    const formControl = new FormControl('systemId');
    expect(component.teamLeadValidator(formControl)).toEqual(undefined);
  });

  it('[onSearch] should search for username and email', fakeAsync(() => {
    const searchparam = "team leader";
    let err = "error";
    component.userList = userData;
    const spy = spyOn(service, 'onSearch').and.returnValue(throwError(err));
    component.onSearch(searchparam);
    flush();
    expect(spy).toHaveBeenCalled();
  }));

  it('should change form when user role changes', fakeAsync(() => {
    //External User
    component.userRoleId.setValue(4);
    fixture.detectChanges();
    tick();

    //Team Lead
    component.userRoleId.setValue(2);
    fixture.detectChanges();
    tick();
    expect(component.formUserMgntUserMgt.controls['teamLeadId']).not.toBeUndefined();
    expect(component.formUserMgntUserMgt.controls['systemId']).toBeUndefined();

    //External User again
    component.userRoleId.setValue(4);
    fixture.detectChanges();
    tick();
    expect(component.formUserMgntUserMgt.controls['teamLeadId']).toBeUndefined();
    expect(component.formUserMgntUserMgt.controls['systemId']).not.toBeUndefined();

    //Business Analyst
    component.userRoleId.setValue(3);
    fixture.detectChanges();
    tick();
    expect(component.formUserMgntUserMgt.controls['teamLeadId']).not.toBeUndefined();
    expect(component.formUserMgntUserMgt.controls['systemId']).toBeUndefined();

    //Superuser
    component.userRoleId.setValue(1);
    fixture.detectChanges();
    tick();
    expect(component.formUserMgntUserMgt.controls['teamLeadId']).toBeUndefined();

    //External User again
    component.userRoleId.setValue(4);
    fixture.detectChanges();
    tick();

    //Superuser
    component.userRoleId.setValue(1);
    fixture.detectChanges();
    tick();
    expect(component.formUserMgntUserMgt.controls['systemId']).toBeUndefined();

    //External User again
    component.userRoleId.setValue(4);
    fixture.detectChanges();
    tick();

    //No Role
    component.userRoleId.setValue("");
    fixture.detectChanges();
    tick();
    expect(component.formUserMgntUserMgt.controls['systemId']).toBeUndefined();

    //Business Analyst
    component.userRoleId.setValue(3);
    fixture.detectChanges();
    tick();

    //No Role
    component.userRoleId.setValue("");
    fixture.detectChanges();
    tick();
    expect(component.formUserMgntUserMgt.controls['teamLeadId']).toBeUndefined();
  }));
});
