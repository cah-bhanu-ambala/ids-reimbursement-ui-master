import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { ContactService } from 'src/app/common/services/http/contact.service';
import { alphaNumericSpaceValidator, webSiteValidator } from 'src/app/common/utils';
import { Contact } from 'src/app/models/classes/contact';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-contact-maintenance',
  templateUrl: './contact-maintenance.component.html',
  styleUrls: ['./contact-maintenance.component.scss']
})
export class ContactMaintenanceComponent implements OnInit {

  contactSearchParam: boolean;
  contactTypes: any[];
  formContact: FormGroup;
  submitted: boolean;
  isUpdate: boolean = false;
  searchResult: any[];
  showGrid: boolean;
  contactId: number;
  showError: boolean;
  errorMessage: any;
  showForm:boolean = true;
  contact: Contact;

  contactGridloading: boolean;
  contactDatasource: any;
  contactSearchResult: any;
  contactTotalRecords: any;
  isDirty = false;

  constructor(
    private formBuilder: FormBuilder,
    private contactService: ContactService,
    private router: Router,
    private ngbModal: NgbModal,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.buildFormFacility();
    this.getContactTypes();
    this.onSearch('');
    this.formContact.valueChanges.subscribe( e =>  {
      if(this.formContact.dirty)
        this.isDirty = true
    } );
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  buildFormFacility() {
    this.formContact = this.formBuilder.group({
      // contactName: ['',[ Validators.required, Validators.maxLength(50)]],
      contactFirstName: ['', [Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]],
      contactLastName: ['', [Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]],
      contactTypeId: [null, [Validators.required]],
      contactWebsite: ['', [Validators.maxLength(100), Validators.pattern(webSiteValidator)]],
      contactNotes: ['', Validators.compose(
        [Validators.maxLength(1000)])],
      contactPhone: [''],
      contactFax: ['']
    });
  }
  get f() { return this.formContact != null ? this.formContact.controls : null; }

  getContactTypes() {
    this.contactService.getAllContacts().subscribe(
      (result) => {
        this.contactTypes = result;
      },
      (err) => { }
    );
  }

  onReset() {
    this.submitted = false;
    this.formContact.reset();
    this.formContact.markAsPristine();
  }

  onCancel() {
    this.onReset();
    this.isUpdate = false;
    this.showGrid = true;
    this.showForm = true;
  }

  onSubmit() {
    this.submitted = true;
    this.showGrid = false;

    //Check form is valid or not
    if (this.formContact.invalid) {
      return false;
    }
    else {
      this.contact = this.formContact.value;
      this.contact.active = true;
      this.contact.modifiedBy = parseInt(localStorage.userId);

      if (this.isUpdate) {
        this.contact.contactId = this.contactId;

        this.contactService.updateContact(this.contact).subscribe(
          (result) => {
            this.submitted = false;
            this.isDirty = false;
            this.isUpdate = false;
            this.formContact.reset();
            this.showSuccess('Updated Contact successfully:: '+this.contact.contactFirstName+' '+this.contact.contactLastName);
            this.onSearch('');
          },
          (err) => {
            console.log(err);
            this.showFailure('Update Failed!');
          }
        );
      }
      else {
        this.contact.createdBy = parseInt(localStorage.userId);
        this.contactService.createContact(this.contact).subscribe(
          (result) => {
            this.showGrid = false;
            this.isDirty = false;
            this.submitted = false;
            this.formContact.reset();
            this.showSuccess('Added Contact successfully:: '+this.contact.contactFirstName+' '+this.contact.contactLastName);
            this.onSearch('');
          },
          (err) => {
            console.log(err);
            this.showFailure(err);
          }
        );
      }

    }
  }

  onSearch(searchValue) {
    this.showGrid = false;
      this.contactSearchParam = searchValue;
      this.contactService.searchContact(searchValue).subscribe(
        (result) => {
          this.searchResult = result;
          if (this.searchResult != null && this.searchResult.length > 0) {
            this.showGrid = true;
            this.showForm = true;
            this.showError = false;
            this.contactDatasource = result;
            this.contactTotalRecords = result.length;
            this.contactGridloading = false;
          }
          else {
            this.showGrid = false;
            this.showError = true;
            // this.showInfo('No Records Found!');
          }

        },
        (err) => { }
      );
    }

  loadContactDetails(event: LazyLoadEvent) {
    this.contactGridloading = true;
    setTimeout(() => {
      if (this.contactDatasource) {
        this.contactSearchResult = this.contactDatasource.slice(event.first, (event.first + event.rows));
        this.contactGridloading = false;
      }
    }, 500);
  }


  onEdit(contact) {
    this.formContact.reset();
    this.showGrid = false;
    this.showForm = true;
    this.formContact.patchValue(
      {
        contactFirstName: contact.contactFirstName,
        contactLastName: contact.contactLastName,
        contactTypeId: contact.contactTypeId,
        contactPhone: contact.contactPhone,
        contactFax: contact.contactFax,
        contactWebsite: contact.contactWebsite,
        contactNotes: contact.contactNotes,
      }
    );
    this.isUpdate = true;
    this.contactId = contact.contactId;
    this.router.navigate(['/dashboard/support/contactMaintenance']);

  }

  onDelete(contact) {
      const modal = this.ngbModal.open(ConfirmModalComponent, {
        backdrop: 'static',
        keyboard: false,
        size: 'm'
      });
      modal.componentInstance.textMessage = "delete";
      modal.componentInstance.delete.subscribe(() => {
        this.deleteContact(contact);
      });
    }

    deleteContact(contact) {
        let params={
          svoId: contact.contactId,
          modifiedBy : parseInt(localStorage.userId)
        }
        this.contactService.deleteContact(params).subscribe(
          (result) => {
            this.showSuccess('Successfully deleted Contact');
            this.onSearch('');
          },
          err=>{
            this.showFailure('Failed to Delete Contact');
          }
        );
      }

  showSuccess(msg) {
    this.toastr.success(msg);
  }

  showFailure(msg) {
    this.toastr.error(msg);
  }

  showInfo(msg) {
    this.toastr.info(msg);
  }
}
