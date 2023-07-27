import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { HttpService } from 'src/app/common/services/http/http.service';
import { Advocacy } from 'src/app/models/classes/advocacy';

import { PatientService } from 'src/app/common/services/http/patient.service';
import { ToastrService } from 'ngx-toastr';
import { concat, Observable, of, Subject } from 'rxjs';
import { alphaNumericSpaceValidator, amountValidator } from 'src/app/common/utils';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { CommonService } from 'src/app/common/services/http/common.service';
import {FileAttachmentData} from "../../shared/file-attachments/file-attachment-data";
import {FileAttachmentService} from "../../../common/services/http/file-attachment.service";

@Component({
  selector: 'app-add-advocacy',
  templateUrl: './add-advocacy.component.html',
  styleUrls: ['./add-advocacy.component.scss']
})
export class AddAdvocacyComponent implements OnInit, AfterContentChecked {

  advAddformAdvocacy: FormGroup;
  formSearchPatient: FormGroup;
  facilities: any[];
  advocacyStatuses: any[];
  advocacyTypes: any[];
  submitted: boolean;
  // drugList: any;
  icdList: any;
  searchResult: any;
  showGrid: boolean;
  patientId: any;
  advocacyInfo: Advocacy;
  showError: boolean;
  searched: boolean;
  showForm = false;
  drugId: string = '';
  userId: number;
  showSearchForm = true;

  resultGridloading: boolean;
  advDatasource: any;
  totalSearchRecords: any;

  icdCodesFiltered$: Observable<any>;
  icdCodesLoading = false;
  icdCodesInput$ = new Subject<string>();
  selectedicdCode: any;
  minLengthTerm = 2;

  icdSearchResult: any;
  icdDatasource: any;
  icdtotalRecords: any;
  icdloading: boolean;

  fileAttachmentData: FileAttachmentData = new FileAttachmentData();
  selectedFacilityId: any;
  isDirty = false;

  constructor(
    private formBuilder: FormBuilder,
    private httpService: HttpService,
    private addAdvocacyService: AdvocacyService,
    private patientService: PatientService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private change: ChangeDetectorRef,
    private fileAttachmentService: FileAttachmentService
  ) { }

  ngOnInit(): void {

    this.userId = parseInt(localStorage.userId);
    this.buildSearchForm();

    this.loadicdCodes();
    this.getFacilityList();
    this.getAdvocacyStatuses();
    this.getAdvocacyTypes();

    this.onSearch();

    this.buildAdvocacyForm();

    this.advAddformAdvocacy.get('advocacyStatusId').valueChanges.subscribe((value) => {
      if (value == 10) {
        this.advAddformAdvocacy.controls['startDate'].disable();
        this.advAddformAdvocacy.controls['endDate'].disable();
      } else {
        this.advAddformAdvocacy.controls['startDate'].enable();
        this.advAddformAdvocacy.controls['endDate'].enable();
      }
    });

    this.advAddformAdvocacy.valueChanges.subscribe(e => {
      if (this.advAddformAdvocacy.dirty)
        this.isDirty = true
    });
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }


  buildAdvocacyForm() {
    this.advAddformAdvocacy = this.formBuilder.group({
      patientMrn: [{ value: '', disabled: true }],
      facilityName: [{ value: '', disabled: true }],
      drugCode: [{ value: '', disabled: true }],
      advocacyStatusId: ['', [Validators.required]],
      advocacyTypeId: ['', [Validators.required]],
      advocacySource: ['', Validators.compose([Validators.required, Validators.maxLength(200)])],
      diagnosisCode: [null, [Validators.required]],
      workItemId: '',
      startDate: null,
      endDate: null,
      maxAmountAvail: ['', Validators.compose([Validators.required, Validators.pattern(amountValidator)])],
      lookBack: ['', Validators.compose([Validators.maxLength(50), Validators.pattern(alphaNumericSpaceValidator)])],
      lookBackStartDate: null,
      notes: ''
    }
      , {
        validator: this.comparisonValidator
      });
  }

  buildSearchForm() {
    this.formSearchPatient = this.formBuilder.group({
      mrn: '',
      facilityId: ''
    });
  }

  comparisonValidator(form: FormGroup) {

    let sAddAdvDate = form.get('startDate').value;
    if (sAddAdvDate != null) {
      let startDate = new Date(sAddAdvDate.year + '-' + sAddAdvDate.month + '-' + sAddAdvDate.day);
      let eDate = form.get('endDate').value;
      if (eDate != null) {
        let endDate = new Date(eDate.year + '-' + eDate.month + '-' + eDate.day);
        if (endDate.getTime() < startDate.getTime()) {
          form.controls['endDate'].setErrors({ dateGreaterThan: true });
        } else {
          form.controls['endDate'].setErrors(null);
        }
      }
    }

  }

  get f() { return this.advAddformAdvocacy != null ? this.advAddformAdvocacy.controls : null; }
  get sf() { return this.formSearchPatient != null ? this.formSearchPatient.controls : null; }

  onSearch() {
    this.searched = true;
    this.showError = false;

    let params = {
      'facilityId': this.formSearchPatient.controls['facilityId'].value,
      'mrn': this.formSearchPatient.controls['mrn'].value,
      'advocacyNeeded': 'Y',
      'pageSize': 5,
      'pageNum': 0
    };

    this.updateTable(params);
  }

  updateTable(params: any) {
    this.resultGridloading = true;
    this.showGrid = true;

    this.patientService.searchPatientByAny(params).subscribe((res) => {
      this.searchResult = res.content;
      this.totalSearchRecords = res.totalElements
      this.resultGridloading = false;
      if(res.totalElements == 0) {
        this.showError = true;
        this.showGrid = false;
      }
    }, (err) => {
      this.showError = true;
      this.showGrid = false;
    })
  }

