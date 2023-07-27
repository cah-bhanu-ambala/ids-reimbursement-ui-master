import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerReportsService } from 'src/app/common/services/http/customer-reports.service';
import { ReportsService } from 'src/app/common/services/http/reports.service';

@Component({
  selector: 'app-customer-orders-completed',
  templateUrl: './customer-orders-completed.component.html',
  styleUrls: ['./customer-orders-completed.component.scss']
})
export class CustomerOrdersCompletedComponent implements OnInit, AfterContentChecked {

  custOrderReportsForm: FormGroup;
  facilitiesList: any[];
  grandAmount: string = '';

  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  userId: number = 1;

  datasource: any[];
  custOrderResultList: any[];
  resultListDetails: any[];
  loading: boolean;
  totalRecords: number;

  totalPHARML1: number = 0;
  totalPHARML2: number = 0;
  totalPHARML3: number = 0;
  totalRADL1: number = 0;
  totalRADL2: number = 0;
  totalVOBL1: number = 0;
  totalVOBL2: number = 0;
  totalVOBL3: number = 0;

  grandTotal: number = 0;

  cols: any[];
  exportColumns: any[] = [];
  facility: any;

  constructor(
    private formBuilder: FormBuilder,
    private custReportsService: CustomerReportsService,
    private reportsService: ReportsService,
    private change: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.buildSearchForm();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.custOrderReportsForm = this.formBuilder.group({
      facilityId: 0,
      facilityName: { value: '', disabled: true },
      dateCreatedFrom: ['', Validators.compose([Validators.required])],
      dateCreatedTo: ['', Validators.compose([Validators.required])],
      intFacilityId: ['', Validators.compose([Validators.required])]
    });
  }

  get sf() {
    return this.custOrderReportsForm != null ? this.custOrderReportsForm.controls : null;
  }

  // getFacilityList() {
  //   this.reportsService.getAllFacilities().subscribe(
  //     (result) => {
  //       this.facilitiesList = result;
  //     }
  //   );
  // }

  getReportsData() {
    this.showGrid = false;
    let selectedDateFrom = this.custOrderReportsForm.value.dateCreatedFrom;
    let selectedDateTo = this.custOrderReportsForm.value.dateCreatedTo;

    let formattedDateFrom = selectedDateFrom != null ? moment(selectedDateFrom).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;
    let formattedDateTo = selectedDateTo != null ? moment(selectedDateTo).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;

    let params = {
      dateOutFrom: formattedDateFrom,
      dateOutTo: formattedDateTo,
      facilityId: this.custOrderReportsForm.get('intFacilityId').value
    };

    if (this.custOrderReportsForm.invalid) {
      this.showError = true;
      // this.showFailure('Please select any advocacy type, facility, valid date created from or date created to')
      this.searched = true;
      this.showGrid = false;
      return false;
    }
    else {
      this.showError = false;
      this.custReportsService.getCustomerOrderCompletedReport(params).subscribe(data => {
        if (data != null) {
          this.datasource = data;
          this.totalRecords = data.length;
          this.showGrid = true;
        }
        else {
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
        if (Array.isArray(this.datasource)) {
          this.custOrderResultList = this.datasource.slice(event.first, (event.first + event.rows));
        } else
          this.custOrderResultList = [this.datasource].slice(event.first, (event.first + event.rows));

        this.loading = false;

        this.facility = this.custOrderResultList[0];

        this.loading = false;
      }
    }, 500);
  }

  onReset() {
    this.custOrderReportsForm.patchValue({
      dateCreatedFrom: null,
      dateCreatedTo: null,
      facilityId: ''
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.custOrderReportsForm.markAsUntouched();
    this.custOrderReportsForm.markAsPristine();
  }

  exportExcel() {
    var custOrderexcelData = [];

    this.custOrderResultList.forEach((col) => {
      custOrderexcelData.push({
        'Facility Name': col.facilityName,
        '# of PHARM L1 Work Items': col.workItemStatuses[0].count,
        '# of PHARM L2 Work Items': col.workItemStatuses[1].count,
        '# of PHARM L3 Work Items': col.workItemStatuses[2].count,
        '# of RAD L1 Work Items': col.workItemStatuses[3].count,
        '# of RAD L2 Work Items': col.workItemStatuses[4].count,
        '# of VOB L1 Work Items': col.workItemStatuses[5].count,
        '# of VOB L2 Work Items': col.workItemStatuses[6].count,
        '# of VOB L3 Work Items': col.workItemStatuses[7].count,
        'Grand Total': col.totalCount
      });
    });

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(custOrderexcelData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "CustomerOrdersCompleted_Report");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_' + moment(new Date()).format('YYYY_MM_DD_HH_mm_ss') + EXCEL_EXTENSION);
    });
  }

  showSuccess(msg) {
    this.toastr.success(msg);
  }

  showFailure(msg) {
    this.toastr.error(msg);
  }
}
