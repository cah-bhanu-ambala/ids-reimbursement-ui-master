import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { AdvocacyBilling } from 'src/app/models/classes/advocacy-billing';

@Component({
  selector: 'app-facility-billing',
  templateUrl: './advocacy-billing.component.html',
  styleUrls: ['./advocacy-billing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvocacyBillingComponent implements OnInit, AfterContentChecked {

  advocacyBillingReportForm: FormGroup;
  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  userId: number;
  advocacyBillingDataSource: any[];
  advocacyBillingList: any[];
  errorMessage: string = '';
  wbsList: any[];


  totalRecords: number;
  cols: any[];
  loading: boolean;
  exportColumns: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private reports: ReportsService,
    private change: ChangeDetectorRef,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.getFacilityListWithWbsNames();
    this.buildSearchForm();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.advocacyBillingReportForm = this.formBuilder.group({
      WbsNames:[''],
      dateOutFrom: ['', Validators.compose([Validators.required])],
      dateOutTo: ['', Validators.compose([Validators.required])]
    });
  }

  get sf() {
    return this.advocacyBillingReportForm != null ? this.advocacyBillingReportForm.controls : null;
  }

  getFacilityListWithWbsNames() {
     this.reports.getAllFacilities().subscribe(
      (result) => {
      let wbsNameArray = new Array();
      if(result && result.length>0){
        for(let j=0;j<result.length;j++){
          if(result[j].facilityWbsDetails && result[j].facilityWbsDetails.length>0) {
          for(let i=0;i<result[j].facilityWbsDetails.length;i++) {
            if ( result[j].facilityWbsDetails[i].wbsName!= null){
              wbsNameArray.push({'wbsName' : result[j].facilityWbsDetails[i].wbsName});
            }
          }
          }
        }
      }
        this.wbsList = wbsNameArray;
      },
      (err) => { }
    );
  }

  getAdvocacyBillingReport() {
    this.showGrid = false;
    let selectedDate =  this.advocacyBillingReportForm.value.dateOutFrom;
    let selectedDateTo = this.advocacyBillingReportForm.value.dateOutTo;
    let dateOutFromFormatted = selectedDate != null ? moment(selectedDate).subtract(1, 'M' ).format('MM/DD/YYYY').toString() : null;
    let dateOutToFormatted = selectedDateTo != null ? moment(selectedDateTo).subtract(1, 'M' ).format('MM/DD/YYYY').toString() : null;


    let params: AdvocacyBilling = {
      wbsNames:  this.advocacyBillingReportForm.value.WbsNames,
      dateOutFrom: dateOutFromFormatted,
      dateOutTo: dateOutToFormatted
    };

    if (this.advocacyBillingReportForm.invalid) {
      this.showError = true;
      this.searched = true;
      this.showGrid = false;
      return false;
    }
    else {
      this.showError = false;
      this.reports.getAdvocacyBillingReport(params).subscribe(data => {
        if(data.length > 0){
        this.advocacyBillingDataSource = data;
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
      if (this.advocacyBillingDataSource) {
        this.advocacyBillingList = this.advocacyBillingDataSource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }

  onReset() {
    this.advocacyBillingReportForm.patchValue({
      WbsNames:[],
      dateOutFrom: null,
      dateOutTo: null
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.advocacyBillingReportForm.markAsPristine();
    this.advocacyBillingReportForm.markAsUntouched();
  }


  exportAdvocacyBillingDataToExcel() {
    var excelData = [];
    this.advocacyBillingDataSource.forEach((col) => {
      excelData.push({
        'MRN': col.mrn,
        'Facility Name': col.facilityName,
        'Advocacy ID': col.advocacyId,
        'Advocacy Status': col.advocacyStatus,
        'Appointment ID': col.appointmentId,
        'Appointment Type': col.appointmentType,
        'Appointment Status': col.appointmentStatus,
        'Insurance Type': col.insuranceType,
        'Insurance Name': col.insuranceName,
        'Replacement Received': col.replacementReceived != null ? moment(col.replacementReceived).utc().format('MM/DD/YYYY').toString() : null,
        'Date Advocacy Received': col.dateAdvocacyReceived != null ? moment(col.dateAdvocacyReceived).utc().format('MM/DD/YYYY').toString() : null,
        'Copay Covered': col.copayCovered,
        'Received From Copay': col.receivedFromCopay,
        'Cost of Medication Infused': col.costOfMedicationInfused,
        'Received From Grant': col.receivedFromGrant,
        'Advocacy Amount': col.advocacyAmount
              });
    });

    import("xlsx").then(xlsx => {
      const advocacyBillingWorksheet = xlsx.utils.json_to_sheet(excelData);
      const xlsxWorkbook = { Sheets: { 'data': advocacyBillingWorksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(xlsxWorkbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Advocacy_Billing");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let FILE_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_' + moment(new Date()).format('YYYY_MM_DD_HH_mm_ss') + FILE_EXTENSION);
    });
  }

}
