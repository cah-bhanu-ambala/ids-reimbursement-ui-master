import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, FormArray } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { BossInvoice } from 'src/app/models/classes/boss-invoice';

@Component({
  selector: 'app-boss-invoice',
  templateUrl: './boss-invoice.component.html',
  styleUrls: ['./boss-invoice.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BossInvoiceComponent implements OnInit, AfterContentChecked {

  reportsForm: FormGroup;
  facilities: any[];
  searched: boolean;
  invoiceShowGrid: boolean;
  showError: boolean;
  selectedFacilitiesIds: any[];
  userId: number;
  invoiceDatasource: any[];
  billingList: any[];
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
    this.getFacilityList();
    this.buildSearchForm();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.reportsForm = this.formBuilder.group({
      WbsNames:[''],
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
      let wbsListArray = new Array();
      let facilitiesResultList = new Array();
      if(result && result.length>0){
        for(let j=0;j<result.length;j++){
          if(result[j].facilityWbsDetails && result[j].facilityWbsDetails.length>0) {
          for(let i=0;i<result[j].facilityWbsDetails.length;i++) {
            if ( result[j].facilityWbsDetails[i].wbsName!= null){
              wbsListArray.push({'wbsName' : result[j].facilityWbsDetails[i].wbsName});
              facilitiesResultList.push(result[j]);
            }
          }

          }
        }
      }
        this.wbsList = wbsListArray;
        this.facilities = facilitiesResultList;
      },
      (err) => { }
    );
  }

  getBillingReport() {
    this.invoiceShowGrid = false;
    let selectedDate =  this.reportsForm.value.dateOutFrom;
    let selectedDateTo = this.reportsForm.value.dateOutTo;
    let formattedDateOutFrom = selectedDate != null ? moment(selectedDate).subtract(1, 'M' ).format('MM/DD/YYYY').toString() : null;
    let formattedDateOutTo = selectedDateTo != null ? moment(selectedDateTo).subtract(1, 'M' ).format('MM/DD/YYYY').toString() : null;
    this.multipleWbsNames = [];
   if (this.reportsForm.value.WbsNames != null)
    {
      if(this.reportsForm.value.WbsNames.length > 0){

        this.reportsForm.value.WbsNames.forEach(wbs => {
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

    let params: BossInvoice = {
      wbsNames:  this.multipleWbsNames,
      dateOutFrom: formattedDateOutFrom,
      dateOutTo: formattedDateOutTo
    };

    if (this.reportsForm.invalid) {
      this.showError = true;
      this.searched = true;
      this.invoiceShowGrid = false;
      return false;
    }
    else {
      this.showError = false;
      this.reports.getBossInvoiceDetails(params).subscribe(data => {
        if(data.length > 0){
        this.invoiceDatasource = data;
        this.invoiceTotalRecords = data.length;
        this.invoiceShowGrid = true;
        }
        else
        {
          this.invoiceShowGrid = false;
          this.showError = true;
        }
      });
    }
  }

  loadReport(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.invoiceDatasource) {
        this.billingList = this.invoiceDatasource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }

  onReset() {
    this.reportsForm.patchValue({
      WbsNames:[],
      dateOutFrom: null,
      dateOutTo: null
    });
    this.invoiceShowGrid = false;
    this.showError = false;
    this.searched = false;
    this.reportsForm.markAsPristine();
    this.reportsForm.markAsUntouched();
  }


  exportExcel() {
    var excelData = [];
    this.invoiceDatasource.forEach((col) => {
      excelData.push({
        'Facility WBS': col.wbsName,
         'Facility Name': col.facilityName,
        'Transaction Type': col.facilityBillingType,
        'Month Of Service': col.dateOfService,
        '# Of Transactions': col.numberOfTransactions,

              });
    });

    import("xlsx").then(xlsx => {
      const invoiceWorksheet = xlsx.utils.json_to_sheet(excelData);
      const workbook = { Sheets: { 'data': invoiceWorksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Boss_Invoice");
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
      this.reportsForm.get('WbsNames').patchValue(selected);
    }
  }

  onClearAll(type) {
    if (type === 'wbsList') {
      this.reportsForm.get('WbsNames').patchValue([]);
    }
  }

}
