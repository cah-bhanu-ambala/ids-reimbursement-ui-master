import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { AdminService } from 'src/app/common/services/http/admin.service';
import { FacilityService } from 'src/app/common/services/http/facility.service';
import { SystemService } from 'src/app/common/services/http/system.service';
import { HttpService } from 'src/app/common/services/http/http.service';
import { alphaNumericValidator, amountValidator, currencyValidator, faciliyNamesValidator, npiValidator, phoneNumValidator } from 'src/app/common/utils';
import { Facility } from 'src/app/models/classes/facility';
import { System } from 'src/app/models/classes/system';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-facility-approval',
  templateUrl: './facility-approval.component.html',
  styleUrls: ['./facility-approval.component.scss']
})

export class FacilityApprovalComponent implements OnInit {
  formFacilityApproval: FormGroup;
  searchFacilityForm: FormGroup;
  formSystemApproval:FormGroup;
  isUpdate: boolean = false;
  isSystemUpdate: boolean = false;
  submitted: boolean;
  showBillAmount: boolean = false;
  billingLevels: any[];
  billingInfo: any[] = [];
  pendingFacilityList: any[];
  pendingSsytemList: any[];
  facilityDeptList:
    [
      { 'name': 'Oncology', 'value': 1 },
      { 'name': 'Non Oncology', 'value': 2 }
    ];
  facilityId: number;
  systemId: number;
  first = 0;
  rows = 10;
  showError: boolean;
  errorMessage: any = '';
  userId: number;
  showFacilityForm = false;
  showSystemForm = false;
  noOfContacts: number = 1;
  arr: Number[];
  systems: any[];
  selectedSystemId: any;
  showPendingFacilityGrid: boolean = true;
  showPendingSystemGrid: boolean = true;
  facilityGridloading: boolean;
  facilityDatasource: any;
  facilitySearchResult: any;
  facilityTotalRecords: any;
  systemGridloading: boolean;
  systemDatasource: any;
  systemSearchResult: any;
  systemTotalRecords: any;
  userRole: string = '';
  ShowOnEdit: boolean = true;
  ShowOnSystemEdit: boolean = true;
  isFormSystemDirty = false;
  isFormFacilityDirty = false;

