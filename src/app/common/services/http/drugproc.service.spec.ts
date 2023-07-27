import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { DrugOrProc } from 'src/app/models/classes/drug-or-proc';
import { environment } from 'src/environments/environment';

import { DrugprocService } from './drugproc.service';

describe('DrugprocService', () => {
  let service: DrugprocService;
  let httpTestingController: HttpTestingController;
  let baseUrl = environment.serviceUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DrugprocService]
    });
    service = TestBed.inject(DrugprocService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('[searchByDrugProc] should get all results based on drug code', async(() => {
    const drugCode ='J2001';
    const pageNum = 1;
    const pageSize = 10;
    service.searchByDrugProc(drugCode, pageNum, pageSize).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +
      '/drug/findByProcCodeDescContainingIgnoreCase?drugSearchParam='+drugCode+'&pageNum='+pageNum+'&pageSize='+pageSize+'&pagination=true');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('[getDrugsByCode] should get data for a given drugcode', async(() => {
    const drugCode ='J2001';
    service.getDrugsByCode(drugCode).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl
      +'/drug/getByDrugProcCode?drugProcCode='+drugCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('should update a drug data', async(() => {
    let drugorproc : DrugOrProc  ={
      drugProcCode: "J0135",
      shortDesc: "Adalimumab injection",
      longDesc: "Adalimumab injection",
      brandName: "Humira Pen",
      genericName: "adalimumab",
      lcd: "LCD1728",
      notes: "Test",
      drugId: 2,
      active: true,
      modifiedBy: 1,
      createdBy:1
  };
  const response ={"active":true,"createdDate":"2021-02-01T17:36:50.881+0000","createdBy":1,"modifiedDate":"2021-02-25T00:48:16.534+0000","modifiedBy":1,"drugId":2,"drugProcCode":"J0135","shortDesc":"Adalimumab injection","longDesc":"Adalimumab injection","brandName":"Humira Pen","genericName":"adalimumab","lcd":"LCD1728","notes":"Test"};

  service.updateDrugProc( drugorproc).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(response);
    });
    const req = httpTestingController.expectOne(baseUrl + '/drug/update/');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush(response);
  }));

  it('[updateDrugProc] should throw error', async(() => {
    let drugorproc : DrugOrProc  ={
      drugProcCode: "J0135",
      shortDesc: "Adalimumab injection",
      longDesc: "Adalimumab injection",
      brandName: "Humira Pen",
      genericName: "adalimumab",
      lcd: "LCD1728",
      notes: "Test",
      drugId: 2,
      active: true,
      modifiedBy: 1,
      createdBy:1
  };

  service.updateDrugProc( drugorproc).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/drug/update/');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush("error",{status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('[updateDrugProc] should throw error with message', async(() => {
    let drugorproc : DrugOrProc  ={
      drugProcCode: "J0135",
      shortDesc: "Adalimumab injection",
      longDesc: "Adalimumab injection",
      brandName: "Humira Pen",
      genericName: "adalimumab",
      lcd: "LCD1728",
      notes: "Test",
      drugId: 2,
      active: true,
      modifiedBy: 1,
      createdBy:1
  };

  service.updateDrugProc( drugorproc).subscribe((res) => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/drug/update/');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({message: "error"},{status: 500, statusText: 'Internal server error'});

    expect(req.cancelled).toBeTrue();
  }));

  it('should delete a drug', async(() => {
    const drugId ='J2001'
    const userId =1;
    service.deleteDrugProc(drugId, userId).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/drug/delete?svoId='
    + drugId + '&modifiedBy=' + userId);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('DELETE');
    req.flush({});
  }));
});
