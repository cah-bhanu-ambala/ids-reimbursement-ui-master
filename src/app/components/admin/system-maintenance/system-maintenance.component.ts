import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { SystemService } from 'src/app/common/services/http/system.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { alphaNumericValidator, amountValidator, currencyValidator, faciliyNamesValidator, npiValidator, phoneNumValidator } from 'src/app/common/utils';
import { System } from 'src/app/models/classes/system';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-system-maintenance',
  templateUrl: './system-maintenance.component.html',
  styleUrls: ['./system-maintenance.component.scss']
})

export class SystemMaintenanceComponent implements OnInit {
  maintainFormSystem: FormGroup;
  searchSystemForm: FormGroup;
  isUpdate: boolean = false;
  submitted: boolean;

  systemList: any[];

  systemId: number;
  searchResult: any[];
  showGrid: boolean;
  systemSearchParam: string;
  systemInfo: System;
  showError: boolean;
  errorMessage: any = '';
  userId: number;
  userRole: string = '';
  showForm = true;

  noOfContacts: number = 1;
  arr: Number[];

  showViewSystemGrid: boolean;
  systemGridloading: boolean;
  systemDatasource: any;
  systemSearchResult: any;
  systemTotalRecords: any;
  isDirty = false;

  modal: NgbModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private systemService: SystemService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.userRole = localStorage.getItem("currentUserRole");
    this.buildSearchSystem();
    this.buildFormMaintainsystem();
    this.generateNumArr(1);
    this.getSystemList();
    this.onSearch('');
    this.maintainFormSystem.valueChanges.subscribe(e => {
      if (this.maintainFormSystem.dirty) {
        this.isDirty = true
      }
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getSystemList() {
    this.systemService.getSystems().subscribe(
      (result) => {
        this.systemList = result;
      },
      (err) => { }
    );
  }

  buildFormMaintainsystem() {
    this.maintainFormSystem = new FormGroup({
      systemName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)]))
    });
  }

  buildSearchSystem() {
    this.searchSystemForm = this.formBuilder.group({
      systemId: ['']
    });
  }

  get f() { return this.maintainFormSystem != null ? this.maintainFormSystem.controls : null; }


  generateNumArr(n: number) {
    this.arr = new Array(n).fill(1);
  }





  onSubmit() {
    this.submitted = true;
    this.errorMessage = ''
    //Check form is valid or not
    if (this.maintainFormSystem.invalid) {
      this.showInfo('Please correct the errors before you proceed!');
      return false;
    }
    else {
      let systemMaintain = new System();
      systemMaintain = this.maintainFormSystem.getRawValue();
      systemMaintain.active = true;
    systemMaintain.modifiedBy = this.userId;



      if (this.isUpdate) {

        systemMaintain.systemId = this.systemId;
        this.systemService.updateSystem(systemMaintain).subscribe(
          (result) => {
            this.isDirty = false;
            this.showError = false;
            this.showForm = true;
            this.showGrid = true;
            this.resetSystemFormFields();

            this.isUpdate = false;
            this.showSuccess(`Updated system successfully : ${systemMaintain.systemName}`);
            this.onSearch(this.systemSearchParam);
          },
          (err) => {
            this.errorMessage = err;
            this.showFailure(err);
          }
        );
      }
      else {
        systemMaintain.createdBy = this.userId;
        systemMaintain.systemId = null;
        this.systemService.createSystem(systemMaintain).subscribe(
          (result) => {
            this.showError = false;
            this.isDirty = false;
            this.resetSystemFormFields();
            this.showForm = true;
            this.showGrid = false;
            this.showSuccess('Added system Successfully:: ' + result.systemName);
            this.onSearch(this.systemSearchParam);
          },
          (err) => {
            this.errorMessage = err;
            this.showFailure(err);
          }
        );
      }
    }
  }

  resetSystemFormFields() {
    this.submitted = false;
    this.showError = false;
    this.maintainFormSystem.markAsPristine();
    this.maintainFormSystem.markAsUntouched();
    this.maintainFormSystem.patchValue({
      systemId: 0,
      systemName: ''
    });
  }

  onCancel() {
    this.resetSystemFormFields();
    this.onSearch('');
    this.showForm = true;
    if (this.isUpdate) {
      this.showGrid = true;
    }
    this.isUpdate = false;
  }


  onSearch(val) {
    this.systemSearchParam = val;
    this.loadSystemSearchResults(val)
  }

  loadSystemSearchResults(val) {

    this.showViewSystemGrid = false;
    this.systemGridloading = true;

    this.systemService.searchBySystemName(val).subscribe((data) => {
      if (data.length > 0) {
        this.showViewSystemGrid = true;
        this.systemDatasource = data;
        this.systemTotalRecords = data.length;
        this.systemGridloading = false;
        this.showError = false;
      }
      else {
        this.showError = true;
      }
    });
  }


  loadSystemDetails(event: LazyLoadEvent) {
    this.systemGridloading = true;
    setTimeout(() => {
      if (this.systemDatasource) {
        this.systemSearchResult = this.systemDatasource.slice(event.first, (event.first + event.rows));
        this.systemGridloading = false;
      }
    }, 500);
  }

  onEdit(system: System) {
    this.showViewSystemGrid = false;
    this.systemId = system.systemId;
    this.showForm = true;

    this.maintainFormSystem.patchValue(
      {
        systemName: system.systemName
      }
    );
    this.isUpdate = true;
    this.systemId = system.systemId;
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
