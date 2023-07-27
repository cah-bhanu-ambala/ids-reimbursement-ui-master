import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { of, throwError } from 'rxjs';  
import { ProviderService } from 'src/app/common/services/http/provider.service';
import { SearchRevenueComponent } from '../../shared/search-revenue/search-revenue.component';

import { ProviderMaintenanceComponent } from './provider-maintenance.component';

describe('ProviderMaintenanceComponent', () => {
  let component: ProviderMaintenanceComponent;
  let fixture: ComponentFixture<ProviderMaintenanceComponent>;
  let providerService:ProviderService;
  let toastr: ToastrService;

  const searchResultData=[
    {
      active: true,
      createdDate: "2021-02-01T17:59:08.062+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T17:59:24.948+0000",
      modifiedBy: 1,
      providerId: 1,
      providerFirstName: "James",
      providerLastName: "Owen",
      npi: "1234567891",
      providerNPI: "James - 1234567891"
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProviderMaintenanceComponent,SearchRevenueComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule,
        ToastrModule.forRoot(),BrowserAnimationsModule ] ,
      providers:[ProviderService, ToastrService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProviderMaintenanceComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    providerService=TestBed.inject(ProviderService); 
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[Provider Name-Check]-should check Provider Name value is required', () => {
    let providerName = component.formProvider.controls['providerFirstName'];
    expect(providerName.valid).toBeFalsy();
    expect(providerName.pristine).toBeTruthy();
    expect(providerName.errors['required']).toBeTruthy();
  });

  it('[NPI-Check]-should check NPI value is required', () => {
    let npi = component.formProvider.controls['npi'];
    expect(npi.valid).toBeFalsy();
    expect(npi.pristine).toBeTruthy();
    expect(npi.errors['required']).toBeTruthy();
  });

  it('[Provider Name-Check]-should check Provider Name errors', () => {
    let providerName = component.formProvider.controls['providerFirstName'];
    providerName.setValue('abcdefzhijklmnopqrstuvwxyzabcdefzhijklmnopqrstuvwxyzqwer'); // Gave more than 50 chars
    expect(providerName.errors).not.toBeNull();
    expect(providerName.valid).toBeFalsy();
    providerName.setValue('abcde'); // Gave valid name
    expect(providerName.errors).toBeNull();
    expect(providerName.valid).toBeTruthy();
  });
  
  it('[NPI-Check]-should check NPI errors', () => {
    let npi = component.formProvider.controls['npi'];
    npi.setValue('0000000000000000')
    expect(npi.errors).not.toBeNull();
    expect(npi.valid).toBeFalsy();
    npi.setValue('9876543210')
    expect(npi.errors).toBeNull();
    expect(npi.valid).toBeTruthy();
  });

  it('[Contact Form-Check]-Should check form is invalid if no values are entered', () => {
    expect(component.formProvider.valid).toBeFalsy();
  });

  it('[Form-Check]-Should check form is valid when values are entered', () => {
    component.formProvider.controls['providerFirstName'].setValue('');
    component.formProvider.controls['providerLastName'].setValue('');
    component.formProvider.controls['npi'].setValue(2);
    expect(component.formProvider.valid).toBeFalsy();

    component.formProvider.controls['providerFirstName'].setValue('James');
    component.formProvider.controls['providerLastName'].setValue('Owen');
    
    component.formProvider.controls['npi'].setValue('1664546789');
    expect(component.formProvider.valid).toBeTruthy();
    expect(component.f).toBeTruthy();
  });
  
  it('[onSubmit] should not update data when form is invalid', async(() => { 
    expect(component.onSubmit()).toBeFalse();
 }));

 it('[onSubmit] should update form when all the data is supplied and isupdate is true', async(() => { 
   component.isUpdate=true;  
   component.formProvider.controls['providerFirstName'].setValue('James');
   component.formProvider.controls['providerLastName'].setValue('Owen');
   component.formProvider.controls['npi'].setValue('1664546789');
   spyOn(component, 'showSuccess').and.callFake(()=>"success");
   spyOn(providerService, 'updateProvider').and.returnValue(of({})) ;
   component.onSubmit();  
   expect(providerService.updateProvider).toHaveBeenCalled();  
 }));

 it('[onSubmit] should update form when all the data is supplied and isupdate is false', async(() => { 
   component.isUpdate=false;  
   component.formProvider.controls['providerFirstName'].setValue('James');
   component.formProvider.controls['providerLastName'].setValue('Owen');
   component.formProvider.controls['npi'].setValue('1664546789');
   spyOn(component, 'showSuccess').and.callFake(()=>"success");
   spyOn(providerService, 'createProvider').and.returnValue(of({})) ;
   component.onSubmit();  
   expect(providerService.createProvider).toHaveBeenCalled();  
 }));

 it('[onSubmit] should throw error when isupdate is true', async(() => { 
  component.isUpdate=true;  
  component.formProvider.controls['providerFirstName'].setValue('James');
  component.formProvider.controls['providerLastName'].setValue('Owen');
  component.formProvider.controls['npi'].setValue('1664546789');
  spyOn(component, 'showFailure').and.callFake(()=>"Error");
  spyOn(providerService, 'updateProvider').and.returnValue(throwError("err")); 
  component.onSubmit(); 
  expect(component.errorMessage).not.toBeNull(); 
})); 

it('[onSubmit] should throw error when isupdate is false', async(() => { 
  component.isUpdate=false;  
  component.formProvider.controls['providerFirstName'].setValue('James');
  component.formProvider.controls['providerLastName'].setValue('Owen');
  component.formProvider.controls['npi'].setValue('1664546789');
  spyOn(component, 'showFailure').and.callFake(()=>"Error");
  spyOn(providerService, 'createProvider').and.returnValue(throwError("err")); 
  component.onSubmit(); 
  expect(component.errorMessage).not.toBeNull();
 
})); 

it('[onSearch] should search for contact and results found', async(() => {
  const searchValue="james";
  spyOn(providerService, 'searchProvider').and.returnValue(of(searchResultData)); 
  component.onSearch(searchValue);
  expect(component.searchResult).toEqual(searchResultData)
  expect(providerService.searchProvider).toHaveBeenCalled();   
}));

it('[onSearch] should search for contact and results empty', async(() => {
  const searchValue="abc";
  spyOn(providerService, 'searchProvider').and.returnValue(of([])); 
  component.onSearch(searchValue);
  expect(component.searchResult).toEqual([]);
  expect(providerService.searchProvider).toHaveBeenCalled();  
}));

it('[onSearch] should throw error', async(() => {
  const searchValue="ABC";
  spyOn(component, 'showFailure').and.callFake(()=>"Error");
  const spy =spyOn(providerService, 'searchProvider').and.returnValue(throwError("error")); 
  component.onSearch(searchValue); 
  expect(spy).toHaveBeenCalled();   
}));

it('[onSearch] should not show grid when search value is empty', async(() => {
  const searchValue="";  
  component.onSearch(searchValue);  
  expect(component.showGrid).toBeFalse();
  expect(component.showForm).toBeTrue();
}));

 it('[onEdit] should navigate to ProviderMaintenance when all values are set', inject([Router], (router: Router) => {
    const provider={
      providerId: 1,
      providerFirstName: "James",
      providerLastName: "Owen",
      npi: "1234567891"
    }
    spyOn(router, 'navigate').and.stub();
    component.onEdit(provider);  
    expect(component.isUpdate).toEqual(true);
    expect(component.providerId).toEqual(provider.providerId);
   }));

   it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.submitted).toBeFalse();
    expect(component.formProvider.pristine).toBeTrue();
  }));
  
  it('[onCancel] should cancel form submission', async(() => {
    spyOn(component,'onReset').and.callThrough();
    component.onCancel();
    expect(component.isUpdate).toBeFalse(); 
    expect(component.showGrid).toBeTrue(); 
  })); 

  it('[loadPatientDetails] should not get any data when datasource is empty', fakeAsync(() => { 
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.providerDatasource = searchResultData;
    component.loadProviderDetails(event);  
    tick(500); 
    expect(component.providerGridloading).toBeFalse(); 
    expect(component.providerSearchResult).not.toBeNull();
  }));

  it('[showSuccess] works', fakeAsync((msg:any) => {
    msg = 'success';
    component.showSuccess(msg);
    flush();
    expect(component.showSuccess).toBeTruthy();
  }));

  it('[showInfo] works', fakeAsync((msg:any) => {
    msg = 'info';
    component.showInfo(msg);
    flush();
    expect(component.showInfo).toBeTruthy();
  }));

  it('[showFailure] works', fakeAsync((msg:any) => {
    msg = 'error';
    component.showFailure(msg);
    flush();
    expect(component.showFailure).toBeTruthy();
  }));
});