  constructor(
    private formBuilder: FormBuilder,
    private adminService: AdminService,
    private facilityService: FacilityService,
    private systemService: SystemService,
    private ngbmodal: NgbModal,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.userRole = localStorage.getItem("currentUserRole");
    this.buildFormSystem();
    this.getPendingSystemList();
    this.formSystemApproval.valueChanges.subscribe(e => {
          if (this.formSystemApproval.dirty)
            this.isFormSystemDirty = true
        });

    this.buildFormFacility();
    this.getbillingLevels();
    // this.buildSearchFacility();
    this.generateNumArr(1);
    this.loadSubFacilities();
    this.loadDefaultContacts();
    this.getPendingFacilityList();
    this.getSystemList();
    this.formFacilityApproval.valueChanges.subscribe(e => {
      if (this.formFacilityApproval.dirty)
        this.isFormFacilityDirty = true
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

    getPendingSystemList() {
      this.showPendingSystemGrid = false;
      this.systemGridloading = true;
      this.systemService.getPendingSystems().subscribe(
        (data) => {
          if (data.length > 0) {
            this.showPendingSystemGrid = true;
            this.systemDatasource = data;
            this.systemTotalRecords = data.length;
            this.systemGridloading = false;
          }

        });

    }

    loadPendingSystemDetails(event: LazyLoadEvent) {
        this.systemGridloading = true;
        setTimeout(() => {
          if (this.systemDatasource) {
            this.systemSearchResult = this.systemDatasource.slice(event.first, (event.first + event.rows));
            this.systemGridloading = false;
          }
        }, 500);
      }


  getPendingFacilityList() {
    this.showPendingFacilityGrid = false;
    this.facilityGridloading = true;
    this.facilityService.getPendingFacilities().subscribe(
      (data) => {
        if (data.length > 0) {
          this.showPendingFacilityGrid = true;
          this.facilityDatasource = data;
          this.facilityTotalRecords = data.length;
          this.facilityGridloading = false;
        }

      });

  }

  loadPendingfacilityDetails(event: LazyLoadEvent) {
    this.facilityGridloading = true;
    setTimeout(() => {
      if (this.facilityDatasource) {
        this.facilitySearchResult = this.facilityDatasource.slice(event.first, (event.first + event.rows));
        this.facilityGridloading = false;
      }
    }, 500);
  }



  onApprove(object, entityType) {
    if(entityType == 'System') {
        const modal = this.ngbmodal.open(ConfirmModalComponent, {
          backdrop: 'static',
          keyboard: false,
          size: 'm'
        });
        modal.componentInstance.textMessage = "approve";
        modal.componentInstance.delete.subscribe(() => {
          this.approveSystem(object.systemId);
        });
     }

    else if(entityType == 'Facility') {
      if (object.facilityWbsDetails.length > 0) {
        const modal = this.ngbmodal.open(ConfirmModalComponent, {
          backdrop: 'static',
          keyboard: false,
          size: 'm'
        });
        modal.componentInstance.textMessage = "approve";
        modal.componentInstance.delete.subscribe(() => {
          this.approveFacility(object.facilityId);
        });
      }
      else {
        this.showInfo('This facility doesnt have wbs name. So it cannot be approved.');
      }
    }
     this.showFacilityForm = false;
     this.showSystemForm = false;

  }

  approveSystem(systemId) {
    let systemObject = new System();
    systemObject.systemId = systemId;
    systemObject.modifiedBy = parseInt(localStorage.userId);
    systemObject.status = "Approved";

    this.systemService.updateSystemStatus(systemObject).subscribe(
      (result) => {
        this.showSuccess("Approved System Successfully:: " + result.systemName);
        this.getPendingSystemList();
      }
    );
  }

  approveFacility(facilityId) {
    let facObject = new Facility();
    facObject.facilityId = facilityId;
    facObject.modifiedBy = parseInt(localStorage.userId);
    facObject.status = "Approved";

    this.facilityService.updateFacilityStatus(facObject).subscribe(
      (result) => {
        this.showSuccess("Approved Facility Successfully:: " + result.facilityName);
        this.getPendingFacilityList();
      }
    );
  }

  buildFormSystem() {
    this.formSystemApproval = new FormGroup({
      systemName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)]))
    });
  }

  get s() { return this.formSystemApproval != null ? this.formSystemApproval.controls : null; }

  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  buildFormFacility() {
    this.formFacilityApproval = new FormGroup({
      facilityName: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
      facilityNickName: new FormControl('', Validators.compose([
        Validators.maxLength(50),
        Validators.pattern(faciliyNamesValidator)])),
      facilityNPI: new FormControl('', Validators.compose(
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(alphaNumericValidator)
        ])),
       ein: new FormControl('', Validators.compose(
       [
         Validators.required,
         Validators.maxLength(10),
         Validators.pattern(alphaNumericValidator)
       ])),
      fax: new FormControl(''),
      address: new FormControl('', Validators.compose([Validators.required, Validators.maxLength(100)])),
      phone: new FormControl(''),
      systemId: new FormControl('', [Validators.required]),
      facilityBillingDetails: this.formBuilder.array([]),
      facilityWbsDetails: new FormArray([])
    });
  }

  get f() { return this.formFacilityApproval != null ? this.formFacilityApproval.controls : null; }
  get facilityBillingDetails(): FormArray { return this.formFacilityApproval.get('facilityBillingDetails') as FormArray };
  get facilityWbsDetails(): FormArray { return this.formFacilityApproval.get('facilityWbsDetails') as FormArray };

  setFacilityBillingDetails(billingLevel): any {
    let billingArray = this.formBuilder.array([]);
    if (this.billingLevels != null && this.billingLevels.length > 0) {
      billingLevel.forEach(element => {
        let billinglevelname = element.facilityBillingLevelName;
        if (billinglevelname != 'N/A') {
          billingArray.push(this.formBuilder.group
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
      return billingArray;
    }
  }

  getbillingLevels() {
    this.facilityService.getBillingLevels().subscribe(
      (result) => {
        this.billingLevels = result;
        if (this.billingInfo != undefined && this.billingInfo != null && this.isUpdate == true) {
          this.formFacilityApproval.setControl('facilityBillingDetails', this.setFacilityBillingDetails(this.billingInfo) || []);
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
    this.formFacilityApproval.addControl('contact1', new FormControl('', [Validators.maxLength(50)]));
    this.formFacilityApproval.addControl('contactRole1', new FormControl('', [Validators.maxLength(100)]));
  }

  generateContacts() {
    if (this.noOfContacts < 4) {
      this.noOfContacts++;
      this.generateNumArr(this.noOfContacts);

      const contactKey = 'contact' + (this.noOfContacts);
      const contactRoleKey = 'contactRole' + (this.noOfContacts);

      this.formFacilityApproval.addControl(contactKey, new FormControl('', [Validators.maxLength(50)]));
      this.formFacilityApproval.addControl(contactRoleKey, new FormControl('', [Validators.maxLength(100)]));
    }
    else {
      this.showInfo("You can only add max 4 contacts");
    }
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = ''
    //Check form is valid or not
    if (this.formFacilityApproval.invalid) {
      this.showInfo('Please correct the errors before you proceed!');
      return false;
    }
    else {
      let facility = new Facility();
      facility = this.formFacilityApproval.getRawValue();
      facility.active = true;
      facility.modifiedBy = this.userId;
      facility.facilityId = this.facilityId;
      if (facility.facilityWbsDetails.length > 0) {
        for (var i = 0; i < facility.facilityWbsDetails.length; i++) {
          let sDate = this.facilityWbsDetails.getRawValue()[i].contractStartDate;
          let eDate = this.facilityWbsDetails.getRawValue()[i].contractEndDate;
          facility.facilityWbsDetails[i].contractStartDate = (sDate != null) ? new Date(sDate.year + '-' + sDate.month + '-' + sDate.day) : null;
          facility.facilityWbsDetails[i].contractEndDate = (eDate != null) ? new Date(eDate.year + '-' + eDate.month + '-' + eDate.day) : null;
          facility.facilityWbsDetails[i].facilityId = this.isUpdate ? facility.facilityId : null
          facility.facilityWbsDetails[i].createdBy = !!facility.facilityWbsDetails[i].createdBy ? facility.facilityWbsDetails[i].createdBy : this.userId;
          facility.facilityWbsDetails[i].modifiedBy = this.userId;

        }
      }

      if (this.isUpdate) {
        this.facilityService.updateFacility(facility).subscribe(
          (result) => {
            this.showError = false;
            this.showFacilityForm = false;
            this.isFormFacilityDirty = false;
            this.showPendingFacilityGrid = true;
            this.getPendingFacilityList();
            this.getbillingLevels();
            this.resetFormFields();
            this.resetWbsDetails();
            this.resetContacts();
            this.isUpdate = false;
            this.isSystemUpdate = false;
            this.showSuccess(`Updated facility successfully : ${facility.facilityName}`);
          },
          (err) => {
            this.errorMessage = err;
            this.showFailure(err);
          }
        );
      }
    }
  }


  resetFormFields() {
    this.submitted = false;
    this.formFacilityApproval.markAsPristine();
    this.formFacilityApproval.markAsUntouched();
    const control = this.facilityBillingDetails;
    Object.values(control.controls).forEach(control => {
      control.get('billingAmount').setValue('');
    });

    this.formFacilityApproval.patchValue({
      facilityName: '',
      facilityNickName: '',
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

    this.formFacilityApproval.markAsPristine();
  }

  resetContacts() {
    this.noOfContacts = 1;
    this.generateNumArr(this.noOfContacts);
  }

  resetWbsDetails() {
    const items = (<FormArray>this.formFacilityApproval.get('facilityWbsDetails'));
    while (items.length !== 0) {
      items.removeAt(0)
    }
    this.loadSubFacilities();
  }

  onCancel() {
    this.resetFormFields();
    this.getPendingFacilityList();
    this.showError = false;
    this.isUpdate = false;
    this.showFacilityForm = false;
    this.showPendingFacilityGrid = true;
    this.resetContacts();
  }

  onKeypressEvent(event: any) {
    if (event.target.value.length == 0) {
      if (event.keyCode == 48) {
        return false;
      };
    }
  }

  onEdit(facility: Facility) {
    this.isUpdate = true;
    this.isSystemUpdate = false;
    this.loadEditOrViewDetails(facility);
    this.loadEditWbsDetails(facility);

  }


  loadEditOrViewDetails(facility: Facility) {
    this.resetContacts();
    this.showPendingFacilityGrid = true;
    this.showFacilityForm = true;
    if (!!facility.contact2) { this.generateContacts(); }
    if (!!facility.contact3) { this.generateContacts(); }
    if (!!facility.contact4) { this.generateContacts(); }
    this.formFacilityApproval.patchValue(
      {
        facilityName: facility.facilityName,
        systemId: facility.systemId,
        facilityNickName: facility.facilityNickName,
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
        fax: facility.fax,
        wbsName: facility.wbsName
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
    this.formFacilityApproval.setControl('facilityBillingDetails', this.setFacilityBillingDetails(this.billingInfo) || []);
    this.facilityId = facility.facilityId;
  }

  loadEditWbsDetails(facility: Facility) {
    let facilityWbsDetails = this.formBuilder.array([]);

    if (facility.facilityWbsDetails.length > 0) {
      facility.facilityWbsDetails.forEach(e => {
        let sDate = new Date(e.contractStartDate);
        let newSd = e.contractStartDate != null ? { year: sDate.getUTCFullYear(), month: sDate.getUTCMonth() + 1, day: sDate.getUTCDate() } : null;

        let eDate = new Date(e.contractEndDate);
        let newEd = e.contractEndDate != null ? { year: eDate.getUTCFullYear(), month: eDate.getUTCMonth() + 1, day: eDate.getUTCDate() } : null;

        facilityWbsDetails.push(this.formBuilder.group
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

      this.formFacilityApproval.setControl('facilityWbsDetails', facilityWbsDetails);
    }
  }





  onView(facility: Facility) {
    this.loadEditOrViewDetails(facility);
    this.ShowOnEdit = false;
    this.formFacilityApproval.disable();
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

  generateSubFacilities() {
    const groupFacApprov = new FormGroup({
      wbsName: new FormControl(''),
      contractStartDate: new FormControl(null),
      contractEndDate: new FormControl(null)
    });
    this.facilityWbsDetails.push(groupFacApprov);
    this.disableWbsRows();
  }

  validateWbsRow() {
    let emptyRowFacApprov: boolean = false;
    for (var i = 0; i <= this.facilityWbsDetails.length - 1; i++) {
      let wbsName = this.facilityWbsDetails.controls[i].get('wbsName').value;
      let cStartDate = this.facilityWbsDetails.controls[i].get('contractStartDate').value;
      if (wbsName == null && cStartDate == null) {
        emptyRowFacApprov = true;
      }
    }
    return emptyRowFacApprov;
  }

  disableWbsRows() {
    for (var i = 0; i < this.facilityWbsDetails.length - 1; i++) {
      let wbsNameFacApprov = this.facilityWbsDetails.controls[i].get('wbsName').value;
      let cStartDate = this.facilityWbsDetails.controls[i].get('contractStartDate').value;
      let cEndDate = this.facilityWbsDetails.controls[i].get('contractEndDate').value;
      if (wbsNameFacApprov != null && cStartDate != null && cEndDate == null) {
        this.facilityWbsDetails.controls[i].get('wbsName').disable();
        this.facilityWbsDetails.controls[i].get('contractStartDate').disable();
        this.facilityWbsDetails.controls[i].get('contractEndDate').disable();
      }
    }
  }
  onContractStartDateChange(idx) {
    if (idx > 0) {
      let sDateFecApp = this.facilityWbsDetails.controls[idx].get('contractStartDate').value;
      let newSd = moment(sDateFecApp).add(-1, 'days');
      let prevDay = newSd != null ? { year: newSd.year(), month: newSd.month(), day: newSd.date() } : null;
      this.facilityWbsDetails.controls[idx - 1].get('contractEndDate').setValue('');
      this.facilityWbsDetails.controls[idx - 1].get('contractEndDate').setValue(prevDay);
    }
  }

  loadEditOrViewSystemDetails(system: System) {
      this.showSystemForm = true;
      this.showFacilityForm = false;
      this.formSystemApproval.patchValue(
        {
          systemName: system.systemName

        }
      );
      this.systemId = system.systemId;
    }


  onSystemEdit(system: System) {
    this.isSystemUpdate = true;
    this.isUpdate = false;
    this.loadEditOrViewSystemDetails(system);
    //this.showPendingSystemGrid = true;
  }

  onSystemView(system: System) {
    this.loadEditOrViewSystemDetails(system);
    this.ShowOnSystemEdit = false;
    this.formSystemApproval.disable();
  }

onSystemSubmit() {
    this.submitted = true;
    this.errorMessage = ''
    //Check form is valid or not
    if (this.formSystemApproval.invalid) {
      this.showInfo('Please correct the errors before you proceed!');
      return false;
    }
    else {
      let system = new System();
      system = this.formSystemApproval.getRawValue();
      system.active = true;
      system.modifiedBy = this.userId;
      system.systemId = this.systemId;



      if (this.isSystemUpdate) {
        this.systemService.updateSystem(system).subscribe(
          (result) => {
            this.showError = false;
            this.showSystemForm = false;
            this.isFormSystemDirty = false;
            this.showPendingSystemGrid = true;
            this.getPendingSystemList();
            this.resetFormFields();
            this.isSystemUpdate = false;
            this.isUpdate = false;
            this.showSuccess(`Updated system successfully : ${system.systemName}`);
          },
          (err) => {
            this.errorMessage = err;
            this.showFailure(err);
          }
        );
      }
    }
  }
    onSystemEditCancel() {
      this.resetFormFields();
      this.getPendingSystemList();
      this.showError = false;
      this.isSystemUpdate = false;
      this.showSystemForm = false;
      this.showPendingSystemGrid = true;
    }


  getSystemList() {
        this.systemService.getApprovedSystems().subscribe(
            (result) => {
                this.systems = result;
            },
            (err) => {
                console.log(err);
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
