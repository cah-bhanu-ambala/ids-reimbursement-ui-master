import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { alphaNumericValidator } from 'src/app/common/utils';
import { Patient } from 'src/app/models/classes/patient';
import { LazyLoadEvent } from 'primeng/api';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { CommonService } from 'src/app/common/services/http/common.service'
import { ToastrService } from 'ngx-toastr';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { concat , Observable, of, Subject } from 'rxjs';
import {FileAttachmentData} from "../../shared/file-attachments/file-attachment-data";
import {FileAttachmentService} from "../../../common/services/http/file-attachment.service";
import { PatientService } from 'src/app/common/services/http/patient.service';

@Component({
  selector: 'app-add-workitem',
  templateUrl: './add-workitem.component.html',
  styleUrls: ['./add-workitem.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddWorkitemComponent implements OnInit, AfterContentChecked {

  addFormWorkItem: FormGroup;
  addFormSearchPatient: FormGroup;
  addSubmitted: boolean;
  addFacilities: any[];
  icdList: any;
  providerList: any[];
  searchResult: any;
  showGrid: boolean;
  showError: boolean;
  addPatientInfo: Patient;
  isUpdate: boolean;
  billingTypes: any[];
  patientId: any;
  searched: boolean;
  workItemId: number;

  showAddWorkItem: boolean = false;
  showPatientSearch: boolean = true;

  fileAttachmentData: FileAttachmentData = new FileAttachmentData();

  showForm: boolean;
  errorMessage: any;
  datasource: any;
  totalRecords: any;
  loading: boolean;

  icdAddSearchResult: any;
  icdDatasource: any;
  icdtotalRecords: any;
  icdloading: boolean;

  addNoOfICDCodes: number = 2;
  noOfdrugCodes: number = 2;
  showAddICDGrid: boolean = false;

  addNgSelList: any[] = [];
  counter: number = 0;
  text: string;
  results: any[];
  ngSelSelected: any;
  values: any[] = [];

  icdCodesFiltered$: Observable<any>;
  drugCodesFiltered$: Observable<any>;
  icdCodesLoading = false;
  drugCodesLoading = false;
  icdCodesInput$ = new Subject<string>();
  drugCodesInput$ = new Subject<string>();
  selectedicdCode: any;
  minLengthTerm = 2;
  userId: number;
  isDirty = false;
  orderTypes: any[];
  tempBillingTypes: any[];
  refOrClaimLabelName: string = 'Referral Number';
  selectedfacilityBillingTypeId: any;

  constructor(
    private formBuilder: FormBuilder
    , private commonService: CommonService
    , private workItemService: WorkitemService
    , private patientService: PatientService
    , private change: ChangeDetectorRef
    , private toastr: ToastrService
    , private fileAttachmentService: FileAttachmentService
  ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.buildSearchForm();
    this.buildWorkItemForm();
    this.addGetFacilityList();
    this.getProviderList();
    // this.getAddIcdList();
    this.getBillingTypes();
    this.loadICDControlsByDefault();
    this.loadDrugControlsByDefault();
    this.loadicdCodes();
    this.loadDrugCodes();
    this.getOrderTypes();
    this.addFormWorkItem.valueChanges.subscribe( e =>
      {
        if(this.addFormWorkItem.dirty)
          this.isDirty = true
      }
       );
  }


  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.addFormSearchPatient = this.formBuilder.group({
      facilityId: ['', [Validators.required]],
      mrn: ['', [Validators.required]],

    });
  }

  buildWorkItemForm() {
    this.addFormWorkItem = this.formBuilder.group({
      mrn: [{ value: '', disabled: true }],
      facilityName: [{ value: '', disabled: true }],
      providerId: ['', [Validators.required]],
      orderTypeId: ['', [Validators.required]],
      referralNumber: ['', Validators.compose([Validators.maxLength(25), Validators.pattern(alphaNumericValidator)])],
      patientId: [''],
      orderDate: [null, [Validators.required]],
      facilityBillingTypeId: [this.selectedfacilityBillingTypeId, [Validators.required]],
      notes: [''],
      icdCodes: this.formBuilder.array([]),
      drugCodes: this.formBuilder.array([]),
      attachment1: [''],
      attachment2: [''],
      attachment3: [''],
      attachment4: [''],
      generalNotes: ''
    });
  }

  get sf() { return this.addFormSearchPatient != null ? this.addFormSearchPatient.controls : null; }

  get f() { return this.addFormWorkItem != null ? this.addFormWorkItem.controls : null; }

  get icdCodes(): FormArray { return this.addFormWorkItem.get('icdCodes') as FormArray };

  get drugCodes(): FormArray { return this.addFormWorkItem.get('drugCodes') as FormArray };

  get facilityId() {
    return this.addFormSearchPatient.get('facilityId') as FormControl;
}

  addGetFacilityList() {
    this.workItemService.getApprovedFacilities().subscribe(
      (result) => {
        this.addFacilities = result;
      },
      (err) => { }
    );
  }

  getOrderTypes() {
      this.workItemService.getOrderTypes().subscribe((result) => {
        this.orderTypes = result;
      });
    }
  // getAddIcdList() {
  //   this.commonService.getICDList().subscribe(
  //     (result) => {
  //       this.icdList = result;
  //     },
  //     (err) => { }
  //   );
  // }

  getBillingTypes() {
    this.workItemService.getBillingTypes().subscribe(
      (result) => {
        this.billingTypes = result;
        this.tempBillingTypes = result;
      },
      (err) => { }
    );
  }

  getProviderList() {
    this.workItemService.getProviderList().subscribe(
      (result) => {
        this.providerList = result;
      },
      (err) => { }
    );
  }

  onSearch() {
    this.showGrid = false;
    this.showAddWorkItem = false;
    let params = {
      'facilityId': this.addFormSearchPatient.controls['facilityId'].value,
      'mrn': this.addFormSearchPatient.value['mrn']
    };

    if (this.addFormSearchPatient.invalid) {
      this.showError = true;
      this.searched = true;
      this.showGrid = false;
      return false;
    }
    else {
      this.showError = false;

      this.workItemService.getMrnFacilities(params).subscribe(
        (data) => {
          if (data.length > 0) {
            this.showGrid = true;
            this.datasource = data;
            this.totalRecords = data.length;
            this.loading = false;
          }
          else
            this.showError = true;
        }
      );
    }
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
    this.addFormSearchPatient.get("facilityId").setValue('');
    this.addFormSearchPatient.get("mrn").reset();
    this.showPatientSearch = true;
    this.searched = false;
    this.showGrid = false;
    this.showAddWorkItem = false;
    this.showError = false;
  }

  onClear() {
    this.addFormWorkItem.markAsPristine();
    this.addFormWorkItem.markAsUntouched();
    this.addFormWorkItem.get("providerId").setValue('');
    this.addFormWorkItem.get("orderTypeId").setValue('');
    this.addFormWorkItem.get("facilityBillingTypeId").setValue('');
    this.addFormWorkItem.get("orderDate").reset();
    this.addFormWorkItem.get("referralNumber").reset();
    this.addFormWorkItem.get("generalNotes").reset();
    this.icdCodes.clear();
    this.addNoOfICDCodes = 1;
    this.generateDianosisControls();
    this.drugCodes.clear();
    this.noOfdrugCodes = 1;
    this.generateDrugCodeControls();
    this.fileAttachmentData = new FileAttachmentData();
    this.addSubmitted = false;
    this.isDirty = false;
  }

  addWorkItem(patient) {

    this.showGrid = false;
    this.showAddICDGrid = false;
    this.showPatientSearch = false;
    this.showAddWorkItem = true;

    this.showForm = true;
    this.patientId = patient.patientId;
    this.addPatientInfo = patient;
    this.addFormWorkItem.patchValue(
      {
        mrn: patient.mrn,
        facilityName: patient.facilityName
      }
    );
  }

  loadICDControlsByDefault() {
    for (let i = 0; i < 1; i++) {
      this.icdCodes.push(this.formBuilder.group({
        icdCode: [null],
        icdDescription: [{ value: '', disabled: true }],
        icdId: [null]
      }));
    }
  }

  loadDrugControlsByDefault() {
    for (let i = 0; i < 1; i++) {
      this.drugCodes.push(this.formBuilder.group({
        drugCode: [null],
        drugCodeDescription: [{ value: '', disabled: true }],
        drugId: [null]
      }));
    }
  }

  generateDianosisControls() {
    if (this.addNoOfICDCodes <= 10) {
      if (this.icdCodes.length < this.addNoOfICDCodes) {
        for (let i = this.icdCodes.length; i < this.addNoOfICDCodes; i++) {
          this.icdCodes.push(this.formBuilder.group({
            icdCode: [null],
            icdDescription: [{ value: '', disabled: true }],
            icdId: [null]
          }));
        }
      } else {
        for (let i = this.icdCodes.length; i >= this.addNoOfICDCodes; i--) {
          this.icdCodes.removeAt(i);
        }
      }
      this.addNoOfICDCodes++;
    }
    else
      this.showInfo("You can only add max 10 ICD codes");
  }

  generateDrugCodeControls() {
    if (this.noOfdrugCodes <= 13) {
      if (this.drugCodes.length < this.noOfdrugCodes) {
        for (let i = this.drugCodes.length; i < this.noOfdrugCodes; i++) {
          this.drugCodes.push(this.formBuilder.group({
            drugCode: [null],
            drugCodeDescription: [{ value: '', disabled: true }],
            drugId: [null]
          }));
        }
      } else {
        for (let i = this.drugCodes.length; i >= this.noOfdrugCodes; i--) {
          this.drugCodes.removeAt(i);
        }
      }
      this.noOfdrugCodes++;
    }
    else
      this.showInfo("You can only add max 13 Drug codes");
  }

  loadICDDetails(event: LazyLoadEvent) {
    this.icdAddSearchResult = [];
    this.showAddICDGrid = true;
    this.icdloading = true;
    setTimeout(() => {
      if (this.icdDatasource) {
        this.icdAddSearchResult = this.icdDatasource.slice(event.first, (event.first + event.rows));
        this.icdloading = false;
      }
    }, 500);
  }

  trackByIcdCode(item: any) {
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
        tap(() => this.icdCodesLoading = true),
        switchMap(term => {
          return this.workItemService.getIcdDetails(term)
            .pipe(
              catchError(() => of([])),
              tap(() =>
                this.icdCodesLoading = false
              ))
        }))
    );

  }

  onIcdCodeChange(selectedValue, Ctrlidx) {
    var val = selectedValue
    let icd = val.split(' - ');
    this.icdCodes.at(Ctrlidx).patchValue(
      {
        icdCode: icd[0],
        icdDescription: icd[1],
        icdId: icd[2]
      }
    );

  }

  loadDrugCodes() {
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
        drugId: parseInt(drug[3])
      }
    );
  }

  onFileAttachmentsChanged(fileAttachmentData: FileAttachmentData) {
    this.fileAttachmentData = fileAttachmentData;
  }

  onOrderTypeChange(selectedOrderTypeId: any){
    const selectedOrder = this.orderTypes.find(orderType => orderType.orderTypeId == selectedOrderTypeId);
    this.populateBillingTypeDrowDown(selectedOrder);
  }

  populateBillingTypeDrowDown(selectedOrder: any){
    if(selectedOrder.orderTypeName === 'Audit'){
      this.refOrClaimLabelName = 'Claim Number';
      const matchedbillingType = this.billingTypes.filter(billingType => billingType.facilityBillingTypeName.toLowerCase() == selectedOrder.orderTypeName.toLowerCase());
      if(matchedbillingType.length > 0){
        this.selectedfacilityBillingTypeId = matchedbillingType[0].facilityBillingTypeId;
        this.addFormWorkItem.get('facilityBillingTypeId').setValue(this.selectedfacilityBillingTypeId);
        this.billingTypes = [matchedbillingType[0]];
      }
    }else{
      this.billingTypes = [...this.tempBillingTypes];
      this.refOrClaimLabelName = 'Referral Number';
      this.selectedfacilityBillingTypeId = '';
      this.addFormWorkItem.get('facilityBillingTypeId').setValue(this.selectedfacilityBillingTypeId);
    }
  }

  onSubmit() {
    this.addSubmitted = true;
    if (this.addFormWorkItem.invalid) {
      return false;
    }
    else {
      let workItem = this.addFormWorkItem.value;

      let fcDate = this.addFormWorkItem.value['orderDate'];

      for (var i = workItem.icdCodes.length - 1; i >= 0; i--) {
        if (!workItem.icdCodes[i].icdCode) {
          workItem.icdCodes.splice(i, 1);
        }
        else {
          workItem.icdCodes[i].workItemId = this.workItemId;
          // workItem.icdCodes[i].icdId = this.icdList.filter(dp => dp.icdCode === workItem.icdCodes[i].icdCode)[0].icdId;
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
          workItem.drugCodes[i].isDenied = false;
        }
      }

      workItem.orderDate = new Date(fcDate.year + '/' + fcDate.month + '/' + fcDate.day);

      workItem.active = true;
      workItem.patientId = this.patientId;

      workItem.createdBy = this.userId;
      workItem.modifiedBy = this.userId;

      this.patientService.getByPatientId(this.patientId).subscribe((res) => {
        workItem.wiInsurance = {}
        workItem.wiInsurance.primaryInsClassification = res.primaryInsuranceId;
        workItem.wiInsurance.secondaryInsClassification = res.secondaryInsuranceId;
        workItem.wiInsurance.workItemId = workItem.workItemId;
        workItem.wiInsurance.createdBy = this.userId;
        workItem.wiInsurance.modifiedBy = this.userId;

        this.workItemService.createWorkItem(workItem).subscribe(
          (result) => {
            if (result) {
              this.isDirty = false;
              this.workItemId = result.workItemId

              if (this.fileAttachmentData.selectedFiles.length > 0) {
                this.fileAttachmentService.postAttachments('workItemId', result.workItemId, this.fileAttachmentData).subscribe(
                  (result) => {
                    this.onClear();
                    this.onReset();
                    this.showSuccess('Work item Id #' + this.workItemId + ' created successfully');
                  },
                  (err) => {
                    this.onClear();
                    this.onReset();
                    this.showSuccess('Save attachment failed but work item Id #' + this.workItemId + ' created successfully')
                  }
                );
              }
              else
                if (result.workItemId != null) {
                  this.onClear();
                  this.onReset();
                  this.showSuccess('Work itemId #' + result.workItemId + ' created successfully');
                }
            }
          },
          (err) => {
            this.showFailure('Work item creation failed')
            console.log(err);
          }
        );
      });



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
}
