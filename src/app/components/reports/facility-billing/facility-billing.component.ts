import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { FacilityBilling } from 'src/app/models/classes/facility-billing';

@Component({
  selector: 'app-facility-billing',
  templateUrl: './facility-billing.component.html',
  styleUrls: ['./facility-billing.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FacilityBillingComponent implements OnInit, AfterContentChecked {

  facilityBillingReportForm: FormGroup;
  facilities: any[];
  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  selectedFacilitiesIds: any[];
  userId: number;
  facilityBillingDataSource: any[];
  facilityBillingList: any[];
  errorMessage: string = '';
  wbsList: any[];


  invoiceTotalRecords: number;
  cols: any[];
  loading: boolean;
  exportColumns: any[] = [];
  multipleWbsNames = new Array();

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
    this.facilityBillingReportForm = this.formBuilder.group({
      WbsNames:[''],
      dateOutFrom: ['', Validators.compose([Validators.required])],
      dateOutTo: ['', Validators.compose([Validators.required])]
    });
  }

  get sf() {
    return this.facilityBillingReportForm != null ? this.facilityBillingReportForm.controls : null;
  }

  getFacilityListWithWbsNames() {
     this.reports.getAllFacilities().subscribe(
      (result) => {
      let wbsNameListArray = new Array();
      let facilitiesResultList = new Array();
      if(result && result.length>0){
        for(let j=0;j<result.length;j++){
          if(result[j].facilityWbsDetails && result[j].facilityWbsDetails.length>0) {
          for(let i=0;i<result[j].facilityWbsDetails.length;i++) {
            if ( result[j].facilityWbsDetails[i].wbsName!= null){
              wbsNameListArray.push({'wbsName' : result[j].facilityWbsDetails[i].wbsName});
              facilitiesResultList.push(result[j]);
            }
          }
          }
        }
      }
        this.wbsList = wbsNameListArray;
        this.facilities = facilitiesResultList;
      },
      (err) => { }
    );
  }

  getFacilityBillingReport() {
    this.showGrid = false;
    let selectedDate =  this.facilityBillingReportForm.value.dateOutFrom;
    let selectedDateTo = this.facilityBillingReportForm.value.dateOutTo;
    let dateOutFromFormatted = selectedDate != null ? moment(selectedDate).subtract(1, 'M' ).format('MM/DD/YYYY').toString() : null;
    let dateOutToFormatted = selectedDateTo != null ? moment(selectedDateTo).subtract(1, 'M' ).format('MM/DD/YYYY').toString() : null;
    this.multipleWbsNames = [];
   if (this.facilityBillingReportForm.value.WbsNames != null)
    {
      if(this.facilityBillingReportForm.value.WbsNames.length > 0){

        this.facilityBillingReportForm.value.WbsNames.forEach(wbs => {
          this.multipleWbsNames.push(wbs);
        });
      }
      else {
        if(this.wbsList!=null && this.wbsList.length > 0){
            this.multipleWbsNames = [];
            this.wbsList.forEach(wbs => {
            this.multipleWbsNames.push(wbs.wbsName);
          });
        }
      }
    }

    let params: FacilityBilling = {
      wbsNames:  this.multipleWbsNames,
      dateOutFrom: dateOutFromFormatted,
      dateOutTo: dateOutToFormatted
    };

    if (this.facilityBillingReportForm.invalid) {
      this.showError = true;
      this.searched = true;
      this.showGrid = false;
      return false;
    }
    else {
      this.showError = false;
      this.reports.getFacilityBillingDetails(params).subscribe(data => {
        if(data.length > 0){
        this.facilityBillingDataSource = data;
        this.invoiceTotalRecords = data.length;
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
      if (this.facilityBillingDataSource) {
        this.facilityBillingList = this.facilityBillingDataSource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }

  onReset() {
    this.facilityBillingReportForm.patchValue({
      WbsNames:[],
      dateOutFrom: null,
      dateOutTo: null
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.facilityBillingReportForm.markAsPristine();
    this.facilityBillingReportForm.markAsUntouched();
  }


  exportFacilityBillingDataToExcel() {
    var excelData = [];
    this.facilityBillingDataSource.forEach((col) => {
      excelData.push({
        'Facility WBS': col.wbsName,
         'Facility Name': col.facilityName,
        'Facility Billing Type': col.facilityBillingType,
        'Facility Billing Level': col.facilityBillingLevel,
        'Status': col.workItemStatus,
        'Date Out': col.dateOut != null ? moment(col.dateOut).utc().format('MM/DD/YYYY').toString() : null,
        'MRN': col.mrn,
        'General Notes': col.generalNotes
              });
    });

    import("xlsx").then(xlsx => {
      const invoiceWorksheet = xlsx.utils.json_to_sheet(excelData);
      const workbook = { Sheets: { 'data': invoiceWorksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Facility_Billing");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let INVOICE_EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: INVOICE_EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_' + moment(new Date()).format('YYYY_MM_DD_HH_mm_ss') + EXCEL_EXTENSION);
    });
  }

  onSelectAll(type) {
    if (type === 'wbsList') {
      const selected = this.wbsList.map(item => item.wbsName);
      this.facilityBillingReportForm.get('WbsNames').patchValue(selected);
    }
  }

  onClearAll(type) {
    if (type === 'wbsList') {
      this.facilityBillingReportForm.get('WbsNames').patchValue([]);
    }
  }

}
