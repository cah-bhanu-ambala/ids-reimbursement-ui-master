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
import { CustomerAdvocacyByAmountComponent } from './customer-advocacy-by-amount.component';

describe('CustomerAdvocacyByAmountComponent', () => {
  let component: CustomerAdvocacyByAmountComponent;
  let fixture: ComponentFixture<CustomerAdvocacyByAmountComponent>; 
  let reportsService: ReportsService;
  let toastr: ToastrService;
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAdvocacyByAmountComponent ],
      imports:[
        ReactiveFormsModule,HttpClientTestingModule, ToastrModule.forRoot()
        ,BrowserAnimationsModule, NgbModule, NgSelectModule,TableModule,
        ButtonModule, TooltipModule, 
      ],
      providers: [ReportsService, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    spyOn(localStorage, 'getItem').and.returnValue("2");
    fixture = TestBed.createComponent(CustomerAdvocacyByAmountComponent);
    component = fixture.componentInstance;
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

  it('should get Advocacy Identified Report', async(() => {
    component.getAdvocacyIdentifiedReport();  
    expect(component.sf).toBeTruthy();
    expect(component.reportsForm.pristine).toBeTrue();
  }));
  

  it('[Form Valid Check] should get Advocacy Identified Report', () => {
    const form = {
      facilityIds: 1,
      intFacilityId: 11,
      facilityName: 'facility1',
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    let resp = {details:[{ name: 'Test', value: 10},{ name: 'Test2', value: 20}]}
    const spy = spyOn(reportsService, 'getAdvocacyAlalysisDetails').and.returnValue(of(resp));

    let params = {
      advocacyTypeIds: [1,2,3,4,5,6,7,8,9,10,11,12],
      facilityIds: 11,
      dateCreatedFrom: '02/26/2021',
      dateCreatedTo: '05/26/2021',
      userId: 2
    };

    component.reportsForm.patchValue(form);
    component.showChart = false;
    component.showError = false;
    component.getAdvocacyIdentifiedReport();
    expect(spy).toHaveBeenCalledWith(params);
    expect(component.showChart).toBeTrue();  
    expect(component.showError).toBeFalse();
  });
  
  it('[Form Valid Check] should get Advocacy Identified Report empty set', () => {
    const form = {
      facilityIds: 1,
      intFacilityId: 1,
      facilityName: 'facility1',     
      dateCreatedFrom: { year: 2021, month: 2, day: 26 },
      dateCreatedTo: { year: 2021, month: 5, day: 26 } 
    };
    let resp = {details:[]}
    const spy = spyOn(reportsService, 'getAdvocacyAlalysisDetails').and.returnValue(of(resp));
    component.reportsForm.patchValue(form);
    component.showChart = true;
    component.showError = false;

    component.getAdvocacyIdentifiedReport();  
    expect(spy).toHaveBeenCalled();
    expect(component.showChart).toBeFalsy();
    expect(component.showError).toBeTrue();
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

  it('should format Data Label', async(() => {
    let value = 10;
    expect(component.formatDataLabel(value)).toEqual('$10');
  }));  

  it('[downloadChart] is called', ()=>{
    component.downloadChart();
    expect(component.downloadChart).toBeTruthy();
    expect(component.loadChartForExport).toBeTruthy();
  })
});

