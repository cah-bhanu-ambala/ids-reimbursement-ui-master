import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SystemService } from './system.service';
import { environment } from 'src/environments/environment';

describe('SystemService', () => {
  let service: SystemService;
  let httpTestingController: HttpTestingController;
  let baseUrl = environment.serviceUrl;

  let systemData = [{
    systemId: 1,
    systemName: "system 1",
    status: "Approved"
  },
  {
    systemId: 2,
    systemName: "system 2",
    status: "Pending"
  }]

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SystemService]
    });
    service = TestBed.inject(SystemService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(()=>{
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all systems', async() => {
    service.getSystems().subscribe((res) => {
      expect(res).toEqual(systemData);
    });
    const req = httpTestingController.expectOne(baseUrl + '/system/getAll');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(systemData);
  })

  it('should get all approved systems', async() => {
    service.getApprovedSystems().subscribe((res) => {
      expect(res).toEqual(systemData[0]);
    });
    const req = httpTestingController.expectOne(baseUrl + '/system/getApprovedSystems');
    expect(req.cancelled).toBeFalsy();
    expect(req.request.method).toEqual('GET');
    req.flush(systemData[0]);
  })

  it('should create system', async(() => {
    const body={};
    service.createSystem(body).subscribe((response) => {
      expect(response).not.toBeNull();
    });
    const request = httpTestingController.expectOne(baseUrl + '/system/create');
    expect(request.cancelled).toBeFalsy();
    expect(request.request.method).toEqual('POST');
    request.flush({});
  }));

    it('should update system', async(() => {
      const body={};
      service.updateSystem(body).subscribe((response) => {
        expect(response).not.toBeNull();
      });
      const request = httpTestingController.expectOne(baseUrl + '/system/update');
      expect(request.cancelled).toBeFalsy();
      expect(request.request.method).toEqual('PUT');
      request.flush({});
    }));

      it('should update system status', async(() => {
        const body={};
        service.updateSystemStatus(body).subscribe((res) => {
          expect(res).not.toBeNull();
        });
        const req = httpTestingController.expectOne(baseUrl + '/system/updateStatus');
        expect(req.cancelled).toBeFalsy();
        expect(req.request.method).toEqual('PUT');
        req.flush({});
      }));

       it('[getPendingSystems] should get list of pending systems', async(() => {
          service.getPendingSystems().subscribe((res) => {
           expect(res).not.toBeNull();
          });
          const req = httpTestingController.expectOne(baseUrl +'/system/getPendingSystems');
          expect(req.cancelled).toBeFalsy();
          expect(req.request.method).toEqual('GET');
          req.flush({});
        }));

  });
