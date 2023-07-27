import { async, ComponentFixture, fakeAsync, flush, TestBed, tick } from '@angular/core/testing';
import {  ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { CustomerOrdersCompletedComponent } from './customer-orders-completed.component';
import { CustomerReportsService } from 'src/app/common/services/http/customer-reports.service';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import { of } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';

describe('CustomerOrdersCompletedComponent', () => {
  let component: CustomerOrdersCompletedComponent;
  let fixture: ComponentFixture<CustomerOrdersCompletedComponent>; 
  let customerReportsService: CustomerReportsService;
  let reportsService: ReportsService;
  let toastr: ToastrService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerOrdersCompletedComponent ],
      imports:[
        ReactiveFormsModule,HttpClientTestingModule, ToastrModule.forRoot()
        ,BrowserAnimationsModule, NgbModule, NgSelectModule,TableModule,
        ButtonModule, TooltipModule, 
      ],
      providers: [CustomerReportsService,ReportsService, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerOrdersCompletedComponent);
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
    component.loadReport(event);
    tick(500);
    expect(component.loading).toBeFalse();
  }));

  it('should load empty data', fakeAsync(() => {
    const event: LazyLoadEvent = { "first": 0, "rows": 10, "sortOrder": 1, "filters": {}, "globalFilter": null };
    component.datasource = null;
    component.loadReport(event);
    tick(500);
    expect(component.loading).toBeTrue();
  }));
  
  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.showGrid).toBeFalse();
    expect(component.showError).toBeFalse();
    expect(component.searched).toBeFalse();
    expect(component.custOrderReportsForm.untouched).toBeTrue();
    expect(component.custOrderReportsForm.pristine).toBeTrue();
  }));

  it('should get reports data', async(() => {
    component.getReportsData();  
    expect(component.custOrderReportsForm.pristine).toBeTrue();
    expect(component.showGrid).toBeFalse();
  }));
  
  it('[Form Valid Check] should check report form is valid when all values are entered', () => {
    const form = {
      facilityId: 1,
      intFacilityId: 11,
      facilityName: 'facility1',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    component.custOrderReportsForm.patchValue(form);
    expect(component.sf).toBeTruthy();
    expect(component.custOrderReportsForm.valid).toBeTrue();
    expect(component.custOrderReportsForm.get('intFacilityId').value).toEqual(11);
  });

  it('[ngAfterContentChecked] is called', async(() => {
    component.ngAfterContentChecked();
    expect(component.ngAfterContentChecked).toBeTruthy();
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
      intFacilityId: 11,
      facilityName: 'facility1',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    let resp = [{details:{ name: 'Test', value: 10}}]
    let params = {
      dateOutFrom: '02/26/2021',
      dateOutTo:'05/26/2021',
      facilityId: 11
    };

    const spy = spyOn(customerReportsService, 'getCustomerOrderCompletedReport').and.returnValue(of(resp));
    component.custOrderReportsForm.patchValue(form);
    component.showGrid = false;
    component.showError = true;
    component.getReportsData();
    expect(spy).toHaveBeenCalledWith(params);
    expect(component.showError ).toBeFalse();  
    expect(component.showGrid ).toBeTrue();
    expect(component.datasource ).toEqual(resp);
    expect(component.totalRecords ).toEqual(1);
  });
  
  it('should export excel data', () => {
    const form = {
      facilityId: 1,
      intFacilityId: 11,
      facilityName: 'facility1',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    let resp = [{details:{ name: 'Test', value: 10}}]
    component.custOrderResultList = [];
    const spy = spyOn(customerReportsService, 'getCustomerOrderCompletedReport').and.returnValue(of(resp));
    component.custOrderReportsForm.patchValue(form);
    component.exportExcel();  
    expect(spy).toBeTruthy();   
  });

  it('should get reports data returns null data', () => {
    const form = {
      facilityId: 1,
      intFacilityId: 11,
      facilityName: 'facility1',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    let resp = [{details:{ name: 'Test', value: 10}}]

    const spy = spyOn(customerReportsService, 'getCustomerOrderCompletedReport').and.returnValue(of(null));
    component.custOrderReportsForm.patchValue(form);
    component.getReportsData();  
    expect(spy).toHaveBeenCalled();
    expect(component.showGrid ).toBeFalse(); 
    expect(component.showError ).toBeTrue();  
  });

});

