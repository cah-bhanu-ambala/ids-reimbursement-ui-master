import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { DrugAdvocacyService } from './drug-advocacy.service';

describe('DrugAdvocacyService', () => {
  let service: DrugAdvocacyService;
  let httpTestingController: HttpTestingController;
  let baseUrl = environment.serviceUrl; 

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DrugAdvocacyService]
    });
    service = TestBed.inject(DrugAdvocacyService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(DrugAdvocacyService).toBeTruthy();
  }); 

  
  it('should get all drug advocacies', async(() => {
    service.getAllAdvocacies().subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/drugAdvocacy/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  
  it('should have drug advocacy', async(() => {
    let params = {
        drugAdvocacyId: '1'
    }
    
   service.drugAdvocacyHasClearance(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacy/drugAdvocacyHasClearance'
    + '?drugIdAdvocacyId=' + params.drugAdvocacyId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  
  it('should get all advocacies with clearance', async(() => {
    let params = {
      drugId: 1,
      icdCode: 'j0235',
      primaryInsuranceId: 1,
      secondaryInsuranceId: 1,
      priorAuthStatusId: 1,
      copay:0,
      premium: 1

    }
    service.getAllAdvocaciesBySearchParam(params).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/drugAdvocacy/getdrugAdvocacyBySearchParam?drugId=' + params.drugId 
    + '&icdCode=' + params.icdCode
    + '&primaryInsuranceId=' + params.primaryInsuranceId
    + '&secondaryInsuranceId='+ params.secondaryInsuranceId
    + '&priorAuthStatusId='+ params.priorAuthStatusId
    + '&copay='+ params.copay
    + '&premium='+ params.premium
    );
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));


  it('should create advocacy', async(() => { 
    const body={};
    service.createAdvocacy(body).subscribe((res) => {
      expect(res).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacy/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('should create advocacy throw error with message', async(() => { 
    const body={}; 
    service.createAdvocacy(body).subscribe((res) => { 
    }, (error) => { 
      expect(error).not.toBeNull();
    }); 

    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacy/create'); 
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('POST');
  }));

  
  it('should update advocacy', async(() => { 
    const body={};
    service.updateAdvocacy(body).subscribe((res) => {
      expect(res).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacy/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('should update advocacy throw error with message', async(() => { 
    const body={}; 
    service.updateAdvocacy(body).subscribe((res) => { 
    }, (error) => { 
      expect(error).not.toBeNull();
    }); 

    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacy/update'); 
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('PUT');
  }));

  it('should delete advocacy by drug id', async(() => {
    let searchParams = {
      svoId: 1,
      modifiedBy: 1

    }

   service.deleteAdvocacyByDrugId(searchParams).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/drugAdvocacy/delete?svoId=' + searchParams.svoId + '&modifiedBy=' + searchParams.modifiedBy);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));

  it('should create advocacy throw error with message (alternative condition)', async(() => { 
    const body={}; 
    service.createAdvocacy(body).subscribe((res) => { 
    }, (error) => { 
      expect(error).not.toBeNull();
    }); 

    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacy/create'); 
    req.flush({message: "could not execute statement"},{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('POST');
  }));

  it('should update advocacy throw error with message (alternative condition)', async(() => { 
    const body={}; 
    service.updateAdvocacy(body).subscribe((res) => { 
    }, (error) => { 
      expect(error).not.toBeNull();
    }); 

    const req = httpTestingController.expectOne(baseUrl + '/drugAdvocacy/update'); 
    req.flush({message: "Sorry, Something went wrong! could not execute statement"},{status: 500, statusText: 'Internal server error'}); 
    expect(req.request.method).toEqual('PUT');
  }));



});