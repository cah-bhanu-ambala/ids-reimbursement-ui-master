import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder,   FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, Subject, concat, of } from 'rxjs';
import { filter, distinctUntilChanged, debounceTime, tap, switchMap, catchError } from 'rxjs/operators';

import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { CommonService } from 'src/app/common/services/http/common.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { alphaNumericSpaceValidator,  amountValidator } from 'src/app/common/utils';
import { Advocacy } from 'src/app/models/classes/advocacy';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {FileAttachmentData} from "../../../shared/file-attachments/file-attachment-data";
import {FileAttachmentService} from "../../../../common/services/http/file-attachment.service";

@Component({
  selector: 'app-edit-advocacy',
  templateUrl: './edit-advocacy.component.html',
  styleUrls: ['./edit-advocacy.component.scss']
})
export class EditAdvocacyComponent implements OnInit {

  advocacyId: number;
  formAdvocacy: FormGroup;

  advocacyStatuses: any[];
  advocacyTypes: any[];
  submitted: boolean;
  drugList: any;
  icdList: any;

  patientId: number;
  drugId: number;
  drugAdvocacyId: number;
  drugAdvocacyWebSites: any;
  drugCode: any;
  advocacyInfo: Advocacy;

  userId: number;
  showForm = false;

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
  isListChangedEditAdv = false;
  isDirty = false;
  advocacySource: any
  constructor(
    private formBuilder: FormBuilder,
    private advocacyService: AdvocacyService,
    private patientService: PatientService,
    private commonService: CommonService,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private toastr: ToastrService,
    private ngbModal: NgbModal,
    private fileAttachmentService: FileAttachmentService
  ) {
    this.activatedRouter.queryParams.subscribe((paramts) => {
      this.advocacyId = parseInt(paramts['advocacyId']);
    });
   }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.getAdvocacyById(this.advocacyId);
  }

  get f() { return this.formAdvocacy != null ? this.formAdvocacy.controls : null; }

  getAdvocacyById(advocacyId) {
    this.patientService.getAdvocacyById(advocacyId).subscribe(
      (result) => {
        /* istanbul ignore else */
        if (result) {
          // this.getFacilityList();
          this.getAdvocacyStatuses();
          this.getAdvocacyTypes();

          this.advocacyInfo = result;

          this.buildAdvocacyForm();
          this.loadicdCodes();
        }
      }
    );
  }
  get advocacySources(): FormArray { return this.formAdvocacy.get('advocacySources') as FormArray };

  buildAdvocacyForm() {

    this.drugId = this.advocacyInfo.drugId;
    this.drugCode = this.advocacyInfo.drugProcCode;
    this.drugAdvocacyId = this.advocacyInfo.drugAdvocacyId;
    this.patientId = this.advocacyInfo.patientId;
    this.drugAdvocacyWebSites = this.advocacyInfo.drugAdvocacy?.active ? this.advocacyInfo?.drugAdvocacy.drugAdvocacyWebsites : [];

    let sd = new Date(this.advocacyInfo.startDate);
    let newSd = this.advocacyInfo.startDate != null ? { year: sd.getFullYear(), month: sd.getUTCMonth() + 1, day: sd.getUTCDate() } : null;

    let eDate = new Date( this.advocacyInfo.endDate);
    let newEndDate =  this.advocacyInfo.endDate != null ? { year: eDate.getFullYear(), month: eDate.getUTCMonth() + 1, day: eDate.getUTCDate() } : null;

    let lbDate = new Date(this.advocacyInfo.lookBackStartDate);
    let newLbDate = this.advocacyInfo.lookBackStartDate != null ? { year: lbDate.getFullYear(), month: lbDate.getUTCMonth() + 1, day: lbDate.getUTCDate() } : null;

    // if (!!this.advocacyInfo.startDate) {
    //   let sd = new Date(this.advocacyInfo.startDate);
    //   this.advocacyInfo.startDate = { year: sd.getFullYear(), month: sd.getMonth() + 1, day: sd.getDate() };
    // }

    // if (!!this.advocacyInfo.endDate) {
    //   let eDate = new Date(this.advocacyInfo.endDate);
    //   this.advocacyInfo.endDate = { year: eDate.getFullYear(), month: eDate.getMonth() + 1, day: eDate.getDate() }
    // }

    // if (!!this.advocacyInfo.lookBackStartDate) {
    //   let lbDate = new Date(this.advocacyInfo.lookBackStartDate);
    //   this.advocacyInfo.lookBackStartDate = { year: lbDate.getFullYear(), month: lbDate.getMonth() + 1, day: lbDate.getDate() }
    // }

    this.formAdvocacy = this.formBuilder.group({
      patientMrn: [{ value: this.advocacyInfo.patientMrn, disabled: true }],
      facilityName: [{ value: this.advocacyInfo.facilityName, disabled: true }],
      drugCode: [{ value: this.drugCode, disabled: true }],
      advocacyStatusId: [this.advocacyInfo.advocacyStatusId, Validators.required],
      advocacyTypeId: [this.advocacyInfo.advocacyTypeId, Validators.required],
      advocacySource: [this.advocacyInfo.drugAdvocacy ? Number(this.advocacyInfo.advocacySource): this.advocacyInfo.advocacySource, Validators.compose([Validators.required, Validators.maxLength(200)])],
      diagnosisCode: [this.advocacyInfo.icdId , Validators.required],
      workItemId: [this.advocacyInfo.workItemId],
      startDate: newSd,
      endDate: newEndDate,
      maxAmountAvail: [this.advocacyInfo.maxAmountAvail, Validators.compose([Validators.required, Validators.pattern(amountValidator)])],
      lookBack: [this.advocacyInfo.lookBack, Validators.compose([Validators.maxLength(50), Validators.pattern(alphaNumericSpaceValidator)])],
      lookBackStartDate: newLbDate,
      notes: [this.advocacyInfo.notes]
    });
    // , { validator: this.comparisonValidator });

    this.formAdvocacy.controls['diagnosisCode'].setValue(  this.advocacyInfo.icdId);
    if(this.formAdvocacy.get('advocacyStatusId').value == 10){
      this.formAdvocacy.controls['startDate'].disable();
      this.formAdvocacy.controls['endDate'].disable();
     }else{
      this.formAdvocacy.controls['startDate'].enable();
      this.formAdvocacy.controls['endDate'].enable();
     }

    this.formAdvocacy.get('advocacyStatusId').valueChanges.subscribe((value) => {
      if(value == 10){
       this.formAdvocacy.controls['startDate'].disable();
       this.formAdvocacy.controls['endDate'].disable();
      }else{
       this.formAdvocacy.controls['startDate'].enable();
       this.formAdvocacy.controls['endDate'].enable();
      }
    });
    //check
    this.advocacyInfo.attachments.forEach(attachment => {
        this.fileAttachmentData.filesList.push({name:attachment.attachmentPath , attachmentId: attachment.advocacyAttachmentId});
    });;

    this.formAdvocacy.valueChanges.subscribe(e => {
      if (this.formAdvocacy.dirty)
        this.isDirty = true
    });
  }


  comparisonValidator(form: FormGroup) {

    let sDate = form.get('startDate').value;
    if (sDate != null) {
      let startDate = new Date(sDate.year + '-' + sDate.month + '-' + sDate.day);
      let eDate = form.get('endDate').value;
      if (eDate != null) {
        let endDate = new Date(eDate.year + '-' + eDate.month + '-' + eDate.day);
        if (endDate.getTime() < startDate.getTime()) {
          form.controls['endDate'].setErrors({ 'dateGreaterThan': true });
        }
      }
    }
  }

  loadICDDetails(event: LazyLoadEvent) {
    this.icdSearchResult = [];
    this.icdloading = true;
    setTimeout(() => {
      /* istanbul ignore else */
      if (this.icdDatasource) {
        this.icdSearchResult = this.icdDatasource.slice(event.first, (event.first + event.rows));
        this.icdloading = false;
      }
    }, 500);
  }

  loadicdCodes() {

    if(!!this.advocacyInfo.icdCode ){

      this.icdCodesFiltered$ = concat(
        of([]),
        this.icdCodesInput$.pipe(
          switchMap((term =this.advocacyInfo.icdCode) => {
            return this.commonService.getIcdDetails(term)
              .pipe(
                catchError(() => of([])),
                tap(() =>
                  this.icdCodesLoading = false
                ))
          }))
      )
    }

    this.icdCodesFiltered$ = concat(
      of([ { icdValue: this.advocacyInfo.icdCode +' - ' + this.advocacyInfo.icdDescription,icdId: this.advocacyInfo.icdId}]),
      this.icdCodesInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1500),
        tap(() => this.icdCodesLoading = true),
        switchMap((term =this.advocacyInfo.icdCode )=> {
          return this.commonService.getIcdDetails(term)
            .pipe(
              catchError(() => of([])),
              tap(() =>
                this.icdCodesLoading = false
              ))
        }))
    );

  }

  getAdvocacyStatuses() {
    this.advocacyService.getAllAdvocacyStatus().subscribe(
      (result) => {
        this.advocacyStatuses = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getAdvocacyTypes() {
    this.advocacyService.getAllAdvocacyTypes().subscribe(
      (result) => {
        this.advocacyTypes = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onFileAttachmentsChanged(fileAttachmentData: FileAttachmentData) {
    this.isListChangedEditAdv = true;
    this.fileAttachmentData = fileAttachmentData;
  }

  onSubmit() {
    this.submitted = true;
    //Check form is valid or not
    if (this.formAdvocacy.invalid) {
      this.showInfo('Please correct the errors before you proceed!');
      return false;
    }
    else {
      let advocacy = this.formAdvocacy.value;

      let sDate = this.formAdvocacy.value['startDate'];
      if (sDate != null) {
        advocacy.startDate = new Date(sDate.year + '-' + sDate.month + '-' + sDate.day);
      }

      let eDate = this.formAdvocacy.value['endDate'];

      if (eDate != null) {
        advocacy.endDate = new Date(eDate.year + '-' + eDate.month + '-' + eDate.day);
      }

      let lbDate = this.formAdvocacy.value['lookBackStartDate'];
      if (lbDate != null) {
        advocacy.lookBackStartDate = new Date(lbDate.year + '-' + lbDate.month + '-' + lbDate.day);
      }
      advocacy.patientId = this.patientId;
      advocacy.modifiedBy = parseInt(localStorage.userId);

      advocacy.icdId = advocacy.diagnosisCode ;

      advocacy.drugId = this.drugId;
      advocacy.advocacyId = this.advocacyId;
      this.patientService.updateAdvocacy(advocacy).subscribe(
        (result) => {
          this.submitted = false;
          this.isDirty = false;
          this.formAdvocacy.reset();


          this.fileAttachmentService.postAttachments('advocacyId', result.advocacyId, this.fileAttachmentData).subscribe(
            (response) => {
              this.submitted = false;
              this.isDirty = false;
              this.formAdvocacy.reset();
              this.showSuccess('Advocacy Id #' + result.advocacyId + ' updated successfully');
              this.router.navigate(['/dashboard/advocacy/advocacyMaintenance']);
            },
            (err) => {
              this.showSuccess('Advocacy Id #' + result.advocacyId + ' updated successfully');
              this.showFailure('Failed to save attachment!');
              this.router.navigate(['/dashboard/advocacy/advocacyMaintenance']);
            }
          );

          if (this.fileAttachmentData.deletedFilesList.length > 0) {
            this.fileAttachmentService.deleteAttachments('advocacyId', this.fileAttachmentData).subscribe(
              (result) => {
                this.fileAttachmentData.deletedFilesList.forEach(deletedFileAttachmentId => {
                  this.advocacyInfo.attachments =this.advocacyInfo.attachments.filter(row=>
                    row.advocacyAttachmentId != deletedFileAttachmentId);
                });
              },
              (err) => {
                this.showFailure('Failed to delete the attachment!');
                console.log(err);
              }
            );
            this.showSuccess('Advocacy Id #' + result.advocacyId + ' updated successfully');
            this.router.navigate(['/dashboard/advocacy/advocacyMaintenance']);
          }
          else if (result.workItemId != null) {
            this.isDirty = false;
            this.showSuccess('Advocacy Id #' + result.advocacyId + ' updated successfully');
            this.router.navigate(['/dashboard/advocacy/advocacyMaintenance']);
          }
        },
        (err) => {
          console.log(err);
          this.showFailure('Advocacy Id # ' + advocacy.advocacyId + ' update Failed!!');
          this.router.navigate(['/dashboard/advocacy/advocacyMaintenance']);
        }
      );
      // this.router.navigate(['/dashboard/advocacy/advocacyMaintenance']);
    }
  }

 onClear(){
    this.formAdvocacy.patchValue({
      diagnosisCode: null,
      advocacyStatusId: '',
      advocacyTypeId: '',
      advocacySource: '',
      maxAmountAvail:'',
      startDate: null,
      endDate: null,
      lookBack: '',
      lookBackStartDate: null,
      notes: ''
    });

    this.submitted = false;
    this.formAdvocacy.markAsPristine();
    this.formAdvocacy.markAsUntouched();
  }

  isAttachmentUpdated(){
    return this.isListChangedEditAdv;
  }

  onCancel() {
    this.submitted = false;
    this.router.navigate(['/dashboard/advocacy/advocacyMaintenance']);
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

