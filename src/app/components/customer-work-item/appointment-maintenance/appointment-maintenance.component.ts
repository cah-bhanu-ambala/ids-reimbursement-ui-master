import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import {
  alphaNumericSpaceValidator,
  amountValidator,
  numberValidator,
  getAdvocacyPerms,
  alphaNumericSpaceDecimalValidator
} from 'src/app/common/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { saveAs } from 'file-saver';
import { CustomerService } from 'src/app/common/services/http/customer.service';
import {FileAttachmentData} from "../../shared/file-attachments/file-attachment-data";
import {FileAttachmentService} from "../../../common/services/http/file-attachment.service";
import { CommonService } from 'src/app/common/services/http/common.service';
import { UserService } from 'src/app/common/services/http/user.service';

@Component({
  selector: 'app-appointment-maintenance',
  templateUrl: './appointment-maintenance.component.html',
  styleUrls: ['./appointment-maintenance.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppointmentMaintenanceComponent implements OnInit {
  maintainFormAppointment: FormGroup;
  formSearchAdvocacy: FormGroup;
  formSearch: FormGroup;
  formAdvocacy: FormGroup;
  facilities: any[];
  appointemntTypes: any[];
  advocacyTypes: any[];
  icdList: any;
  drugList: any;
  submitted: boolean;
  teamMembers: any[];

  //advocacyStatuses: any[];
  isUpdate: boolean;
  errorMessage: any;
  appointmentId: any;
  showError: boolean;
  showGrid: boolean;
  searchResult: any[];
  appointmentList: any[];
  appointmentStatusList: any[];
  showAdvocacyDetails: boolean;
  searched: boolean;
  showCommercialCopayVob: boolean;
  showEOBSubmited: boolean;
  showEOBReceived: boolean;
  showEobSubmitedDate: boolean;
  showEobReceivedDate: boolean;
  showFreeMedicationBeforeInfusion: boolean;
  showCommercialCopayPharmacy: boolean;
  showFreeMedicationAfterInfusion: boolean;
  showGrantVobDisplay: boolean;
  showGrantPharmacyDisplay: boolean;
  showMcdMonitorVobDIsplay: boolean;
  showMcdMonitorPharmacyDisplay: boolean;
  showPremiumAssistanceDisplay: boolean;
  showEobSubmittedToGrantDate: boolean;
  showPatientNotifiedDate: boolean;

  advocacyGridloading: boolean;
  advocacyDatasource: any;
  advocacySearchResult: any;
  advocacyTotalRecords: any;
   showClosedAppointments: boolean = false;

  appointmentGridloading: boolean;
  appointmentDatasource: any;
  appointmentSearchResult: any;
  appointmentTotalRecords: any;
  showAppointmentGrid: boolean = false;
  showNoAppointsError: boolean = false;
  showSubmitBtn: boolean = false;
  activeState: boolean[] = [false, false, false];
  userId: any;
  systemId: number;

  fileAttachmentData: FileAttachmentData = new FileAttachmentData();

  attachmentsLength: number = 0;
  advocacyAttachments: any[] = [];
  customerFacilityId: number;
  customerFacilityName: string = '';
  showSearch: boolean = true;
  showAdvocacyMasterDetails: boolean = false;
  isDirty = false;
  advocacyPerms = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private advocacyService: AdvocacyService,
    private customerService: CustomerService,
    private patientService: PatientService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private fileAttachmentService: FileAttachmentService,
    private common: CommonService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    // this.onSearch('');
    this.userId = parseInt(localStorage.userId);
    this.systemId = parseInt(localStorage.systemId);
    console.log(this.systemId);
    this.getTeamMemberList();
    // this.customerFacilityId = parseInt(localStorage.CustomerfacilityId);
    // this.customerFacilityName = localStorage.CustomerfacilityName;
    this.advocacyPerms = getAdvocacyPerms();
    // this.getFacilityList();
    this.buildSearchForm();
    this.buildAppointmentForm();
    this.getAppointmentTypes();
    this.buildAdvocayForm();
    this.getAppoitmentStatusList();
    this.getAdvocacyTypes();
    this.advocacyService.setAdvocacyInfo(null);

  this.formAdvocacy.valueChanges.subscribe( e => this.isDirty = true );

    this.maintainFormAppointment.get('eobSubmittedToIns').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.maintainFormAppointment.controls['eobSubmittedToInsDate'].enable();
      } else {
        this.maintainFormAppointment.controls['eobSubmittedToInsDate'].disable();
      }
    });

    this.maintainFormAppointment.get('eobReceivedFromIns').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.maintainFormAppointment.controls['eobReceivedFromInsDate'].enable();
      } else {
        this.maintainFormAppointment.controls['eobReceivedFromInsDate'].disable();
      }
    });

    this.maintainFormAppointment.get('eobSubmittedToGrant').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.maintainFormAppointment.controls['eobSubmittedToGrantDate'].enable();
      } else {
        this.maintainFormAppointment.controls['eobSubmittedToGrantDate'].disable();
      }
    });

    this.maintainFormAppointment.get('patientNotified').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.maintainFormAppointment.controls['patientNotifiedDate'].enable();
      } else {
        this.maintainFormAppointment.controls['patientNotifiedDate'].disable();
      }
    });
    this.maintainFormAppointment.get('eobSubmittedToCopay').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.maintainFormAppointment.controls['eobSubmittedToCopayDate'].enable();
      } else {
        this.maintainFormAppointment.controls['eobSubmittedToCopayDate'].disable();
      }
    });
    // if (this.customerFacilityId != 0) {
    //   this.formSearch.removeControl("facilityId");
    // }
  }

  buildAdvocayForm() {
    this.formAdvocacy = this.formBuilder.group({
      patientMrn: { value: '', disabled: true },
      advocacyId: { value: '', disabled: true },
      facilityId: { value: '', disabled: true },
      facilityName: { value: '', disabled: true },
      patientId: { value: '', disabled: true },
      advocacyStatusId: { value: '', disabled: true },
      advocacyStatusName: { value: '', disabled: true },
      advocacyTypeId: { value: '', disabled: true },
      advocacyTypeName: { value: '', disabled: true },
      advocacySource: { value: '', disabled: true },
      diagnosisCode: { value: '', disabled: true },
      drugForAdvocacy: { value: '', disabled: true },
      startDate: { value: '', disabled: true },
      maxAmountAvail: { value: '', disabled: true },
      endDate: { value: '', disabled: true },
      totalCostOfMedicationInfused: { value: '', disabled: true },
      lookBack: { value: '', disabled: true },
      lookBackStartDate: { value: '', disabled: true },
      notes: { value: '', disabled: true },
      dateItWasAddded: { value: '', disabled: true },
      attachment: { value: '', disabled: true }
    });
  }

  buildAppointmentForm() {
    this.maintainFormAppointment = this.formBuilder.group({
      appointmentTypeId: [''],
      scheduledAppointmentDate: [null],
      dateInfused: [null],
      frequency: [''],
      dosage: [''],
      appointmentStatusId: [''],
      unitsUsedAtInfusion: [''],
      pricePerUnitInfusion: [''],
      totalCostOfMedicationInfused: [{ value: 0, disabled: true }],
      freeMedicationOrdered: [null],
      dateAdvocacyReceived: [null],
      prescriptionNumber: [''],
      copayCovered: ['', Validators.compose([Validators.pattern(/^[0-9]\d{0,7}(\.[0-9]{1,2})?$/)])],
      copayRemaining: ['', Validators.compose([Validators.pattern(/^[0-9]\d{0,7}(\.[0-9]{1,2})?$/)])],
      notes: [''],
      indicatedCopay: [''],
      replacementOrdered: [null],
      eobSubmittedToIns: [''],
      eobSubmittedToInsDate: { value: null, disabled: true },
      eobReceivedFromIns: [{value: '', disabled: !this.advocacyPerms}],
      eobReceivedFromInsDate: { value: null, disabled: true },
      eobSubmittedToCopay: [{value: '', disabled: !this.advocacyPerms}],
      eobSubmittedToCopayDate: { value: null, disabled: true },
      amountReceivedFromGrant: [''],
      amountReceivedFromCopay: [''],
      replacementReceived: [null],
      eobSubmittedToGrant: [{value: '', disabled: !this.advocacyPerms}],
      eobSubmittedToGrantDate: { value: null, disabled: true },
      patientNotifiedDate: { value: null, disabled: true },
      patientNotified: [{value: '', disabled: !this.advocacyPerms}],
      attachment1: [''],
      attachment2: [''],
      attachment3: [''],
      attachment4: [''],
      followUpDate: [null],
      teamMemberAssignedTo: ['']
    });
  }

  toggle(index: number) {
    if (!this.activeState[index]) {
      this.activeState[index] = true;
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  get f() {
    return this.maintainFormAppointment != null ? this.maintainFormAppointment.controls : null;
  }

  buildSearchForm() {
    this.formSearch = this.formBuilder.group({
      facilityId: 0,
      facilityName: [{ value: this.customerFacilityName, disabled: true }],
      intFacilityId: ['', Validators.compose([Validators.required])],
      mrn: ''
    });
  }

  get sf() {
    return this.formSearch != null ? this.formSearch.controls : null;
  }

  // getFacilityList() {
  //   this.advocacyService.getFacilityList().subscribe(
  //     (result) => {
  //       this.facilities = result;
  //     }
  //   );
  // }

  getAdvocacyTypes() {
    this.advocacyService.getAllAdvocacyTypes().subscribe(
      (result) => {
        this.advocacyTypes = result;
      }
    );
  }

  getAppointmentTypes() {
    this.advocacyService.getAllAppointmentTypes().subscribe(
      (result) => {
        this.appointemntTypes = result;
      }
    );
  }

  calculateTotalCost() {
    var unitsUsed = this.maintainFormAppointment.value.unitsUsedAtInfusion;
    var costPerUnit = this.maintainFormAppointment.value.pricePerUnitInfusion;
    var totalCost = unitsUsed * costPerUnit;
    if (totalCost > 0) {
      this.maintainFormAppointment.patchValue({
        totalCostOfMedicationInfused: totalCost
      });

    }
  }

  getAppoitmentStatusList() {
    this.advocacyService.getAllAppointmentStatus().subscribe(
      (result) => {
        this.appointmentStatusList = result;
      }
    );
  }

  loadAppointmentDetails(event: LazyLoadEvent) {
    this.appointmentGridloading = true;
    setTimeout(() => {
      if (this.appointmentDatasource) {
        this.appointmentSearchResult = this.appointmentDatasource.slice(event.first, (event.first + event.rows));
        this.appointmentGridloading = false;
      }
    }, 500);
  }
public onShowClosedChanged(value:boolean){
      this.showClosedAppointments = value;
      if (this.showClosedAppointments){
        this.getAppointmentByPatientId(this.formAdvocacy.value.patientMrn, this.formAdvocacy.value.advocacyId);
      }else {
        this.getAppointmentByPatientIdExcludeClosed(this.formAdvocacy.value.patientMrn, this.formAdvocacy.value.advocacyId);
      }
  }

  getAppointmentByPatientId(patientMrn, advocacyId) {
    this.customerService.getAllAppointmentsByAdvocacyIdForExternalCustomer(advocacyId).subscribe(
      (result) => {
        if (result) {
          this.appointmentDatasource = result;
          this.appointmentTotalRecords = result.length;
          this.appointmentGridloading = false;
          this.showAppointmentGrid = true;
          this.showNoAppointsError = false;
        }
        else {
          this.showNoAppointsError = true;
          this.showAppointmentGrid = false;
        }

      },
      (err) => {
        console.log(err);
      }
    )
  }
getAppointmentByPatientIdExcludeClosed(patientMrn, advocacyId){
    //this.selectedPatientMrn = patientMrn;
      //this.formAdvocacy.value.advocacyId = advocacyId;
        this.customerService.getOpenAppointmentsByAdvocacyIdForExternalCustomer(advocacyId).subscribe(
          (result) => {
            if (result) {
              this.appointmentDatasource = result;
              this.appointmentTotalRecords = result.length;
              this.appointmentGridloading = false;
              this.showAppointmentGrid = true;
              this.showNoAppointsError = false;
            }
            else {
              this.showNoAppointsError = true;
              this.showAppointmentGrid = false;
            }
          }
        )
  }
  openAdvAttachment(id, name) {
    this.patientService.getAttachmentById(id).subscribe(
      (response) => {
        let mediaFileType = response.type;
        let blob = new Blob([response], { type: mediaFileType });
        var url = window.URL.createObjectURL(blob);
        if (mediaFileType == 'application/pdf' || mediaFileType == 'image/jpeg' || mediaFileType == 'image/png') {
          window.open(url);
        } else {
          saveAs(blob, name);
        }
      }, err => {
        this.showFailure('Failed to Open the file!');
        console.log(err);
      });
  }

  onEobSubmited(value) {
    if (value === 'Y') {
      this.showEobSubmitedDate = true;
    } else {
      this.showEobSubmitedDate = false;
    }
  }

  onEobReceived(value) {
    if (value === 'Y') {
      this.showEobReceivedDate = true;
    } else {
      this.showEobReceivedDate = false;
    }
  }

  onEobSubmittedToGrantDate(value) {
    if (value === 'Y') {
      this.showEobSubmittedToGrantDate = true;
    } else {
      this.showEobSubmittedToGrantDate = false;
    }
  }

  onPatientNotified(value) {
    if (value === 'Y') {
      this.showPatientNotifiedDate = true;
    } else {
      this.showPatientNotifiedDate = false;
    }
  }


  onSearchAdv() {
    if (this.formSearch.invalid) {
      this.searched = true;
      return false;
    } else {
      let facilityId = this.formSearch.get('facilityId').value;
      let mrn = this.formSearch.get('mrn').value;

      this.loadSearchResults(mrn, facilityId);
    }
  }

  loadSearchResults(val, facId ) {
    this.showGrid = false;
    this.advocacyGridloading = true;
    // let facilityId = 15;
    this.showError = false;
    this.customerService.SearchForCustAdvocacies(val, facId).subscribe((data) => {
      if (data.length > 0) {
        this.showGrid = true;
        this.showSearch = true;
        this.advocacyDatasource = data;
        this.advocacyTotalRecords = data.length;
        this.advocacyGridloading = false;
        this.showAdvocacyMasterDetails = false;
      }
      else {
        this.showGrid = false;
        this.showError = true;
      }
    });
  }

  loadAdvocacyDetails(event: LazyLoadEvent) {
    this.advocacyGridloading = true;
    setTimeout(() => {
      if (this.advocacyDatasource) {
        this.advocacySearchResult = this.advocacyDatasource.slice(event.first, (event.first + event.rows));
        this.advocacyGridloading = false;
      }
    }, 500);
  }

  onAdd(advocacy) {
    this.showGrid = false;
    this.showSearch = false;
    this.showAdvocacyDetails = true;
    this.showAdvocacyMasterDetails = true;

    this.maintainFormAppointment.get('appointmentTypeId').setValue('');

    var startDate = new Date(advocacy.startDate);
    var sDate = advocacy.startDate != null ? { year: startDate.getUTCFullYear(), month: startDate.getUTCMonth() + 1, day: startDate.getUTCDate() } : advocacy.startDate;

    var endDate = new Date(advocacy.endDate);
    var eDate = advocacy.endDate != null ? { year: endDate.getUTCFullYear(), month: endDate.getUTCMonth() + 1, day: endDate.getUTCDate() } : advocacy.endDate;

    var lookBackStartDate = new Date(advocacy.lookBackStartDate);
    var lStartDate = advocacy.lookBackStartDate != null ? { year: lookBackStartDate.getUTCFullYear(), month: lookBackStartDate.getUTCMonth() + 1, day: lookBackStartDate.getUTCDate() } : advocacy.lookBackStartDate;

    var dateItWasAddded = new Date(advocacy.createdDate);
    var createdDate = dateItWasAddded != null ? { year: dateItWasAddded.getUTCFullYear(), month: dateItWasAddded.getUTCMonth() + 1, day: dateItWasAddded.getUTCDate() } : advocacy.dateItWasAddded;

    this.formAdvocacy.patchValue({
      patientMrn: advocacy.patientMrn,
      facilityId: advocacy.facilityId,
      facilityName: advocacy.facilityName,
      advocacyId: advocacy.advocacyId,
      patientId: advocacy.patientId,
      advocacyStatusName: advocacy.advocacyStatusName,
      advocacyStatusId: advocacy.advocacyStatusId,
      advocacyTypeId: advocacy.advocacyTypeId,
      advocacyTypeName: advocacy.advocacyTypeName,
      advocacySource: advocacy.advocacySource,
      diagnosisCode: advocacy.icdCode + ' - ' + advocacy.icdDescription,
      drugForAdvocacy: advocacy.drugProcCode + ' - ' + advocacy.drugShortDesc,
      startDate: sDate,
      endDate: eDate,
      maxAmountAvail: advocacy.maxAmountAvail,
      dateItWasAddded: createdDate,
      lookBack: advocacy.lookBack,
      lookBackStartDate: lStartDate,
      notes: advocacy.notes,
    });
    this.advocacyAttachments = advocacy.attachments;

    this.showAdvocacyDetails = true;
    this.getAppointmentByPatientIdExcludeClosed(advocacy.patientMrn, advocacy.advocacyId);
    this.showClosedAppointments = false;
    this.router.navigate(['/dashboard/customerworkmenu/appointmentMaintenance']
    );
  }


  onEditAppointment(appointmentObj) {
    //this.maintainFilesList = [];
    this.attachmentsLength = appointmentObj.attachments.length;

    var mscheduledAppointmentDate = new Date(appointmentObj.scheduledAppointmentDate);
    var saDate = appointmentObj.scheduledAppointmentDate != null ? { year: mscheduledAppointmentDate.getUTCFullYear(), month: mscheduledAppointmentDate.getUTCMonth() + 1, day: mscheduledAppointmentDate.getUTCDate() } : appointmentObj.scheduledAppointmentDate;

    var mdateInfused = new Date(appointmentObj.dateInfused);
    var infusedDate = appointmentObj.dateInfused != null ? { year: mdateInfused.getUTCFullYear(), month: mdateInfused.getUTCMonth() + 1, day: mdateInfused.getUTCDate() } : appointmentObj.dateInfused;

    var meobReceivedFromInsDate = new Date(appointmentObj.eobReceivedFromInsDate);
    var eReceivedDate = appointmentObj.eobReceivedFromInsDate != null ? { year: meobReceivedFromInsDate.getUTCFullYear(), month: meobReceivedFromInsDate.getUTCMonth() + 1, day: meobReceivedFromInsDate.getUTCDate() } : appointmentObj.eobReceivedFromInsDate;

    var meobSubmittedToInsDate = new Date(appointmentObj.eobSubmittedToInsDate);
    var eSubmittedToInsDate = appointmentObj.eobSubmittedToInsDate != null ? { year: meobSubmittedToInsDate.getUTCFullYear(), month: meobSubmittedToInsDate.getUTCMonth() + 1, day: meobSubmittedToInsDate.getUTCDate() } : appointmentObj.eobSubmittedToInsDate;

    var eobSubmittedToGrantDate = new Date(appointmentObj.eobSubmittedToGrantDate);
    var eSubmittedToGrantDate = appointmentObj.eobSubmittedToGrantDate != null ? { year: eobSubmittedToGrantDate.getUTCFullYear(), month: eobSubmittedToGrantDate.getUTCMonth() + 1, day: eobSubmittedToGrantDate.getUTCDate() } : appointmentObj.eobSubmittedToGrantDate;

    var patientNotifiedDate = new Date(appointmentObj.patientNotifiedDate);
    var pNotifiedDate = appointmentObj.patientNotifiedDate != null ? { year: patientNotifiedDate.getUTCFullYear(), month: patientNotifiedDate.getUTCMonth() + 1, day: patientNotifiedDate.getUTCDate() } : appointmentObj.patientNotifiedDate;

    var mfreeMedicationOrdered = new Date(appointmentObj.freeMedicationOrdered);
    var freeMedicationOrderedDate = appointmentObj.freeMedicationOrdered != null ? { year: mfreeMedicationOrdered.getUTCFullYear(), month: mfreeMedicationOrdered.getUTCMonth() + 1, day: mfreeMedicationOrdered.getUTCDate() } : appointmentObj.freeMedicationOrdered;

    var dateAdvocacyReceived = new Date(appointmentObj.dateAdvocacyReceived);
    var formDateAdvocacyReceived = appointmentObj.dateAdvocacyReceived != null ? { year: dateAdvocacyReceived.getUTCFullYear(), month: dateAdvocacyReceived.getUTCMonth() + 1, day: dateAdvocacyReceived.getUTCDate() } : appointmentObj.dateAdvocacyReceived;

    var mreplacementOrdered = new Date(appointmentObj.replacementOrdered);
    var replacementOrderedDate = appointmentObj.replacementOrdered != null ? { year: mreplacementOrdered.getUTCFullYear(), month: mreplacementOrdered.getUTCMonth() + 1, day: mreplacementOrdered.getUTCDate() } : appointmentObj.replacementOrdered;

    var replacementReceived = new Date(appointmentObj.replacementReceived);
    var replamentReceivedDate = appointmentObj.replacementReceived != null ? { year: replacementReceived.getUTCFullYear(), month: replacementReceived.getUTCMonth() + 1, day: replacementReceived.getUTCDate() } : appointmentObj.replacementReceived;

    var eobSubmittedToCopayDate = new Date(appointmentObj.eobSubmittedToCopayDate);
    var eSubmittedToCopayDate = appointmentObj.eobSubmittedToCopayDate != null ? { year: eobSubmittedToCopayDate.getUTCFullYear(), month: eobSubmittedToCopayDate.getUTCMonth() + 1, day: eobSubmittedToCopayDate.getUTCDate() } : appointmentObj.eobSubmittedToCopayDate;

    var mfollowUpDt = new Date(appointmentObj.followUpDate);
    var fDate = appointmentObj.followUpDate != null ? { year: mfollowUpDt.getUTCFullYear(), month: mfollowUpDt.getUTCMonth() + 1, day: mfollowUpDt.getUTCDate() } : appointmentObj.followUpDate;

    this.maintainFormAppointment.patchValue(
      {
        appointmentTypeId: appointmentObj.appointmentTypeId,
        scheduledAppointmentDate: saDate,
        dateInfused: infusedDate,
        frequency: appointmentObj.frequency,
        dosage: appointmentObj.dosage,
        appointmentStatusId: appointmentObj.appointmentStatusId,
        unitsUsedAtInfusion: appointmentObj.unitsUsedAtInfusion,
        pricePerUnitInfusion: appointmentObj.pricePerUnitInfusion,
        totalCostOfMedicationInfused: appointmentObj.totalCostOfMedicationInfused,
        freeMedicationOrdered: freeMedicationOrderedDate,
        dateAdvocacyReceived: formDateAdvocacyReceived,
        prescriptionNumber: appointmentObj.prescriptionNumber,
        copayCovered: appointmentObj.copayCovered,
        copayRemaining: appointmentObj.copayRemaining,
        notes: appointmentObj.notes,
        eobSubmittedToIns: appointmentObj.eobSubmittedToIns == 'U' ? '' : appointmentObj.eobSubmittedToIns,
        eobSubmittedToInsDate: eSubmittedToInsDate,
        eobReceivedFromIns: appointmentObj.eobReceivedFromIns == 'U' ? '' : appointmentObj.eobReceivedFromIns,
        eobReceivedFromInsDate: eReceivedDate,
        amountReceivedFromGrant: appointmentObj.amountReceivedFromGrant,
        eobSubmittedToGrant: appointmentObj.eobSubmittedToGrant == 'U' ? '' : appointmentObj.eobSubmittedToGrant,
        eobSubmittedToGrantDate: eSubmittedToGrantDate,
        eobSubmittedToCopay: appointmentObj.eobSubmittedToCopay == 'U' ? '' : appointmentObj.eobSubmittedToCopay,
        eobSubmittedToCopayDate: eSubmittedToCopayDate,
        patientNotifiedDate: pNotifiedDate,
        patientNotified: appointmentObj.patientNotified == 'U' ? '' : appointmentObj.patientNotified,
        indicatedCopay: appointmentObj.indicatedCopay,
        amountReceivedFromCopay: appointmentObj.amountReceivedFromCopay,
        replacementOrdered: replacementOrderedDate,
        replacementReceived: replamentReceivedDate,
        followUpDate: fDate,
        teamMemberAssignedTo: appointmentObj.teamMemberAssignedTo
      }
    );
    this.isUpdate = true;

    this.appointmentId = appointmentObj.appointmentId;
    this.onEobReceived(appointmentObj.eobReceivedFromIns);
    this.onEobSubmited(appointmentObj.eobSubmittedToIns);
    this.onEobSubmittedToGrantDate(appointmentObj.eobSubmittedToGrant);
    this.onPatientNotified(appointmentObj.patientNotified);
    this.fileAttachmentData = new FileAttachmentData();
    appointmentObj.attachments.forEach(attachment => {
      this.fileAttachmentData.filesList.push({ name: attachment.attachmentPath, attachmentId: attachment.appointmentAttachmentId, active: attachment.active });
    });
    // this.router.navigate(['/dashboard/customerworkmenu/appointmentMaintenance']);
  }

  onDeleteAppointment(appointmentId) {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "send a request to delete for";
    modal.componentInstance.delete.subscribe(() => {
      this.onDeleteAppointmentId(appointmentId);
    });
  }

  onDeleteAppointmentId(appointmentId) {

    let params = {
      svoId: appointmentId,
      modifiedBy: this.userId
    }
    this.showAppointmentGrid = false;
    this.customerService.deleteAppointmentByCust(params).subscribe(
      (result) => {
        this.showSuccess('Submitted request to delete for appointment id: ' + appointmentId);
        this.getAppointmentByPatientIdExcludeClosed(this.formAdvocacy.value.patientMrn, this.formAdvocacy.value.advocacyId);
        this.showClosedAppointments = false;

        this.resetAppointmentForm();
      },
      (err) => {
        this.showFailure('Failed to submit delete request!')
        this.showAppointmentGrid = true;
        this.errorMessage = err;
      }
    );
  }

  onResetAdvocacyType() {
    this.showCommercialCopayVob = false;
    this.showCommercialCopayPharmacy = false;
    this.showFreeMedicationBeforeInfusion = false;
    this.showFreeMedicationAfterInfusion = false;
    this.showGrantPharmacyDisplay = false;
    this.showGrantVobDisplay = false;
    this.showMcdMonitorPharmacyDisplay = false;
    this.showMcdMonitorVobDIsplay = false;
    this.showPremiumAssistanceDisplay = false;
    this.maintainFormAppointment.get('appointmentStatusId').enable();
  }

  OnClearAppointmentFields() {
    this.maintainFormAppointment.patchValue(
      {
        scheduledAppointmentDate: null,
        dateInfused: null,
        frequency: '',
        dosage: '',
        appointmentStatusId: '',
        unitsUsedAtInfusion: '',
        pricePerUnitInfusion: '',
        totalCostOfMedicationInfused: 0,
        freeMedicationOrdered: null,
        dateAdvocacyReceived: null,
        prescriptionNumber: '',
        copayCovered: '',
        copayRemaining: '',
        notes: '',
        eobSubmittedToIns: '',
        eobSubmittedToInsDate: null,
        eobReceivedFromIns: '',
        eobReceivedFromInsDate: null,
        amountReceivedFromGrant: '',
        eobSubmittedToGrant: '',
        eobSubmittedToGrantDate: null,
        patientNotifiedDate: null,
        patientNotified: '',
        indicatedCopay: '',
        amountReceivedFromCopay: '',
        replacementOrdered: null,
        replacementReceived: null,
        followUpDate: null,
        teamMemberAssignedTo: ''
      }
    );
  }
  // Commercial Copay - Pharmacy
  setCommercialCoPayPharmacyValidators() {
    this.maintainFormAppointment.get('frequency').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);

    this.maintainFormAppointment.get('dosage').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);

    this.maintainFormAppointment.get('prescriptionNumber').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('appointmentStatusId').setValidators(Validators.required);
    this.maintainFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator))
  }

  //Commercial Copay - VOB
  setCommercialCoPayVobValidators() {
    this.maintainFormAppointment.get('frequency').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);

    this.maintainFormAppointment.get('dosage').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);

    this.maintainFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);
    this.maintainFormAppointment.get('indicatedCopay').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('amountReceivedFromGrant').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('amountReceivedFromCopay').setValidators(Validators.pattern(amountValidator));
  }

  //Free Medication after infusion
  setFreeMedicationAfterInfusionValidators() {
    this.maintainFormAppointment.get('frequency').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);

    this.maintainFormAppointment.get('dosage').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);

    this.maintainFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);

    this.maintainFormAppointment.get('unitsUsedAtInfusion').setValidators([Validators.required,
    Validators.pattern(numberValidator), Validators.maxLength(10)]);

    this.maintainFormAppointment.get('pricePerUnitInfusion').setValidators([Validators.required,
    Validators.pattern(amountValidator)]);

    this.maintainFormAppointment.get('totalCostOfMedicationInfused').setValidators(Validators.pattern(amountValidator));


  }

  //Free Medication before infusion
  setFreeMedicationBeforeInfusionValidators() {
    this.maintainFormAppointment.get('frequency').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('dosage').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);
    this.maintainFormAppointment.get('totalCostOfMedicationInfused').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('unitsUsedAtInfusion').setValidators([
      Validators.pattern(numberValidator), Validators.maxLength(10)]);

    this.maintainFormAppointment.get('pricePerUnitInfusion').setValidators([
      Validators.pattern(amountValidator)]);
  }

  //Grant Pharmacy
  setGrantPharmacyValidators() {
    this.maintainFormAppointment.get('prescriptionNumber').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('frequency').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('dosage').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator));
  }
  //Grant vob
  setGrantVobValidators() {
    this.maintainFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);
    this.maintainFormAppointment.get('frequency').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('dosage').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('amountReceivedFromGrant').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('indicatedCopay').setValidators(Validators.pattern(amountValidator));
  }
  //MCD monitor
  setMCDMonitorValidators() {
    this.maintainFormAppointment.get('frequency').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('dosage').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);
    this.maintainFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('prescriptionNumber').setValidators([Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
  }
  //MCD monitor
  premiumAssistValidators() {
    this.maintainFormAppointment.get('patientNotified').setValidators(Validators.required);
  }
  //MCD monitoring Vob
  setMCDMonitorVobValidators() {
    this.maintainFormAppointment.get('frequency').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);

    this.maintainFormAppointment.get('dosage').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);

    this.maintainFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);
    this.maintainFormAppointment.get('indicatedCopay').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('amountReceivedFromCopay').setValidators(Validators.pattern(amountValidator));
    this.maintainFormAppointment.get('amountReceivedFromGrant').setValidators(Validators.pattern(amountValidator));
  }

  ClearAllValidators(formAppnt) {
    var fields = ['frequency', 'dosage', 'prescriptionNumber', 'scheduledAppointmentDate', 'appointmentStatusId',
      'unitsUsedAtInfusion', 'pricePerUnitInfusion', 'patientNotified', 'indicatedCopay', 'amountReceivedFromGrant',
      'copayCovered', 'copayRemaining', 'totalCostOfMedicationInfused', 'amountReceivedFromCopay'];
    fields.forEach(function (field) {
      formAppnt.get(field).clearValidators();
      formAppnt.get(field).updateValueAndValidity();
    })
  }

  onAdvocacyTypeSelected(appointmentTypeId) {
    if (appointmentTypeId != null && appointmentTypeId != '') {
      this.ClearAllValidators(this.maintainFormAppointment);
      this.OnClearAppointmentFields();
      this.submitted = false;
      this.showSubmitBtn = true;
      var appointmentType = this.appointemntTypes.filter(x => x.appointmentTypeId == appointmentTypeId)[0];
      if (appointmentType != null) {
        this.onResetAdvocacyType();
        if (appointmentType.appointmentTypeName == 'Commercial Copay - Pharmacy') {
          this.showCommercialCopayPharmacy = true;
          this.setCommercialCoPayPharmacyValidators();
        }
        else if (appointmentType.appointmentTypeName == 'Commercial Copay - VOB') {
          this.showCommercialCopayVob = true;
          this.setCommercialCoPayVobValidators();
        }
        else if (appointmentType.appointmentTypeName == 'Free Medication - After Infusion') {
          this.showFreeMedicationAfterInfusion = true;
          this.setFreeMedicationAfterInfusionValidators();
        }
        else if (appointmentType.appointmentTypeName === 'Free Medication - Before Infusion') {
          this.showFreeMedicationBeforeInfusion = true;
          this.setFreeMedicationBeforeInfusionValidators();
        }
        else if (appointmentType.appointmentTypeName === 'Grant - VOB') {
          this.showGrantVobDisplay = true;
          this.setGrantVobValidators();
        }
        else if (appointmentType.appointmentTypeName === 'Grant - Pharmacy') {
          this.showGrantPharmacyDisplay = true;
          this.setGrantPharmacyValidators();
        }
        else if (appointmentType.appointmentTypeName === 'MCD Monitoring - Pharmacy') {
          this.showMcdMonitorPharmacyDisplay = true;
          this.setMCDMonitorValidators();
        }
        else if (appointmentType.appointmentTypeName === 'MCD Monitoring - VOB') {
          this.showMcdMonitorVobDIsplay = true;
          this.setMCDMonitorVobValidators();
        }
        else if (appointmentType.appointmentTypeName === 'Premium Assist') {
          this.showPremiumAssistanceDisplay = true;
          this.premiumAssistValidators();
          this.maintainFormAppointment.get('appointmentStatusId').disable();
        }
      }
    }
    else {
      this.onResetAdvocacyType();
      this.showSubmitBtn = false;
    }
    this.isUpdate = false;

    this.fileAttachmentData = new FileAttachmentData();

    this.maintainFormAppointment.markAsUntouched();
    this.maintainFormAppointment.markAsPristine();
  }

  public findInvalidControls() {
    const invalidControls = [];
    const controls = this.maintainFormAppointment.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(name);
      }
    }
    console.log(invalidControls)
    return invalidControls;
  }

  onFileAttachmentsChanged(fileAttachmentData: FileAttachmentData) {
    this.fileAttachmentData = fileAttachmentData;
  }

  onSubmit() {
    this.submitted = true;
    this.findInvalidControls();

    if (this.maintainFormAppointment.invalid) {
      return false;
    }
    else {

      let appointment = this.maintainFormAppointment.getRawValue();

      appointment.modifiedBy = parseInt(localStorage.userId);
      appointment.patientId = this.formAdvocacy.value.patientId;

      appointment.facilityId = this.formAdvocacy.value.facilityId;
      appointment.advocacyId = this.formAdvocacy.value.advocacyId;

      let sDate = this.maintainFormAppointment.value.scheduledAppointmentDate;
      if (sDate != null) {
        appointment.scheduledAppointmentDate = new Date(sDate.year + '/' + sDate.month + '/' + sDate.day);
      }

      let infusedDate = this.maintainFormAppointment.value.dateInfused;
      if (infusedDate != null) {
        appointment.dateInfused = new Date(infusedDate.year + '/' + infusedDate.month + '/' + infusedDate.day);

      }
      let eobSGrantDate = this.maintainFormAppointment.value.eobSubmittedToGrantDate;
      if (eobSGrantDate != null) {
        appointment.eobSubmittedToGrantDate = new Date(eobSGrantDate.year + '/' + eobSGrantDate.month + '/' + eobSGrantDate.day);
      }

      let eobSInsDate = this.maintainFormAppointment.value.eobSubmittedToInsDate;
      if (eobSInsDate != null) {
        appointment.eobSubmittedToInsDate = new Date(eobSInsDate.year + '/' + eobSInsDate.month + '/' + eobSInsDate.day);
      }

      let eobRInsDate = this.maintainFormAppointment.value.eobReceivedFromInsDate;
      if (eobRInsDate != null) {
        appointment.eobReceivedFromInsDate = new Date(eobRInsDate.year + '/' + eobRInsDate.month + '/' + eobRInsDate.day);
      }

      let pNotifiedDate = this.maintainFormAppointment.value.patientNotifiedDate;
      if (pNotifiedDate != null) {
        appointment.patientNotifiedDate = new Date(pNotifiedDate.year + '/' + pNotifiedDate.month + '/' + pNotifiedDate.day);
      }


      let freeMedicationOrderedDate = this.maintainFormAppointment.value.freeMedicationOrdered;
      if (freeMedicationOrderedDate != null) {
        appointment.freeMedicationOrdered = new Date(freeMedicationOrderedDate.year + '/' + freeMedicationOrderedDate.month + '/' + freeMedicationOrderedDate.day);
      }

      let formDateAdvocacyReceived = this.maintainFormAppointment.value.dateAdvocacyReceived;
      if (formDateAdvocacyReceived != null) {
        appointment.dateAdvocacyReceived = new Date(formDateAdvocacyReceived.year + '/' + formDateAdvocacyReceived.month + '/' + formDateAdvocacyReceived.day);
      }

      let replacementOrderedDate = this.maintainFormAppointment.value.replacementOrdered;
      if (replacementOrderedDate != null) {
        appointment.replacementOrdered = new Date(replacementOrderedDate.year + '/' + replacementOrderedDate.month + '/' + replacementOrderedDate.day);
      }

      let replamentReceivedDate = this.maintainFormAppointment.value.replacementReceived;
      if (replamentReceivedDate != null) {
        appointment.replacementReceived = new Date(replamentReceivedDate.year + '/' + replamentReceivedDate.month + '/' + replamentReceivedDate.day);
      }

      let eobSubmittedToCopayDate = this.maintainFormAppointment.value.eobSubmittedToCopayDate;
      if (eobSubmittedToCopayDate != null) {
        appointment.eobSubmittedToCopayDate = new Date(eobSubmittedToCopayDate.year + '/' + eobSubmittedToCopayDate.month + '/' + eobSubmittedToCopayDate.day);
      }

      let fupDate = this.maintainFormAppointment.value.followUpDate;
      if (fupDate != null) {
        appointment.followUpDate = new Date(fupDate.year + '/' + fupDate.month + '/' + fupDate.day);
      }

      if (appointment.patientNotified === "") {
        appointment.patientNotified = "U";
      }
      if (appointment.eobSubmittedToIns === "") {
        appointment.eobSubmittedToIns = "U";
      }
      if (appointment.eobSubmittedToGrant === "") {
        appointment.eobSubmittedToGrant = "U";
      }
      if (appointment.eobReceivedFromIns === "") {
        appointment.eobReceivedFromIns = "U";
      }
      if (appointment.prescriptionNumber == null) {
        appointment.prescriptionNumber = "";
      }

      if (appointment.frequency == null) {
        appointment.frequency = "";
      }

      if (appointment.dosage == null) {
        appointment.dosage = "";
      }

      if (appointment.notes == null) {
        appointment.notes = "";
      }

      appointment.appointmentStatusId = (appointment.appointmentStatusId == '') ? '1' : appointment.appointmentStatusId;

      this.showAppointmentGrid = false;
      if (this.isUpdate) {
        if (this.appointmentId != null) {
          appointment.appointmentId = this.appointmentId;
        }
        this.patientService.updateAppointment(appointment).subscribe(
          (result) => {
            this.isDirty = false;

            this.fileAttachmentService.postAttachments('appointmentId', result.appointmentId, this.fileAttachmentData).subscribe(
              (result) => {
                this.showGrid = false;
                this.isDirty = false;
                this.showAppointmentGrid = true;
                this.submitted = false;
                this.showSuccess('Updated appointment id: ' + appointment.appointmentId + ' successfully');
                if(!this.fileAttachmentData.deletedFilesList || this.fileAttachmentData.deletedFilesList.length ===0 ) {
                  this.resetAppointmentForm();
                }
                this.getAppointmentByPatientIdExcludeClosed(this.formAdvocacy.value.patientMrn, this.formAdvocacy.value.advocacyId);
                this.showClosedAppointments = false;

              },
              (err) => {
                console.log(err);
                this.showFailure('Save Attachment Failed!!');
              }
            );

            if (this.fileAttachmentData.deletedFilesList.length > 0) {
              this.fileAttachmentService.deleteAttachments('appointmentId', this.fileAttachmentData).subscribe(
                (result) => {
                  this.showGrid = false;
                  this.showAppointmentGrid = true;
                  this.submitted = false;
                  this.showSuccess('Updated appointment id: ' + appointment.appointmentId + ' successfully');
                  this.resetAppointmentForm();
                  this.getAppointmentByPatientIdExcludeClosed(this.formAdvocacy.value.patientMrn, this.formAdvocacy.value.advocacyId);
                  this.showClosedAppointments = false;

                },
                (err) => {
                  this.showFailure('Failed to delete the attachment!');
                  console.log(err);
                }
              );
              this.showSuccess('Updated appointment id: ' + appointment.appointmentId + ' successfully');
            }
            //no modifications on attachments, update success
            else if (!!result.appointmentId) {
              this.showSuccess('Updated appointment id: ' + appointment.appointmentId + ' successfully');
              this.resetAppointmentForm();
              this.getAppointmentByPatientIdExcludeClosed(this.formAdvocacy.value.patientMrn, this.formAdvocacy.value.advocacyId);
              this.showClosedAppointments = false;

            }

            this.submitted = false;
            this.isUpdate = false;
          },
          (err) => {
            this.showFailure('Update Failed!');
            console.log(err);
          }
        );
      } else {
        appointment.createdBy = parseInt(localStorage.userId);
        this.patientService.createAppointment(appointment).subscribe(
          (result) => {
            appointment.appointmentId = result.appointmentId;
            //add attachment
            if (this.fileAttachmentData.selectedFiles.length > 0) {
              let formData = new FormData();
              this.fileAttachmentData.selectedFiles.forEach(file => {
                formData.append('files', file.file, file.file.name);
              });
              formData.append('modifiedBy', localStorage.userId);
              formData.append('createdBy', localStorage.userId);
              formData.append('appointmentId', appointment.appointmentId);

              this.advocacyService.postAttachment(formData).subscribe(
                (result) => {
                  this.showGrid = false;
                  this.showAppointmentGrid = true;
                  this.submitted = false;
                  this.showSuccess('Created appointment id: ' + appointment.appointmentId + ' successfully');
                  this.resetAppointmentForm();
                  this.getAppointmentByPatientIdExcludeClosed(this.formAdvocacy.value.patientMrn, this.formAdvocacy.value.advocacyId);
                  this.showClosedAppointments = false;
                },
                (err) => {
                  console.log(err);
                  this.showFailure('Save Attachment Failed!!');
                }
              );
            }
            //no attachments create appointment success
            else if (result.appointmentId != null) {
              this.submitted = false;
              this.showAppointmentGrid = true;
              this.resetAppointmentForm();
              this.getAppointmentByPatientIdExcludeClosed(this.formAdvocacy.value.patientMrn, this.formAdvocacy.value.advocacyId);
              this.showClosedAppointments = false;
              this.showSuccess('Appointment Id #' + result.appointmentId + ' created successfully');
            }
          },
          (err) => {
            console.log(err);
            this.showFailure('Save Appointment Failed!!');
          }
        );
      }
    }
  }

  //This is to maintain the dropdown values with select option
  resetAppointmentForm() {
    this.maintainFormAppointment.reset({
      appointmentTypeId: '',
      appointmentStatusId: '',
      eobSubmittedToIns: '',
      eobReceivedFromIns: '',
      eobSubmittedToGrant: '',
      eobSubmittedToCopay: ''
    });

    this.fileAttachmentData = new FileAttachmentData();
    this.attachmentsLength = 0;

    this.isUpdate = false;
    this.maintainFormAppointment.markAsUntouched();
    this.maintainFormAppointment.markAsPristine();
  }

  resetAllFields() {
    //Commercial copay pharmacy
    this.maintainFormAppointment.get("prescriptionNumber").reset();
    this.maintainFormAppointment.get("frequency").reset();
    this.maintainFormAppointment.get("dosage").reset();
    this.maintainFormAppointment.get("appointmentStatusId").setValue('');
    this.maintainFormAppointment.get("scheduledAppointmentDate").reset();
    this.maintainFormAppointment.get("copayCovered").reset();
    this.maintainFormAppointment.get("copayRemaining").reset();
    this.maintainFormAppointment.get("notes").reset();

  }

  onResetSF() {
    this.formSearch.patchValue({
      facilityId: '',
      mrn: ''
    });

    this.formSearch.markAsPristine();
    this.submitted = false;
    this.showGrid = false;
    this.searched = false;
    this.showError = false;
  }

  returnToSearch() {
    this.showSearch = true
    this.showGrid = false;
    this.showAdvocacyMasterDetails = false;
    this.onSearchAdv();

  }


 getTeamMemberList() {

  this.userService.getBySystemId(this.systemId).subscribe(
    (result) => {
      this.teamMembers = result.filter(x => x.userRoleId == 4);
    });
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


