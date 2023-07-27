import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import { UserService } from 'src/app/common/services/http/user.service';

import * as moment from 'moment';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryComponent implements OnInit, AfterContentChecked {

  reportsForm: FormGroup;
  facilitiesList: any[];
  facilities: any[];
  systemId: number;
  grandAmount: string = '';
  teamMembers: any[];
  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  selectedFacilitiesIds: any[];
  selectedTeamMembersIds: any[];
  selectedDateType: string;
  dateTypes: any[] = [
    {
      'dateType': 'dateIn',
      'dateTypeName': 'In'
    },
    {
      'dateType': 'dateOut',
      'dateTypeName': 'Out'
    }
  ];
  userId: number = 1;
  datasource: any[];
  teamMemberList: any[];
  summaryList: any[];
  errorMessage: string = '';

  totalRecords: number;
  cols: any[];
  loading: boolean;
  exportColumns: any[] = [];

  totalVOBL1: number = 0;
  totalVOBL2: number = 0;
  totalVOBL3: number = 0;
  totalPHARML1: number = 0;
  totalPHARML2: number = 0;
  totalPHARML3: number = 0;
  totalRADL1: number = 0;
  totalRADL2: number = 0;
  grandTotal: number = 0;

  constructor(
    private formBuilder: FormBuilder
    , private reports: ReportsService
    , private change: ChangeDetectorRef
    , private userService: UserService
  ) { }

  ngOnInit(): void {

    this.getFacilityList();
    this.getTeamMemberList();
    this.buildSearchForm();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.reportsForm = this.formBuilder.group({
      selectedFacilitiesIds: ['', Validators.compose([Validators.required])],
      selectedTeamMembersIds: '',
      // date: [null, Validators.compose([Validators.required])],
      fromDate: ['', Validators.compose([Validators.required])],
      toDate: ['', Validators.compose([Validators.required])],
      selectedDateType: ['', Validators.compose([Validators.required])]
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

  getTeamMemberList() {
    this.systemId = localStorage.systemId?  parseInt(localStorage.systemId)  : 0;

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

  getSummaryReport() {
    this.showGrid = false;
    let selectedDateFrom = this.reportsForm.value.fromDate;
    let selectedDateTo = this.reportsForm.value.toDate;

    let formattedDateFrom;
    let formattedDateTo;
    if(this.reportsForm.value.fromDate != ''){
       let selectedDate = JSON.parse(JSON.stringify(this.reportsForm.value.fromDate));
       selectedDate.month = selectedDate.month - 1;
       formattedDateFrom= selectedDate != null ? moment(selectedDate).format('MM/DD/YYYY').toString() : null;
    }
    if(this.reportsForm.value.toDate != ''){
      let selectedDateTo = JSON.parse(JSON.stringify(this.reportsForm.value.toDate));
      selectedDateTo.month = selectedDateTo.month - 1;
      formattedDateTo = selectedDateTo != null ? moment(selectedDateTo).format('MM/DD/YYYY').toString() : null;
    }
    let params = {
      facilityIds: this.reportsForm.get('selectedFacilitiesIds').value,
      teamMembersIds: this.reportsForm.get('selectedTeamMembersIds').value,
      // date: formattedDate,
      fromDate: formattedDateFrom,
      toDate: formattedDateTo,
      dateType: this.reportsForm.get('selectedDateType').value,
      userId: this.userId
    };

    if (this.reportsForm.invalid) {
      this.showError = true;
      this.errorMessage = 'Please select any facility, valid date or date type'
      this.searched = true;
      this.showGrid = false;
      return false;
    }
    else {
      this.showError = false;
      this.reports.getSummaryDetails(params).subscribe(data => {
        if (data!=null) {
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
        if (Array.isArray(this.datasource)) {
          this.summaryList = this.datasource.slice(event.first, (event.first + event.rows));
        }
        else
          this.summaryList = [this.datasource];
        this.facilities = this.summaryList[0].facilities;
        this.grandAmount = this.summaryList[0].grandAmount;

        // calculation total values for each column
        let sumVOBL1: number = 0;
        let sumVOBL2: number = 0;
        let sumVOBL3: number = 0;
        let sumPHARML1: number = 0;
        let sumPHARML2: number = 0;
        let sumPHARML3: number = 0;
        let sumRADL1: number = 0;
        let sumRADL2: number = 0;
        let sumGrandTotal: number = 0;

        this.facilities.forEach((col) => {
          sumVOBL1 += col.workItemStatuses[5].amount;
          sumVOBL2 += col.workItemStatuses[6].amount;
          sumVOBL3 += col.workItemStatuses[7].amount;
          sumPHARML1 += col.workItemStatuses[0].amount;
          sumPHARML2 += col.workItemStatuses[1].amount;
          sumPHARML3 += col.workItemStatuses[2].amount;
          sumRADL1 += col.workItemStatuses[3].amount;
          sumRADL2 += col.workItemStatuses[4].amount;
          sumGrandTotal += col.totalAmount;
        });

        this.totalVOBL1 = sumVOBL1;
        this.totalVOBL2 = sumVOBL2;
        this.totalVOBL3 = sumVOBL3;
        this.totalPHARML1 = sumPHARML1;
        this.totalPHARML2 = sumPHARML2;
        this.totalPHARML3 = sumPHARML3;
        this.totalRADL1 = sumRADL1;
        this.totalRADL2 = sumRADL2;
        this.grandTotal = sumGrandTotal;

        this.loading = false;
      }
    }, 500);
  }

  onReset() {
    this.selectedFacilitiesIds = [];
    this.selectedTeamMembersIds = [];
    this.reportsForm.patchValue({
      selectedFacilitiesIds: [],
      selectedTeamMembersIds: [],
      // date: null,
      fromDate: null,
      toDate: null,
      selectedDateType: ''
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.reportsForm.markAsUntouched();
    this.reportsForm.markAsPristine();
  }

  onSelectAll(type) {
    if (type === 'facilities') {
      const selected = this.facilitiesList.map(item => item.facilityId);
      this.reportsForm.get('selectedFacilitiesIds').patchValue(selected);
    }
    if (type === 'teamMember') {
      const selected = this.teamMembers.map(item => item.userId);
      this.reportsForm.get('selectedTeamMembersIds').patchValue(selected);
    }
  }

  onClearAll(type) {
    if (type === 'facilities') {
      this.reportsForm.get('selectedFacilitiesIds').patchValue([]);
    }
    if (type === 'teamMember') {
      this.reportsForm.get('selectedTeamMembersIds').patchValue([]);
    }
  }
  exportExcel() {
    var excelData = [];
    this.facilities.forEach((col) => {
      excelData.push({
        'Facility Name': col.facilityName,
        '# of VOB L1 Work Items': col.workItemStatuses[5].count,
        'VOB L1 Bill Amt': col.workItemStatuses[5].amount,
        '# of VOB L2 Work Items': col.workItemStatuses[6].count,
        'VOB L2 Bill Amt': col.workItemStatuses[6].amount,
        '# of VOB L3 Work Items': col.workItemStatuses[7].count,
        'VOB L3 Bill Amt': col.workItemStatuses[7].amount,
        '# of PHARM L1 Work Items': col.workItemStatuses[0].count,
        'PHARM L1 Bill Amt': col.workItemStatuses[0].amount,
        '# of PHARM L2 Work Items': col.workItemStatuses[1].count,
        'PHARM L2 Bill Amt': col.workItemStatuses[1].amount,
        '# of PHARM L3 Work Items': col.workItemStatuses[2].count,
        'PHARM L3 Bill Amt': col.workItemStatuses[2].amount,
        '# of RAD L1 Work Items': col.workItemStatuses[3].count,
        'RAD L1 Bill Amt': col.workItemStatuses[3].amount,
        '# of RAD L2 Work Items': col.workItemStatuses[4].count,
        'RAD L2 Bill Amt': col.workItemStatuses[4].amount,
        'Grand Total': col.totalAmount
      });
    });
    // adding total row to the end of the excel data file
    excelData.push({
      'Facility Name': 'TOTAL',
      '# of VOB L1 Work Items': '',
      'VOB L1 Bill Amt': this.totalVOBL1,
      '# of VOB L2 Work Items': '',
      'VOB L2 Bill Amt': this.totalVOBL2,
      '# of VOB L3 Work Items': '',
      'VOB L3 Bill Amt': this.totalVOBL3,
      '# of PHARM L1 Work Items': '',
      'PHARM L1 Bill Amt': this.totalPHARML1,
      '# of PHARM L2 Work Items': '',
      'PHARM L2 Bill Amt': this.totalPHARML2,
      '# of PHARM L3 Work Items': '',
      'PHARM L3 Bill Amt': this.totalPHARML3,
      '# of RAD L1 Work Items': '',
      'RAD L1 Bill Amt': this.totalRADL1,
      '# of RAD L2 Work Items': '',
      'RAD L2 Bill Amt': this.totalRADL2,
      'Grand Total': this.grandTotal
    });

    import("xlsx").then(xlsx => {
      const worksheetSummary = xlsx.utils.json_to_sheet(excelData);
      const workbook = { Sheets: { 'data': worksheetSummary }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Summary_Report");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE_SUMMARY = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE_SUMMARY
      });
      FileSaver.saveAs(data, fileName + '_' + moment(new Date()).format('YYYY_MM_DD_HH_mm_ss') + EXCEL_EXTENSION);
    });
  }

}
