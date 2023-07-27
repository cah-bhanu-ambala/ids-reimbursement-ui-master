import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-advocacy-analysis',
  templateUrl: './advocacy-analysis.component.html',
  styleUrls: ['./advocacy-analysis.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdvocacyAnalysisComponent implements OnInit, AfterContentChecked {

  reportsForm: FormGroup;
  advocacyTypes: any[];
  facilitiesList: any[];
  grandAmount: string = '';
  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  selectedAdvocacyTypesIds: any[]; // all selected by default
  // selectedFacilitiesIds: any[];
  userId: number = 1;
  datasource: any[];
  advocacyAnalysisList: any[];
  advocacyAnalysisListDetails: any[];
  errorMessage: string = '';

  totalRecords: number;
  cols: any[];
  loading: boolean;
  exportColumns: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private reports: ReportsService,
    private change: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.buildSearchForm();
    this.getAdvocacyTypeList();
    this.getFacilityList();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.reportsForm = this.formBuilder.group({
      selectedAdvocacyTypesIds: ['', Validators.compose([Validators.required])],
      selectedFacilitiesIds: ['', Validators.compose([Validators.required])],
      dateCreatedFrom: ['', Validators.compose([Validators.required])],
      dateCreatedTo: ['', Validators.compose([Validators.required])]
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

  getAdvocacyTypeList() {
    this.reports.getAllAdvocacyTypes().subscribe(
      (result) => {
        this.advocacyTypes = result;
      },
      (err) => { }
    );
  }

  getAdvocacyAnalysisReport() {
    this.showGrid = false;
    let selectedDateFrom = this.reportsForm.value.dateCreatedFrom;
    let selectedDateTo = this.reportsForm.value.dateCreatedTo;
    let formattedDateFrom = selectedDateFrom != null ? moment(selectedDateFrom).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;
    let formattedDateTo = selectedDateTo != null ? moment(selectedDateTo).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;
    let params = {
      advocacyTypeIds: this.reportsForm.get('selectedAdvocacyTypesIds').value,
      facilityIds: this.reportsForm.get('selectedFacilitiesIds').value,
      dateCreatedFrom: formattedDateFrom,
      dateCreatedTo: formattedDateTo,
      userId: this.userId
    };

    if (this.reportsForm.invalid) {
      this.showError = true;
      // this.showFailure('Please select any advocacy type, facility, valid date created from or date created to')
      this.searched = true;
      this.showGrid = false;
      return false;
    }
    else {
      this.showError = false;
      this.reports.getAdvocacyAlalysisDetails(params).subscribe(data => {
        if (data != null) {
          this.datasource = data;
          this.totalRecords = data.length;
          this.showGrid = true;
        }
        else
        {
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
          this.advocacyAnalysisList = this.datasource.slice(event.first, (event.first + event.rows));
        }
        this.advocacyAnalysisList = [this.datasource];
        this.loading = false;

        this.advocacyAnalysisListDetails = this.advocacyAnalysisList[0].details;
      }
    }, 500);
  }

  onReset() {
    this.selectedAdvocacyTypesIds = [];
    //this.selectedFacilitiesIds = [];
    this.reportsForm.patchValue({
      selectedFacilitiesIds: [],
      selectedAdvocacyTypesIds: [],
      dateCreatedFrom: null,
      dateCreatedTo: null
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.reportsForm.markAsPristine();
    this.reportsForm.markAsUntouched();
  }

  onSelectAll(type) {
    if (type === 'facilities') {
      const selected = this.facilitiesList.map(item => item.facilityId);
      this.reportsForm.get('selectedFacilitiesIds').patchValue(selected);
    }
    if (type === 'advocacyType') {
      const selected = this.advocacyTypes.map(item => item.advocacyTypeId);
      this.reportsForm.get('selectedAdvocacyTypesIds').patchValue(selected);
    }
  }

  onClearAll(type) {
    if (type === 'facilities') {
      this.reportsForm.get('selectedFacilitiesIds').patchValue([]);
    }
    if (type === 'advocacyType') {
      this.reportsForm.get('selectedAdvocacyTypesIds').patchValue([]);
    }
  }

  exportExcel() {
    var excelData = [];
    this.advocacyAnalysisList.forEach((col) => {

      excelData.push({
        'Application to Clinic': col.details[0].count,
        'Clinic Declined': col.details[1].count,
        'Clinic Obtained': col.details[2].count,
        'Inactive': col.details[3].count,
        'No Longer Available': col.details[4].count,
        'No Response': col.details[5].count,
        'Patient Declined': col.details[6].count,
        'Patient Not Eligible': col.details[7].count,
        'Pending': col.details[8].count,
        'RS Obtained': col.details[9].count
      });
    });

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(excelData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Advocacy_Analysis_Report");
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
