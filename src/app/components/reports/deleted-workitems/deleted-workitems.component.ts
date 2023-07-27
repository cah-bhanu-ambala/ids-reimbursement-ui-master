import { Component, OnInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-deleted-workitems',
  templateUrl: './deleted-workitems.component.html',
  styleUrls: ['./deleted-workitems.component.scss']
})

export class DeletedWorkitemsComponent implements OnInit, AfterContentChecked {

  deleteWiReportsForm: FormGroup;
  facilities: any[];
  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  selectedFacilitiesIds: any[];
  userId: number = 1;
  deleteWiDatasource: any[];
  deletedWorkItemList: any[];
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
    this.getFacilityList();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.deleteWiReportsForm = this.formBuilder.group({
      dateOutTo: ['', Validators.compose([Validators.required])],
      dateOutFrom: ['', Validators.compose([Validators.required])],
      selectedFacilitiesIds:['', Validators.compose([Validators.required])]
    });
  }

  get sf() {
    return this.deleteWiReportsForm != null ? this.deleteWiReportsForm.controls : null;
  }

  getFacilityList() {
    this.reports.getAllFacilities().subscribe(
      (result) => {
        this.facilities = result;
      },
      (err) => { }
    );
  }

  getReport() {
    this.showGrid = false;
    let dateOutFromDate = this.deleteWiReportsForm.value.dateOutFrom;
    let dateOutToDate = this.deleteWiReportsForm.value.dateOutTo;

    let formatteddateOutFromInDate = dateOutFromDate != null ? moment(dateOutFromDate).subtract(1, 'M' ).format("MM/DD/YYYY").toString() : null;
    let formatteddateOutToDate = dateOutToDate != null ? moment(dateOutToDate).subtract(1, 'M' ).add(1, 'd').format("MM/DD/YYYY").toString() : null;
    let params = {
      // facilityId: this.deleteWiReportsForm.get('selectedFacilitiesIds').value[0]
      facilityIds:this.deleteWiReportsForm.get('selectedFacilitiesIds').value,
      dateOutFrom: formatteddateOutFromInDate,
      dateOutTo: formatteddateOutToDate,
      userId: this.userId
    };
    console.log(params);

    if (this.deleteWiReportsForm.invalid) {
      this.showError = true;
      // this.showFailure('Please select any facility or valid date')
      this.searched = true;
      this.showGrid = false;
      return false;
    }
    else {
      this.showError = false;
      this.reports.getdeletedWorkItemDetails(params).subscribe(data => {
        if(data.length > 0){
        this.deleteWiDatasource = data;
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
      if (this.deleteWiDatasource) {
        this.deletedWorkItemList = this.deleteWiDatasource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }

  onReset() {
    this.selectedFacilitiesIds = [];
    this.deleteWiReportsForm.patchValue({
      selectedFacilitiesIds:[],
      dateIn: null
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.deleteWiReportsForm.markAsPristine();
    this.deleteWiReportsForm.markAsUntouched();
  }

  onSelectAll(type) {
    if(type==='facilities'){
      const selected = this.facilities.map(item => item.facilityId);
      this.deleteWiReportsForm.get('selectedFacilitiesIds').patchValue(selected);
    }
  }

  onClearAll(type) {
    if(type==='facilities'){
      this.deleteWiReportsForm.get('selectedFacilitiesIds').patchValue([]);
    }
  }

  exportExcel() {
    var deleteWiexcelData = [];
    this.deleteWiDatasource.forEach((col) => {
      deleteWiexcelData.push({
        'WorkItem Id': col.workItemId,
        'Patient Mrn': col.patientMrn,
        'Factility Name': col.facilityName,
        'Date In': moment(col.dateIn).format('MM/DD/YYYY')
      });
    });

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(deleteWiexcelData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsDeleteWiExcelFile(excelBuffer, "deletedWorkItem_Report");
    });
  }

  saveAsDeleteWiExcelFile(buffer: any, fileName: string): void {
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
