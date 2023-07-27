import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import { of } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerSecuredAdvocacyComponent } from './customer-secured-advocacy.component';
import { CustomerReportsService } from 'src/app/common/services/http/customer-reports.service';

describe('CustomerSecuredAdvocacyComponent', () => {
  let component: CustomerSecuredAdvocacyComponent;
  let fixture: ComponentFixture<CustomerSecuredAdvocacyComponent>; 
  let customerReportsService: CustomerReportsService;
  let reportsService: ReportsService;
  let toastr: ToastrService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerSecuredAdvocacyComponent ],
      imports:[
        ReactiveFormsModule,HttpClientTestingModule, ToastrModule.forRoot()
        ,BrowserAnimationsModule, NgbModule, NgSelectModule,TableModule,
        ButtonModule, TooltipModule, 
      ],
      providers: [CustomerReportsService, ReportsService, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerSecuredAdvocacyComponent);
    component = fixture.componentInstance;
    customerReportsService = TestBed.inject(CustomerReportsService);  
    reportsService = TestBed.inject(ReportsService);
    toastr = TestBed.inject(ToastrService);
    component.ngOnInit();
    fixture.detectChanges();
  });

  const facilityData = [
    {
      active: true,
      createdDate: "2021-02-01T17:54:57.974+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:54:57.974+0000",
      modifiedBy: 1,
      facilityBillingDetailId: 1,
      facilityId: 1,
      billingLevelId: 5,
      billingAmount: 1,
      billingLevelName: "PHARM L1"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:54:57.994+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:54:57.994+0000",
      modifiedBy: 1,
      facilityBillingDetailId: 2,
      facilityId: 1,
      billingLevelId: 6,
      billingAmount: 2,
      billingLevelName: "PHARM L2"
    }
  ];

  
  const searchResult = [{
    active: true,
    createdDate: "2021-02-15T06:12:48.059+0000",
    createdBy: 1,
    modifiedDate: "2021-02-17T18:30:44.938+0000",
    modifiedBy: 1,
    patientId: 3,
    mrn: "mrn",
    facilityId: 1,
    primaryInsuranceId: 5,
    secondaryInsuranceId: null,
    proofOfIncome: 0,
    householdSize: null,
    contactStatusId: 1,
    notes: "test@12334",
    firstContactDate: null,
    firstContactOutcome: 1,
    secondContactDate: null,
    secondContactOutcome: 2,
    thirdContactDate: null,
    thirdContactOutcome: 3,
    facilityName: "Facility 1",
    facilityNPI: "1234567890",
    facilityEin: "1234567890"
  }];

  it('should create', () => {   
    expect(component).toBeTruthy();
  });

  it('should load data after 500ms', fakeAsync(() => {
    const event: LazyLoadEvent = { "first": 0, "rows": 10, "sortOrder": 1, "filters": {}, "globalFilter": null };
    component.datasource = searchResult;
    component.loadAdvocacyReport(event);
    tick(500);
    expect(component.loading).toBeFalse();
  }));

  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.showGrid).toBeFalse();
    expect(component.reportsAdvocacyForm.pristine).toBeTrue();
  }));

 it('should get reports data', async(() => {
    component.getReportsData();  
    expect(component.reportsAdvocacyForm.pristine).toBeTrue();
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

  it('should get reports data', () => {
    const form = {
      facilityId: 1,
      intFacilityId: 12,
      mrn: 'mrn001',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    let resp = [{details:{ name: 'Test', value: 10}}]

    let params = {
      dateOutFrom: '02/26/2021',
      dateOutTo:  '05/26/2021',
      facilityId: 12,
      mrn: 'mrn001'
    };

    const spy = spyOn(customerReportsService, 'getSecureAdvocacyReport').and.returnValue(of(resp));
    component.reportsAdvocacyForm.patchValue(form);
    component.showError = true;
    component.showGrid = false;
    component.searched = false;
    component.getReportsData();
    expect(spy).toHaveBeenCalledWith(params);
    expect(component.sf).toBeTruthy();
    expect(component.showError ).toBeFalse();
    expect(component.searched ).toBeTrue();
    expect(component.showGrid ).toBeTrue();
    expect(component.datasource ).toEqual(resp);
    expect(component.totalRecords ).toEqual(1);

  });

  it('should get reports data throw error', () => {
    const form = {
      facilityId: 1,
      intFacilityId: 11,
      mrn: 'mrn001',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    }; 
    let err = "error";
    const spy = spyOn(customerReportsService, 'getSecureAdvocacyReport').and.returnValue(of([]));
    component.reportsAdvocacyForm.patchValue(form);
    component.showError = false;
    component.showGrid = true;
    component.searched = false;

    component.getReportsData();  
    expect(spy).toHaveBeenCalled();
    expect(component.showGrid).toBeFalse();  
    expect(component.showError).toBeTrue();
    expect(component.searched ).toBeTrue();
  });

  it('should export excel data', () => {
    const form = {
      facilityId: 1,
      intFacilityId: 11,
      mrn: 'mrn001',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    let resp = [{details:{ name: 'Test', value: 10}}]
    component.resultList = [];
    const spy = spyOn(customerReportsService, 'getSecureAdvocacyReport').and.returnValue(of(resp));
    component.reportsAdvocacyForm.patchValue(form);
    component.exportAdvocacyExcel();  
    expect(spy).toBeTruthy();   
  });

  it('should save as excel file', () => {
    const form = {
      facilityId: 1,
      intFacilityId: 11,
      mrn: 'mrn001',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    let buffer: any, fileName: string;
    let resp = [{details:{ name: 'Test', value: 10}}]
    component.resultList = [];
    const spy = spyOn(customerReportsService, 'getSecureAdvocacyReport').and.returnValue(of(resp));
    component.reportsAdvocacyForm.patchValue(form);
    component.saveAsAdvocacyExcelFile(buffer, fileName);  
    expect(spy).toBeTruthy();   
  });
});

