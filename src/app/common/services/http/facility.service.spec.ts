import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FacilityService } from './facility.service';
import { environment } from 'src/environments/environment';

describe('FacilityService', () => {
  let service: FacilityService;
  let httpTestingController: HttpTestingController; 
  let baseUrl = environment.serviceUrl; 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FacilityService]
    });
    service = TestBed.inject(FacilityService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('[getFacilities] should get facility list', async(() => { 
    service.getFacilities().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/facility/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getBillingLevels] should get billing levels data', async(() => { 
    service.getBillingLevels().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/facilityBillingLevel/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getPendingFacilities] should get list of pending facilities', async(() => { 
    service.getPendingFacilities().subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/facility/getPendingFacilities');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[searchByFacilityName] should get data for a giving facility name', async(() => { 
    const facilityName = 'Facility 1';
    service.searchByFacilityName(facilityName).subscribe((res) => {
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/facility/getByFacilityName?facilityName='+ facilityName);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));
  
  it('should update a facility', async(() => { 
    const body={};
    service.updateFacility(body).subscribe((res) => {
      expect(res).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/facility/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should create a new facility', async(() => { 
    const body={};
    service.createFacility(body).subscribe((res) => {
      expect(res).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/facility/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));
  
  it('should update facility status', async(() => { 
    const body={};
    service.updateFacilityStatus(body).subscribe((res) => {
      expect(res).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/facility/updateStatus');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should throw error obj with message while updating facility status', async(() => { 
    const body={};
    service.updateFacilityStatus(body).subscribe((res) => {}, err =>{
      expect(err).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/facility/updateStatus');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'}); 

    expect(req.cancelled).toBeTrue();
  }));

  it('should throw error obj with message while updating facility status', async(() => { 
    const body={};
    service.updateFacilityStatus(body).subscribe((res) => {}, err =>{
      expect(err).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/facility/updateStatus');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush("error",{status: 500, statusText: 'Internal server error'}); 
  }));

  it('should delete facility', async(() => {
    let params = {
      svoId: 1,
      modifiedBy: 1
    }

    service.deleteFacility(params).subscribe((result) => {
      expect(result).not.toBeNull();
    })
    const req = httpTestingController.expectOne(baseUrl + '/facility/delete?svoId=1&modifiedBy=1');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }))
});
