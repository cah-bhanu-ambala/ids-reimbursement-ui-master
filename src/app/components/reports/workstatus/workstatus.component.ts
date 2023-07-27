import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-workstatus',
  templateUrl: './workstatus.component.html',
  styleUrls: ['./workstatus.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WorkstatusComponent implements OnInit, AfterContentChecked {

  reportsForm: FormGroup;
  facilities: any[];
  facilitiesList: any[];
  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  selectedFacilitiesIds: any[];
  userId: number = 1;
  datasource: any[];
  workstatusList: any[];
  errorMessage: string = '';


  totalRecords: number;
  cols: any[];
  loading: boolean;
  exportColumns: any[] = [];

  // properties of the class for Total Amount
  totalNew: number = 0;
  totalApproved: number = 0;
  totalInProcess: number = 0;
  totalPending: number = 0;
  totalRFA: number = 0;
  totalDenied: number = 0;
  grandCount: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private reports: ReportsService,
    private change: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.buildSearchForm();
    this.getFacilityList();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.reportsForm = this.formBuilder.group({
      selectedFacilitiesIds: [null, Validators.compose([Validators.required])],
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
        this.facilitiesList = result;
      },
      (err) => { }
    );
  }

  getWorkstatusReport() {
    this.showGrid = false;
    let selectedDateFrom = this.reportsForm.value.dateOutFrom;
    let selectedDateTo = this.reportsForm.value.dateOutTo;
    let formattedDateFrom;
    let formattedDateTo;
    if(this.reportsForm.value.dateOutFrom != ''){
       let selectedDate = JSON.parse(JSON.stringify(this.reportsForm.value.dateOutFrom));
       selectedDate.month = selectedDate.month - 1;
       formattedDateFrom= selectedDate != null ? moment(selectedDate).format('MM/DD/YYYY').toString() : null;
    }
    if(this.reportsForm.value.dateOutTo != ''){
      let selectedDateTo = JSON.parse(JSON.stringify(this.reportsForm.value.dateOutTo));
      selectedDateTo.month = selectedDateTo.month - 1;
      formattedDateTo = selectedDateTo != null ? moment(selectedDateTo).format('MM/DD/YYYY').toString() : null;
    }
    let params = {
      facilityIds: this.reportsForm.get('selectedFacilitiesIds').value,
      userId: this.userId,
      fromDate: formattedDateFrom,
      toDate: formattedDateTo
    };

    if (this.reportsForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Please select any facility to get the report on work items';
      this.searched = true;
      this.showGrid = false;
      return false;
    }
    else {
      this.showError = false;
      this.reports.getWorkstatusDetails(params).subscribe(data => {
        if (data != null) {
          this.showError = false;
          this.datasource = data;
          this.totalRecords = data.facilities.length;
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
        this.showGrid = false;
        if (Array.isArray(this.datasource)) {
          this.workstatusList = this.datasource.slice(event.first, (event.first + event.rows));
        }
        else {
          this.workstatusList = [this.datasource].slice(event.first, (event.first + event.rows));
        }
        this.facilities = this.workstatusList[0].facilities;

        let sumNew: number = 0;
        let sumApproved: number = 0;
        let sumDenied: number = 0;
        let sumInProcess: number = 0;
        let sumPending: number = 0;
        let sumRFA: number = 0;
        this.facilities.forEach((col) => {
          sumNew += col.workItemStatuses[3].count;
          sumApproved += col.workItemStatuses[0].count;
          sumDenied += col.workItemStatuses[1].count;
          sumInProcess += col.workItemStatuses[2].count;
          sumPending += col.workItemStatuses[4].count;
          sumRFA += col.workItemStatuses[5].count;
        });

        this.totalNew = sumNew;
        this.totalDenied = sumDenied;
        this.totalApproved = sumApproved;
        this.totalRFA = sumRFA;
        this.totalPending = sumPending;
        this.totalInProcess = sumInProcess;
        this.grandCount = this.workstatusList[0].grandCount;

        this.loading = false;
        this.showGrid = true;
      }
    }, 500);
  }
  onSelectAll(type) {
    if (type === 'facilities') {
      const selected = this.facilitiesList.map(item => item.facilityId);
      this.reportsForm.get('selectedFacilitiesIds').patchValue(selected);
    }
  }

  onClearAll(type) {
    if (type === 'facilities') {
      this.reportsForm.get('selectedFacilitiesIds').patchValue([]);
    }
  }
  onReset() {
    this.selectedFacilitiesIds = [];
    // this.reportsForm.get('selectedFacilitiesIds').setValue([]);
    this.reportsForm.patchValue({
      selectedFacilitiesIds: [],
      dateOutFrom: null,
      dateOutTo: null,
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.reportsForm.reset();
    this.reportsForm.markAsPristine();
    this.reportsForm.markAsUntouched();
  }

  exportExcel() {
    var excelData = [];
    this.facilities.forEach((col) => {
      excelData.push({
        'Facility Name': col.facilityName,
        'Approved': col.workItemStatuses[0].count,
        'Denied': col.workItemStatuses[1].count,
        'In Process': col.workItemStatuses[2].count,
        'New': col.workItemStatuses[3].count,
        'Pending': col.workItemStatuses[4].count,
        'Reviewed for Advocacy': col.workItemStatuses[5].count,
        'Grand Total': col.totalCount,

      });
    });
    excelData.push({
      'Facility Name': 'TOTAL',
      'Approved': this.totalApproved,
      'Denied': this.totalDenied,
      'In Process': this.totalInProcess,
      'New': this.totalNew,
      'Pending': this.totalPending,
      'Reviewed for Advocacy': this.totalRFA,
      'Grand Total': this.grandCount
    });

    import("xlsx").then(xlsx => {
      const worksheetWorkStatus = xlsx.utils.json_to_sheet(excelData);
      const workbook = { Sheets: { 'data': worksheetWorkStatus }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "WorkStatus_Report");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE_WORKSTATUS = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE_WORKSTATUS
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

  // getFormattedDate(selectedDate)  {
  //   return selectedDate != null ? moment(selectedDate).subtract(1, 'M' ).format('MM/DD/YYYY').toString() : null;
  // }
}
