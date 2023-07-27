import { AfterContentChecked, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { saveAs } from 'file-saver';
import { CommonService } from 'src/app/common/services/http/common.service';
import * as moment from 'moment';
import { Table } from 'primeng/table';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-advocacy-maintenance',
  templateUrl: './advocacy-maintenance.component.html',
  styleUrls: ['./advocacy-maintenance.component.scss']
})

export class AdvocacyMaintenanceComponent implements OnInit, AfterContentChecked {

  SUPERUSER_ROLE = 'Superuser';
  TEAMLEAD_ROLE = 'Team Lead';
  formSearchAdvocacy: FormGroup;
  searchResult: any[];
  facilities: any[];
  advocacyStatuses: any[];
  showGrid: boolean;
  showExport:boolean;
  searched: boolean;
  drugList: any[];
  userId: number;
  currentUserRole: any;
  selectedFacilitiesIds: any[];
  resultGridloading: boolean;
  totalSearchRecords: any;
  showError: boolean;
  facilitiesList: any[];
  advocacyEndCutoff: Date;
  advocacyStartDate: Date;

  pageNum: any;
  pageSize: any;
  orderBy: any;
  defaultSort: any[] = ["advocacyId -1"];
  loading: boolean;
  advocacySearchParam: any;
  totalRecords: any;
  totalExcelRecordsToExport: any;
  advocacyDatasource: any;
  dataSourceForExcelExport: any;
  pagination: boolean=true;

  constructor(private formBuilder: FormBuilder,
    private patientService: PatientService,
    private advocacyService: AdvocacyService,
    private commonService: CommonService,
    private toastr: ToastrService,
    private ngbModal: NgbModal,
    private router: Router,
    private change: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.currentUserRole = localStorage.getItem("currentUserRole");
    this.buildSearchForm();
    this.getFacilityList();
    this.getAdvocacyStatuses();
    this.onSearch();
    this.setExportFlag();
    this.advocacyEndCutoff = new Date();
    this.advocacyEndCutoff.setDate(new Date().getDate() + 30);
    this.advocacyEndCutoff.setTime( this.advocacyEndCutoff.getTime() + this.advocacyEndCutoff.getTimezoneOffset()*60*1000 );

    this.advocacyStartDate = new Date();
    this.advocacyStartDate.setTime( this.advocacyStartDate.getTime() + this.advocacyStartDate.getTimezoneOffset()*60*1000 );
    this.advocacyStartDate.setHours(0);
    this.advocacyStartDate.setMinutes(0);
    this.advocacyStartDate.setSeconds(0);
    this.advocacyStartDate.setMilliseconds(0);
  }

  buildSearchForm() {
    this.formSearchAdvocacy = this.formBuilder.group({
      patientMrn:'',
      selectedFacilitiesIds: [''],
      selectedAdvocacyStatusIds: ['']
    });
  }

  get sf() { return this.formSearchAdvocacy != null ? this.formSearchAdvocacy.controls : null; }


  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  getFacilityList() {
    this.advocacyService.getFacilityList().subscribe(
      (result) => {
        this.facilitiesList = result;
      },
      (err) => { }
    );
  }

  getAdvocacyStatuses() {
    this.advocacyService.getAllAdvocacyStatus().subscribe(
      (result) => {
        this.advocacyStatuses = result;
      },
      (err) => { }
    );
  }

  setExportFlag(){
    if(this.currentUserRole == this.SUPERUSER_ROLE || this.currentUserRole == this.TEAMLEAD_ROLE){
      this.showExport = true;
    } else {
      this.showExport = false;
    }
  }

  downloadFile(id, name) {
    this.patientService.getAttachmentById(id).subscribe(
        (response) => {
          let mediaType = response.type;
          let blob = new Blob([response], {type: mediaType});
          saveAs(blob, name);
        }, err =>{
          this.showFailure('Failed to dowload the file!');
          console.log(err);
        });
  }

  openFile(id, name) {
    this.patientService.getAttachmentById(id).subscribe(
        (response) => {
          let mediaType = response.type;
          let blob = new Blob([response], {type: mediaType});
          var url = window.URL.createObjectURL(blob);
          if(mediaType == 'application/pdf' || mediaType =='image/jpeg' || mediaType =='image/png'){
            window.open(url);
          }else{
            saveAs(blob, name);
          }
        }, err =>{
          this.showFailure('Failed to Open the file!');
          console.log(err);
        });
  }

  onEdit(advocacyId) {
    let params: NavigationExtras = {
      queryParams: {
        "advocacyId": advocacyId
      }
    }
    this.router.navigate(['/dashboard/advocacy/editAdvocacy'], params);
  }


  onDelete(advocacyId) {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "delete";
    modal.componentInstance.delete.subscribe(() => {
      this.deleteAdvocacy(advocacyId);
    });
  }
  deleteAdvocacy(advocacyId) {
    let params={
      svoId: advocacyId,
      modifiedBy : this.userId
    }
    this.patientService.deleteAdvocacyById(params).subscribe(
      (result) => {
        this.showSuccess('Successfully deleted Advocacy #'+advocacyId);
        this.onSearch();
      },
      err=>{
        this.showFailure('Failed to Delete Advocacy #'+advocacyId);
      }
    );
  }

