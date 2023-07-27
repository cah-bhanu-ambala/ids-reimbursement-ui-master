import { AfterContentChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerReportsService } from 'src/app/common/services/http/customer-reports.service';
import { ReportsService } from 'src/app/common/services/http/reports.service';

@Component({
  selector: 'app-customer-secured-advocacy',
  templateUrl: './customer-secured-advocacy.component.html',
  styleUrls: ['./customer-secured-advocacy.component.scss']
})

export class CustomerSecuredAdvocacyComponent implements OnInit, AfterContentChecked {

  reportsAdvocacyForm: FormGroup;
  facilitiesList: any[];

  searched: boolean;
  showGrid: boolean;
  showError: boolean;
  userId: number = 1;

  datasource: any[];
  resultList: any[];
  resultListDetails: any[];
  loading: boolean;
  totalRecords: number;
  facility: any;

  cols: any[];
  exportColumns: any[] = [];

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
    this.reportsAdvocacyForm = this.formBuilder.group({
      facilityId: 0,
      facilityName: {value:'', disabled: true},
      mrn: ['', Validators.required],
      dateCreatedFrom: ['', Validators.required],
      dateCreatedTo: ['', Validators.required],
      intFacilityId: ['', Validators.compose([Validators.required])]
    });
  }

  get sf() {
    return this.reportsAdvocacyForm != null ? this.reportsAdvocacyForm.controls : null;
  }

  getReportsData() {
    this.showGrid = false;
    this.searched = true;
    if (this.reportsAdvocacyForm.invalid) {
      return false;
    }
    else {
    let selectedDateFrom = this.reportsAdvocacyForm.value.dateCreatedFrom;
    let selectedDateTo = this.reportsAdvocacyForm.value.dateCreatedTo;

    let formattedDateFrom = selectedDateFrom != null ? moment(selectedDateFrom).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;
    let formattedDateTo = selectedDateTo != null ? moment(selectedDateTo).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;

    let params = {
      dateOutFrom: formattedDateFrom,
      dateOutTo: formattedDateTo,
      facilityId: this.reportsAdvocacyForm.get('intFacilityId').value,
      mrn: this.reportsAdvocacyForm.value.mrn
    };

      this.showError = false;
      this.custReportsService.getSecureAdvocacyReport(params).subscribe(data => {
        if (data.length > 0) {
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

  loadAdvocacyReport(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.datasource) {
        if (Array.isArray(this.datasource)) {
          this.resultList = this.datasource.slice(event.first, (event.first + event.rows));
        } else
          this.resultList = [this.datasource].slice(event.first, (event.first + event.rows));

        this.loading = false;

        this.facility = this.resultList[0];

        this.loading = false;
      }
    }, 500);
  }

  onReset() {
    this.reportsAdvocacyForm.patchValue({
      dateCreatedFrom: null,
      dateCreatedTo: null,
      mrn: ''
    });
    this.showGrid = false;
    this.showError = false;
    this.searched = false;
    this.reportsAdvocacyForm.markAsUntouched();
    this.reportsAdvocacyForm.markAsPristine();
  }

  exportAdvocacyExcel() {
    var excelData = [];

    this.resultList.forEach((col) => {
      excelData.push({
        'Facility Name': col.facilityName,
        'Advocacy Type': col.advocacyTypeName,
        'Maximum Availed': col.maxAmountAvail
      });
    });

    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(excelData);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsAdvocacyExcelFile(excelBuffer, "CustomerSecuredAdvocacy_Report");
    });
  }

  saveAsAdvocacyExcelFile(buffer: any, fileName: string): void {
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
