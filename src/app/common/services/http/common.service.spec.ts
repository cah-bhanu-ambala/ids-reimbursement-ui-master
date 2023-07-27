import { async, ComponentFixture, fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DrugOrProc } from 'src/app/models/classes/drug-or-proc';

import { CommonService } from './common.service';


describe('CommonService', () => {

  let commonService: CommonService;
  let httpTestingController: HttpTestingController;
  const baseUrl = environment.serviceUrl;

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

  let drugOrProcData: DrugOrProc = {
    active: true,
    createdBy: 1,
    modifiedBy: 1,
    drugId: 25,
    drugProcCode: "J0135",
    shortDesc: "Adalimumab injection",
    longDesc: "Adalimumab injection",
    brandName: "Humira Pen",
    genericName: "adalimumab",
    lcd: "",
    notes: ""
  };

  const drugByCodeData = {
    "active": true,
    "createdDate": "2021-02-01T17:36:50.881+0000",
    "createdBy": 1,
    "modifiedDate": "2021-02-01T17:53:17.878+0000",
    "modifiedBy": 1,
    "drugId": 2,
    "drugProcCode": "J0135",
    "shortDesc": "Adalimumab injection",
    "longDesc": "Adalimumab injection",
    "brandName": "Humira Pen",
    "genericName": "adalimumab",
    "lcd": "lcd",
    "notes": "Notes Added"
  };

  const icdResp = [{
    active: true,
    createdDate: "2021-02-01T17:36:50.927+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.927+0000",
    modifiedBy: 1,
    icdId: 2,
    icdCode: "A00.0",
    description: "Cholera due to Vibrio cholerae 01, biovar cholerae"
  }
  ];

  let drugOrProcListData = [];
  drugOrProcListData.push(drugOrProcData);

  const drugResp = {content: [{
    active: true,
    createdDate: "2021-02-01T17:36:50.881+0000",
    createdBy: 1,
    modifiedDate: "2021-02-17T17:50:17.409+0000",
    modifiedBy: 1,
    drugId: 2,
    drugProcCode: "J0135",
    shortDesc: "Adalimumab injection",
    longDesc: "Adalimumab injection",
    brandName: "Humira Pen",
    genericName: "adalimumab",
    lcd: "LCD1728",
    notes: "test notes"
  }]};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommonService]
    });
    commonService = TestBed.inject(CommonService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(commonService).toBeTruthy();
  });

  it('should get ICD list', async(() => {
    const resp = [{
      icdValue: 'A00.0-undefined',//'A00.0-Cholera due to Vibrio cholerae 01, biovar cholerae',
      icdId: 1,
      icdCode: 'A00.0'
    }]
    commonService.getICDList().subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(resp);
    });
    const req = httpTestingController.expectOne(baseUrl +'/icd/getAll');
    // const req = httpTestingController.expectOne(baseUrl +'/icd/getAllICDLimitColumns');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(resp);
  }));

  it('should get drug list', async(() => {
    const resp = [{
      active: true,
      brandName: "Humira Pen",
      createdBy: 1,
      drugId: 25,
      drugProcCode: "J0135",
      genericName: "adalimumab",
      lcd: "",
      longDesc: "Adalimumab injection",
      modifiedBy: 1,
      notes: "",
      shortDesc: "Adalimumab injection"
    }]
    commonService.getdrugList().subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(resp);
          });
    const req = httpTestingController.expectOne(baseUrl +'/drug/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(resp);
  }));


  it('get wbs list', async(() => {

    const facilityId = 1;

    commonService.getWbsList(facilityId).subscribe((res) => {
      expect(res).not.toBeNull();
    }, (error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
    });
    const req = httpTestingController.expectOne(baseUrl + '/wbs/getWbsByFacilityId/' + facilityId);

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));

  it('get wbs by login', async(() => {

    const params = {
      userId: 1,
      facilityId: 1
    }

    commonService.getWbsByLogin(params).subscribe((res) => {
      expect(res).not.toBeNull();
    }, (error: any) => {
      expect(error).toEqual('Something went wrong,Please check.');
    });
    const req = httpTestingController.expectOne(baseUrl + '/user/getWbsByUserIdAndFacilityId?userId=' + params.userId + '&' + 'facilityId=' + params.facilityId);

    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));


  it('should get DrugDetails', async(() => {
    const drugCode = 'J0135';
    commonService.getDrugDetails(drugCode).subscribe((res) => {
      expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/drug/findByProcCodeDescContainingIgnoreCase?drugSearchParam=' + drugCode + '&pagination=false');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(drugResp);
  }));


  it('Should get ICD Details', async(() => {
    const icdCode = 'a00.0';
    const resp = [{
      icdValue: 'A00.0-undefined',//'A00.0-Cholera due to Vibrio cholerae 01, biovar cholerae',
      icdId: 1,
      icdCode: 'A00.0'
    }]

    commonService.getIcdDetails(icdCode).subscribe((res) => {
      expect(res).not.toBeNull();
      expect(res).toEqual(resp);
    });
    const req = httpTestingController.expectOne(baseUrl + '/icd/getByIcdCodeContainingIgnoreCase?icdCode=' + icdCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(resp);

  }));

  it('Get Icd details should throw error', async(() => {
    const icdCode = 'a00.0';
    commonService.getIcdDetails(icdCode).subscribe((res) => {
      expect(res).not.toBeNull();
    },(error: any) => {
      expect(error).toEqual('Something went wrong,Please check!');
    });
    const req = httpTestingController.expectOne(baseUrl + '/icd/getByIcdCodeContainingIgnoreCase?icdCode=' + icdCode);
    const msg = 'error';
    req.flush(msg,{status: 500, statusText: 'Internal server error'});
    expect(req.request.method).toEqual('GET');
  }));

  it('should get IcdDetails throws an error', async(() => {
    const icdCode = 'a00.0';
    const response = ['A00.0-Cholera due to Vibrio cholerae 01, biovar cholerae'];
    commonService.getIcdDetails(icdCode).subscribe((res) => {
      expect(res).not.toBeNull();
    }, (error: any) => {
      expect(error).toEqual('Something went wrong,Please check!');
    });
    const req = httpTestingController.expectOne(baseUrl + '/icd/getByIcdCodeContainingIgnoreCase?icdCode=' + icdCode);
    const msg = 'error';
    req.flush(msg, { status: 500, statusText: 'Internal server error' });
    expect(req.request.method).toEqual('GET');

  }));

  it('should get DrugDetails throws an error', async(() => {
    const drugCode = 'J0135';
    commonService.getDrugDetails(drugCode).subscribe((res) => {
      expect(res).not.toBeNull();
    },
     (error: any) => {
      expect(error).toEqual('Something went wrong,Please check!');
    }
    );
    const req = httpTestingController.expectOne(baseUrl + '/drug/findByProcCodeDescContainingIgnoreCase?drugSearchParam=' + drugCode + '&pagination=false');
    const msg = 'error';
    req.flush(msg, { status: 500, statusText: 'Internal server error' });
    expect(req.request.method).toEqual('GET');
  }));

  it('Get Icd details should throw error (alternative)', async(() => {
    const icdCode = 'a00.0';
    commonService.getIcdDetails(icdCode).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl + '/icd/getByIcdCodeContainingIgnoreCase?icdCode=' + icdCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({message: "Something went wrong,Please check!"},{status: 500, statusText: 'Internal server error'});

  }));

  it('should get one ICD code with exact match', async(() => {
    const icdCode = 'a00.0';
    const resp = {
      icdCode: 'a00.0'
    };
    commonService.getExactIcd(icdCode).subscribe(res => {
      expect(res).not.toBeNull();
      expect(res.icdCode).toEqual(icdCode);
    })
    const req = httpTestingController.expectOne(baseUrl + '/icd/getByIcdCode?icdCode=' + icdCode);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(resp);
  }));

});
