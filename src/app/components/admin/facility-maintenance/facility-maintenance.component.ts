import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { FacilityService } from 'src/app/common/services/http/facility.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { alphaNumericValidator, amountValidator, currencyValidator, faciliyNamesValidator, npiValidator, phoneNumValidator } from 'src/app/common/utils';
import { Facility } from 'src/app/models/classes/facility';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { SystemService } from 'src/app/common/services/http/system.service';

@Component({
  selector: 'app-facility-maintenance',
  templateUrl: './facility-maintenance.component.html',
  styleUrls: ['./facility-maintenance.component.scss']
})

export class FacilityMaintenanceComponent implements OnInit {
  maintainFormFacility: FormGroup;
  searchFacilityForm: FormGroup;
  isUpdate: boolean = false;
  submitted: boolean;
  showBillAmount: boolean = false;
  billingLevels: any[];
  billingInfo: any[] = [];
  facilityList: any[];
  facilityDeptList:
    [
      { 'name': 'Oncology', 'value': 1 },
      { 'name': 'Non Oncology', 'value': 2 }
    ];
  facilityId: number;
  searchResult: any[];
  showGrid: boolean;
  facilitySearchParam: string;
  facilityInfo: Facility;
  showError: boolean;
  errorMessage: any = '';
  userId: number;
  userRole: string = '';
  showForm = true;
  systems: any[];
  selectedSystemId: any;
  noOfContacts: number = 1;
  arr: Number[];

  showViewFacilityGrid: boolean;
  facilityGridloading: boolean;
  facilityDatasource: any;
  facilitySearchResult: any;
  facilityTotalRecords: any;
  isDirty = false;

