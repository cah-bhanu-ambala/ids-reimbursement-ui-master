import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {of} from 'rxjs';

import {FacilityComponent} from './facility.component';
import {CustomerWorkitemService} from "../../../common/services/http/customer-workitem.service";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {NgSelectModule} from "@ng-select/ng-select";
import {TableModule} from "primeng/table";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";
import {Router} from "@angular/router";

describe('FacilityComponent', () => {
  let component: FacilityComponent;
  let customerWorkitemService: CustomerWorkitemService;
  let fixture: ComponentFixture<FacilityComponent>;

  const facilityData = [
    {
      active: true,
      createdDate: "2021-02-01T17:54:57.974+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:54:57.974+0000",
      modifiedBy: 1,
      facilityBillingDetailId: 1,
      facilityId: 1,
      facilityName: 'facilityName1',
      billingLevelId: 5,
      billingAmount: 1,
      systemId: 1,
      billingLevelName: "PHARM L1"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:54:57.974+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:54:57.974+0000",
      modifiedBy: 1,
      facilityBillingDetailId: 1,
      facilityId: 1,
      facilityName: 'facilityName11',
      billingLevelId: 51,
      billingAmount: 11,
      systemId: 1,
      billingLevelName: "PHARM L1"
    },
    {
      active: true,
      createdDate: "2021-02-01T17:54:57.994+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:54:57.994+0000",
      modifiedBy: 1,
      facilityBillingDetailId: 2,
      facilityId: 2,
      facilityName: 'facilityName2',
      billingLevelId: 6,
      billingAmount: 2,
      systemId: 2,
      billingLevelName: "PHARM L2"
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacilityComponent],
      imports: [
        ReactiveFormsModule, HttpClientTestingModule, ToastrModule.forRoot()
        , BrowserAnimationsModule, NgbModule, NgSelectModule, TableModule,
        ButtonModule, TooltipModule,
      ],
      providers: [ CustomerWorkitemService, {
        provide: Router,
        useClass: class {
          navigate = jasmine.createSpy("navigate");
        }
      },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityComponent);
    component = fixture.componentInstance;
    customerWorkitemService = TestBed.inject(CustomerWorkitemService);

    component.form=new FormGroup({
      facilityId: new FormControl(''),
      intFacilityId: new FormControl(''),
      facilityName: new FormControl('')
    });
    fixture.detectChanges();
  });


  it('[getFacilityList] - should return valid facility list for non ext user', async(() => {

    component.facilities = [];
    component.systemId =0;

    spyOn(customerWorkitemService, 'getApprovedFacilities').and.returnValue(of(facilityData));
    spyOn(component, 'setDropDownVisibility');
    spyOn(component, 'setFacilitNameObserver');
    component.getFacilityList();
    expect(component.facilities).not.toBeNull();
    expect(customerWorkitemService.getApprovedFacilities).toHaveBeenCalled();
    expect(component.setDropDownVisibility).toHaveBeenCalled();
    expect(component.setFacilitNameObserver).toHaveBeenCalled();
    expect(component.facilities).toEqual(facilityData);
  }));

  it('[getFacilityList] - should return valid facility list for  ext user', async(() => {

    component.facilities = [];
    component.systemId =1;

    spyOn(customerWorkitemService, 'getApprovedFacilities').and.returnValue(of(facilityData));
    spyOn(component, 'setDropDownVisibility');
    spyOn(component, 'setFacilitNameObserver');
    component.getFacilityList();
    expect(component.facilities).not.toBeNull();
    expect(customerWorkitemService.getApprovedFacilities).toHaveBeenCalled();
    expect(component.setDropDownVisibility).toHaveBeenCalled();
    expect(component.setFacilitNameObserver).toHaveBeenCalled();
    expect(component.facilities).toEqual(facilityData.filter(x => x.systemId == component.systemId));
    expect(component.facilities.length).toEqual(2);
  }));

  it('[setDropDownVisibility]- disable dropdown when there is one facility', async(() => {

    component.form.patchValue({
      facilityId: 0,
      intFacilityId: 0,
      facilityName: ''
    })
    let facility = [facilityData[0]];
    component.facilities = facility;
    component.setDropDownVisibility();
    expect(component.form.controls['intFacilityId'].disabled).toBeTrue();
    expect(component.form.get("facilityName").value).toEqual(facility[0].facilityName);
    expect(component.form.get("facilityId").value).toEqual(facility[0].facilityId);
  }));

  it('[setDropDownVisibility]- enable dropdown when there is more than one facility', async(() => {
    component.facilities =facilityData;
    component.form.patchValue({
      facilityId: 0,
      intFacilityId: 0,
      facilityName: ''
    })

    component.setDropDownVisibility();
    expect(component.form.controls['intFacilityId'].disabled).toBeFalse();
    expect(component.form.get("facilityName").value).toEqual('');
    expect(component.form.get("facilityId").value).toEqual(0);
    expect(component.form.get("intFacilityId").value).toEqual(0);
  }));

  it('[isInValid]- return false when submt flag is false or no erro', async(() => {
    component.submitEvent =false;
    expect(component.isInValid()).toBeFalse();

    component.submitEvent =true;
    expect(component.isInValid()).toBeFalse();
  }));

  it('[isInValid]- return true when both flags are valid', async(() => {
    component.submitEvent =true;
    component.form.controls['intFacilityId'].markAsTouched();
    component.form.controls['intFacilityId'].setErrors({ required: true });
    fixture.detectChanges();
    expect(component.isInValid()).toBeTrue();
  }));

  it('[setFacilitNameObserver]- return empty if there no name assigned', async(() => {
    component.setFacilitNameObserver();
    component.form.markAsTouched();
    component.form.markAsPristine();
    expect(component.form.value.facilityName).toEqual("");
  }));

  it('[setFacilitNameObserver]- return valid facility name', async(() => {
    component.facilities =facilityData;
    component.setFacilitNameObserver();
    component.form.get("intFacilityId").setValue(2)

    component.form.markAsTouched();
    component.form.markAsPristine();

    expect(component.form.value.facilityName).toEqual("facilityName2");
    expect(component.form.value.facilityId).toEqual(2);
  }));

});
