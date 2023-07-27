import {HttpClientTestingModule,HttpTestingController} from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;
  let baseUrl = environment.serviceUrl;
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

  const facilityListdata=[
    {
      "active": true,
      "createdDate": "2021-02-02T08:45:12.587Z",
      "createdBy": 0,
      "modifiedDate": "2021-02-02T08:45:12.587Z",
      "modifiedBy": 0,
      "facilityId": 0,
      "facilityName": "string",
      "facilityNickName": "string",
      "ein": "string",
      "contacts": "string",
      "facilityNPI": "string",
      "address": "string",
      "phone": "string",
      "fax": "string",
      "status": "string",
      "facilityBillingDetails": [
        {
          "active": true,
          "createdDate": "2021-02-02T08:45:12.587Z",
          "createdBy": 0,
          "modifiedDate": "2021-02-02T08:45:12.587Z",
          "modifiedBy": 0,
          "facilityBillingDetailId": 0,
          "facilityId": 0,
          "billingLevelId": 0,
          "billingAmount": 0,
          "billingLevelName": "string"
        }
      ]
    }
  ];
  const userRoleListdata=[
    {
      "active": true,
      "createdDate": "2021-02-01T17:36:49.427+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:36:49.427+0000",
      "modifiedBy": 1,
      "userRoleId": 3,
      "userRoleName": "Business Analyst"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:36:49.427+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:36:49.427+0000",
      "modifiedBy": 1,
      "userRoleId": 4,
      "userRoleName": "External User"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:36:49.427+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:36:49.427+0000",
      "modifiedBy": 1,
      "userRoleId": 1,
      "userRoleName": "Superuser"
    },
    {
      "active": true,
      "createdDate": "2021-02-01T17:36:49.427+0000",
      "createdBy": 1,
      "modifiedDate": "2021-02-01T17:36:49.427+0000",
      "modifiedBy": 1,
      "userRoleId": 2,
      "userRoleName": "Team Lead"
    }
  ];
  const searchdata=  [
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
      "userRoleName": "Team Lead"
    }
  ];

  const updateUser=    {
    "userEmail": "admin@infodatinc.com",
    "teamLeadId": 1,
    "userRoleId": 1,
    "facilityId": 0,
    "createdBy": 1,
    "active": true
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all users', async(() => {
    service.getAllUsers().subscribe((res) => {
      expect(res).toEqual(userdata);
    });
    const req = httpTestingController.expectOne(baseUrl + '/user/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(userdata);
  }));

  it('should get user roles', async(() => {
    const userRoleList = userRoleListdata;
    service.getUserRole().subscribe((res) => {
      expect(res).toEqual(userRoleList);
    });
    const req = httpTestingController.expectOne(baseUrl + '/userRole/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(userRoleList);
  }));

  it('should get facility list', async(() => {
    service.getFacilityList().subscribe((res) => {
      expect(res).toEqual(facilityListdata);
    });
    const req = httpTestingController.expectOne(baseUrl + '/facility/getApprovedFacilities');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(facilityListdata);
  }));
  it('should get Reporting User List ', async(() => {
    let url="getSuperUserRoleUsers";
    service.getReportingUserList(url).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/user/'+ url);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(facilityListdata);
  }));

  it('should search with user name and email', async(() => {
    let Searchvalue="team leader";
    service.onSearch(Searchvalue).subscribe((res) => {
      expect(res).toEqual(searchdata);
    });
    const req = httpTestingController.expectOne(baseUrl +  '/user/getByUserNameAndEmail?userNameEmail=' + Searchvalue);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(searchdata);
  }));

  it('should get all users by systemId', async(() => {
    let systemId = 1;
    service.getBySystemId(systemId).subscribe((res) => {
      expect(res).toEqual(userdata);
    })
    const req = httpTestingController.expectOne(baseUrl + '/user/getBySystemId?systemId=' + systemId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(userdata);
  }))

  it('should get all internal users', async(() => {
    service.getInternalUsers().subscribe((res) => {
      expect(res).toEqual(userdata);
    })
    const req = httpTestingController.expectOne(baseUrl + '/user/getAllInternalUsers');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(userdata);
  }))

  it('should get all external users', async(() => {
    service.getExternalUsers().subscribe((res) => {
      expect(res).toEqual(userdata);
    })
    const req = httpTestingController.expectOne(baseUrl + '/user/getExternalRoleUsers');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(userdata);
  }))

  it('should update user details', async(() => {
    service.updateUser(updateUser).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(searchdata);
    });
    const req = httpTestingController.expectOne(baseUrl + '/user/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush(searchdata);
  }));

  it('should throw error obj with a message while updating user details', async(() => {
    service.createUser(updateUser).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/user/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('should throw error while updating user details', async(() => {
    service.createUser(updateUser).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/user/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush("error",{status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('getUserDetails should get user when input email', async(() => {
    const userEmail = 'test@gmail.com'
    service.getUserDetails(userEmail).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + `/user/getUserDetails/${userEmail}`);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({})
  }));

});