  modal: NgbModalRef;

  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private facilityService: FacilityService,
    private patientService: PatientService,
    private workItemService: WorkitemService,
    private systemService: SystemService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.userRole = localStorage.getItem("currentUserRole");
    this.buildSearchFacility();
    this.getbillingLevels();
    this.buildFormMaintainFacility();
    this.generateNumArr(1);
    this.loadSubFacilities();
    this.loadDefaultContacts();
    this.getFacilityList();
    this.getSystemList();
    this.onSearch('');
    this.maintainFormFacility.valueChanges.subscribe(e => {
      if (this.maintainFormFacility.dirty) {
        this.isDirty = true
      }
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  getFacilityList() {
    this.facilityService.getFacilities().subscribe(
      (result) => {
        this.facilityList = result;
      },
      (err) => { }
    );
  }

  buildFormMaintainFacility() {
    this.maintainFormFacility = new FormGroup({
      facilityName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
      facilityNickName: new FormControl('', Validators.compose([
        Validators.maxLength(50),
        Validators.pattern(faciliyNamesValidator)])),
      ein: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(alphaNumericValidator)
        ])),
      facilityNPI: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(alphaNumericValidator)
        ])),
      address: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
      phone: new FormControl(''),
      fax: new FormControl(''),
      facilityBillingDetails: this.formBuilder.array([]),
      facilityWbsDetails: new FormArray([]),
      systemId: new FormControl('', [Validators.required])

    });
  }

  buildSearchFacility() {
    this.searchFacilityForm = this.formBuilder.group({
      facilityId: ['']
    });
  }

  get f() { return this.maintainFormFacility != null ? this.maintainFormFacility.controls : null; }
  get facilityBillingDetails(): FormArray { return this.maintainFormFacility.get('facilityBillingDetails') as FormArray };
  get facilityWbsDetails(): FormArray { return this.maintainFormFacility.get('facilityWbsDetails') as FormArray };

  setFacilityMaintainBillingDetails(billingLevel): any {

    let billingFacilityArray = this.formBuilder.array([]);
    if (this.billingLevels != null && this.billingLevels.length > 0) {
      billingLevel.forEach(element => {
        let billinglevelname = element.facilityBillingLevelName;

        if (billinglevelname != 'N/A') {
          billingFacilityArray.push(this.formBuilder.group
            ({
              facilityBillingDetailId: element.facilityBillingDetailId,
              facilityId: element.facilityId,
              facilityBillingLevelName: billinglevelname,
              billingLevelId: element.facilityBillingLevelId,
              billingAmount: [element.billingAmount, Validators.compose([Validators.pattern(amountValidator)])],
              createdBy: this.userId,
              modifiedBy: this.userId
            }))
        }
      });
      return billingFacilityArray;
    }
  }

  getbillingLevels() {
    this.facilityService.getBillingLevels().subscribe(
      (result) => {
        this.billingLevels = result;
        if (this.billingInfo != undefined && this.billingInfo != null && this.isUpdate == true) {
          this.maintainFormFacility.setControl('facilityBillingDetails',
            this.setFacilityMaintainBillingDetails(this.billingInfo) || []);
        }
        else {
          this.maintainFormFacility.setControl('facilityBillingDetails',
            this.setFacilityMaintainBillingDetails(this.billingLevels) || []);
        }
      },
      (err) => { }
    );
  }

  generateNumArr(n: number) {
    this.arr = new Array(n).fill(1);
  }

  loadDefaultContacts() {

    this.generateNumArr(this.noOfContacts);
    this.maintainFormFacility.addControl('contact1', new FormControl('', [Validators.maxLength(50)]));
    this.maintainFormFacility.addControl('contactRole1', new FormControl('', [Validators.maxLength(100)]));
  }

  generateMaintainContacts() {
    if (this.noOfContacts < 4) {
      this.noOfContacts++;
      this.generateNumArr(this.noOfContacts);

      const contactKey = 'contact' + (this.noOfContacts);
      const contactRoleKey = 'contactRole' + (this.noOfContacts);

      this.maintainFormFacility.addControl(contactKey, new FormControl('', [Validators.maxLength(50)]));
      this.maintainFormFacility.addControl(contactRoleKey, new FormControl('', [Validators.maxLength(100)]));
    }
    else {
      this.showInfo("You can only add max 4 contacts");
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = ''
    //Check form is valid or not
    if (this.maintainFormFacility.invalid) {
      this.showInfo('Please correct the errors before you proceed!');
      return false;
    }
    else {
      let facilityMaintain = new Facility();
      facilityMaintain = this.maintainFormFacility.getRawValue();
      facilityMaintain.active = true;
      facilityMaintain.modifiedBy = this.userId;
      facilityMaintain.facilityId = this.facilityId;


      if (facilityMaintain.facilityWbsDetails.length > 0) {
        for (var i = 0; i < facilityMaintain.facilityWbsDetails.length; i++) {
          let sDate = this.facilityWbsDetails.getRawValue()[i].contractStartDate;
          let eDate = this.facilityWbsDetails.getRawValue()[i].contractEndDate;
          facilityMaintain.facilityWbsDetails[i].contractStartDate = (sDate != null) ? new Date(sDate.year + '-' + sDate.month + '-' + sDate.day) : null;
          facilityMaintain.facilityWbsDetails[i].contractEndDate = (eDate != null) ? new Date(eDate.year + '-' + eDate.month + '-' + eDate.day) : null;
          facilityMaintain.facilityWbsDetails[i].facilityId = this.isUpdate ? facilityMaintain.facilityId : null
          facilityMaintain.facilityWbsDetails[i].createdBy = !!facilityMaintain.facilityWbsDetails[i].createdBy ? facilityMaintain.facilityWbsDetails[i].createdBy : this.userId;
          facilityMaintain.facilityWbsDetails[i].modifiedBy = this.userId;

        }
      }


      if (this.isUpdate) {

        this.facilityService.updateFacility(facilityMaintain).subscribe(
          (result) => {
            this.isDirty = false;
            this.showError = false;
            this.showForm = true;
            this.showGrid = true;
            this.getbillingLevels();
            this.resetMaintainFormFields();
            this.resetContacts();
            this.resetWbsDetails();
            this.isUpdate = false;
            this.showSuccess(`Updated facility successfully : ${facilityMaintain.facilityName}`);
            this.onSearch(this.facilitySearchParam);
          },
          (err) => {
            this.errorMessage = err;
            this.showFailure(err);
          }
        );
      }
      else {
        facilityMaintain.createdBy = this.userId;

        this.facilityService.createFacility(facilityMaintain).subscribe(
          (result) => {
            this.showError = false;
            this.isDirty = false;
            this.getbillingLevels();
            this.resetMaintainFormFields();
            this.resetContacts();
            this.resetWbsDetails();
            this.showForm = true;
            this.showGrid = false;
            this.showSuccess('Added Facility Successfully:: ' + result.facilityName);
            this.onSearch(this.facilitySearchParam);
          },
          (err) => {
            this.errorMessage = err;
            this.showFailure(err);
          }
        );
      }
    }
  }

  resetMaintainFormFields() {
    this.submitted = false;
    this.showError = false;
    this.maintainFormFacility.markAsPristine();
    this.maintainFormFacility.markAsUntouched();

    const control = this.facilityBillingDetails;
    Object.values(control.controls).forEach(control => {
      control.get('billingAmount').setValue('');
    });

    this.maintainFormFacility.patchValue({
      facilityName: '',
      facilityNickName: '',
      systemId:'',
      ein: '',
      contact1: '',
      contact2: '',
      contact3: '',
      contact4: '',
      contactRole1: '',
      contactRole2: '',
      contactRole3: '',
      contactRole4: '',
      facilityNPI: '',
      address: '',
      phone: '',
      fax: '',
      facilityWbsDetails: []
    });
  }

  resetContacts() {
    this.noOfContacts = 1;
    this.generateNumArr(this.noOfContacts);
  }

  resetWbsDetails() {
    const items = (<FormArray>this.maintainFormFacility.get('facilityWbsDetails'));
    while (items.length !== 0) {
      items.removeAt(0)
    }
    this.loadSubFacilities();
  }

  onCancel() {
    this.resetMaintainFormFields();
    this.onSearch('');
    this.showForm = true;
    if (this.isUpdate) {
      this.showGrid = true;
    }
    this.isUpdate = false;
    this.resetContacts();
  }

  onKeypressEvent(event: any) {
    if (event.target.value.length == 0) {
      if (event.keyCode == 48) {
        return false;
      };
    }
  }

  onSearch(val) {
    this.facilitySearchParam = val;
    this.loadFacilitySearchResults(val)
  }

  loadFacilitySearchResults(val) {

    this.showViewFacilityGrid = false;
    this.facilityGridloading = true;

    this.facilityService.searchByFacilityName(val).subscribe((data) => {
      if (data.length > 0) {
        this.showViewFacilityGrid = true;
        this.facilityDatasource = data;
        this.facilityTotalRecords = data.length;
        this.facilityGridloading = false;
        this.showError = false;
      }
      else {
        this.showError = true;
      }
    });
  }


  loadfacilityDetails(event: LazyLoadEvent) {
    this.facilityGridloading = true;
    setTimeout(() => {
      if (this.facilityDatasource) {
        this.facilitySearchResult = this.facilityDatasource.slice(event.first, (event.first + event.rows));
        this.facilityGridloading = false;
      }
    }, 500);
  }

  onEdit(facility: Facility) {
    this.showViewFacilityGrid = false;
    this.resetContacts();
    this.facilityId = facility.facilityId;
    this.showForm = true;

    if (!!facility.contact2) { this.generateMaintainContacts(); }
    if (!!facility.contact3) { this.generateMaintainContacts(); }
    if (!!facility.contact4) { this.generateMaintainContacts(); }

    this.maintainFormFacility.patchValue(
      {
        facilityName: facility.facilityName,
        facilityNickName: facility.facilityNickName,
        systemId: facility.systemId,
        ein: facility.ein,
        contact1: facility.contact1,
        contactRole1: facility.contactRole1,
        contact2: facility.contact2,
        contactRole2: facility.contactRole2,
        contact3: facility.contact3,
        contactRole3: facility.contactRole3,
        contact4: facility.contact4,
        contactRole4: facility.contactRole4,
        facilityNPI: facility.facilityNPI,
        address: facility.address,
        phone: facility.phone,
        fax: facility.fax
      }
    );

    this.billingInfo = [];
    facility.facilityBillingDetails.forEach(element => {
      this.billingInfo.push({
        facilityBillingDetailId: element.facilityBillingDetailId,
        facilityId: element.facilityId,
        facilityBillingLevelName: element.facilityBillingLevelName,
        facilityBillingLevelId: element.billingLevelId,
        billingAmount: element.billingAmount
      });
    });
    this.maintainFormFacility.setControl('facilityBillingDetails', this.setFacilityMaintainBillingDetails(this.billingInfo) || []);

    let facilityWbsMaintainDetails = this.formBuilder.array([]);

    if (facility.facilityWbsDetails.length > 0) {
      facility.facilityWbsDetails.forEach(e => {
        let sDate = new Date(e.contractStartDate);
        let newSd = e.contractStartDate != null ? { year: sDate.getUTCFullYear(), month: sDate.getUTCMonth() + 1, day: sDate.getUTCDate() } : null;

        let eDate = new Date(e.contractEndDate);
        let newEd = e.contractEndDate != null ? { year: eDate.getUTCFullYear(), month: eDate.getUTCMonth() + 1, day: eDate.getUTCDate() } : null;

        facilityWbsMaintainDetails.push(this.formBuilder.group
          ({
            wbsId: e.wbsId,
            wbsName: [{ value: e.wbsName, disabled: newEd != null ? true : false }],
            contractStartDate: [{ value: newSd, disabled: newEd != null ? true : false }],
            contractEndDate: [{ value: newEd, disabled: newEd != null ? true : false }],
            facilityId: e.facilityId,
            modifiedBy: this.userId
          })
        )
      })

      this.maintainFormFacility.setControl('facilityWbsDetails', facilityWbsMaintainDetails);
    }
    this.isUpdate = true;
    this.facilityId = facility.facilityId;
  }

  onDelete(facility: Facility) {
    this.modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    this.modal.componentInstance.needConfirm = true;
    this.modal.componentInstance.textMessage = "delete";

    let params = {
      facilityId: facility.facilityId
    }

    let numPatients, numWI, patientIds, workItemIds;
    this.patientService.searchByFacilityAndMrn(facility.facilityName).subscribe((result) => {
      numPatients = result.length;
      patientIds = result.map(x => x['patientId']);

      this.workItemService.getAllWorkItemsByFacilityId(params).subscribe((res) => {
        numWI = res.length;
        workItemIds = res.map(x => x['workItemId']);

        this.modal.componentInstance.textMessage = "delete this item?\n"
          + numPatients + " Patients and "
          + numWI + " Work items will be deleted along with ";

          this.modal.componentInstance.delete.subscribe(() => {
          this.deleteFacility(facility);
          this.patientService.deleteAllPatientsById(patientIds, this.userId).subscribe((result) => {
            console.log(result);
          });
          this.workItemService.deleteAllWorkItemsById(workItemIds, this.userId).subscribe((result) => {
            console.log(result);
          })
        });
      })
    })
  }

  deleteFacility(facility: Facility) {
    let params={
      svoId: facility.facilityId,
      modifiedBy : this.userId
    }
    this.facilityService.deleteFacility(params).subscribe(
      (result) => {
        this.showSuccess('Successfully deleted Facility #'+facility.facilityId);
        this.onSearch('');
      },
      err=>{
        this.showFailure('Failed to Delete Facility #'+facility.facilityId);
      }
    );
  }

  loadSubFacilities() {
    for (let i = 1; i <= 1; i++) {
      this.facilityWbsDetails.push(this.formBuilder.group({
        wbsId: null,
        wbsName: null,
        contractStartDate: null,
        contractEndDate: null,
        createdBy: this.userId,
        modifiedBy: this.userId
      }));
    }

  }

  generateSubMaintainFacilities() {
    const group = new FormGroup({
      wbsName: new FormControl(''),
      contractStartDate: new FormControl(null),
      contractEndDate: new FormControl(null)
    });
    this.facilityWbsDetails.push(group);
    this.disableWbsRows();
  }

  validateWbsRow() {
    let emptyRow: boolean = false;
    for (var i = 0; i <= this.facilityWbsDetails.length - 1; i++) {
      let wbsName = this.facilityWbsDetails.controls[i].get('wbsName').value;
      let cStartDate = this.facilityWbsDetails.controls[i].get('contractStartDate').value;
      if (wbsName == null && cStartDate == null) {
        emptyRow = true;
      }
    }
    return emptyRow;
  }

  disableWbsRows() {
    for (var i = 0; i < this.facilityWbsDetails.length - 1; i++) {
      let wbsName = this.facilityWbsDetails.controls[i].get('wbsName').value;
      let cStartDate = this.facilityWbsDetails.controls[i].get('contractStartDate').value;
      let cEndDate = this.facilityWbsDetails.controls[i].get('contractEndDate').value;
      if (wbsName != null && cStartDate != null && cEndDate == null) {
        this.facilityWbsDetails.controls[i].get('wbsName').disable();
        this.facilityWbsDetails.controls[i].get('contractStartDate').disable();
        this.facilityWbsDetails.controls[i].get('contractEndDate').disable();
      }
    }
  }

  onContractStartDateChange(idx) {
    if (idx > 0) {
      let sDate = this.facilityWbsDetails.controls[idx].get('contractStartDate').value;
      let newSd = moment(sDate).add(-1, 'days');
      let prevDay = newSd != null ? { year: newSd.year(), month: newSd.month(), day: newSd.date() } : null;
      this.facilityWbsDetails.controls[idx - 1].get('contractEndDate').setValue('');
      this.facilityWbsDetails.controls[idx - 1].get('contractEndDate').setValue(prevDay);
    }
  }

  getSystemList() {
        this.systemService.getApprovedSystems().subscribe(
            (res) => {
                this.systems = res;
            },
            (error) => {
                console.log(error);
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
