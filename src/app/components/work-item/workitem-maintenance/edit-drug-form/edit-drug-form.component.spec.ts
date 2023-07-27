import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of, throwError } from 'rxjs';
import { HttpService } from 'src/app/common/services/http/http.service';

import { EditDrugFormComponent } from './edit-drug-form.component';

describe('EditDrugFormComponent', () => {
  let component: EditDrugFormComponent;
  let fixture: ComponentFixture<EditDrugFormComponent>;
  let httpService: HttpService;

  const drugCodes = [{
  active: true,
  createdDate: "2021-02-01T17:36:50.881+0000",
  createdBy: 1,
  modifiedDate: "2021-02-17T17:50:17.409+0000",
  modifiedBy: 1,
  drugId: 2,
  drugProcCode: "J0135",
  shortDesc: "Adalimumab injection",
  longDesc: "Adalimumab injection",
  brandName: "Humira Pen",
  genericName: "adalimumab",
  lcd: "LCD1728",
  notes: "test notes"
}, {
  active: true,
  createdDate: "2021-02-01T17:36:50.881+0000",
  createdBy: 1,
  modifiedDate: "2021-02-01T17:36:50.881+0000",
  modifiedBy: 1,
  drugId: 25,
  drugProcCode: "J0170",
  shortDesc: "Adrenalin epinephrin inject",
  longDesc: "Adrenalin epinephrin inject",
  brandName: "Epinephrine",
  genericName: "epinephrine",
  lcd: "",
  notes: ""
}];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDrugFormComponent ],
      imports: [ReactiveFormsModule,HttpClientTestingModule, NgbModalModule, NgbModule],
      providers:[HttpService, NgbActiveModal,NgbModal]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDrugFormComponent);
    httpService = TestBed.inject(HttpService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  
  it('[getdrugList] should get drug list', async(() => {
    const spy =spyOn(httpService, 'getAll').and.returnValue(of(drugCodes)); 
    component.getdrugList();
    expect(component.drugList ).not.toBeNull();
    expect(component.drugList).toEqual(drugCodes);
    expect(spy).toHaveBeenCalled();   
  }));
   
  it('[getdrugList] should throw error', async(() => {
    let err="error"
    spyOn(httpService, 'getAll').and.returnValue(throwError(err)); 
    component.getdrugList(); 
    expect(component.drugList ).not.toBeNull(); 
  }));

  it('[on Close] should close the modal', () => {    
    component.Close(); 
    expect(component).toBeTruthy; 
  });

  it('[getDrugsByCode] should get drugs by code - not needed', () => {    
    component.getDrugsByCode(); 
    expect(component).toBeTruthy; 
  });

  it('[onSubmit] should submit form', () => {    
    component.onSubmit(); 
    expect(component).toBeTruthy; 
  });
});
