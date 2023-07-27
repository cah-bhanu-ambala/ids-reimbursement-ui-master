import { async, ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import {   ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {  NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { ButtonModule } from 'primeng/button';
import { CustomerReportsService } from 'src/app/common/services/http/customer-reports.service';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import { of } from 'rxjs';
import { CustomerAdvocacyByTypeComponent } from './customer-advocacy-by-type.component';

describe('CustomerAdvocacyByTypeComponent', () => {
  let component: CustomerAdvocacyByTypeComponent;
  let fixture: ComponentFixture<CustomerAdvocacyByTypeComponent>; 
  let reportsService: ReportsService;
  let custReportsService: CustomerReportsService;
  let toastr: ToastrService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAdvocacyByTypeComponent ],
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
    fixture = TestBed.createComponent(CustomerAdvocacyByTypeComponent);
    component = fixture.componentInstance;
    custReportsService = TestBed.inject(CustomerReportsService);
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

  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.showChart).toBeFalse();
    expect(component.reportsForm.pristine).toBeTrue();
  }));

  it('should get reports data', async(() => {
    component.getReportsData();  
    expect(component.reportsForm.pristine).toBeTrue();
  }));
  
  it('[Form Valid Check] should check report form is valid when all values are entered', () => {
    const form = {
      facilityId: 1,
      intFacilityId: 11,
      facilityName: 'facility1',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    component.reportsForm.patchValue(form);
    expect(component.sf).toBeTruthy();
    expect(component.reportsForm.valid).toBeTrue();
  });

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
    let resp = {details:[{ name: 'Test', value: 10},{ name: 'Test2', value: 20}]}

    let params = {
      facilityId: 11 ,
      dateOutFrom: '02/26/2021',
      dateOutTo: '05/26/2021'
    };

    const spy = spyOn(custReportsService, 'getAdvocacyOrderTypeReport').and.returnValue(of(resp));
    component.reportsForm.patchValue(form);
    component.showChart = false;
    component.searched = true;
    component.getReportsData();
    expect(spy).toHaveBeenCalledWith(params);
    expect(component.showChart).toBeTrue();  
    expect(component.searched).toBeFalse();
  });

  it('should get reports data - and turn of showChart', () => {
    const form = {
      facilityId: 1,
      intFacilityId: 11,
      facilityName: 'facility1',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    let resp = {details:[]};
    let params = {
      facilityId: 11 ,
      dateOutFrom: '02/26/2021',
      dateOutTo: '05/26/2021'
    };

    const spy = spyOn(custReportsService, 'getAdvocacyOrderTypeReport').and.returnValue(of(resp));
    component.reportsForm.patchValue(form);
    component.showChart = false;
    component.searched = true;

    component.getReportsData();  
    expect(spy).toHaveBeenCalledWith(params);
    expect(component.showChart).toBeFalse();
    expect(component.searched).toBeFalse();
  });

  it('[downloadChart] is called', () => {
    component.downloadChart();
    component.loadChartForExport();
    expect(component.downloadChart).toBeTruthy();
    expect(component.loadChartForExport).toBeTruthy();
  });
  
});

