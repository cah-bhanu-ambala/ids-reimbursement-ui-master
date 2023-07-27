import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { alphaNumericSpaceValidator, alphaNumericValidator } from 'src/app/common/utils';
import { Patient } from 'src/app/models/classes/patient';
import { LazyLoadEvent } from 'primeng/api';
import { CommonService } from 'src/app/common/services/http/common.service'
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { concat, Observable, of, Subject } from 'rxjs';
import { CustomerWorkitemService } from 'src/app/common/services/http/customer-workitem.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import {FileAttachmentData} from "../../shared/file-attachments/file-attachment-data";
import {FileAttachmentService} from "../../../common/services/http/file-attachment.service";

@Component({
  selector: 'app-add-customer-workitem',
  templateUrl: './add-customer-workitem.component.html',
  styleUrls: ['./add-customer-workitem.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddCustomerWorkitemComponent implements OnInit, AfterContentChecked {

  formCustomerWorkItem: FormGroup;
  submitted: boolean;
  facilities: any[];
  providerList: any[];
  searchResult: any;
  showGrid: boolean;
  showError: boolean;
  patientInfo: Patient;
  isUpdate: boolean;
  billingTypes: any[];
  patientId: any;
  searched: boolean;
  workItemId: number;
  isProviderUndefined: boolean = false;

  showAddWorkItem: boolean = false;
  showPatientSearch: boolean = true;

  fileAttachmentData: FileAttachmentData = new FileAttachmentData();

  showForm: boolean;
  errorMessage: any;
  datasource: any;
  totalRecords: any;
  loading: boolean;

  icdSearchResult: any;
  icdDatasource: any;
  icdtotalRecords: any;
  icdloading: boolean;

  noOfICDCodesCust: number = 2;
  noOfdrugCodesAddCust: number = 2;
  showICDGrid: boolean = false;

  ngSelList: any[] = [];
  counter: number = 0;
  text: string;
  results: any[];
  ngSelSelected: any;
  values: any[] = [];

  icdCodesFiltered$: Observable<any>[];
  drugCodesFiltered$: Observable<any>[];
  icdCodesLoading = false;
  drugCodesLoadingCust = false;
  icdCodesInput$ : Subject<string>[];
  drugCodesInput$ : Subject<string>[];
  selectedicdCode: any;
  minLengthTerm = 2;
  userId: number;
  // customerFacilityId: number;
  // customerFacilityName: string;

  mrnFiltered$: Observable<any>;

  providerFiltered$: Observable<any>;
  providerLoading = false;
  providerInput$ = new Subject<string>();

  showAddNewMrn: boolean = false;
  searchedMrn: string;
  isDirty = false;

  constructor(
    private formBuilder: FormBuilder
    , private commonService: CommonService
    , private customerWorkItemService: CustomerWorkitemService
    , private change: ChangeDetectorRef
    , private toastr: ToastrService
    , private router: Router
    , private ngbModal: NgbModal
    // , private patientService: PatientService
    , private fileAttachmentService: FileAttachmentService
  ) {

  }

  ngOnInit(): void {
    // this.customerFacilityId = parseInt(localStorage.CustomerfacilityId);
    // this.customerFacilityName = localStorage.CustomerfacilityName;

    this.userId = parseInt(localStorage.userId);
    // this.getFacilityList();
    this.buildCustomerWorkItemForm();
    this.loadICDControlsByDefaultCust();
    this.loadDrugControlsByDefaultCust();
    this.loadProviders();
    this.loadIcdCodes();
    this.loadDrugCodes();

    this.formCustomerWorkItem.addControl('intFacilityId', new FormControl('', [Validators.required]));
    // if (this.customerFacilityId == 0) {
    //   this.formCustomerWorkItem.addControl('intFacilityId', new FormControl('', [Validators.required]));
    //   //this.formCustomerWorkItem.removeControl("facilityName");
    // }
    // else {
    //   this.formCustomerWorkItem.removeControl("intFacilityId");
    //   //this.formCustomerWorkItem.addControl('facilityName', new FormControl({value: this.customerFacilityName , disabled: true}) );
    // }
    this.formCustomerWorkItem.valueChanges.subscribe(e => {
      if (this.formCustomerWorkItem.dirty)
        this.isDirty = true
    });

    // this.formCustomerWorkItem.setControl("icdCodes", this.setICDForm(null) || []);
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildCustomerWorkItemForm() {

    this.formCustomerWorkItem = this.formBuilder.group({
      facilityName: [{ value: '', disabled: true }],
      facilityId: 0,
      patientMrn: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(25), Validators.pattern(alphaNumericValidator)])),
      providerId: [''],
      providerName: [null],
      providerFlag:[null],
      patientId: [''],
      dos: [null, Validators.required],
      icdCodes: this.formBuilder.array([]),
      drugCodes: this.formBuilder.array([]),
      notes: [''],
      providerFirstName: new FormControl('', Validators.compose([
        Validators.maxLength(50),
        Validators.pattern(alphaNumericSpaceValidator)
      ])),
      providerLastName: new FormControl('', Validators.compose([
        Validators.maxLength(50),
        Validators.pattern(alphaNumericSpaceValidator)
      ]))

    });

  }

  get f() { return this.formCustomerWorkItem != null ? this.formCustomerWorkItem.controls : null; }

  get icdCodes(): FormArray { return this.formCustomerWorkItem.get('icdCodes') as FormArray };

  get drugCodes(): FormArray { return this.formCustomerWorkItem.get('drugCodes') as FormArray };

  get facilityId() {
    return this.formCustomerWorkItem.value['facilityId'] as FormControl;
  }

  // getFacilityList() {
  //   this.patientService.getFacilityList().subscribe(
  //     (result) => {
  //       this.facilities = result;
  //     }
  //   )
  // }

  getBillingTypes() {
    this.customerWorkItemService.getBillingTypes().subscribe(
      (result) => {
        this.billingTypes = result;
      }
    );
  }

  loadAddWorkItemDetails(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.datasource) {
        this.searchResult = this.datasource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }

  onReset() {
    this.showGrid = false;
    this.showAddWorkItem = false;
    this.showError = false;
  }

  onClear() {
    this.formCustomerWorkItem.get("providerId").setValue('');
    this.formCustomerWorkItem.get("notes").setValue('');
    this.formCustomerWorkItem.get("dos").reset();
    this.icdCodes.reset();
    this.drugCodes.reset();
    this.formCustomerWorkItem.markAsUntouched();
    this.formCustomerWorkItem.markAsPristine();
    this.submitted = false;
    this.fileAttachmentData = new FileAttachmentData();
  }

  // addWorkItem(patient) {
  //
  //   this.showGrid = false;
  //   this.showICDGrid = false;
  //   this.showPatientSearch = false;
  //   this.showAddWorkItem = true;
  //
  //   this.showForm = true;
  //   this.patientId = patient.patientId;
  //   this.patientInfo = patient;
  //   this.formCustomerWorkItem.patchValue(
  //     {
  //       mrn: patient.mrn,
  //       facilityName: this.customerFacilityName != '' ? this.customerFacilityName : ''
  //     }
  //   );
  // }

  loadICDControlsByDefaultCust() {
    for (let i = 0; i < 1; i++) {
      this.icdCodes.push(this.formBuilder.group({
        icdCode: [null],
        icdDescription: [{ value: '', disabled: true }],
        customerWorkItemICDId: [null]
      }));
    }
  }

  loadDrugControlsByDefaultCust() {
    for (let i = 0; i < 1; i++) {
      this.drugCodes.push(this.formBuilder.group({
        drugCode: [null],
        drugCodeDescription: [{ value: '', disabled: true }],
        customerDrugId: [null]
      }));
    }
  }

  generateDianosisControls() {
    if (this.noOfICDCodesCust <= 10) {
      if (this.icdCodes.length < this.noOfICDCodesCust) {
        for (let i = this.icdCodes.length; i < this.noOfICDCodesCust; i++) {
          this.icdCodes.push(this.formBuilder.group({
            icdCode: [null],
            icdDescription: [{ value: '', disabled: true }],
            customerWorkItemICDId: [null]
          }));
          this.loadIcdCodes();
        }
      } else {
        for (let i = this.icdCodes.length; i >= this.noOfICDCodesCust; i--) {
          this.icdCodes.removeAt(i);
        }
      }
      this.noOfICDCodesCust++;
    }
    else
      this.showInfo("You can only add max 10 ICD codes");
  }

  generateDrugCodeControls() {
    if (this.noOfdrugCodesAddCust <= 13) {
      if (this.drugCodes.length < this.noOfdrugCodesAddCust) {
        for (let i = this.drugCodes.length; i < this.noOfdrugCodesAddCust; i++) {
          this.drugCodes.push(this.formBuilder.group({
            drugCode: [null],
            drugCodeDescription: [{ value: '', disabled: true }],
            customerDrugId: [null]
          }));
          this.loadDrugSearch();
        }
      } else {
        for (let i = this.drugCodes.length; i >= this.noOfdrugCodesAddCust; i--) {
          this.drugCodes.removeAt(i);
        }
      }
      this.noOfdrugCodesAddCust++;
    }
    else
      this.showInfo("You can only add max 13 Drug codes");
  }

  loadICDDetails(event: LazyLoadEvent) {
    this.icdSearchResult = [];
    this.showICDGrid = true;
    this.icdloading = true;
    setTimeout(() => {
      if (this.icdDatasource) {
        this.icdSearchResult = this.icdDatasource.slice(event.first, (event.first + event.rows));
        this.icdloading = false;
      }
    }, 500);
  }

  trackByIcdCode(item: any) {
    return item.customerWorkItemICDId;
  }

  loadIcdCodes() {
    this.icdCodesFiltered$ = [] as any;
    this.icdCodesInput$ = [] as any;
    for(let i = 0; i < this.icdCodes.length; i++) {
      this.loadIcdSearch();
    }

  }

  loadIcdSearch() {
    this.icdCodesInput$.push(new Subject<string>());
      this.icdCodesFiltered$.push(concat(
        of([]),
        this.icdCodesInput$[this.icdCodesInput$.length - 1].pipe(
          filter(res => {
            return res !== null && res.length >= this.minLengthTerm
          }),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.icdCodesLoading = true),
          switchMap(term => {
            return this.customerWorkItemService.getIcdDetails(term)
              .pipe(
                catchError(() => of([])),
                tap(() => {
                  this.icdCodesLoading = false;
                }
                ))
          }))
      ));
  }

  onIcdCodeChange(selectedValue, Ctrlidx) {
    var val = selectedValue
    let icd = val.split(' - ');
    this.icdCodes.at(Ctrlidx).patchValue(
      {
        icdCode: icd[0],
        icdDescription: icd[1],
        customerWorkItemICDId: icd[2]
      }
    );

  }

  loadDrugCodes() {
    this.drugCodesFiltered$ = [] as any;
    this.drugCodesInput$ = [] as any;
    for(let i = 0; i < this.drugCodes.length; i++) {
      this.loadDrugSearch();
    }

  }

  loadDrugSearch() {
    this.drugCodesInput$.push(new Subject<string>());
      this.drugCodesFiltered$.push(concat(
        of([]),
        this.drugCodesInput$[this.drugCodesInput$.length - 1].pipe(
          filter(res => {
            console.log(res);
            return res !== null && res.length >= this.minLengthTerm
          }),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.drugCodesLoadingCust = true),
          switchMap(term => {
            return this.customerWorkItemService.getDrugDetails(term)
              .pipe(
                catchError(() => of([])),
                tap(() =>
                  this.drugCodesLoadingCust = false
                ))
          }))
      ));
  }

  trackByDrugCode(item: any) {
    return item;
  }


  onDrugCodeChange(selectedValue, Ctrlidx) {
    var val = selectedValue
    let drug = val.split(' - ');
    this.drugCodes.at(Ctrlidx).patchValue(
      {
        drugCode: drug[0],
        drugCodeDescription: drug[1],
        customerDrugId: drug[3]
      }
    );

  }


  addMrn() {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "Add";
    modal.componentInstance.delete.subscribe(() => {
      this.onSaveMrn();
    });


  }

  onSaveMrn() {
    let patient = new Patient;
    patient.mrn = this.searchedMrn;
    patient.facilityId = this.formCustomerWorkItem.value['facilityId'];
    this.customerWorkItemService.createMRN(patient).subscribe(
      (result) => {
        if (result) {
          this.showSuccess('MRN added successfully')
        }
      });
  }

  trackByMrn(item: any) {
    return item;
  }

  loadProviders() {
    this.providerFiltered$ = concat(
      of([]),
      this.providerInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.providerLoading = true),
        switchMap(term => {
          return this.customerWorkItemService.getProviders(term)
            .pipe(
              catchError(() => of([])),
              tap(() =>
                this.providerLoading = false
              ))
        }))
    );

  }

  trackByProvider(item: any) {
    return item;
  }

  onProviderChange(selectedValue) {
    var val = selectedValue
    let provider = val.split('-');
    this.formCustomerWorkItem.patchValue(
      {
        providerName: provider[0] + '-' + provider[1] + '-' + provider[2],
        providerId: provider[3],
        providerFlag: provider[2]
      });

    if(this.formCustomerWorkItem.controls.providerFlag.value == "9999999999") {
      this.isProviderUndefined =true;
    }
    else{
      this.isProviderUndefined = false;
    }
  }

  onFileAttachmentsChanged(fileAttachmentData: FileAttachmentData) {
    this.fileAttachmentData = fileAttachmentData;
  }

  onSubmit() {
    this.submitted = true;


    if (this.formCustomerWorkItem.invalid) {
      return false;
    }
    else {
      let workItem = this.formCustomerWorkItem.value;

      let fcDate = this.formCustomerWorkItem.value['dos'];

      for (var i = workItem.icdCodes.length - 1; i >= 0; i--) {
        if (!workItem.icdCodes[i].icdCode) {
          workItem.icdCodes.splice(i, 1);
        }
        else {
          workItem.icdCodes[i].createdBy = this.userId;
          workItem.icdCodes[i].modifiedBy = this.userId;
        }
      }

      for (var i = workItem.drugCodes.length - 1; i >= 0; i--) {
        if (!workItem.drugCodes[i].drugCode) {
          workItem.drugCodes.splice(i, 1);
        }
        else {
          workItem.drugCodes[i].createdBy = this.userId;
          workItem.drugCodes[i].modifiedBy = this.userId;
        }
      }

      workItem.dos = (fcDate != null) ? new Date(fcDate.year + '/' + fcDate.month + '/' + fcDate.day) : '';

      workItem.active = true;
      //workItem.patientId = this.patientId;

      workItem.createdBy = this.userId;
      workItem.modifiedBy = this.userId;

      this.customerWorkItemService.createCustomerWorkItem(workItem).subscribe(
        (result) => {
          if (result) {
            this.isDirty = false;

            if (this.fileAttachmentData.selectedFiles.length > 0) {
              this.fileAttachmentService.postAttachments('customerWorkItemId', result.customerWorkItemId, this.fileAttachmentData).subscribe(
                (attachment_result) => {
                  this.submitted = false;
                  this.isDirty = false;
                  this.showSuccess('Customer Work item Id #' + result.customerWorkItemId + ' created successfully');
                  this.router.navigate(['/dashboard/customerworkmenu/viewSubmittedCustomerWork']);

                },
                (err) => {
                  this.showSuccess('Save attachment failed but customer work item Id #' + result.customerWorkItemId + ' created successfully')
                  this.router.navigate(['/dashboard/customerworkmenu/viewSubmittedCustomerWork']);
                }
              );
            }
            else
              if (result.customerWorkItemId != null) {
                this.showSuccess('Customer Work itemId #' + result.customerWorkItemId + ' created successfully');
                //this.formCustomerWorkItem.reset();
                this.router.navigate(['/dashboard/customerworkmenu/viewSubmittedCustomerWork']);
              }
          }
        },
        (err) => {
          this.showFailure('Work item creation failed')
          console.log(err);
        }
      );
    }
  }

  showSuccess(msg) {
    this.toastr.success(msg);
  }

  showInfo(msg) {
    this.toastr.info(msg);
  }

  showFailure(msg) {
    this.toastr.error(msg)
  }

  // setICDForm(icds): any {
  //   let icdArray = this.formBuilder.array([]);
  //   for (let i = 0; i < 10; i++) {
  //     if (this.icdCodes.length >i) {
  //       icdArray.push(this.formBuilder.group
  //         ({
  //           createdBy: new FormControl(this.icdCodes[i].createdBy),
  //           modifiedBy: new FormControl(this.icdCodes[i].modifiedBy),
  //           icdCode: new FormControl(this.icdCodes[i].icdCode),
  //           icdDescription: new FormControl({ value: this.icdCodes[i].icdDescription, disabled: true }),
  //           workItemIcdCodeId: new FormControl(this.icdCodes[i].workItemIcdCodeId),
  //           icdId: new FormControl(this.icdCodes[i].icdId)
  //         }));
  //     }
  //   }
  //   this.noOfICDCodesCust = icdArray.length;
  //   return icdArray;
  // }
}


