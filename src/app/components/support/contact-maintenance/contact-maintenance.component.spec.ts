import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, fakeAsync, flush, inject, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { ContactService } from 'src/app/common/services/http/contact.service';
import { SearchRevenueComponent } from '../../shared/search-revenue/search-revenue.component';

import { ContactMaintenanceComponent } from './contact-maintenance.component';

describe('ContactMaintenanceComponent', () => {
  let component: ContactMaintenanceComponent;
  let fixture: ComponentFixture<ContactMaintenanceComponent>;
  let contactService: ContactService;

  const searchResultData=[
    {
      active: true,
      createdDate: "2021-02-01T18:00:13.083+0000",
      createdBy: 1,
      modifiedDate: "2021-02-01T18:00:13.083+0000",
      modifiedBy: 1,
      contactId: 1,
      contactName: "ABC ",
      contactTypeId: 2,
      contactPhone: "1122233333",
      contactFax: "4445556666",
      contactWebsite: "www.abc.com",
      contactNotes: "test Notes",
      contactTypeName: "Insurance"
    }
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactMaintenanceComponent, SearchRevenueComponent],
      imports: [ReactiveFormsModule,HttpClientTestingModule,RouterTestingModule,
        ToastrModule.forRoot(),BrowserAnimationsModule ],
      providers:[ContactService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactMaintenanceComponent);
    component = fixture.componentInstance;
    contactService=TestBed.inject(ContactService);
    component.ngOnInit();
    spyOn(window, 'alert').and.callFake(()=>true);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('[Contact Name-Check]-should check Contact Name value is required', () => {
    let cName = component.formContact.controls['contactFirstName'];
    let cLastName = component.formContact.controls['contactLastName'];
    expect(cName.valid).toBeFalsy();
    expect(cName.pristine).toBeTruthy();
    expect(cName.errors['required']).toBeTruthy();

    expect(cLastName.valid).toBeFalsy();
    expect(cLastName.pristine).toBeTruthy();
    expect(cLastName.errors['required']).toBeTruthy();
  });

  it('[contact Type Id-Check]-should check contact Type Id value is required', () => {
    let contactTypeId = component.formContact.controls['contactTypeId'];
    expect(contactTypeId.valid).toBeFalsy();
    expect(contactTypeId.pristine).toBeTruthy();
    expect(contactTypeId.errors['required']).toBeTruthy();
  });
  it('[contactName-Check]-should check Contact Name errors', () => {
    let cName = component.formContact.controls['contactFirstName'];
    cName.setValue('abcdefzhijklmnopqrstuvwxyzabcdefzhijklmnopqrstuvwxyzqwer'); // Gave more than 50 chars
    expect(cName.errors).not.toBeNull();
    expect(cName.valid).toBeFalsy();
    cName.setValue('abcde'); // Gave valid name
    expect(cName.errors).toBeNull();
    expect(cName.valid).toBeTruthy();
  });
  it('[contactWebsite-Check]-should check contact Website errors', () => {
    let contactWebsite = component.formContact.controls['contactWebsite'];
    contactWebsite.setValue('.invalidwebsite')
    expect(contactWebsite.errors).not.toBeNull();
    expect(contactWebsite.valid).toBeFalsy();
    contactWebsite.setValue('wwww.validwebsite.com')
    expect(contactWebsite.errors).toBeNull();
    expect(contactWebsite.valid).toBeTruthy();
  });

  it('[Notes-Check]-should check Notes errors', () => {
    let notes = component.formContact.controls['contactNotes'];
    notes.setValue('test notes with abcd 123 &65845_)(*&%6');
    expect(notes.errors).toBeNull();
    expect(notes.valid).toBeTruthy();
  });

  it('[Phone-Check]-should check Phone number errors', () => {
    let contactPhone = component.formContact.controls['contactPhone'];
    contactPhone.setValue('5678905678');
    expect(contactPhone.errors).toBeNull();
    expect(contactPhone.valid).toBeTruthy();
  });

  it('[Phone-Check]-should check fax errors', () => {
    let contactFax= component.formContact.controls['contactFax'];
    contactFax.setValue('325353252');
    expect(contactFax.errors).toBeNull();
    expect(contactFax.valid).toBeTruthy();
  });

  it('[Contact Form-Check]-Should check form is invalid if no values are entered', () => {
    expect(component.formContact.valid).toBeFalsy();
  });

  it('[Form-Check]-Should check form is valid when values are entered', () => {
    component.formContact.controls['contactFirstName'].setValue('Testcontactone');
    component.formContact.controls['contactLastName'].setValue('Test');
    component.formContact.controls['contactTypeId'].setValue(2);
    component.formContact.controls['contactWebsite'].setValue('www.testweb.com');
    component.formContact.controls['contactNotes'].setValue('test notes');
    component.formContact.controls['contactPhone'].setValue('345-678-9870');
    component.formContact.controls['contactFax'].setValue('345-678-9871');
    expect(component.formContact.valid).toBeTruthy();
    expect(component.f).toBeTruthy();
  });


  it('[getContactTypes] should get secondary insurance list', async(() => {
    let spy=spyOn(contactService, 'getAllContacts').and.returnValue(of({}));
    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    component.getContactTypes();
    expect(component.contactTypes).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[getContactTypes] should throw error', async(() => {
    let err="error"
    spyOn(component, 'showFailure').and.callFake(()=>"Failed");
    spyOn(contactService, 'getAllContacts').and.returnValue(throwError(err));
    component.getContactTypes();
    expect(contactService.getAllContacts).toHaveBeenCalled();
  }));

  it('[onSubmit] should not update data when form is invalid', async(() => {
    component.submitted = true;
     expect(component.onSubmit()).toBeFalse();
  }));

  it('[onSubmit] should update form when all the data is supplied and isupdate is true', async(() => {
    component.isUpdate=true;
    component.formContact.controls['contactFirstName'].setValue('Testcontactone');
    component.formContact.controls['contactLastName'].setValue('Test');
    component.formContact.controls['contactTypeId'].setValue(2);
    component.formContact.controls['contactWebsite'].setValue('www.testweb.com');
    component.formContact.controls['contactNotes'].setValue('test notes');
    component.formContact.controls['contactPhone'].setValue('345-678-9870');
    component.formContact.controls['contactFax'].setValue('345-678-9871');
    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    spyOn(contactService, 'updateContact').and.returnValue(of({})) ;
    component.onSubmit();
    expect(contactService.updateContact).toHaveBeenCalled();
  }));

  it('[onSubmit] should call create form when isupdate is false', async(() => {
    component.isUpdate=false;
    component.formContact.controls['contactFirstName'].setValue('Testcontactone');
    component.formContact.controls['contactLastName'].setValue('Test');
    component.formContact.controls['contactTypeId'].setValue(2);
    component.formContact.controls['contactWebsite'].setValue('www.testweb.com');
    component.formContact.controls['contactNotes'].setValue('test notes');
    component.formContact.controls['contactPhone'].setValue('345-678-9870');
    component.formContact.controls['contactFax'].setValue('345-678-9871');
    spyOn(component, 'showSuccess').and.callFake(()=>"success");
    spyOn(contactService, 'createContact').and.returnValue(of({})) ;
    component.onSubmit();
    expect(contactService.createContact).toHaveBeenCalled();
  }));

  it('[onSubmit] should throw error during create api call', async(() => {
    component.isUpdate=false;
    component.formContact.controls['contactFirstName'].setValue('Testcontactone');
    component.formContact.controls['contactLastName'].setValue('Test');
    component.formContact.controls['contactTypeId'].setValue(2);
    component.formContact.controls['contactWebsite'].setValue('www.testweb.com');
    component.formContact.controls['contactNotes'].setValue('test notes');
    component.formContact.controls['contactPhone'].setValue('345-678-9870');
    component.formContact.controls['contactFax'].setValue('345-678-9871');

    const spy = spyOn(contactService, 'createContact').and.returnValue(throwError("err")) ;
     spyOn(component, 'showFailure').and.callFake(()=>"Failed");

    component.onSubmit();
    expect(component.errorMessage).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSubmit] should throw error during update api call', async(() => {
    component.isUpdate=true;
    component.formContact.controls['contactFirstName'].setValue('Testcontactone');
    component.formContact.controls['contactLastName'].setValue('Test');
    component.formContact.controls['contactTypeId'].setValue(2);
    component.formContact.controls['contactWebsite'].setValue('www.testweb.com');
    component.formContact.controls['contactNotes'].setValue('test notes');
    component.formContact.controls['contactPhone'].setValue('345-678-9870');
    component.formContact.controls['contactFax'].setValue('345-678-9871');

     const spy = spyOn(contactService, 'updateContact').and.returnValue(throwError("err")) ;
     spyOn(component, 'showFailure').and.callFake(()=>"Failed");

    component.onSubmit();
    expect(component.errorMessage).not.toBeNull();
    expect(spy).toHaveBeenCalled();
  }));

  it('[onSearch] should search for contact and results found', async(() => {
    const searchValue="ABC";
    spyOn(contactService, 'searchContact').and.returnValue(of(searchResultData));
    component.onSearch(searchValue);
    expect(component.contactDatasource).toEqual(searchResultData);
    expect(contactService.searchContact).toHaveBeenCalled();
  }));

  it('[onSearch] should search for contact and results empty', async(() => {
    const searchValue="ABC";
    spyOn(component, 'showInfo').and.callFake(()=>"No Records Found");
    spyOn(contactService, 'searchContact').and.returnValue(of([]));
    component.onSearch(searchValue);
    expect(contactService.searchContact).toHaveBeenCalled();
    expect(component.showGrid).toBeFalse();
  }));

  it('[onSearch] should not show grid when search value is empty', async(() => {
    const searchValue="";
    component.onSearch(searchValue);
    expect(component.showGrid).toBeFalse();
    expect(component.showForm).toBeTrue();
  }));

  it('[onSearch] should throw error', async(() => {
    const searchValue="ABC";
    let spy=spyOn(contactService, 'searchContact').and.returnValue(throwError("error"));
    component.onSearch(searchValue);
    expect(spy).toHaveBeenCalled();
  }));

  it('[onEdit] should navigate to patientMaintenance when all values are set', inject([Router], (router: Router) => {
    const contact={
      contactName: "ABC ",
      contactTypeId: 2,
      contactPhone: "1122233333",
      contactFax: "4445556666",
      contactWebsite: "www.abc.com",
      contactNotes: "test Notes",
      contactTypeName: "Insurance",
      contactId: 15
    }
    spyOn(router, 'navigate').and.stub();
    component.onEdit(contact);
    expect(component.isUpdate).toEqual(true);
    expect(component.contactId).toEqual(contact.contactId);
   }));

   it('[onReset] should clear the form', async(() => {
    component.onReset();
    expect(component.submitted).toBeFalse();
    expect(component.formContact.pristine).toBeTrue();
  }));

  it('[onCancel] should cancel form submission', async(() => {
    component.onCancel();
    expect(component.isUpdate).toBeFalse();
  }));

  it('[loadContactDetails] should not get any data when datasource is empty', fakeAsync(() => {
    let event:LazyLoadEvent ={
      first: 0,
      rows: 1
    };
    component.contactDatasource = searchResultData;
    component.loadContactDetails(event);
    tick(500);
    expect(component.contactGridloading ).toBeFalse();
    expect(component.contactSearchResult ).not.toBeNull();
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

  it('[deleteContact] should delete contact throw error', fakeAsync(() => {
      const contactId = 25;
      let err = "error";
      let spy = spyOn(contactService, 'deleteContact').and.returnValue(throwError(err));
      component.deleteContact(contactId);
      tick(500);
      flush();
      expect(spy).toHaveBeenCalled();
    }));

    it('[deleteContact] should delete contact delete successful', fakeAsync(() => {
          const contactId = 25;
          let spy = spyOn(contactService, 'deleteContact').and.returnValue(of([]));
          component.deleteContact(contactId);
          tick(500);
          flush();
          expect(spy).toBeTruthy();
        }));

    it('[onDelete]should delete contact', fakeAsync(() => {
      const contactId = 25;
      let spy = spyOn(contactService, 'deleteContact').and.returnValue(of([]));
      component.onDelete(contactId);
      tick(500);
      flush();
      expect(spy).toBeTruthy();
    }));
});