  onResetSF(){
    this.formSearchAdvocacy.get('selectedFacilitiesIds').patchValue([])
    this.formSearchAdvocacy.get('selectedAdvocacyStatusIds').patchValue([]);
    this.formSearchAdvocacy.get("patientMrn").reset();
    this.showGrid = false;
    this.searched = false;
    this.formSearchAdvocacy.reset();
    this.formSearchAdvocacy.markAsPristine();
    this.formSearchAdvocacy.markAsUntouched();
  }

    loadAdvocacyMaintenancePage(event: LazyLoadEvent) {
    this.pageNum = event.first/event.rows;
    this.advocacySearchParam.pageNum = this.pageNum;
    this.pageSize = event.rows;
    this.advocacySearchParam.pageSize = this.pageSize;

    let multiSortMeta = event.multiSortMeta;
    if(multiSortMeta) {
    this.orderBy = multiSortMeta.map(sort => sort.field + " " + sort.order);
      this.advocacySearchParam.orderBy = this.orderBy ;
    }
    else {
      this.orderBy = this.defaultSort;
      this.advocacySearchParam.orderBy = this.defaultSort;
    }

    this.updateTable();
    this.showGrid = true;
  }


  onSearch() {
    this.pagination=true;
    let searchAdvocacy = this.formSearchAdvocacy.value;
     if(this)
        this.advocacySearchParam= {
                'patientMrnsearchParam': this.formSearchAdvocacy.get('patientMrn').value != null ? this.formSearchAdvocacy.get('patientMrn').value : '',
                'facilityIdSearchParam': searchAdvocacy.selectedFacilitiesIds != null ? searchAdvocacy.selectedFacilitiesIds : '',
                'advStatusIdSearchParam': searchAdvocacy.selectedAdvocacyStatusIds != null ? searchAdvocacy.selectedAdvocacyStatusIds : '' ,
                'pageNum': this.pageNum? this.pageNum : 0,
                'pageSize': this.pageSize? this.pageSize : 5,
                'orderBy':this.orderBy? this.orderBy:this.defaultSort,
                'pagination':this.pagination
              }
    this.updateTable();
  }

  updateTable() {
      this.loading = true;
      this.advocacyService.getAdvocacyMaintenanceSearchParamsForPagination(this.advocacySearchParam).subscribe((data) => {
      this.advocacyDatasource = data.content;
      this.totalRecords = data.totalElements;
      this.loading = false;
      this.showGrid = true;
    })
  }

  getDataSetForExcel() {
      let excelSearchParam = {...this.advocacySearchParam};
      excelSearchParam['pagination'] = false;
      this.advocacyService.getAdvocacyMaintenanceSearchParamsForPagination(excelSearchParam).subscribe((excelData) => {
      this.dataSourceForExcelExport = excelData.content;
      this.totalExcelRecordsToExport = excelData.totalElements;
      this.exportDataToExcel(this.dataSourceForExcelExport);

    })
  }

exportDataToExcel(excelData) {
    var dataForExcelExport = [];
    let excelExportData = [];
    excelExportData = excelData;
    excelExportData.forEach((column) => {
      dataForExcelExport.push({
         'Advocacy': column.advocacyId,
        'MRN': column.patientMrn,
        'Facility': column.facilityName,
        'Advocacy Status': column.advocacyStatusName,
        'Advocacy Type': column.advocacyTypeName,
        'Advocacy Source': column.advocacySource,
        'Insurance Type': column.insuranceType,
        'Insurance Name': column.insuranceName,
        'Diagnosis for Advocacy': column.icdCode,
        'Drug for Advocacy': column.drugProcCode,
        'Start Date': column.startDate != null ? moment(column.startDate).utc().format('MM/DD/YYYY').toString() : null,
        'End Date': column.endDate != null ? moment(column.endDate).utc().format('MM/DD/YYYY').toString() : null,
        'Look Back': column.lookBack,
        'Look Back Start Date': column.lookBackStartDate != null ? moment(column.lookBackStartDate).utc().format('MM/DD/YYYY').toString() : null,
        'Maximum Amount': column.maxAmountAvail,
        'Notes': column.notes,
        'Date It Was added': column.createdDate != null ? moment(column.createdDate).utc().format('MM/DD/YYYY').toString() : null

              });
    });

    import("xlsx").then(xlsx => {
      const advocacyWorksheet = xlsx.utils.json_to_sheet(dataForExcelExport);
      const workbook = { Sheets: { 'data': advocacyWorksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, "Advocacy_Maintenance");
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let FILE_EXTENSION = '.xlsx';
      const dataforExport: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(dataforExport, fileName + '_' + moment(new Date()).format('YYYY_MM_DD_HH_mm_ss') + FILE_EXTENSION);
    });
  }
onSelectAll(type) {
    if (type === 'facilities') {
      const selected = this.facilitiesList.map(item => item.facilityId);
      this.formSearchAdvocacy.get('selectedFacilitiesIds').patchValue(selected);
    }else if(type === 'advocacyStatuses'){
      const selected = this.advocacyStatuses.map(item => item.advocacyStatusId);
      this.formSearchAdvocacy.get('selectedAdvocacyStatusIds').patchValue(selected);
    }
  }

  onClearAll(type) {
    if (type === 'facilities') {
      this.formSearchAdvocacy.get('selectedFacilitiesIds').patchValue([]);
    }
    else if (type === 'advocacyStatuses') {
       this.formSearchAdvocacy.get('selectedAdvocacyStatusIds').patchValue([]);
    }
  }
  showSuccess(msg) {
    this.toastr.success(msg);
  }
  showInfo(msg) {
    this.toastr.info(msg);
  }
  showFailure(msg) {
    this.toastr.error(msg);
  }
}
