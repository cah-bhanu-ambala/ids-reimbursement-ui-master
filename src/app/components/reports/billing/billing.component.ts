import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import * as logoFile from './logo.js';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BillingComponent implements OnInit, AfterContentChecked {

  reportsForm: FormGroup;
  facilities: any[];
  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  public selectedFacilitiesIds: any[];
  userId: number;
  datasource: any[];
  billingList: any[];
  errorMessage: string = '';

  totalRecords: number;
  cols: any[];
  loading: boolean;
  exportColumns: any[] = [];
  maxJCodesLength = 10;
  maxJCodesList = [];

  constructor(
    private formBuilder: FormBuilder,
    private reports: ReportsService,
    private change: ChangeDetectorRef,
    private toastr: ToastrService
  ) {
    this.maxJCodesList = [].constructor(this.maxJCodesLength);
  }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.buildSearchForm();
    this.getFacilityList();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.reportsForm = this.formBuilder.group({
      selectedFacilitiesIds:['', Validators.compose([Validators.required])],
      dateOutFrom: ['', Validators.compose([Validators.required])],
      dateOutTo: ['', Validators.compose([Validators.required])]
    });
  }

  get sf() {
    return this.reportsForm != null ? this.reportsForm.controls : null;
  }

  getFacilityList() {
    this.reports.getAllFacilities().subscribe(
      (result) => {
        this.facilities = result;
      }
    );
  }
  getFormattedDate(selectedDate)  {
    if(selectedDate!= ''){
      let dateObj = JSON.parse(JSON.stringify(selectedDate));
      dateObj.month = dateObj.month - 1;
      return selectedDate != null ? moment(dateObj).format('MM/DD/YYYY').toString() : null;
    }
  }
  getBillingReport() {
    this.showGrid = false;
    let formatteddateOutFrom;
    let formatteddateOutTo;
    if(this.reportsForm.value.dateOutFrom != ''){
       let selectedDate = JSON.parse(JSON.stringify(this.reportsForm.value.dateOutFrom));
       selectedDate.month = selectedDate.month - 1;
       formatteddateOutFrom= selectedDate != null ? moment(selectedDate).format('MM/DD/YYYY').toString() : null;
    }
    if(this.reportsForm.value.dateOutTo != ''){
      let selectedDateTo = JSON.parse(JSON.stringify(this.reportsForm.value.dateOutTo));
      selectedDateTo.month = selectedDateTo.month - 1;
      formatteddateOutTo = selectedDateTo != null ? moment(selectedDateTo).format('MM/DD/YYYY').toString() : null;
    }
    let params = {
      facilityIds: this.reportsForm.get('selectedFacilitiesIds').value,
      dateOutFrom: formatteddateOutFrom,
      dateOutTo: formatteddateOutTo,
      userId: this.userId
    };

    if (this.reportsForm.invalid) {
      this.showError = true;
      // this.showFailure('Please select any facility or valid date')
      this.searched = true;
      this.showGrid = false;
      return false;
    }
    else {
      this.showError = false;
      this.reports.getBillingDetails(params).subscribe(data => {
        if(data.length > 0){
        this.datasource = data;
        this.totalRecords = data.length;
        this.showGrid = true;
        }
        else
        {
          this.showGrid = false;
          this.showError = true;
        }
      });
    }
  }

  loadReport(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.datasource) {
        this.billingList = this.datasource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }

  onReset() {
    this.selectedFacilitiesIds = [];
    this.reportsForm.patchValue({
      selectedFacilitiesIds:[],
      dateOutFrom: null,
      dateOutTo: null
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.reportsForm.markAsPristine();
    this.reportsForm.markAsUntouched();
  }

  onSelectAll(type) {
    if(type==='facilities'){
      const selected = this.facilities.map(item => item.facilityId);
      this.reportsForm.get('selectedFacilitiesIds').patchValue(selected);
    }
  }

  onClearAll(type) {
    if(type==='facilities'){
      this.reportsForm.get('selectedFacilitiesIds').patchValue([]);
    }
  }

   exportExcel() {
     var excelData = [];
     this.datasource.forEach((col) => {
       let jc0 = col.drugCodes[0];
       let jc0_procCode =  '';
       let jc0_dosage =  '';
       let jc0_denied =  '';
       let jc0_denialType =  '';
       if(jc0!= null){
          jc0_procCode = jc0.drugProcCode  ? jc0.drugProcCode : '';
          jc0_dosage = jc0.drugDosage ? jc0.drugDosage: 0;
          jc0_denied = jc0.isDenied ? 'Yes': 'No';
          jc0_denialType = jc0.denialType  ? jc0.denialType.denialType: '';
       }

       let jc1 = col.drugCodes[1];
       let jc1_procCode =  '';
       let jc1_dosage = '';
       let jc1_denied = '';
       let jc1_denialType = '';
       if(jc1!=null){
          jc1_procCode = jc1.drugProcCode ? jc1.drugProcCode : '';
          jc1_dosage = jc1.drugDosage ? jc1.drugDosage: 0;
          jc1_denied = jc1.isDenied ? 'Yes': 'No';
          jc1_denialType = jc1.denialType  ? jc1.denialType.denialType: '';
        }


        let jc2 = col.drugCodes[2];
        let jc2_procCode =  '';
        let jc2_dosage =  '';
        let jc2_denied =  '';
        let jc2_denialType =  '';
        if(jc2!=null){
          jc2_procCode = jc2.drugProcCode ? jc2.drugProcCode : '';
          jc2_dosage = jc2.drugDosage ? jc2.drugDosage: 0;
          jc2_denied = jc2.isDenied ? 'Yes': 'No';
          jc2_denialType = jc2.denialType ?  jc2.denialType.denialType: '';
        }

        let jc3 = col.drugCodes[3];
        let jc3_procCode =  '';
        let jc3_dosage =  '';
        let jc3_denied =  '';
        let jc3_denialType =  '';
        if(jc3!=null){
          jc3_procCode = jc3.drugProcCode ? jc3.drugProcCode : '';
          jc3_dosage = jc3.drugDosage ? jc3.drugDosage: 0;
          jc3_denied = jc3.isDenied ? 'Yes': 'No';
          jc3_denialType = jc3.denialType ? jc3.denialType.denialType: '';
        }

       let jc4 = col.drugCodes[4];
       let jc4_procCode =  '';
       let jc4_dosage =  '';
       let jc4_denied =  '';
       let jc4_denialType =  '';
       if(jc4!=null){
          jc4_procCode = jc4.drugProcCode ? jc4.drugProcCode : '';
          jc4_dosage = jc4.drugDosage ? jc4.drugDosage: 0;
          jc4_denied = jc4.isDenied ? 'Yes': 'No';
          jc4_denialType = jc4.denialType ? jc4.denialType.denialType: '';
       }

       let jc5 = col.drugCodes[5];
       let jc5_procCode =  '';
       let jc5_dosage =  '';
       let jc5_denied =  '';
       let jc5_denialType =  '';
       if(jc5!=null){
          jc5_procCode = jc5.drugProcCode ? jc5.drugProcCode : '';
          jc5_dosage = jc5.drugDosage ? jc5.drugDosage: 0;
          jc5_denied = jc5.isDenied ? 'Yes': 'No';
          jc5_denialType = jc5.denialType ? jc5.denialType.denialType: '';
       }

       let jc6 = col.drugCodes[6];
       let jc6_procCode = '';
       let jc6_dosage = '';
       let jc6_denied = '';
       let jc6_denialType = '';
       if(jc6!=null){
         jc6_procCode = jc6.drugProcCode ? jc6.drugProcCode : '';
         jc6_dosage = jc6.drugDosage ? jc6.drugDosage: 0;
         jc6_denied = jc6.isDenied ? 'Yes': 'No';
         jc6_denialType = jc6.denialType ? jc6.denialType.denialType: '';
       }

       let jc7 = col.drugCodes[7];
       let jc7_procCode =  '';
       let jc7_dosage =  '';
       let jc7_denied =  '';
       let jc7_denialType =  '';
       if(jc7!=null){
         jc7_procCode = jc7.drugProcCode ? jc7.drugProcCode : '';
         jc7_dosage = jc7.drugDosage ? jc7.drugDosage: 0;
         jc7_denied = jc7.isDenied ? 'Yes': 'No';
         jc7_denialType = jc7.denialType ? jc7.denialType.denialType: '';
       }

       let jc8 = col.drugCodes[8];
       let jc8_procCode =  '';
       let jc8_dosage =  '';
       let jc8_denied =  '';
       let jc8_denialType =  '';
       if(jc8!=null){
         jc8_procCode = jc8.drugProcCode ? jc8.drugProcCode : '';
         jc8_dosage = jc8.drugDosage ? jc8.drugDosage: 0;
         jc8_denied = jc8.isDenied ? 'Yes': 'No';
         jc8_denialType = jc8.denialType ? jc8.denialType.denialType: '';
       }

       let jc9 = col.drugCodes[9];
       let jc9_procCode =  '';
       let jc9_dosage =  '';
       let jc9_denied =  '';
       let jc9_denialType =  '';
       if(jc9!=null){
         jc9_procCode = jc9.drugProcCode  ? jc9.drugProcCode : '';
         jc9_dosage = jc9.drugDosage ? jc9.drugDosage: 0;
         jc9_denied = jc9.isDenied ? 'Yes': 'No';
         jc9_denialType = jc9.denialType ? jc9.denialType.denialType: '';
       }
       excelData.push({
         'Facility Name': col.facilityName,
         'Billing Type': col.facilityBillingLevelName,
         'Patient Mrn': col.patientMrn,
         'WorkItem Id': col.workItemId,
         'Status': col.workItemStatusName,
         "Physician": col.providerName,
         "JCode 1": jc0_procCode,
         "JC1 Dosage": jc0_dosage,
         "JC1 Denied": jc0_denied,
         "JC1 Denial Type": jc0_denialType,
         "JCode 2": jc1_procCode,
         "JCode 2 Dosage": jc1_dosage,
         "JCode 2 Denied": jc1_denied,
         "JCode 2 Denial Type": jc1_denialType,
         "JCode 3": jc2_procCode,
         "JCode 3 Dosage": jc2_dosage,
         "JCode 3 Denied": jc2_denied,
         "JCode 3 Denial Type": jc2_denialType,
         "JCode 4": jc3_procCode,
         "JCode 4 Dosage": jc3_dosage,
         "JCode 4 Denied": jc3_denied,
         "JCode 4 Denial Type": jc3_denialType,
         "JCode 5": jc4_procCode,
         "JCode 5 Dosage": jc4_dosage,
         "JCode 5 Denied": jc4_denied,
         "JCode 5 Denial Type": jc4_denialType,
         "JCode 6": jc5_procCode,
         "JCode 6 Dosage": jc5_dosage,
         "JCode 6 Denied": jc5_denied,
         "JCode 6 Denial Type": jc5_denialType,
         "JCode 7": jc6_procCode,
         "JCode 7 Dosage": jc6_dosage,
         "JCode 7 Denied": jc6_denied,
         "JCode 7 Denial Type": jc6_denialType,
         "JCode 8": jc7_procCode,
         "JCode 8 Dosage": jc7_dosage,
         "JCode 8 Denied": jc7_denied,
         "JCode 8 Denial Type": jc7_denialType,
         "JCode 9": jc8_procCode,
         "JCode 9 Dosage": jc8_dosage,
         "JCode 9 Denied": jc8_denied,
         "JCode 9 Denial Type": jc8_denialType,
         "JCode 10": jc9_procCode,
         "JCode 10 Dosage": jc9_dosage,
         "JCode 10 Denied": jc9_denied,
         "JCode 10 Denial Type": jc9_denialType
               });
     });
      let workbook = new Workbook();
      let worksheet = workbook.addWorksheet('data',{views: [{showGridLines: false}]});
      let logo = workbook.addImage({
            base64: logoFile.logoBase64,
            extension: 'png',
      });
     let formattedDateOutFrom = this.getFormattedDate(this.reportsForm.value.dateOutFrom);
     let formattedDateOutTo =  this.getFormattedDate(this.reportsForm.value.dateOutTo);

     worksheet.addImage(logo, 'A2:E7');
     worksheet.addRow(['                 Transactions for period of '+formattedDateOutFrom+' through '+formattedDateOutTo]);
     worksheet.mergeCells('A1:AN10');
     worksheet.addRow([])
     worksheet.addRow([])
     worksheet.addRow([])
     worksheet.mergeCells('A11:AN13');
     let headerRow = worksheet.addRow(Object.keys(excelData[0]));
     headerRow.font = {bold: true };
     headerRow.eachCell((cell, number) => {
       cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
     });
     excelData.forEach(d => {
       let row = worksheet.addRow([d['Facility Name'], d['Billing Type'],  d['Patient Mrn'],  d['WorkItem Id'], d['Status'], d['Physician'],
        d['JCode 1'],d['JC1 Dosage'],d['JC1 Denied'],d['JC1 Denial Type'],
        d['JCode 2'],d['JCode 2 Dosage'],d['JCode 2 Denied'],d['JCode 2 Denial Type'],
        d['JCode 3'],d['JCode 3 Dosage'],d['JCode 3 Denied'],d['JCode 3 Denial Type'],
        d['JCode 4'],d['JCode 4 Dosage'],d['JCode 4 Denied'],d['JCode 4 Denial Type'],
        d['JCode 5'],d['JCode 5 Dosage'],d['JCode 5 Denied'],d['JCode 5 Denial Type'],
        d['JCode 6'],d['JCode 6 Dosage'],d['JCode 6 Denied'],d['JCode 6 Denial Type'],
        d['JCode 7'],d['JCode 7 Dosage'],d['JCode 7 Denied'],d['JCode 7 Denial Type'],
        d['JCode 8'],d['JCode 8 Dosage'],d['JCode 8 Denied'],d['JCode 8 Denial Type'],
        d['JCode 9'],d['JCode 9 Dosage'],d['JCode 9 Denied'],d['JCode 9 Denial Type'],
        d['JCode 10'],d['JCode 10 Dosage'],d['JCode 10 Denied'],d['JCode 10 Denial Type']]);

       row.eachCell((cell, number) => {
         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
       });
     });
     workbook.xlsx.writeBuffer().then((data) => {
           let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
           fs.saveAs(blob, 'Billing_Report_' + moment(new Date()).format('YYYY_MM_DD_HH_mm_ss') + '.xlsx');
     });
   }





  showSuccess(msg) {
    this.toastr.success(msg);
  }

  showFailure(msg) {
    this.toastr.error(msg);
  }
}
