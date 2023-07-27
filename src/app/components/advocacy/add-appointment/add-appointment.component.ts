import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/common/services/http/http.service';
import { Router } from '@angular/router';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { alphaNumericSpaceDecimalValidator, alphaNumericSpaceValidator, amountValidator, createDateValidator, getDateRange, numberValidator } from 'src/app/common/utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { saveAs } from 'file-saver';
import { InputModalComponent } from '../../shared/input-modal/input-modal.component';
import {FileAttachmentData} from "../../shared/file-attachments/file-attachment-data";
import {FileAttachmentService} from "../../../common/services/http/file-attachment.service";
import { CommonService } from 'src/app/common/services/http/common.service';
import { UserService } from 'src/app/common/services/http/user.service';
import { FacilityService } from 'src/app/common/services/http/facility.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddAppointmentComponent implements OnInit {
  @ViewChild('advocacyTable') advocacyTable: Table;

  addFormAppointment: FormGroup;
  addFormSearchAdvocacy: FormGroup;
  addFormAdvocacy: FormGroup;
  facilities: any[];
  appointemntTypes: any[];
  addAdvocacyTypes: any[];
  icdList: any;
  drugList: any;
  submitted: boolean;
  teamMembers: any[];
  //advocacyStatuses: any[];
  advocacySearchParams: any;
  searchValue: any;
  pageNum: any;
  pageSize: any;
  orderBy: any;
  totalRecords: any;
  loading: boolean;
  datasource: any;
  defaultSort: any[] = ["advocacyId -1"];


  isUpdate: boolean;
  errorMessage: any;
  appointmentId: any;
  showError: boolean;
  showGrid: boolean;
  searchResult: any[];

  addAppointmentList: any[];
  addAppointmentStatusList: any[];

  showAdvocacyDetails: boolean;
  searched: boolean;

  showCommercialCopayVob: boolean;
  showEOBSubmited: boolean;
  showEOBReceived: boolean;
  showAddEobSubmitedDate: boolean;
  showEobReceivedDate: boolean;
  showFreeMedicationBeforeInfusion: boolean;
  showCommercialCopayPharmacy: boolean;
  showFreeMedicationAfterInfusion: boolean;
  showGrantVobDisplay: boolean;
  showAddGrantPharmacyDisplay: boolean;
  showMcdMonitorVobDIsplay: boolean;
  showMcdMonitorPharmacyDisplay: boolean;
  showPremiumAssistanceDisplay: boolean;
  showEobSubmittedToGrantDate: boolean;
  showPatientNotifiedDate: boolean;

  advocacyGridloading: boolean;
  advocacyDatasource: any;
  advocacySearchResult: any;
  advocacyTotalRecords: any;
  selectedAdvocacyId: any;
  selectedPatientMrn: any;

  appointmentGridloading: boolean;
  appointmentDatasource: any;
  addAppointmentSearchResult: any;
  appointmentTotalRecords: any;
  showAppointmentGrid: boolean = false;
  showClosedAppointments: boolean = false;
  showNoAppointsError: boolean = false;
  showSubmitBtn: boolean = false;
  activeState: boolean[] = [false, false, false];
  userId: any;
  systemId: number;

  fileAttachmentData: FileAttachmentData = new FileAttachmentData();

  attachmentsLength: number = 0;
  advocacyAttachments: any[] = [];

  showSearch: boolean = true;
  isDirty = false;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    private httpService: HttpService,
    private advocacyService: AdvocacyService,
    private patientService: PatientService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private fileAttachmentService: FileAttachmentService,
    private common: CommonService,
    private userService: UserService,
    private facilityService: FacilityService
  ) { }

  ngOnInit(): void {
    this.onSearch('');
    this.buildAddAppointmentForm();
    this.getFacilityList();
    this.getAppointmentTypes();
    this.buildAddAdvocayForm();
    this.getAppoitmentStatusList();
    this.getAdvocacyTypes();
    this.advocacyService.setAdvocacyInfo(null);
    this.userId = parseInt(localStorage.userId);
    this.addFormAppointment.valueChanges.subscribe( e => this.isDirty = true );
    this.addFormAppointment.get('eobSubmittedToIns').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.addFormAppointment.controls['eobSubmittedToInsDate'].enable();
      } else {
        this.addFormAppointment.controls['eobSubmittedToInsDate'].disable();
      }
    });

    this.addFormAppointment.get('eobReceivedFromIns').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.addFormAppointment.controls['eobReceivedFromInsDate'].enable();
      } else {
        this.addFormAppointment.controls['eobReceivedFromInsDate'].disable();
      }
    });

    this.addFormAppointment.get('eobSubmittedToGrant').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.addFormAppointment.controls['eobSubmittedToGrantDate'].enable();
      } else {
        this.addFormAppointment.controls['eobSubmittedToGrantDate'].disable();
      }
    });

    this.addFormAppointment.get('patientNotified').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.addFormAppointment.controls['patientNotifiedDate'].enable();
      } else {
        this.addFormAppointment.controls['patientNotifiedDate'].disable();
      }
    });
    this.addFormAppointment.get('eobSubmittedToCopay').valueChanges.subscribe((value) => {
      if (value == 'Y') {
        this.addFormAppointment.controls['eobSubmittedToCopayDate'].enable();
      } else {
        this.addFormAppointment.controls['eobSubmittedToCopayDate'].disable();
      }
    });
  }

  buildAddAdvocayForm() {
    this.addFormAdvocacy = this.formBuilder.group({
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
      attachment: { value: [], disabled: true }
    });
  }

  buildAddAppointmentForm() {
    this.addFormAppointment = this.formBuilder.group({
      appointmentTypeId: [''],
      scheduledAppointmentDate: [null],
      dateInfused: [null],
      frequency: [''],
      dosage: [''],
      appointmentStatusId: [''],
      unitsUsedAtInfusion: [0],
      pricePerUnitInfusion: [0],
      totalCostOfMedicationInfused: [{ value: 0, disabled: true }],
      freeMedicationOrdered: [null],
      dateAdvocacyReceived: [null, createDateValidator(getDateRange()["monthStart"], getDateRange()["monthEnd"])],
      prescriptionNumber: [''],
      copayCovered: ['', Validators.compose([Validators.pattern(/^[0-9]\d{0,7}(\.[0-9]{1,2})?$/)])],
      copayRemaining: ['', Validators.compose([Validators.pattern(/^[0-9]\d{0,7}(\.[0-9]{1,2})?$/)])],
      notes: [''],
      indicatedCopay: [''],
      replacementOrdered: [null],
      eobSubmittedToIns: [''],
      eobSubmittedToInsDate: { value: null, disabled: true },
      eobReceivedFromIns: [''],
      eobReceivedFromInsDate: { value: null, disabled: true },
      eobSubmittedToCopay: [''],
      eobSubmittedToCopayDate: { value: null, disabled: true },
      amountReceivedFromGrant: [''],
      amountReceivedFromCopay: [''],
      replacementReceived: [null],
      eobSubmittedToGrant: [''],
      eobSubmittedToGrantDate: { value: null, disabled: true },
      patientNotifiedDate: { value: null, disabled: true },
      patientNotified: [''],
      attachment1: [''],
      attachment2: [''],
      attachment3: [''],
      attachment4: [''],
      followUpDate: [null],
      teamMemberAssignedTo: ['']
    });
  }

  toggle(index: number) {
    // this.activeState[index] = !this.activeState[index];
    if (!this.activeState[index]) {
      this.activeState[index] = true;
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  get f() {
    return this.addFormAppointment != null ? this.addFormAppointment.controls : null;
  }
  get sf() { return this.addFormSearchAdvocacy != null ? this.addFormSearchAdvocacy.controls : null; }

  getFacilityList() {
    this.advocacyService.getFacilityList().subscribe(
      (result) => {
        this.facilities = result;
      }
    );
  }

  getAdvocacyTypes() {
    this.advocacyService.getAllAdvocacyTypes().subscribe(
      (result) => {
        this.addAdvocacyTypes = result;
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
    var unitsUsed = this.addFormAppointment.value.unitsUsedAtInfusion;
    var costPerUnit = this.addFormAppointment.value.pricePerUnitInfusion;
    var totalCost = unitsUsed * costPerUnit;
    if (totalCost > 0) {
      this.addFormAppointment.patchValue({
        totalCostOfMedicationInfused: totalCost
      });

    }
  }


  public onShowClosedChanged(value:boolean){
      this.showClosedAppointments = value;
      if (this.showClosedAppointments){
        this.getAppointmentByPatientId(this.selectedPatientMrn, this.selectedAdvocacyId);
      }else {
        this.getAppointmentByPatientIdExcludeClosed(this.selectedPatientMrn, this.selectedAdvocacyId);
      }
  }
  getAppoitmentStatusList() {
    this.advocacyService.getAllAppointmentStatus().subscribe(
      (result) => {
        this.addAppointmentStatusList = result;
      }
    );
  }

  loadAppointmentDetails(event: LazyLoadEvent) {
    this.appointmentGridloading = true;
    setTimeout(() => {
      if (this.appointmentDatasource) {
        this.addAppointmentSearchResult = this.appointmentDatasource.slice(event.first, (event.first + event.rows));
        this.appointmentGridloading = false;
      }
    }, 500);
  }

  getAppointmentByPatientIdExcludeClosed(patientMrn, advocacyId){
    this.selectedPatientMrn = patientMrn;
      this.selectedAdvocacyId = advocacyId;
        //this.showAppointmentGrid = false;
        this.patientService.getAppointmentByPatientIdExcludeClosed(advocacyId).subscribe(
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
  getAppointmentByPatientId(patientMrn, advocacyId) {
  this.selectedPatientMrn = patientMrn;
  this.selectedAdvocacyId = advocacyId;
    //this.showAppointmentGrid = false;
    this.patientService.getAppointmentByPatientId(advocacyId).subscribe(
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
        let mediaType = response.type;
        let blob = new Blob([response], { type: mediaType });
        var url = window.URL.createObjectURL(blob);
        if (mediaType == 'application/pdf' || mediaType == 'image/jpeg' || mediaType == 'image/png') {
          window.open(url);
        } else {
          saveAs(blob, name);
        }
      }, err => {
        this.showFailure('Failed to Open the file!');
      });
  }

  onEobSubmited(value) {
    if (value === 'Y') {
      this.showAddEobSubmitedDate = true;
    } else {
      this.showAddEobSubmitedDate = false;
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

  /* onSearch(val) {
    this.loadSearchResults(val)
  } */

  onSearch(val) {
      this.searchValue = val;
      this.updateTable();
    }

loadAdvocacyMasterList(event: LazyLoadEvent) {

    this.pageNum = event.first/event.rows;
    this.advocacySearchParams.pageNum = this.pageNum;
    this.pageSize = event.rows;
    this.advocacySearchParams.pageSize = this.pageSize;

    let multiSortMeta = event.multiSortMeta;
    if(multiSortMeta) {
    this.orderBy = multiSortMeta.map(sort => sort.field + " " + sort.order);
      this.advocacySearchParams.orderBy = this.orderBy ;
    }
    else {
      this.orderBy = this.defaultSort;
      this.advocacySearchParams.orderBy = this.defaultSort;
    }

    this.updateTable();
  }

  updateTable() {
    this.loading = true;
    if(this)
    //this.advocacySearchParams. = this.searchValue;

    this.advocacySearchParams = {
            'advocacySearchParam': this.searchValue != null ? this.searchValue : '',
            'pageNum': this.pageNum? this.pageNum : 0,
            'pageSize': this.pageSize? this.pageSize : 3,
            'orderBy':this.orderBy? this.orderBy:this.defaultSort
          }
    this.advocacyService.getPagedAdvocaciesBySearchParam(this.advocacySearchParams).subscribe((data) => {
      this.datasource = data.content;
      this.totalRecords = data.totalElements;
      this.loading = false;
    })
  }
  /*loadSearchResults(val) {
    this.showGrid = false;
    this.advocacyGridloading = true;
    this.showError = false;
    this.advocacyService.SearchForAdvocacies(val).subscribe((data) => {
      if (data.length > 0) {
        this.showGrid = true;
        this.advocacyDatasource = data;
        this.advocacyTotalRecords = data.length;
        this.advocacyGridloading = false;
      }
      else {
        this.showGrid = false;
        this.showError = true;
      }
    });
  }*/

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

   this.patientService.getAdvocacyById(advocacy.advocacyId).subscribe(
         (result) => {
           /* istanbul ignore else */
           if (result) {
             var startDate = new Date(result.startDate);
                 var sDate = result.startDate != null ? { year: startDate.getUTCFullYear(), month: startDate.getUTCMonth() + 1, day: startDate.getUTCDate() } : advocacy.startDate;

                 var endDate = new Date(result.endDate);
                 var eDate = result.endDate != null ? { year: endDate.getUTCFullYear(), month: endDate.getUTCMonth() + 1, day: endDate.getUTCDate() } : advocacy.endDate;

                 var lookBackStartDate = new Date(result.lookBackStartDate);
                 var lStartDate = result.lookBackStartDate != null ? { year: lookBackStartDate.getUTCFullYear(), month: lookBackStartDate.getUTCMonth() + 1, day: lookBackStartDate.getUTCDate() } : advocacy.lookBackStartDate;

                 this.addFormAdvocacy.patchValue({
                   patientMrn: result.patientMrn,
                   facilityId: result.facilityId,
                   facilityName: result.facilityName,
                   advocacyId: result.advocacyId,
                   patientId: result.patientId,
                   advocacyStatusName: result.advocacyStatusName,
                   advocacyStatusId: result.advocacyStatusId,
                   advocacyTypeId: result.advocacyTypeId,
                   advocacyTypeName: result.advocacyTypeName,
                   advocacySource: result.advocacySource,
                   diagnosisCode: result.icdCode + ' - ' + result.icdDescription,
                   drugForAdvocacy: result.drugProcCode + ' - ' + result.drugShortDesc,
                   startDate: sDate,
                   endDate: eDate,
                   maxAmountAvail: result.maxAmountAvail,
                   lookBack: result.lookBack,
                   lookBackStartDate: lStartDate,
                   notes: result.notes
                 });
                 this.advocacyAttachments = result.attachments;

                 this.showAdvocacyDetails = true;
                 this.getAppointmentByPatientIdExcludeClosed(advocacy.patientMrn, advocacy.advocacyId);
                 this.showClosedAppointments = false;

                 this.router.navigate(['/dashboard/advocacy/addAppointment']);
                 this.showGrid = false;
                 this.showSearch = false;

                 this.facilityService.getById(advocacy.facilityId).subscribe((res) => {
                   this.systemId = res.systemId;
                   this.getTeamMemberList();
                 })
           }
         }
       );

  }

  showAdvocacies() {
    this.showGrid = true;
    this.showAppointmentGrid = false;
    this.showSearch = true;
    this.onSearch('');
  }

  onEditAppointment(appointment) {
    //this.filesList = [];
    this.attachmentsLength = appointment.attachments.length;
    var scheduledAppointmentDate = new Date(appointment.scheduledAppointmentDate);
    var saDate = appointment.scheduledAppointmentDate != null ? { year: scheduledAppointmentDate.getUTCFullYear(), month: scheduledAppointmentDate.getUTCMonth() + 1, day: scheduledAppointmentDate.getUTCDate() } : appointment.scheduledAppointmentDate;

    var dateInfused = new Date(appointment.dateInfused);
    var infusedDate = appointment.dateInfused != null ? { year: dateInfused.getUTCFullYear(), month: dateInfused.getUTCMonth() + 1, day: dateInfused.getUTCDate() } : appointment.dateInfused;

    var eobReceivedFromInsDate = new Date(appointment.eobReceivedFromInsDate);
    var eReceivedDate = appointment.eobReceivedFromInsDate != null ? { year: eobReceivedFromInsDate.getUTCFullYear(), month: eobReceivedFromInsDate.getUTCMonth() + 1, day: eobReceivedFromInsDate.getUTCDate() } : appointment.eobReceivedFromInsDate;

    var eobSubmittedToInsDate = new Date(appointment.eobSubmittedToInsDate);
    var eSubmittedToInsDate = appointment.eobSubmittedToInsDate != null ? { year: eobSubmittedToInsDate.getUTCFullYear(), month: eobSubmittedToInsDate.getUTCMonth() + 1, day: eobSubmittedToInsDate.getUTCDate() } : appointment.eobSubmittedToInsDate;

    var eobSubmittedToGrantDate = new Date(appointment.eobSubmittedToGrantDate);
    var eSubmittedToGrantDate = appointment.eobSubmittedToGrantDate != null ? { year: eobSubmittedToGrantDate.getUTCFullYear(), month: eobSubmittedToGrantDate.getUTCMonth() + 1, day: eobSubmittedToGrantDate.getUTCDate() } : appointment.eobSubmittedToGrantDate;

    var patientNotifiedDate = new Date(appointment.patientNotifiedDate);
    var pNotifiedDate = appointment.patientNotifiedDate != null ? { year: patientNotifiedDate.getUTCFullYear(), month: patientNotifiedDate.getUTCMonth() + 1, day: patientNotifiedDate.getUTCDate() } : appointment.patientNotifiedDate;

    var freeMedicationOrdered = new Date(appointment.freeMedicationOrdered);
    var freeMedicationOrderedDate = appointment.freeMedicationOrdered != null ? { year: freeMedicationOrdered.getUTCFullYear(), month: freeMedicationOrdered.getUTCMonth() + 1, day: freeMedicationOrdered.getUTCDate() } : appointment.freeMedicationOrdered;

    var dateAdvocacyReceived = new Date(appointment.dateAdvocacyReceived);
    var formDateAdvocacyReceived = appointment.dateAdvocacyReceived != null ? { year: dateAdvocacyReceived.getUTCFullYear(), month: dateAdvocacyReceived.getUTCMonth() + 1, day: dateAdvocacyReceived.getUTCDate() } : appointment.dateAdvocacyReceived;

    var replacementOrdered = new Date(appointment.replacementOrdered);
    var replacementOrderedDate = appointment.replacementOrdered != null ? { year: replacementOrdered.getUTCFullYear(), month: replacementOrdered.getUTCMonth() + 1, day: replacementOrdered.getUTCDate() } : appointment.replacementOrdered;

    var replacementReceived = new Date(appointment.replacementReceived);
    var replamentReceivedDate = appointment.replacementReceived != null ? { year: replacementReceived.getUTCFullYear(), month: replacementReceived.getUTCMonth() + 1, day: replacementReceived.getUTCDate() } : appointment.replacementReceived;

    var eobSubmittedToCopayDate = new Date(appointment.eobSubmittedToCopayDate);
    var eSubmittedToCopayDate = appointment.eobSubmittedToCopayDate != null ? { year: eobSubmittedToCopayDate.getUTCFullYear(), month: eobSubmittedToCopayDate.getUTCMonth() + 1, day: eobSubmittedToCopayDate.getUTCDate() } : appointment.eobSubmittedToCopayDate;

    var followUpDt = new Date(appointment.followUpDate);
    var fDate = appointment.followUpDate != null ? { year: followUpDt.getUTCFullYear(), month: followUpDt.getUTCMonth() + 1, day: followUpDt.getUTCDate() } : appointment.followUpDate;

    this.addFormAppointment.patchValue(
      {
        appointmentTypeId: appointment.appointmentTypeId,
        scheduledAppointmentDate: saDate,
        dateInfused: infusedDate,
        frequency: appointment.frequency,
        dosage: appointment.dosage,
        appointmentStatusId: appointment.appointmentStatusId,
        unitsUsedAtInfusion: appointment.unitsUsedAtInfusion,
        pricePerUnitInfusion: appointment.pricePerUnitInfusion,
        totalCostOfMedicationInfused: appointment.totalCostOfMedicationInfused,
        freeMedicationOrdered: freeMedicationOrderedDate,
        dateAdvocacyReceived: formDateAdvocacyReceived,
        prescriptionNumber: appointment.prescriptionNumber,
        copayCovered: appointment.copayCovered,
        copayRemaining: appointment.copayRemaining,
        notes: appointment.notes,
        eobSubmittedToIns: appointment.eobSubmittedToIns == 'U' ? '' : appointment.eobSubmittedToIns,
        eobSubmittedToInsDate: eSubmittedToInsDate,
        eobReceivedFromIns: appointment.eobReceivedFromIns == 'U' ? '' : appointment.eobReceivedFromIns,
        eobReceivedFromInsDate: eReceivedDate,
        eobSubmittedToCopay: appointment.eobSubmittedToCopay == 'U' ? '' : appointment.eobSubmittedToCopay,
        eobSubmittedToCopayDate: eSubmittedToCopayDate,
        amountReceivedFromGrant: appointment.amountReceivedFromGrant,
        eobSubmittedToGrant: appointment.eobSubmittedToGrant == 'U' ? '' : appointment.eobSubmittedToGrant,
        eobSubmittedToGrantDate: eSubmittedToGrantDate,
        patientNotifiedDate: pNotifiedDate,
        patientNotified: appointment.patientNotified == 'U' ? '' : appointment.patientNotified,
        indicatedCopay: appointment.indicatedCopay,
        amountReceivedFromCopay: appointment.amountReceivedFromCopay,
        replacementOrdered: replacementOrderedDate,
        replacementReceived: replamentReceivedDate,
        followUpDate: fDate,
        teamMemberAssignedTo: appointment.teamMemberAssignedTo
      }
    );
    this.isUpdate = true;
    this.appointmentId = appointment.appointmentId;
    this.onEobReceived(appointment.eobReceivedFromIns);
    this.onEobSubmited(appointment.eobSubmittedToIns);
    this.onEobSubmittedToGrantDate(appointment.eobSubmittedToGrant);
    this.onPatientNotified(appointment.onPatientNotified);
    this.fileAttachmentData = new FileAttachmentData();
    appointment.attachments.forEach(attachment => {
      this.fileAttachmentData.filesList.push({ name: attachment.attachmentPath, attachmentId: attachment.appointmentAttachmentId, active: attachment.active });
    });
    this.router.navigate(['/dashboard/advocacy/addAppointment']);
  }

  onDeleteAppointment(appointmentId) {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "delete";
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
    this.patientService.deleteAppointmentById(params).subscribe(
      (result) => {
        this.showSuccess('Deleted appointment id: ' + appointmentId + ' successfully');
        this.getAppointmentByPatientIdExcludeClosed(this.addFormAdvocacy.value.patientMrn, this.addFormAdvocacy.value.advocacyId);
        this.showClosedAppointments = false;
        this.resetAppointmentForm();
      },
      (err) => {
        this.showFailure('Delete Failed!')
        this.showAppointmentGrid = true;
        this.errorMessage = err;
      }
    );
  }

  rejectDelete(appointment) {
    const appointmentId = appointment.appointmentId;
    const modal = this.ngbModal.open(InputModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.label = "Reason for Rejection";
    modal.componentInstance.buttonText = 'Submit';
    modal.componentInstance.title = 'Reject external customers delete request';
    modal.componentInstance.confirm.subscribe((notes) => {
      appointment.externalCustomerRequestedToDelete = "R";
      appointment.rejectedReasonNotes = notes;

      this.patientService.rejectRequestToDelete(appointment).subscribe(
        (result) => {
          this.showSuccess('Rejected delete request for appointment id: ' + appointmentId);
          this.getAppointmentByPatientIdExcludeClosed(this.addFormAdvocacy.value.patientMrn, this.addFormAdvocacy.value.advocacyId);
          this.showClosedAppointments = false;
          this.resetAppointmentForm();
        },
        (err) => {
          this.showFailure('Failed to reject the request to delete for appointment id: ' + appointmentId);
          this.showAppointmentGrid = true;
          this.errorMessage = err;
        }
      );
    });
  }

  onResetAdvocacyType() {
    this.showCommercialCopayVob = false;
    this.showCommercialCopayPharmacy = false;
    this.showFreeMedicationBeforeInfusion = false;
    this.showFreeMedicationAfterInfusion = false;
    this.showAddGrantPharmacyDisplay = false;
    this.showGrantVobDisplay = false;
    this.showMcdMonitorPharmacyDisplay = false;
    this.showMcdMonitorVobDIsplay = false;
    this.showPremiumAssistanceDisplay = false;
  }

  OnClearAppointmentFields() {
    this.addFormAppointment.patchValue(
      {
        scheduledAppointmentDate: null,
        dateInfused: null,
        frequency: '',
        dosage: '',
        appointmentStatusId: '',
        unitsUsedAtInfusion: '',
        pricePerUnitInfusion: '',
        totalCostOfMedicationInfused: '',
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
        teamMemberAssignedTo: ''
      }
    );
  }
  // Commercial Copay - Pharmacy
  setCommercialCoPayPharmacyValidators() {
    this.addFormAppointment.get('frequency').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);

    this.addFormAppointment.get('dosage').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);

    this.addFormAppointment.get('prescriptionNumber').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('appointmentStatusId').setValidators(Validators.required);
    this.addFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator))
  }

  //Commercial Copay - VOB
  setCommercialCoPayVobValidators() {
    this.addFormAppointment.get('frequency').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);

    this.addFormAppointment.get('dosage').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);

    this.addFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);
    this.addFormAppointment.get('indicatedCopay').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('amountReceivedFromGrant').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('amountReceivedFromCopay').setValidators(Validators.pattern(amountValidator));
  }

  //Free Medication after infusion
  setFreeMedicationAfterInfusionValidators() {
    this.addFormAppointment.get('frequency').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);

    this.addFormAppointment.get('dosage').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);

    this.addFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);

    this.addFormAppointment.get('unitsUsedAtInfusion').setValidators([Validators.required,
    Validators.pattern(numberValidator), Validators.maxLength(10)]);

    this.addFormAppointment.get('pricePerUnitInfusion').setValidators([Validators.required,
    Validators.pattern(amountValidator)]);

    this.addFormAppointment.get('totalCostOfMedicationInfused').setValidators(Validators.pattern(amountValidator));


  }

  //Free Medication before infusion
  setFreeMedicationBeforeInfusionValidators() {
    this.addFormAppointment.get('frequency').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('dosage').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);
    this.addFormAppointment.get('totalCostOfMedicationInfused').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('unitsUsedAtInfusion').setValidators([
      Validators.pattern(numberValidator), Validators.maxLength(10)]);

    this.addFormAppointment.get('pricePerUnitInfusion').setValidators([
      Validators.pattern(amountValidator)]);
  }

  //Grant Pharmacy
  setGrantPharmacyValidators() {
    this.addFormAppointment.get('prescriptionNumber').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('frequency').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('dosage').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator));
  }
  //Grant vob
  setGrantVobValidators() {
    this.addFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);
    this.addFormAppointment.get('frequency').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('dosage').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('amountReceivedFromGrant').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('indicatedCopay').setValidators(Validators.pattern(amountValidator));
  }
  //MCD monitor
  setMCDMonitorValidators() {
    this.addFormAppointment.get('frequency').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('dosage').setValidators([Validators.required, Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);
    this.addFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('prescriptionNumber').setValidators([Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);
  }
  //MCD monitor
  premiumAssistValidators() {
    this.addFormAppointment.get('patientNotified').setValidators(Validators.required);
  }
  //MCD monitoring Vob
  setMCDMonitorVobValidators() {
    this.addFormAppointment.get('frequency').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceValidator), Validators.maxLength(50)]);

    this.addFormAppointment.get('dosage').setValidators([Validators.required,
    Validators.pattern(alphaNumericSpaceDecimalValidator), Validators.maxLength(50)]);

    this.addFormAppointment.get('scheduledAppointmentDate').setValidators(Validators.required);
    this.addFormAppointment.get('indicatedCopay').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('copayCovered').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('copayRemaining').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('amountReceivedFromCopay').setValidators(Validators.pattern(amountValidator));
    this.addFormAppointment.get('amountReceivedFromGrant').setValidators(Validators.pattern(amountValidator));
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
      this.ClearAllValidators(this.addFormAppointment);
      this.OnClearAppointmentFields();
      this.submitted = false;
      this.showSubmitBtn = true;
      var addAppointmentType = this.appointemntTypes.filter(x => x.appointmentTypeId == appointmentTypeId)[0];
      if (addAppointmentType != null) {
        this.onResetAdvocacyType();
        if (addAppointmentType.appointmentTypeName == 'Commercial Copay - Pharmacy') {
          this.showCommercialCopayPharmacy = true;
          this.setCommercialCoPayPharmacyValidators();
        }
        else if (addAppointmentType.appointmentTypeName == 'Commercial Copay - VOB') {
          this.showCommercialCopayVob = true;
          this.setCommercialCoPayVobValidators();
        }
        else if (addAppointmentType.appointmentTypeName == 'Free Medication - After Infusion') {
          this.showFreeMedicationAfterInfusion = true;
          this.setFreeMedicationAfterInfusionValidators();
        }
        else if (addAppointmentType.appointmentTypeName === 'Free Medication - Before Infusion') {
          this.showFreeMedicationBeforeInfusion = true;
          this.setFreeMedicationBeforeInfusionValidators();
        }
        else if (addAppointmentType.appointmentTypeName === 'Grant - VOB') {
          this.showGrantVobDisplay = true;
          this.setGrantVobValidators();
        }
        else if (addAppointmentType.appointmentTypeName === 'Grant - Pharmacy') {
          this.showAddGrantPharmacyDisplay = true;
          this.setGrantPharmacyValidators();
        }
        else if (addAppointmentType.appointmentTypeName === 'MCD Monitoring - Pharmacy') {
          this.showMcdMonitorPharmacyDisplay = true;
          this.setMCDMonitorValidators();
        }
        else if (addAppointmentType.appointmentTypeName === 'MCD Monitoring - VOB') {
          this.showMcdMonitorVobDIsplay = true;
          this.setMCDMonitorVobValidators();
        }
        else if (addAppointmentType.appointmentTypeName === 'Premium Assist') {
          this.showPremiumAssistanceDisplay = true;
          this.premiumAssistValidators();
        }
      }
    }
    else {
      this.onResetAdvocacyType();
      this.showSubmitBtn = false;
    }
    this.isUpdate = false;

    this.fileAttachmentData = new FileAttachmentData();

    this.addFormAppointment.markAsUntouched();
    this.addFormAppointment.markAsPristine();
  }

  public findInvalidControls() {
    const invalidControls = [];
    const controls = this.addFormAppointment.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(name);
      }
    }
    return invalidControls;
  }

  onFileAttachmentsChanged(fileAttachmentData: FileAttachmentData) {
    this.fileAttachmentData = fileAttachmentData;
  }

  onSubmit() {
    this.submitted = true;
    this.findInvalidControls();

    if (this.addFormAppointment.invalid) {
      return false;
    }
    else {
      // let appointment = this.addFormAppointment.value;
      //adding this to read disabled field values
      let appointmentinfo = this.addFormAppointment.getRawValue();
      appointmentinfo.modifiedBy = parseInt(localStorage.userId);
      appointmentinfo.patientId = this.addFormAdvocacy.value.patientId;

      appointmentinfo.facilityId = this.addFormAdvocacy.value.facilityId;
      appointmentinfo.advocacyId = this.addFormAdvocacy.value.advocacyId;

      let sDate = this.addFormAppointment.value.scheduledAppointmentDate;
      if (sDate != null) {
        appointmentinfo.scheduledAppointmentDate = new Date(sDate.year + '/' + sDate.month + '/' + sDate.day);
      }

      let infusedDate = this.addFormAppointment.value.dateInfused;
      if (infusedDate != null) {
        appointmentinfo.dateInfused = new Date(infusedDate.year + '/' + infusedDate.month + '/' + infusedDate.day);

      }
      let eobSGrantDate = this.addFormAppointment.value.eobSubmittedToGrantDate;
      if (eobSGrantDate != null) {
        appointmentinfo.eobSubmittedToGrantDate = new Date(eobSGrantDate.year + '/' + eobSGrantDate.month + '/' + eobSGrantDate.day);
      }

      let eobSInsDate = this.addFormAppointment.value.eobSubmittedToInsDate;
      if (eobSInsDate != null) {
        appointmentinfo.eobSubmittedToInsDate = new Date(eobSInsDate.year + '/' + eobSInsDate.month + '/' + eobSInsDate.day);
      }

      let eobRInsDate = this.addFormAppointment.value.eobReceivedFromInsDate;
      if (eobRInsDate != null) {
        appointmentinfo.eobReceivedFromInsDate = new Date(eobRInsDate.year + '/' + eobRInsDate.month + '/' + eobRInsDate.day);
      }

      let pNotifiedDate = this.addFormAppointment.value.patientNotifiedDate;
      if (pNotifiedDate != null) {
        appointmentinfo.patientNotifiedDate = new Date(pNotifiedDate.year + '/' + pNotifiedDate.month + '/' + pNotifiedDate.day);
      }


      let freeMedicationOrderedDate = this.addFormAppointment.value.freeMedicationOrdered;
      if (freeMedicationOrderedDate != null) {
        appointmentinfo.freeMedicationOrdered = new Date(freeMedicationOrderedDate.year + '/' + freeMedicationOrderedDate.month + '/' + freeMedicationOrderedDate.day);
      }

      let formDateAdvocacyReceived = this.addFormAppointment.value.dateAdvocacyReceived;
      if (formDateAdvocacyReceived != null) {
        appointmentinfo.dateAdvocacyReceived = new Date(formDateAdvocacyReceived.year + '/' + formDateAdvocacyReceived.month + '/' + formDateAdvocacyReceived.day);
      }

      let replacementOrderedDate = this.addFormAppointment.value.replacementOrdered;
      if (replacementOrderedDate != null) {
        appointmentinfo.replacementOrdered = new Date(replacementOrderedDate.year + '/' + replacementOrderedDate.month + '/' + replacementOrderedDate.day);
      }

      let replamentReceivedDate = this.addFormAppointment.value.replacementReceived;
      if (replamentReceivedDate != null) {
        appointmentinfo.replacementReceived = new Date(replamentReceivedDate.year + '/' + replamentReceivedDate.month + '/' + replamentReceivedDate.day);
      }

      let eobSubmittedToCopayDate = this.addFormAppointment.value.eobSubmittedToCopayDate;
      if (eobSubmittedToCopayDate != null) {
        appointmentinfo.eobSubmittedToCopayDate = new Date(eobSubmittedToCopayDate.year + '/' + eobSubmittedToCopayDate.month + '/' + eobSubmittedToCopayDate.day);
      }

      let fupDate = this.addFormAppointment.value.followUpDate;
      if (fupDate != null) {
        appointmentinfo.followUpDate = new Date(fupDate.year + '/' + fupDate.month + '/' + fupDate.day);
      }

      if (appointmentinfo.patientNotified === "") {
        appointmentinfo.patientNotified = "U";
      }
      if (appointmentinfo.eobSubmittedToIns === "") {
        appointmentinfo.eobSubmittedToIns = "U";
      }
      if (appointmentinfo.eobSubmittedToGrant === "") {
        appointmentinfo.eobSubmittedToGrant = "U";
      }
      if (appointmentinfo.eobReceivedFromIns === "") {
        appointmentinfo.eobReceivedFromIns = "U";
      }
      if (appointmentinfo.prescriptionNumber == null) {
        appointmentinfo.prescriptionNumber = "";
      }

      if (appointmentinfo.frequency == null) {
        appointmentinfo.frequency = "";
      }

      if (appointmentinfo.dosage == null) {
        appointmentinfo.dosage = "";
      }

      if (appointmentinfo.notes == null) {
        appointmentinfo.notes = "";
      }

      appointmentinfo.appointmentStatusId = (appointmentinfo.appointmentStatusId == '') ? '1' : appointmentinfo.appointmentStatusId;

      this.showAppointmentGrid = false;
      if (this.isUpdate) {
        if (this.appointmentId != null) {
          appointmentinfo.appointmentId = this.appointmentId;
        }
        this.patientService.updateAppointment(appointmentinfo).subscribe(
          (result) => {
            this.isDirty = false;

            this.fileAttachmentService.postAttachments('appointmentId', result.appointmentId, this.fileAttachmentData).subscribe(
              (result) => {
                this.showGrid = false;
                this.isDirty = false;
                this.showAppointmentGrid = true;
                this.submitted = false;
                this.showSuccess('Updated appointment id: ' + appointmentinfo.appointmentId + ' successfully');
                this.getAppointmentByPatientIdExcludeClosed(this.addFormAdvocacy.value.patientMrn, this.addFormAdvocacy.value.advocacyId);
                this.showClosedAppointments = false;
              },
              (err) => {
                this.showFailure('Save Attachment Failed!!');
              }
            );

            if (this.fileAttachmentData.deletedFilesList.length > 0) {
              this.fileAttachmentService.deleteAttachments('appointmentId', this.fileAttachmentData).subscribe(
                (result) => {
                  this.showGrid = false;
                  this.isDirty = false;
                  this.showAppointmentGrid = true;
                  this.submitted = false;
                  this.showSuccess('Updated appointment id: ' + appointmentinfo.appointmentId + ' successfully');
                  this.getAppointmentByPatientIdExcludeClosed(this.addFormAdvocacy.value.patientMrn, this.addFormAdvocacy.value.advocacyId);
                  this.showClosedAppointments = false;

                },
                (err) => {
                  this.showFailure('Failed to delete the attachment!');
                }
              );
              this.showSuccess('Updated appointment id: ' + appointmentinfo.appointmentId + ' successfully');
            }
            //no modifications on attachments, update success
            else if (!!result.appointmentId) {
              this.showSuccess('Updated appointment id: ' + appointmentinfo.appointmentId + ' successfully');
              this.resetAppointmentForm();
              this.getAppointmentByPatientIdExcludeClosed(this.addFormAdvocacy.value.patientMrn, this.addFormAdvocacy.value.advocacyId);
              this.showClosedAppointments = false;
            }

            this.submitted = false;
            this.resetAppointmentForm();
          },
          (err) => {
            this.showFailure('Update Failed!');
          }
        );
      } else {
        appointmentinfo.createdBy = parseInt(localStorage.userId);
        this.patientService.createAppointment(appointmentinfo).subscribe(
          (result) => {
            appointmentinfo.appointmentId = result.appointmentId;
            if (this.fileAttachmentData.selectedFiles.length > 0) {
              this.fileAttachmentService.postAttachments('appointmentId', result.appointmentId, this.fileAttachmentData).subscribe(
                (result) => {
                  this.showGrid = false;
                  this.showAppointmentGrid = true;
                  this.submitted = false;
                  this.showSuccess('Created appointment id: ' + appointmentinfo.appointmentId + ' successfully');
                  this.resetAppointmentForm();
                  this.getAppointmentByPatientIdExcludeClosed(this.addFormAdvocacy.value.patientMrn, this.addFormAdvocacy.value.advocacyId);
                  this.showClosedAppointments = false;
                  //this.filesList = [];
                },
                (err) => {
                  this.showFailure('Save Attachment Failed!!');
                }
              );
            }
            //no attachments create appointment success
            else if (result.appointmentId != null) {
              this.submitted = false;
              this.showAppointmentGrid = true;
              this.resetAppointmentForm();
              this.getAppointmentByPatientIdExcludeClosed(this.addFormAdvocacy.value.patientMrn, this.addFormAdvocacy.value.advocacyId);
              this.showClosedAppointments = false;

              this.showSuccess('Appointment Id #' + result.appointmentId + ' created successfully');
              //this.filesList = [];
            }
          },
          (err) => {
            this.showFailure('Save Appointment Failed!!');
          }
        );
      }
    }
  }

  //This is to maintain the dropdown values with select option
  resetAppointmentForm() {
    this.addFormAppointment.reset({
      appointmentTypeId: '',
      appointmentStatusId: '',
      eobSubmittedToIns: '',
      eobReceivedFromIns: '',
      eobSubmittedToGrant: '',
      eobSubmittedToCopay: '',
    });

    this.fileAttachmentData = new FileAttachmentData();
    this.attachmentsLength = 0;

    this.isUpdate = false;
    this.addFormAppointment.markAsUntouched();
    this.addFormAppointment.markAsPristine();
  }

  resetAllFields() {
    //Commercial copay pharmacy
    this.addFormAppointment.get("prescriptionNumber").reset();
    this.addFormAppointment.get("frequency").reset();
    this.addFormAppointment.get("dosage").reset();
    this.addFormAppointment.get("appointmentStatusId").setValue('');
    this.addFormAppointment.get("scheduledAppointmentDate").reset();
    this.addFormAppointment.get("copayCovered").reset();
    this.addFormAppointment.get("copayRemaining").reset();
    this.addFormAppointment.get("notes").reset();

  }
  getTeamMemberList() {
    this.userService.getBySystemId(this.systemId).subscribe(
      (result) => {
        this.teamMembers = result;
        this.userService.getInternalUsers().subscribe((result) => {
          this.teamMembers = this.teamMembers.concat(result);
        })
      },
      (err) => { }
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