  addAdvocacy(patient) {
    this.showGrid = false;
    this.showSearchForm = false;
    this.showForm = true;
    this.patientId = patient.patientId;
    this.drugId = patient.drugId;
    this.selectedFacilityId = patient.facilityId;
    this.advAddformAdvocacy.patchValue(
      {
        patientMrn: patient.patientMrn,
        facilityName: patient.facilityName,
        drugCode: patient.drugCode + " - " + patient.drugShortDesc,
        workItemId: patient.workItemId
      }
    );
  }

  loadAdvDetails(event: LazyLoadEvent) {
    let params = {
      'facilityId': this.formSearchPatient.controls['facilityId'].value,
      'mrn': this.formSearchPatient.controls['mrn'].value,
      'advocacyNeeded': 'Y',
      'pageSize': event.rows,
      'pageNum': event.first/event.rows
    }

    this.updateTable(params);
  }

  loadICDDetails(event: LazyLoadEvent) {
    this.icdSearchResult = [];
    this.icdloading = true;
    setTimeout(() => {
      if (this.icdDatasource) {
        this.icdSearchResult = this.icdDatasource.slice(event.first, (event.first + event.rows));
        this.icdloading = false;
      }
    }, 500);
  }

  loadicdCodes() {
    this.icdCodesFiltered$ = concat(
      of([]),
      this.icdCodesInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1500),
        tap(() => this.icdCodesLoading = true),
        switchMap(term => {
          return this.commonService.getIcdDetails(term)
            .pipe(
              catchError(() => of([])),
              tap(() =>
                this.icdCodesLoading = false
              ))
        }))
    );
  }


  getFacilityList() {
    this.addAdvocacyService.getFacilityList().subscribe(
      (result) => {
        this.facilities = result;
      },
      (err) => { }
    );
  }

  getAdvocacyStatuses() {
    this.addAdvocacyService.getAllAdvocacyStatus().subscribe(
      (result) => {
        this.advocacyStatuses = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAdvocacyTypes() {
    this.addAdvocacyService.getAllAdvocacyTypes().subscribe(
      (result) => {
        this.advocacyTypes = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onFileAttachmentsChanged(fileAttachmentData: FileAttachmentData) {
    this.fileAttachmentData = fileAttachmentData;
  }

  onSubmit() {
    this.submitted = true;

    if (this.advAddformAdvocacy.invalid) {
      this.showInfo('Please correct the errors before you proceed!');
      return false;
    }
    else {
      let advocacy = this.advAddformAdvocacy.value;

      let sDate = this.advAddformAdvocacy.value['startDate'];
      if (sDate != null) {
        advocacy.startDate = new Date(sDate.year + '-' + sDate.month + '-' + sDate.day);
      }

      let eDate = this.advAddformAdvocacy.value['endDate'];

      if (eDate != null) {
        advocacy.endDate = new Date(eDate.year + '-' + eDate.month + '-' + eDate.day);
      }

      let lbDate = this.advAddformAdvocacy.value['lookBackStartDate'];
      if (lbDate != null) {
        advocacy.lookBackStartDate = new Date(lbDate.year + '-' + lbDate.month + '-' + lbDate.day);
      }
      advocacy.patientId = this.patientId;
      advocacy.modifiedBy = this.userId;

      advocacy.icdId = advocacy.diagnosisCode;
      advocacy.drugId = this.drugId;
      advocacy.createdBy = this.userId;

      this.patientService.createAdvocacy(advocacy).subscribe(
        (result) => {
          this.isDirty = false;

          if (this.fileAttachmentData.selectedFiles.length > 0) {
            this.fileAttachmentService.postAttachments('advocacyId', result.advocacyId, this.fileAttachmentData).subscribe(
              (response) => {
                this.submitted = false;
                this.isDirty = false;
                this.advAddformAdvocacy.reset();
                this.showSuccess('Advocacy Id #' + result.advocacyId + ' created successfully');
                this.showForm = false;

              },
              (err) => {
                this.showSuccess('Advocacy Id #' + result.advocacyId + ' created successfully');
                this.showFailure('Failed to save attachment!')
                this.showForm = false;
              }
            );
          }
          else if (result.workItemId != null) {
            this.showSuccess('Advocacy Id #' + result.advocacyId + ' created successfully');
            this.showForm = false;
          }

          this.showSearchForm = true;
          this.showGrid = true;
          this.advAddformAdvocacy.reset();
          this.submitted = false;
          this.onSearch();

        },
        (err) => {
          console.log(err);
          this.showFailure('Failed to Create Advocacy!!');
        }
      );
    }
  }

  onCancel() {
    this.onResetSF();
    this.showForm = false;
    this.showSearchForm = true;
    this.advAddformAdvocacy.reset();
    this.onSearch();
  }

  onClear() {
    this.advAddformAdvocacy.patchValue({
      diagnosisCode: null,
      advocacyStatusId: '',
      advocacyTypeId: '',
      advocacySource: '',
      maxAmountAvail: '',
      startDate: null,
      endDate: null,
      lookBack: '',
      lookBackStartDate: null,
      notes: ''
    });
    this.submitted = false;
    this.advAddformAdvocacy.markAsPristine();
    this.advAddformAdvocacy.markAsUntouched();
    this.fileAttachmentData = new FileAttachmentData();
  }

  onResetSF() {
    this.formSearchPatient.get("facilityId").setValue('');
    this.formSearchPatient.get("mrn").setValue('');
    this.searched = false;
    this.showGrid = false;
    this.showError = false;
  }

  showSuccess(msg) {
    this.toastr.success(msg);
  }
  showInfo(msg) {
    this.toastr.info(msg);
  }
  showFailure(msg) {
    this.toastr.error(msg);
  }
}
