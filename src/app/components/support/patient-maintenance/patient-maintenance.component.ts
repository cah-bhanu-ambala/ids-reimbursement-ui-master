import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpService } from 'src/app/common/services/http/http.service';
import { Facility } from 'src/app/models/classes/facility';
import { Patient } from 'src/app/models/classes/patient';
import { ActivatedRoute, Router } from '@angular/router';
import { alphaNumericValidator, amountValidator } from 'src/app/common/utils';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerWorkitemService } from 'src/app/common/services/http/customer-workitem.service';
import { CustomerWorkItem } from 'src/app/models/classes/customer-work-item';
import { CommonService } from 'src/app/common/services/http/common.service';
import * as logoFile from 'src/app/components/reports/billing/logo.js';
import { Workbook } from 'exceljs';
import * as moment from 'moment';
import * as fs from 'file-saver';


@Component({
  selector: 'app-patient-maintenance',
  templateUrl: './patient-maintenance.component.html',
  styleUrls: ['./patient-maintenance.component.scss']
})
export class PatientMaintenanceComponent implements OnInit {

  formPatient: FormGroup;
  formSearchPatient: FormGroup;
  patientSearchParam: any;
  facilities: Facility[];
  submitted: boolean;
  insuranceList: any[];
  isUpdate: boolean;
  patient: Patient;
  showGrid: boolean;
  primaryInsuranceList: any[];
  secondaryInsuranceList: any[];
  contactStatuses: any;
  outcomes: any;
  searchResult: any;
  patientId: any;
  showError: boolean;
  searched: boolean;
  secondOutcomes: any;
  thirdOutcomes: any;
  errorMessage: any;
  showForm: boolean = true;
  patientGridloading: boolean;
  patientDatasource: any;
  patientSearchResult: any;
  patientTotalRecords: any;
  patientMrn: any;
  patientFacilityId: any;
  primaryInsuranceId: any;
  customerWorkItemId: any;
  public customerWitem: CustomerWorkItem = new CustomerWorkItem();
  userId: number;
  isDirty = false;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private customerWItemService: CustomerWorkitemService,
    private commonService: CommonService,
    private router: Router,
    private toastr: ToastrService,
    private change: ChangeDetectorRef,
    private activatedRouter: ActivatedRoute
  ) {

    this.activatedRouter.queryParams.subscribe((paramts) => {
      if (paramts['mrn'] != null || paramts['facilityId'] != null) {
        this.patientMrn = paramts['mrn'];
        this.patientFacilityId = paramts['facilityId'];
        this.primaryInsuranceId = paramts['primaryInsuranceId'];
        this.customerWorkItemId = paramts['customerWorkItemId'];
      }
      else{
        this.customerWorkItemId ='';
      }

    }
    );

  }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.buildFormPatient();
    this.buildSearchForm();
    this.getFacilityList();
    this.getPrimaryInsuranceList();
    this.getSecondaryInsuranceList();
    this.getContactStatus();
    this.getFirstOutcomeList();
    this.getSecondtOutcomeList();
    this.getThirdOutcomeList();
    this.onSearch('');
    this.formPatient.valueChanges.subscribe( e =>  {
      if(this.formPatient.dirty)
        this.isDirty = true
    });
  }

  ngAfterViewChecked() {
    this.change.detectChanges();
  }

  buildFormPatient() {
    this.formPatient = this.formBuilder.group({
      mrn: this.patientMrn != null ? this.patientMrn
        : new FormControl('', Validators.compose([Validators.required, Validators.maxLength(25), Validators.pattern(alphaNumericValidator)])),
      facilityId: this.patientFacilityId != null ? { value: this.patientFacilityId, disabled: true } : new FormControl('', Validators.compose([Validators.required])),
      primaryInsuranceId: this.primaryInsuranceId != null ? 1 : new FormControl(null, Validators.compose([Validators.required])),
      secondaryInsuranceId: new FormControl(''),
      proofOfIncome: new FormControl('', Validators.compose([Validators.maxLength(13), Validators.pattern(amountValidator)])),
      householdSize: new FormControl(''),
      firstContactDate: new FormControl(null),
      firstContactOutcome: new FormControl(''),
      contactStatusId: new FormControl('', []),
      secondContactDate: new FormControl(null, []),
      secondContactOutcome: new FormControl(''),
      thirdContactDate: new FormControl(null, []),
      thirdContactOutcome: new FormControl(''),
      notes: new FormControl('', Validators.compose([Validators.maxLength(1000)]))
    }, { validators: this.contactStatusValidation });
  }

  contactStatusValidation(form: FormGroup) {
    const fcDate = form.get('firstContactDate').value;
    const fcOutcome = form.get('firstContactOutcome').value;

    const scDate = form.get('secondContactDate').value;
    const scOutcome = form.get('secondContactOutcome').value;

    const tcDate = form.get('thirdContactDate').value;
    const tcOutcome = form.get('thirdContactOutcome').value;

    const contactStatus = form.get('contactStatusId').value;

    //contact status is a required field only when the 3 date fields and 3 contact outcomes are filled
    if ((fcDate && fcOutcome && fcOutcome && scDate && scOutcome && tcDate && tcOutcome) && !contactStatus) {
      form.controls['contactStatusId'].setErrors({ csInvalid: true });
    } else {
      form.controls['contactStatusId'].setErrors(null);
    }
  }

  buildSearchForm() {
    this.formSearchPatient = this.formBuilder.group({
      mrn: ['', [Validators.required]],
      facilityId: [null, [Validators.required]]
    });
  }
  get f() { return this.formPatient != null ? this.formPatient.controls : null; }
  get sf() { return this.formSearchPatient != null ? this.formSearchPatient.controls : null; }

  getPrimaryInsuranceList() {
    this.patientService.getPrimaryInsuranceList().subscribe(
      (result) => {
        this.primaryInsuranceList = result;
      },
      (err) => { }
    );

  }
  getSecondaryInsuranceList() {
    this.patientService.getSecondaryInsuranceList().subscribe(
      (result) => {
        this.secondaryInsuranceList = result;
      },
      (err) => { }
    );

  }

  getFacilityList() {
    this.patientService.getFacilityList().subscribe(
      (result) => {
        this.facilities = result;
      },
      (err) => { }
    );
  }

  getContactStatus() {
    this.patientService.getContactStatus().subscribe(
      (result) => {
        this.contactStatuses = result;
      },
      (err) => { }
    );
  }

  getFirstOutcomeList() {
    this.patientService.getFirstOutcomeList().subscribe(
      (result) => {
        this.outcomes = result;
      },
      (err) => { }
    );
  }

  getSecondtOutcomeList() {
    this.patientService.getSecondtOutcomeList().subscribe(
      (result) => {
        this.secondOutcomes = result;
      },
      (err) => { }
    );
  }
  getThirdOutcomeList() {
    this.patientService.getThirdOutcomeList().subscribe(
      (result) => {
        this.thirdOutcomes = result;
      },
      (err) => { }
    );
  }

  onSearch(searchValue) {
    this.searched = true;
    this.showGrid = false;

    this.patientService.searchByFacilityAndMrn(searchValue).subscribe(
      (result) => {
        this.searchResult = result;
        if (this.searchResult != null && this.searchResult.length > 0) {
          this.showError = false;
          this.showGrid = true;
          this.showForm = true;
          this.patientDatasource = result;
          this.patientTotalRecords = result.length;
          this.patientGridloading = false;
        }
        else {
          this.showGrid = false;
          this.showError = true;
          this.showInfo('No Records Found!');
        }

      },
      (err) => { this.showFailure(err); }
    );
  }


  loadPatientDetails(event: LazyLoadEvent) {
    this.patientGridloading = true;
    setTimeout(() => {
      if (this.patientDatasource) {
        this.patientSearchResult = this.patientDatasource.slice(event.first, (event.first + event.rows));
        this.patientGridloading = false;
      }
    }, 500);
  }

  onSubmit() {
    this.submitted = true;

    //Check form is valid or not
    if (this.formPatient.invalid) {
      return false;
    }
    else {
      this.patient = this.formPatient.value;

      if (!!this.customerWorkItemId) {
        this.customerWitem.customerWorkItemId = this.customerWorkItemId;
        this.customerWitem.patientMrn = this.patient.mrn;
        this.customerWitem.modifiedBy = this.userId;
      }
      let fcDate = this.formPatient.value['firstContactDate'];
      let scDate = this.formPatient.value['secondContactDate'];
      let tcDate = this.formPatient.value['thirdContactDate'];

      if (fcDate != null)
        this.patient.firstContactDate = new Date(fcDate.year + '-' + fcDate.month + '-' + fcDate.day);

      if (scDate != null) {
        this.patient.secondContactDate = new Date(scDate.year + '-' + scDate.month + '-' + scDate.day); { }

      }

      if (tcDate != null) {
        this.patient.thirdContactDate = new Date(tcDate.year + '-' + tcDate.month + '-' + tcDate.day);

      }

      this.patient.active = true;
      this.patient.modifiedBy = parseInt(localStorage.userId);

      //update existing MRN
      if (this.isUpdate) {
        this.patient.patientId = this.patientId;
        this.patientService.updatePatient(this.patient).subscribe(
          (result) => {
            this.submitted = false;
            this.isDirty = false;
            this.searched = false;
            this.isUpdate = false;
            this.showSuccess('Successfully Updated Patient :: ' + this.patient.mrn);
            this.formPatient.reset();
            this.formPatient.get('facilityId').setValue('');
            this.onSearch('');
          },
          (err) => {
            console.log(err);
            this.showFailure(err);
            // this.showFailure('Update Failed!!');
          }
        );
      }
      else {
        //new MRN
        this.patient.createdBy = parseInt(localStorage.userId);
        this.patient.facilityId = this.patientFacilityId != null && this.patientFacilityId != '' ? this.patientFacilityId : this.formPatient.get('facilityId').value;
        this.patientService.createPatient(this.patient).subscribe(
          (result) => {
            this.showGrid = false;
            this.submitted = false;

            if (!!this.customerWorkItemId) {
              this.customerWitem.patientId = result.patientId;
              this.patientService.updatePatientInfoInCustomerWorkItem(this.customerWitem).subscribe((resp) => {
                this.showSuccess('Added Patient Successfully :: ' + resp.patientMrn);

                this.patientFacilityId = '';
                this.customerWitem = null;
                this.formPatient.reset();
                this.formPatient.get('facilityId').enable();
                this.formPatient.get('facilityId').setValue('');
                this.router.navigate(['/dashboard/workmenu/customerWorkItem']);
                //this.router.navigate(['/dashboard/support/patientMaintenance'], { queryParams: {}});
                //this.onSearch('');

              },
                (err) => {
                  console.log(err);
                  this.showFailure(err);
                  this.showFailure('Update patient info failed!!');
                });

            }
            else {
              this.showSuccess('Added Patient Successfully :: ' + result.mrn);
              this.customerWitem = null;
              this.patientFacilityId = '';
              this.formPatient.reset();
              this.router.navigate(['/dashboard/support/patientMaintenance'], { queryParams: {}});
              //this.router.navigate(['/dashboard/support/patientMaintenance']);
              this.onSearch('');
            }
          },
          (err) => {
            console.log(err);
            this.showFailure(err);
            this.showFailure('Create Patient Failed!!');
          }
        );
      }
    }
  }
  onEdit(patientId) {
    this.formPatient.reset();
    this.showGrid = false;
    this.showForm = true;
    this.patientId = patientId;
    this.patientService.getByPatientId(patientId).subscribe(
      (result) => {
        this.patient = result;
        var fcd = new Date(this.patient.firstContactDate);
        var fcDate = this.patient.firstContactDate != null ? { year: fcd.getUTCFullYear(), month: fcd.getUTCMonth() + 1, day: fcd.getUTCDate() } : this.patient.firstContactDate;

        var scd = new Date(this.patient.secondContactDate);
        var scDate = this.patient.secondContactDate != null ? { year: scd.getUTCFullYear(), month: scd.getUTCMonth() + 1, day: scd.getUTCDate() } : this.patient.secondContactDate;

        var tcd = new Date(this.patient.thirdContactDate);
        var tcDate = this.patient.thirdContactDate != null ? { year: tcd.getUTCFullYear(), month: tcd.getUTCMonth() + 1, day: tcd.getUTCDate() } : this.patient.thirdContactDate;
        this.formPatient.setValue(
          {
            mrn: this.patient.mrn,
            facilityId: this.patient.facilityId,
            primaryInsuranceId: this.patient.primaryInsuranceId,
            secondaryInsuranceId: this.patient.secondaryInsuranceId,
            proofOfIncome: this.patient.proofOfIncome,
            householdSize: this.patient.householdSize,
            firstContactDate: fcDate,
            firstContactOutcome: this.patient.firstContactOutcome,
            contactStatusId: this.patient.contactStatusId,
            secondContactDate: scDate,
            secondContactOutcome: this.patient.secondContactOutcome,
            thirdContactDate: tcDate,
            thirdContactOutcome: this.patient.thirdContactOutcome,
            notes: this.patient.notes
          });
        this.isUpdate = true;

        this.router.navigate(['/dashboard/support/patientMaintenance']);
      },
      (err) => { this.showFailure(err); }
    );
  }

  onReset() {
    this.formPatient.reset();
    this.formPatient.markAsPristine();
    this.submitted = false;
    this.showGrid = false;
    this.showForm = true;

  }

  onCancel() {
    this.onReset();
    this.isUpdate = false;
    this.showGrid = false;
    this.showForm = true;
  }

   exportExcel() {
     var excelData = [];
     this.patientDatasource.forEach((col) => {

       excelData.push({
         'MRN': col.mrn,
         'Facility Name': col.facilityName,
         'Contact Status': col.contactStatusName
       });
     });
       let excelWorkbook = new Workbook();
      let excelWorksheet = excelWorkbook.addWorksheet('data',{views: [{showGridLines: false}]});
      let logo = excelWorkbook.addImage({
            base64: logoFile.logoBase64,
            extension: 'png',
      });
     //let formattedDateOutFrom = this.getFormattedDate(this.reportsForm.value.dateOutFrom);
     //let formattedDateOutTo =  this.getFormattedDate(this.reportsForm.value.dateOutTo);

     excelWorksheet.addImage(logo, 'A2:E7');
     //worksheet.addRow(['                 Transactions for period of '+formattedDateOutFrom+' through '+formattedDateOutTo]);
     excelWorksheet.mergeCells('A1:AN10');
     excelWorksheet.addRow([])
     excelWorksheet.addRow([])
     excelWorksheet.addRow([])
     excelWorksheet.mergeCells('A11:AN13');
     let headerRow = excelWorksheet.addRow(Object.keys(excelData[0]));
     headerRow.font = {bold: true };
     headerRow.eachCell((cell, number) => {
       cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
     });
     excelData.forEach(d => {
       let row = excelWorksheet.addRow([d['MRN'], d['Facility Name'],  d['Contact Status'] ]);

       row.eachCell((cell, number) => {
         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
       });
     });
     excelWorkbook.xlsx.writeBuffer().then((data) => {
           let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
           fs.saveAs(blob, 'Patient_' + moment(new Date()).format('YYYY_MM_DD_HH_mm_ss') + '.xlsx');
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
