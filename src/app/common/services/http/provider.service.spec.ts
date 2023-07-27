import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { ProviderService } from './provider.service';

describe('ProviderService', () => {
  let service: ProviderService;
  let httpTestingController: HttpTestingController; 
  let baseUrl = environment.serviceUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProviderService]
    });
      service = TestBed.inject(ProviderService);
      httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('[searchProvider] should search for a provider based on NPI', async(() => { 
    const providerNpi = "1234";
    service.searchProvider(providerNpi).subscribe((res) => {     
     expect(res).not.toBeNull();
    });
    const req = httpTestingController.expectOne(baseUrl +'/provider/getByProviderAndNpi?providerNpi='+ providerNpi);
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush({});
  }));
  
  it('[updateProvider] should update a provider', async(() => { 
    const body={};
    service.updateProvider(body).subscribe((res) => {
      expect(res).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/provider/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({});
  }));

  it('[createProvider] should create a new provider', async(() => { 
    const body={};
    service.createProvider(body).subscribe((res) => {
      expect(res).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/provider/create');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('POST');
    req.flush({});
  }));

  it('[updateProvider] should throw error obj with a message', async(() => { 
    const body={};
    service.updateProvider(body).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/provider/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush({message: "error"}, {status: 500, statusText: 'Internal server error'}); 

    expect(req.cancelled).toBeTrue();
  }));

  it('[updateProvider] should throw error', async(() => { 
    const body={};
    service.updateProvider(body).subscribe(res => {},(err)=>{
      expect(err).not.toBeNull();
    }); 
    const req = httpTestingController.expectOne(baseUrl + '/provider/update');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('PUT');
    req.flush("error",{status: 500, statusText: 'Internal server error'}); 

    expect(req.cancelled).toBeTrue();
  }));
});
