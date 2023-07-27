import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { DrugAdvocacyClearanceService } from './drug-advocacy-clearance.service';

describe('DrugAdvocacyClearanceService', () => {
  let service: DrugAdvocacyClearanceService;
  let httpTestingController: HttpTestingController;
  let baseUrl = environment.serviceUrl; 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DrugAdvocacyClearanceService]
    });
    service = TestBed.inject(DrugAdvocacyClearanceService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(DrugAdvocacyClearanceService).toBeTruthy();
  }); 

  it('should get all advocacies with clearance', async(() => {
    let params = {
      drugId: 1,
      icdCode: 'j0235',
      primaryInsuranceId: 1,
      secondaryInsuranceId: 1,
      priorAuthStatusId: 1
    }
    service.getAllAdvocaciesWithClearanceBySearchParam(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/drugAdvocacyClearance/getDrugAdvocacyClearanceBySearchParam?drugId=' + params.drugId 
    + '&icdCode=' + params.icdCode
    + '&primaryInsuranceId=' + params.primaryInsuranceId
    + '&secondaryInsuranceId='+ params.secondaryInsuranceId
    + '&priorAuthStatusId='+ params.priorAuthStatusId );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should get all advoacies', async(() => {
    service.getAllAdvocacies().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/drugAdvocacyClearance/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  
  it('should create advocacy clearance', async(() => { 
    const body={};
    service.createAdvocacyWithClearance(body).subscribe((res) => {
      expect(res).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacyClearance/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('should create advocacy clearance throw error with message', async(() => { 
    const body={}; 
    service.createAdvocacyWithClearance(body).subscribe((res) => { 
    }, (error) => { 
      expect(error).not.toBeNull();
    }); 

    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacyClearance/create'); 
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('POST');
  }));

  
  it('should update advocacy clearance', async(() => { 
    const body={};
    service.updateAdvocacyWithClearance(body).subscribe((res) => {
      expect(res).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacyClearance/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should update advocacy clearance throw error with message', async(() => { 
    const body={}; 
    service.updateAdvocacyWithClearance(body).subscribe((res) => { 
    }, (error) => { 
      expect(error).not.toBeNull();
    }); 

    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacyClearance/update'); 
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('PUT');
  }));

  it('should delete advocacy clearance by drug id', async(() => {
    let searchParams = {
      svoId: 1,
      modifiedBy: 1

    }

   service.deleteAdvocacyClearanceByDrugId(searchParams).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/drugAdvocacyClearance/delete?svoId=' + searchParams.svoId + '&modifiedBy=' + searchParams.modifiedBy);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));

  it('should update advocacy clearance throw error with message', async(() => { 
    const body={}; 
    service.updateAdvocacyWithClearance(body).subscribe((res) => { 
    }, (error) => { 
      expect(error).not.toBeNull();
    }); 

    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacyClearance/update'); 
    req.flush({message: "could not execute statement"},{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('PUT');
  }));


});