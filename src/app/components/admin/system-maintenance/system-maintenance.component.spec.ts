import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaskModule } from 'ngx-mask';
import { LazyLoadEvent, SharedModule } from 'primeng/api';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { of, throwError } from 'rxjs';
import { SystemService } from 'src/app/common/services/http/system.service';
import { System } from 'src/app/models/classes/system';
import { SearchRevenueComponent } from '../../shared/search-revenue/search-revenue.component';
import { AdminRoutingModule } from '../admin-routing.module';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SystemMaintenanceComponent } from './system-maintenance.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

describe('SystemMaintenanceComponent', () => {
  let component: SystemMaintenanceComponent;
  let fixture: ComponentFixture<SystemMaintenanceComponent>;
  let formBuilder: FormBuilder;
  let systemService: SystemService;
  let toastr: ToastrService;
  let ngbModal: NgbModal;

const billingLevelsData=[
  {
    active: true,
    createdDate: "2021-02-01T17:36:50.907+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.907+0000",
    modifiedBy: 1
  },
  {
    active: true,
    createdDate: "2021-02-01T17:36:50.907+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.907+0000",
    modifiedBy: 1
  },
  {
    active: true,
    createdDate: "2021-02-01T17:36:50.907+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.907+0000",
    modifiedBy: 1
  },
  {
    active: true,
    createdDate: "2021-02-01T17:36:50.907+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.907+0000",
    modifiedBy: 1
  },
  {
    active: true,
    createdDate: "2021-02-01T17:36:50.907+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.907+0000",
    modifiedBy: 1
  },
  {
    active: true,
    createdDate: "2021-02-01T17:36:50.907+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.907+0000",
    modifiedBy: 1
  },
  {
    active: true,
    createdDate: "2021-02-01T17:36:50.907+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.907+0000",
    modifiedBy: 1
  },
  {
    active: true,
    createdDate: "2021-02-01T17:36:50.907+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.907+0000",
    modifiedBy: 1
  },
  {
    active: true,
    createdDate: "2021-02-01T17:36:50.907+0000",
    createdBy: 1,
    modifiedDate: "2021-02-01T17:36:50.907+0000",
    modifiedBy: 1
  }
];
const system: System ={
  systemName: "abc",
  createdBy: 1,
  status: 'Active',
  active: true,
  modifiedBy: 1,
  systemId: 10

};
let allSystemData=[system];

const systemEditData:System={
  systemId: 1,
  systemName: "System 1",
  active: true,
  createdBy: 1,
  modifiedBy: 1,
  status: "Approved"
  //isUpdate:true

};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemMaintenanceComponent, SearchRevenueComponent],
      imports:[
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        BrowserAnimationsModule,
        NgbModule,
        NgbDatepickerModule,
        NgxMaskModule.forRoot(),
        CommonModule,
        AdminRoutingModule,
        SharedModule,
        TableModule,
        MultiSelectModule,
        TableModule,
        NgSelectModule
      ],
      providers:[ ToastrService]
    })
    .compileComponents();
  }));

  const systemFormValue ={
    systemName: "abc",
    active: true,
    modifiedBy: 1,
    systemId: 10
  };



  beforeEach(() => {
    fixture = TestBed.createComponent(SystemMaintenanceComponent);
    component = fixture.componentInstance;
    systemService = TestBed.inject(SystemService);
    toastr = TestBed.inject(ToastrService);
    component.systemInfo=systemEditData;
    component.ngOnInit();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[system-Check]-should check system value is valid or not', () => {
    let system = component.maintainFormSystem.controls['systemName'];
    expect(system.valid).toBeFalsy();
    expect(system.pristine).toBeTruthy();
    expect(system.errors['required']).toBeTruthy();
  });


  it('[System-Check]-should check System errors after setting the value', () => {
    let system = component.maintainFormSystem.controls['systemName'];
    system.setValue('abcdef')
    expect(system.errors).toBeNull();
    expect(system.valid).toBeTruthy();
  });



  it('[Form-Check]-Should form validity when no values are entered', () => {
    expect(component.maintainFormSystem.valid).toBeFalsy();
  });

  it('[Form-Check]-form should be valid when all values are entered', () => {
    component.maintainFormSystem.patchValue(systemFormValue);
    expect(component.maintainFormSystem.valid).toBeTruthy();
  });

  it('[getSystemList] should get system list', async(() => {
    spyOn(systemService, 'getSystems').and.returnValue(of(allSystemData));
    component.getSystemList();
    expect(component.systemList).toEqual(allSystemData);
    expect(systemService.getSystems).toHaveBeenCalled();
  }));

  it('[getSystemList] should throw error', async(() => {
    let err="error"
    spyOn(systemService, 'getSystems').and.returnValue(throwError(err));
    component.getSystemList();
    expect(systemService.getSystems).toHaveBeenCalled();
  }));

  it('should return form',async(()=>{
    component.maintainFormSystem =new FormGroup({});
    expect(component.f).not.toBeNull();
  }))
  it('should not return form',async(()=>{
    component.maintainFormSystem =null;
    expect(component.f).toBeNull();
  }))




  it('[onSubmit] should not update data when form is invalid', async(() => {
    component.submitted = true;
    component.errorMessage = '';
    spyOn(component, 'showInfo').and.callFake(()=>"showInfo");
     expect(component.onSubmit()).toBeFalse();
  }));

  it('[onSubmit] should update system when isupdate is true and systemid not null', async(() => {
    component.maintainFormSystem.patchValue( systemFormValue);
    component.isUpdate=true;
    component.systemId=1;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(systemService, 'updateSystem').and.returnValue(of({})) ;
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSubmit] should update system when isupdate is true and systemid is null', async(() => {
    component.maintainFormSystem.patchValue( systemFormValue);
    component.isUpdate=true;
    component.systemId=null;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(systemService, 'updateSystem').and.returnValue(of({})) ;
    component.onSubmit();
    expect(spy).toHaveBeenCalled();

  }));

  it('[onSubmit] should create system when isupdate is false', async(() => {
    component.maintainFormSystem.patchValue( systemFormValue);
    component.isUpdate=false;
    component.systemId=1;
    component.userId=1;

    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    const spy =spyOn(systemService, 'createSystem').and.returnValue(of({})) ;
    component.onSubmit();
    expect(spy).toHaveBeenCalled();

  }));

  it('[onSubmit] should throw error when during onsubmit create', async(() => {
    component.maintainFormSystem.patchValue( systemFormValue);
    component.isUpdate=false; //true, false
    component.systemId=1; //null ,1
    component.userId=1;

    let err="error"
    component.submitted = true;
    component.errorMessage = '';
    const spy =spyOn(systemService, 'createSystem').and.returnValue(throwError(err)) ;
    spyOn(component, 'showFailure').and.callFake(()=>"Error");
    component.onSubmit();
    expect(component.errorMessage).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSubmit] should throw error when during onsubmit update', async(() => {
    component.maintainFormSystem.patchValue( systemFormValue);
    component.isUpdate=true; //true, false
    component.systemId=1; //null ,1
    component.userId=1;
    let err="error"
    component.submitted = true;
    component.errorMessage = '';
    const spy =spyOn(systemService, 'updateSystem').and.returnValue(throwError(err)) ;
    spyOn(component, 'showFailure').and.callFake(()=>"Error");
    component.onSubmit();
    expect(component.errorMessage).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));


  it("should reset form fields",()=>{
    component.resetSystemFormFields();
    expect(component.maintainFormSystem.pristine).toBeTrue();
  })

  it('[onSearch] should search for system and results found', async(() => {
    const searchparam="System 1";
    spyOn(systemService, 'searchBySystemName').and.returnValue(of([system]));
    component.onSearch(searchparam);
    expect(component.systemDatasource).toEqual(allSystemData);
    expect(systemService.searchBySystemName).toHaveBeenCalled();
  }));

  it('[onSearch] should search for system and results not found', async(() => {
    const searchparam="System 1";
    spyOn(systemService, 'searchBySystemName').and.returnValue(of([]));
    component.onSearch(searchparam);
    expect(component.showForm  ).toBeTrue();
    expect(component.showError ).toBeTrue();
  }));

  it('[onEdit] should Edit', () => {
  component.onEdit(system);
  expect(component.isUpdate).toBeTrue();
});




  it('[onReset] should clear the form', async(() => {
    component.resetSystemFormFields();
    expect(component.submitted).toBeFalse();
    expect(component.maintainFormSystem.pristine).toBeTrue();
  }));

  it('[onCancel] should cancel form submission when isUpdate is set', async(() => {
    component.isUpdate = true;
    component.onCancel();
    expect(component.showGrid).toBeTrue();
  }));

  it('[loadSystemDetails] should not get any data when datasource is empty', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.systemDatasource = allSystemData;
    component.loadSystemDetails(event);
    tick(500);
    expect(component.systemGridloading ).toBeFalse();
    expect(component.systemSearchResult ).not.toBeNull();
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

  it('[showInfo] works', fakeAsync((msg:any) => {
    msg = 'info';
    component.showInfo(msg);
    flush();
    expect(component.showInfo).toBeTruthy();
  }));








});

