import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delinquency',
  templateUrl: './delinquency.component.html',
  styleUrls: ['./delinquency.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DelinquencyComponent implements OnInit, AfterContentChecked {

  reportsForm: FormGroup;
  delinquencyFacilities: any[];
  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  delinquencySelectedFacilitiesIds: any[];
  userId: number = 1;
  datasource: any[];
  delinquencyList: any[];
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

    this.buildDelinquencySearchForm();
    this.getFacilityList();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildDelinquencySearchForm() {
    this.reportsForm = this.formBuilder.group({
      dateIn: ['', Validators.compose([Validators.required])],
      delinquencySelectedFacilitiesIds:['', Validators.compose([Validators.required])]
    });
  }

  get sf() {
    return this.reportsForm != null ? this.reportsForm.controls : null;
  }

  getFacilityList() {
    this.reports.getAllFacilities().subscribe(
      (result) => {
        this.delinquencyFacilities = result;
      },
      (err) => { }
    );
  }

  getDelinquencyReport() {
    this.showGrid = false;
    let selectedDate = this.reportsForm.value.dateIn;

    // TODO: fix the issue with month on the javascript (0-11) selecteDate="2021-01-10" formattedInDate="2021-02-10"

    let formattedInDate = selectedDate != null ? moment(selectedDate).subtract(1, 'M' ).format("MM/DD/YYYY").toString() : null;
    let params = {
      facilityIds:this.reportsForm.get('delinquencySelectedFacilitiesIds').value,
      dateIn: formattedInDate,
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
      this.reports.getDelinquencyDetails(params).subscribe(data => {
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
        this.delinquencyList = this.datasource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }

  onFormReset() {
    this.delinquencySelectedFacilitiesIds = [];
    this.reportsForm.patchValue({
      delinquencySelectedFacilitiesIds:[],
      dateIn: null
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.reportsForm.markAsPristine();
    this.reportsForm.markAsUntouched();
  }

  onSelectAll(type) {
    if(type==='delinquencyFacilities'){
      const selected = this.delinquencyFacilities.map(item => item.facilityId);
      this.reportsForm.get('delinquencySelectedFacilitiesIds').patchValue(selected);
    }
  }

  onClearAll(type) {
    if(type==='delinquencyFacilities'){
      this.reportsForm.get('delinquencySelectedFacilitiesIds').patchValue([]);
    }
  }

  exportDelinquencyExcel() {
    var excelData = [];
    this.datasource.forEach((col) => {
      excelData.push({
        'WorkItem Id': col.workItemId,
        'Patient Mrn': col.patientMrn,
        'Factility Name': col.facilityName,
        'Date In': moment(col.dateIn).format('MM/DD/YYYY')
      });
    });

    import("xlsx").then(xlsx => {
      const worksheetDelinq = xlsx.utils.json_to_sheet(excelData);
      const workbook = { Sheets: { 'data': worksheetDelinq }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Delinquency_Report");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE_Delinq = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE_Delinq
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
