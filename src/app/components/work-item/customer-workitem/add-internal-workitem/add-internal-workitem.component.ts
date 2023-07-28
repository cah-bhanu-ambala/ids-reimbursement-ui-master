import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { alphaNumericSpaceValidator, alphaNumericValidator } from 'src/app/common/utils';
import { Patient } from 'src/app/models/classes/patient';
import { CommonService } from 'src/app/common/services/http/common.service'
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, delay, distinctUntilChanged, filter, finalize, switchMap, tap } from 'rxjs/operators';
import { concat, Observable, of, Subject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerWorkitemService } from 'src/app/common/services/http/customer-workitem.service';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerWorkItem } from 'src/app/models/classes/customer-work-item';
import {FileAttachmentData} from "../../../shared/file-attachments/file-attachment-data";
import {FileAttachmentService} from "../../../../common/services/http/file-attachment.service";

@Component({
  selector: 'app-add-internal-workitem',
  templateUrl: './add-internal-workitem.component.html',
  styleUrls: ['./add-internal-workitem.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddInternalWorkitemComponent implements OnInit, AfterContentChecked {

  internalFormWorkItem: FormGroup;
  submitted: boolean;
  internalFacilities: any[];
  internalProviderList: any[];
  searchResult: any;
  showGrid: boolean;
  showError: boolean;
  patientInfo: Patient;
  isUpdate: boolean;
  billingTypes: any[];
  patientId: any;
  fileToUpload: File = null;
  searched: boolean;
  workItemId: number;

  showAddWorkItem: boolean = false;
  showPatientSearch: boolean = true;

  fileAttachmentData: FileAttachmentData = new FileAttachmentData();

  showForm: boolean;
  errorMessage: any;
  internalDatasource: any;
  totalRecords: any;
  loading: boolean;

  icdInternalSearchResult: any;
  icdDatasource: any;
  icdtotalInternalRecords: any;
  icdloading: boolean;

  noOfICDCodes: number = 2;
  noOfdrugCodesInternal: number = 2;
  showICDGrid: boolean = false;

  ngInternalSelList: any[] = [];
  counter: number = 0;
  text: string;
  results: any[];
  ngSelSelected: any;
  values: any[] = [];

  icdCodesFiltered$: Observable<any>;
  drugCodesFiltered$: Observable<any>;
  icdCodesLoadingInternal = false;
  drugCodesLoading = false;
  icdCodesInput$ = new Subject<string>();
  drugCodesInput$ = new Subject<string>();
  selectedInternalicdCode: any;
  minLengthTerm = 2;
  userId: number;
  customerWorkItemNumber: number;
  customerWiStatuses: any[];
  selectedPatientId: number = 0;
  customerWorkItem: any;
  customerWitem: CustomerWorkItem = new CustomerWorkItem();
  isDirty = false;

  providerFiltered$: Observable<any>;
  providerLoading = false;
  providerInput$ = new Subject<string>();
  isProviderUndefined: boolean;

  wiStatusesExtLoading: boolean;
  facilityExtLoading: boolean;
  providerExtLoading: boolean;
  billingExtLoading: boolean;

  // @ViewChild('providerDirective') providerId: any;


  constructor(
    private formBuilder: FormBuilder
    , private commonService: CommonService
    , private workItemService: WorkitemService
    , private customerWiService: CustomerWorkitemService
    , private change: ChangeDetectorRef
    , private activatedRouter: ActivatedRoute
    , private toastr: ToastrService
    , private router: Router
    , private fileAttachmentService: FileAttachmentService
    ,  private renderer: Renderer2
  ) {

    this.activatedRouter.queryParams.subscribe((paramts) => {
      let customerWorkItemNo = paramts['customerWorkItemNumber'];
      this.customerWorkItemNumber = parseInt(customerWorkItemNo);
      this.selectedPatientId = paramts['patientId'];
    });

  }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.wiStatusesExtLoading =true;
    this.facilityExtLoading = true;
    this.providerExtLoading = true;
    this.billingExtLoading = true;
    this.loadCustomerWorkItemDetails();
    this.buildWorkItemForm();
    this.getwiStatuses();
    this.getInternalFacilityList();
    this.getInternalProviderList();
    this.getInternalBillingTypes();
    this.loadicdCodes();
    this.loadInternalDrugCodes();
    this.internalFormWorkItem.valueChanges.subscribe( e =>  {
      if(this.internalFormWorkItem.dirty)
        this.isDirty = true
    } );
    // this.internalFormWorkItem.setControl('icdCodes', this.setICDForm(null) || []);

  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildWorkItemForm() {
    this.internalFormWorkItem = this.formBuilder.group({
      mrn: [{ value: '', disabled: true }],
      facilityName: [{ value: '', disabled: true }],
      providerName: [null],
      providerFlag: null,
      providerId: [''],
      orderTypeId: ['', [Validators.required]],
      referralNumber: ['', Validators.compose([Validators.maxLength(25), Validators.pattern(alphaNumericValidator)])],
      patientId: [{ value: '', disabled: true }],
      orderDate: [null, [Validators.required]],
      facilityBillingTypeId: ['', [Validators.required]],
      // notes: [''],
      icdCodes: this.formBuilder.array([]),
      drugCodes: this.formBuilder.array([]),
      attachment1: [''],
      attachment2: [''],
      attachment3: [''],
      attachment4: [''],
      generalNotes: [''],

      customerWorkItemStatusId: [{ value: '', disabled: true }],
      assignedTeamMember: [{ value: '', disabled: true }],
      createdByName: [{ value: '', disabled: true }],
      cad: [{ value: '', disabled: true }],
      customerTeamMember: [{ value: '', disabled: true }],

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

  get f() { return this.internalFormWorkItem != null ? this.internalFormWorkItem.controls : null; }

  get icdCodes(): FormArray { return this.internalFormWorkItem.get('icdCodes') as FormArray };

  get drugCodes(): FormArray { return this.internalFormWorkItem.get('drugCodes') as FormArray };


  loadCustomerWorkItemDetails() {
    if (!!this.customerWorkItemNumber) {
      this.customerWiService.getCustomerWorkItem(this.customerWorkItemNumber).subscribe(
        (result) => {
          if (result != null) {
            this.showAddWorkItem = true;
            this.customerWorkItem = result;
            var customerAddedDate = new Date(result.dos);
            this.internalFormWorkItem.patchValue({
              mrn: result.patientMrn,
              facilityName: result.facilityName,
              providerId: result.providerId,
              providerFlag: result.providerNPi,
              customerWorkItemStatusId: 2,
              assignedTeamMember: '',
              createdByName: result.createdByName,
              cad: result.dos != null ? customerAddedDate.getMonth() + '/' + customerAddedDate.getDay() + '/' + customerAddedDate.getFullYear() : '',
              customerTeamMember: '',
              patientId: result.patientId,
              icdCode: result.icdCode,
              icdDescription: result.icdDescription,
              icdId: result.customerWorkItemICDId,
              generalNotes: result.notes,
              providerFirstName: result.providerFirstName,
              providerLastName: result.providerLastName
            });
            // console.log(this.internalFormWorkItem.controls.providerId.value);
            // console.log(this.internalFormWorkItem.controls.providerFlag.value);

            this.loadICDControlsByDefault();
            this.loadDrugControlsByDefault();
            
            this.customerWorkItem.attachments.forEach(attachment => {
              this.fileAttachmentData.filesList.push({name:attachment.customerWorkItemAttachmentPath , attachmentId: attachment.customerWorkItemAttachmentId});
            });
            
          }
        }
      )
    }
  }

  getwiStatuses() {
    this.customerWiService.getwiStatuses().pipe(finalize(() => this.wiStatusesExtLoading = false)).subscribe(
      (result) => {
        this.customerWiStatuses = result;
      },
      (err) => { }
    );
  }

  getInternalFacilityList() {
    this.workItemService.getApprovedFacilities().pipe(finalize(() => this.facilityExtLoading = false)).subscribe(
      (result) => {
        this.internalFacilities = result;
      },
      (err) => { }
    );
  }

  getInternalBillingTypes() {
    this.workItemService.getBillingTypes().pipe(finalize(() => this.billingExtLoading = false)).subscribe(
      (result) => {
        this.billingTypes = result;
      },
      (err) => { }
    );
  }

  getInternalProviderList() {
    this.workItemService.getProviderList().pipe(finalize(() => this.providerExtLoading = false)).subscribe(
      (result) => {
        this.internalProviderList = result;
      },
      (err) => { }
    );
  }

  loadAddWorkItemDetails(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.internalDatasource) {
        this.searchResult = this.internalDatasource.slice(event.first, (event.first + event.rows));
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
    this.internalFormWorkItem.get("providerId").setValue('');
    this.internalFormWorkItem.get("orderTypeId").setValue('');
    this.internalFormWorkItem.get("facilityBillingTypeId").setValue('');
    this.internalFormWorkItem.get("orderDate").reset();
    this.internalFormWorkItem.get("referralNumber").reset();
    this.icdCodes.reset();
    this.drugCodes.reset();
    this.submitted = false;
    this.internalFormWorkItem.markAsUntouched();
    this.internalFormWorkItem.markAsPristine();
  }

  addWorkItem(patient) {

    this.showGrid = false;
    this.showICDGrid = false;
    this.showPatientSearch = false;
    this.showAddWorkItem = true;

    this.showForm = true;
    this.patientId = patient.patientId;
    this.patientInfo = patient;
    this.internalFormWorkItem.patchValue(
      {
        mrn: patient.mrn,
        facilityName: patient.facilityName
      }
    );
  }

  loadICDControlsByDefault() {
    if (this.customerWorkItem.icdCodes.length > 0) {
      for (let i = 0; i < this.customerWorkItem.icdCodes.length; i++) {
        this.icdCodes.push(this.formBuilder.group({
          icdCode: this.customerWorkItem.icdCodes[i].icdCode,
          icdDescription: { value: this.customerWorkItem.icdCodes[i].icdDescription, disabled: true },
          icdId: this.customerWorkItem.icdCodes[i].icdId
        }));
      }
    }
    else {
      this.icdCodes.push(this.formBuilder.group({
        icdCode: [null],
        icdDescription: [{ value: '', disabled: true }],
        icdId: [null]
      }));
    }
  }

  loadDrugControlsByDefault() {
    if (this.customerWorkItem.drugCodes.length > 0) {
      for (let i = 0; i < this.customerWorkItem.drugCodes.length; i++) {
        this.drugCodes.push(this.formBuilder.group({
          drugCode: this.customerWorkItem.drugCodes[i].drugProcCode,
          drugCodeDescription: { value: this.customerWorkItem.drugCodes[i].drugShortDesc, disabled: true },
          drugId: this.customerWorkItem.drugCodes[i].drugId
        }));
      }
    }
    else {
      this.drugCodes.push(this.formBuilder.group({
        drugCode: [null],
        drugCodeDescription: [{ value: '', disabled: true }],
        drugId: [null]
      }));
    }
  }

  generateInternalDianosisControls() {
    if (this.noOfICDCodes <= 10) {
      if (this.icdCodes.length < this.noOfICDCodes) {
        for (let i = this.icdCodes.length; i < this.noOfICDCodes; i++) {
          this.icdCodes.push(this.formBuilder.group({
            icdCode: [null],
            icdDescription: [{ value: '', disabled: true }],
            icdId: [null]
          }));
        }
      } else {
        for (let i = this.icdCodes.length; i >= this.noOfICDCodes; i--) {
          this.icdCodes.removeAt(i);
        }
      }
      this.noOfICDCodes++;
    }
    else
      this.showInfo("You can only add max 10 ICD codes");
  }

  generateDrugCodeControls() {
    if (this.noOfdrugCodesInternal <= 13) {
      if (this.drugCodes.length < this.noOfdrugCodesInternal) {
        for (let i = this.drugCodes.length; i < this.noOfdrugCodesInternal; i++) {
          this.drugCodes.push(this.formBuilder.group({
            drugCode: [null],
            drugCodeDescription: [{ value: '', disabled: true }],
            drugId: [null]
          }));
        }
      } else {
        for (let i = this.drugCodes.length; i >= this.noOfdrugCodesInternal; i--) {
          this.drugCodes.removeAt(i);
        }
      }
      this.noOfdrugCodesInternal++;
    }
    else
      this.showInfo("You can only add max 13 Drug codes");
  }

  loadICDDetails(event: LazyLoadEvent) {
    this.icdInternalSearchResult = [];
    this.showICDGrid = true;
    this.icdloading = true;
    setTimeout(() => {
      if (this.icdDatasource) {
        this.icdInternalSearchResult = this.icdDatasource.slice(event.first, (event.first + event.rows));
        this.icdloading = false;
      }
    }, 500);
  }

  trackByIcdCodeInternal(item: any) {
    return item.icdId;
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
        tap(() => this.icdCodesLoadingInternal = true),
        switchMap(term => {
          return this.workItemService.getIcdDetails(term)
            .pipe(
              catchError(() => of([])),
              tap(() =>
                this.icdCodesLoadingInternal = false
              ))
        }))
    );

  }

  onIcdCodeChange(selectedValue, Ctrlidx) {
    var valInternal = selectedValue
    let icd = valInternal.split(' - ');
    this.icdCodes.at(Ctrlidx).patchValue(
      {
        icdCode: icd[0],
        icdDescription: icd[1],
        icdId: icd[2]
      }
    );

  }

  loadInternalDrugCodes() {
    this.drugCodesFiltered$ = concat(
      of([]),
      this.drugCodesInput$.pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.drugCodesLoading = true),
        switchMap(term => {
          return this.workItemService.getDrugDetails(term)
            .pipe(
              catchError(() => of([])),
              tap(() =>
                this.drugCodesLoading = false
              ))
        }))
    );

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
        drugId: drug[3]
      }
    );

  }

  onProviderChange() {
    this.internalFormWorkItem.controls.providerFlag.patchValue('')
  }

  onFileAttachmentsChanged(fileAttachmentData: FileAttachmentData) {
    this.fileAttachmentData = fileAttachmentData;
  }

  onSubmit() {
    this.submitted = true;

    if (this.internalFormWorkItem.controls.providerFlag.value == "9999999999") {
      this.isProviderUndefined =true;
      let msg = "Provider cannot be undefined";
      this.showFailure(msg);
      // this.providerId.nativeElement.focus();

      return false
    }

    else if (this.internalFormWorkItem.invalid) {
      return false;
    }
    else {
      this.isProviderUndefined= false;
      let workItem = this.internalFormWorkItem.value;

      this.customerWitem.customerWorkItemId = this.customerWorkItemNumber;
      this.customerWitem.workItemStatusId = this.internalFormWorkItem.get('customerWorkItemStatusId').value;
      this.customerWitem.modifiedBy = this.userId;

      let fcDate = this.internalFormWorkItem.value['orderDate'];

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

      workItem.orderDate = new Date(fcDate.year + '/' + fcDate.month + '/' + fcDate.day);

      workItem.active = true;
      workItem.patientId = this.selectedPatientId;

      workItem.createdBy = this.userId;
      workItem.modifiedBy = this.userId;

      this.workItemService.createWorkItem(workItem).subscribe(
        (result) => {
          if (result) {
            this.workItemId = result.workItemId;
            this.isDirty = false;
            this.customerWitem.internalWorkItemId = result.workItemId;
            if (this.customerWorkItemNumber) {
              this.workItemService.updateStatus(this.customerWitem).subscribe((resp) => {
               // console.log('updated status to loaded and work item id in customer work item')
              });
            }

            if (this.fileAttachmentData.selectedFiles.length > 0) {
              this.fileAttachmentService.postAttachments('workItemId', result.workItemId, this.fileAttachmentData).subscribe(
                (result) => {
                  this.showGrid = false;
                  this.isDirty = false;
                  this.submitted = false;
                  this.internalFormWorkItem.reset();
                  this.showSuccess('Work item Id #' + this.workItemId + ' created successfully');
                  this.router.navigate(['/dashboard/workmenu/customerWorkItem']);
                },
                (err) => {
                  this.showSuccess('Save attachment failed but work item Id #' + this.workItemId + ' created successfully')
                }
              );
            }
            else
              if (result.workItemId != null) {
                this.showSuccess('Work itemId #' + result.workItemId + ' created successfully');
                this.showAddWorkItem = false;
                this.showPatientSearch = true;
                this.router.navigate(['/dashboard/workmenu/customerWorkItem']);
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
  //     if (this.customerWorkItem.icdCodes.length >i) {
  //       icdArray.push(this.formBuilder.group
  //         ({
  //           createdBy: new FormControl(this.customerWorkItem.icdCodes[i].createdBy),
  //           modifiedBy: new FormControl(this.customerWorkItem.icdCodes[i].modifiedBy),
  //           icdCode: new FormControl(this.customerWorkItem.icdCodes[i].icdCode),
  //           icdDescription: new FormControl({ value: this.customerWorkItem.icdCodes[i].icdDescription, disabled: true }),
  //           workItemIcdCodeId: new FormControl(this.customerWorkItem.icdCodes[i].workItemIcdCodeId),
  //           icdId: new FormControl(this.customerWorkItem.icdCodes[i].icdId)
  //         }));
  //     }
  //   }
  //   this.noOfICDCodes = icdArray.length;
  //   return icdArray;
  // }

}
