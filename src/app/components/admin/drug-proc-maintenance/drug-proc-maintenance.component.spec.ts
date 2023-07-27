import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { DrugProcMaintenanceComponent } from './drug-proc-maintenance.component';
import { of, throwError } from 'rxjs';
import { DrugOrProc } from 'src/app/models/classes/drug-or-proc';
import { Router } from '@angular/router';
import { SearchRevenueComponent } from '../../shared/search-revenue/search-revenue.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonService } from 'src/app/common/services/http/common.service';
import { DrugprocService } from 'src/app/common/services/http/drugproc.service';
import { LazyLoadEvent } from 'primeng/api';
import { TableModule } from 'primeng/table';

describe('DrugProcMaintenanceComponent', () => {
  let component: DrugProcMaintenanceComponent;
  let fixture: ComponentFixture<DrugProcMaintenanceComponent>;
  let commonService: CommonService;
  let drugProcService: DrugprocService;
  let toastr: ToastrService;

  let drugOrProcData:DrugOrProc={
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
    const drugByCodeData={
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

    let pageableDrugData = {
       "content": [
           {
               "drugProcCode": "00023320503",
               "shortDesc": "Lumigan 0.01% 2.5 ML",
               "longDesc": "Lumigan 0.01% 2.5 ML",
               "brandName": "Lumigan",
               "genericName": "bimatoprost",
               "drugId": 699,
               "notes": "",
               "lcd": ""
           }
       ],
       "totalElements": 23279
    };

    let drugOrProcListData=[];
    drugOrProcListData.push(drugOrProcData);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DrugProcMaintenanceComponent,SearchRevenueComponent],
      imports: [ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule,
        ToastrModule.forRoot(), BrowserAnimationsModule, TableModule],
      providers:[DrugprocService, CommonService, ToastrService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrugProcMaintenanceComponent);
    // drugProcService = TestBed.inject(drugProcService);
    drugProcService = TestBed.inject(DrugprocService);
    commonService = TestBed.inject(CommonService);
    toastr = TestBed.inject(ToastrService);
    component = fixture.componentInstance;
    component.ngOnInit();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('[Form-Check]-Should form validity when no values are entered', () => {
    expect(component.drugForm.valid).toBeFalsy();
  });

  it('[Form-Check]-form should be valid when all values are entered', () => {
    component.drugForm.controls['drugProcCode'].setValue('J0135');
    component.drugForm.controls['shortDesc'].setValue('Adalimumab injection');
    component.drugForm.controls['longDesc'].setValue('Adalimumab injection');
    component.drugForm.controls['brandName'].setValue('Humira Pen');
    component.drugForm.controls['genericName'].setValue('adalimumab');
    component.drugForm.controls['lcd'].setValue('');
    expect(component.drugForm.valid).toBeTruthy();
  });

  it('should return form',async(()=>{
    component.drugForm.controls['drugProcCode'].setValue('J0135');
    component.drugForm.controls['shortDesc'].setValue('Adalimumab injection');
    component.drugForm.controls['longDesc'].setValue('Adalimumab injection');
    component.drugForm.controls['brandName'].setValue('Humira Pen');
    component.drugForm.controls['genericName'].setValue('adalimumab');
    component.drugForm.controls['lcd'].setValue('');
    expect(component.f).not.toBeNull();
  }));

  it('should not return form when no values set',async(()=>{
    component.drugForm=null;
    expect(component.f).toBeNull();
  }));

  it('[getDrugsByCode] should get list', async(() => {
    spyOn(drugProcService, 'getDrugsByCode').and.returnValue(of(drugByCodeData));
    component.drugForm.controls["drugProcCode"].setValue("J0135");
    component.getDrugsByCode();
   expect(component.drugorproc).not.toBeNull();
    expect(drugProcService.getDrugsByCode).toHaveBeenCalled();
  }));

  it('[getDrugsByCode] should get empty list', async(() => {
    spyOn(drugProcService, 'getDrugsByCode').and.returnValue(of(null));
    component.getDrugsByCode();
    expect(drugProcService.getDrugsByCode).toHaveBeenCalled();
  }));

  it('[getDrugsByCode] should throw error', async(() => {
    let err="error"
    spyOn(drugProcService, 'getDrugsByCode').and.returnValue(throwError(err));
    component.getDrugsByCode();
    expect(drugProcService.getDrugsByCode).toHaveBeenCalled();
  }));

  it('[onSubmit] should not update data when form is invalid', async(() => {
     expect(component.onSubmit()).toBeFalse();
  }));

  it('[onSubmit] should throw error', async(() => {
    let err="error"
    spyOn(drugProcService, 'updateDrugProc').and.returnValue(throwError(err));
    spyOn(component, 'showFailure').and.callFake(()=>"Error");

    component.isUpdate=true;
    component.drugForm.controls['drugProcCode'].setValue('J0135');
    component.drugForm.controls['shortDesc'].setValue('Adalimumab injection');
    component.drugForm.controls['longDesc'].setValue('Adalimumab injection');
    component.drugForm.controls['brandName'].setValue('Humira Pen');
    component.drugForm.controls['genericName'].setValue('adalimumab');
    component.drugForm.controls['lcd'].setValue(25);

    component.drugOrProcList = drugOrProcListData;
    component.onSubmit();
    expect(drugProcService.updateDrugProc).toHaveBeenCalled();
  }));

  it('[onSubmit] should return false when form data is invalid', async(() => {
    component.buildDrugForm()
    expect(component.onSubmit()).toBeFalsy();
  }));

  it('[onSubmit] should update data when form data is valid', () => {
    localStorage.userId = '';
    component.drugId = 12345;
    component.buildDrugForm();
    component.drugForm.patchValue({
        drugProcCode: 1234,
        longDesc: "long desc",
        shortDesc: "short description",
        brandName: "Cardinal health",
        genericName: "generic name",
        lcd: "sample",
        notes: "sample notes"
    });
    const spy = spyOn(drugProcService, 'updateDrugProc').and.returnValue(of(pageableDrugData));
    component.drugForm.updateValueAndValidity();
    component.onSubmit();
    expect(spy).toHaveBeenCalled();
  });

  it('[onSubmit] should update data when isUpdate is set', async(() => {
    spyOn(drugProcService, 'updateDrugProc').and.returnValue(of(drugOrProcListData));
    spyOn(component, 'showSuccess').and.callFake(()=>"success");

    component.isUpdate=true;
    component.drugForm.controls['drugProcCode'].setValue('J0135');
    component.drugForm.controls['shortDesc'].setValue('Adalimumab injection');
    component.drugForm.controls['longDesc'].setValue('Adalimumab injection');
    component.drugForm.controls['brandName'].setValue('Humira Pen');
    component.drugForm.controls['genericName'].setValue('adalimumab');
    component.drugForm.controls['lcd'].setValue(25);

    component.drugOrProcList = drugOrProcListData;
    component.onSubmit();
    expect(drugProcService.updateDrugProc).toHaveBeenCalled();
  }));

  it('[onEdit] should route to drugProcMaintenance', inject([Router], (router: Router) => {
    const drug= {drugProcCode: "J0135",
    shortDesc: "Adalimumab injection",
    longDesc: "Adalimumab injection",
    brandName: "Humira Pen",
    genericName: "adalimumab",
    lcd: "",
    notes: ""};
    spyOn(router, 'navigate').and.stub();
    component.onEdit(drug);
    expect(component.isUpdate).toEqual(true);
  }));


  it('[onSearch] set drug Search Parameters', async(() => {
    const searchparam="J0135";
    component.onSearch(searchparam);
    expect(component.drugSearchParam.searchParam).toEqual(searchparam);
    expect(component.drugSearchParam.pageNum).toEqual(0);
    expect(component.drugSearchParam.pageSize).toEqual(5);
    expect(component.showViewDrugGrid).toBeTrue();
  }));

  it('[loadDrugDetails] should set the parameters for the search results call', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.drugDatasource = drugOrProcListData;
    spyOn(component, 'loadSearchResults').and.stub();
    component.loadDrugDetails(event);
    tick(500);
    expect(component.drugProcloading).toBeTrue();
    expect(component.loadSearchResults).toHaveBeenCalled();
    expect(component.drugSearchParam.pageNum).toEqual(event.first/event.rows);
    expect(component.drugSearchParam.pageSize).toEqual(event.rows);
  }));

  it('should call the service to get drug data', async(() => {
    spyOn(drugProcService, 'searchByDrugProc').and.returnValue(of(pageableDrugData));
    component.loadSearchResults();
    expect(drugProcService.searchByDrugProc).toHaveBeenCalled();
    expect(component.drugProcloading).toBeFalsy();
    expect(component.showError).toBeFalsy();
    expect(component.drugDatasource).toEqual(pageableDrugData.content);
    expect(component.drugTotalRecords).toEqual(pageableDrugData.totalElements);
  }));

  it('should call the service and error on null api response', async(() => {
    spyOn(drugProcService, 'searchByDrugProc').and.returnValue(of(null));
    component.loadSearchResults();
    expect(drugProcService.searchByDrugProc).toHaveBeenCalled();
    expect(component.showError).toBeTrue();
  }));

  it('[deleteDrug] should delete', async(() => {
    const drugId=25;
   let spy= spyOn(drugProcService, 'deleteDrugProc').and.returnValue(of([]));
    component.deleteDrug(drugId);
    expect(spy).toHaveBeenCalled();
  }));

  it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.submitted).toBeFalse();
    expect(component.drugForm.pristine).toBeTrue();
  }));

  it('[onCancel] should cancel form submission', async(() => {
    component.onCancel();
    expect(component.submitted).toBeFalse();
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
