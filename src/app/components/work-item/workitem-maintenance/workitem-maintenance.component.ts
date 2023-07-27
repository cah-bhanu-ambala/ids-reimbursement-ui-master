import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';

@Component({
  selector: 'app-workitem-maintenance',
  templateUrl: './workitem-maintenance.component.html',
  styleUrls: ['./workitem-maintenance.component.scss']
})
export class WorkitemMaintenanceComponent implements OnInit {

  @ViewChild('wiTable') wiTable: Table;

  formSearchWI: FormGroup;
  facilities: any[];
  wiStatuses: any[];
  wiTeamMembers: any[];
  orderTypes: any[];
  workItemMaintenaceParams: any;
  searchResult: any;
  showGrid: boolean;
  searched: boolean;
  datasource: any;
  totalRecords: any;
  loading: boolean;
  showError: boolean;

  defaultSort: any[] = ["workItemId -1"];

  userIdMap: Map<number, string>;

  constructor(private formBuilder: FormBuilder
    , private router: Router
    , private wiService: WorkitemService
    , private toastr: ToastrService
    , private change: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.buildSearchForm();
    this.getFacilityList();
    this.getwiStatuses();
    this.getTeamMembers();
    this.getOrderTypes();
  }

  ngAfterViewChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.formSearchWI = this.formBuilder.group({
      mrn: [''],
      facilityId: [''],
      workItemStatusId: [''],
      teamMemberId: [''],
      orderTypeId: [''],
      dateOut: [null]
    });
  }

  get sf() { return this.formSearchWI != null ? this.formSearchWI.controls : null; }


  getFacilityList() {
    this.wiService.getApprovedFacilities().subscribe(
      (result) => {
        this.facilities = result;
      },
      (err) => { }
    );
  }

  getwiStatuses() {
    this.wiService.getwiStatuses().subscribe(
      (result) => {
        this.wiStatuses = result;
      },
      (err) => { }
    );
  }
  getTeamMembers() {
    this.wiService.getAllTeamMembers().subscribe(
      (result) => {
        this.wiTeamMembers = result;
        this.userIdMap = new Map<number, string>();
        // for(const user of result) {
        //   this.userIdMap.set(user['userId'], user['userName']);
        // }
        for(let i = 0; i < result.length; i++) {
          let user = result[i];
          this.userIdMap.set(user.userId, user.userName);
        }
      },
      (err) => { }
    );
  }

  getOrderTypes() {
    this.wiService.getOrderTypes().subscribe(
      (result) => {
        this.orderTypes = result;
      },
      (err) => { }
    );
  }

  onSearch() {
    this.searched = true;

    //Check form is valid or not
    if (this.formSearchWI.invalid) {
      return false;
    }
    else {
      this.showGrid = false;
      this.showError = false;
      let searchWI = this.formSearchWI.value;

      this.workItemMaintenaceParams = {
        'facilityId': this.formSearchWI.value['facilityId'] != null ? this.formSearchWI.value['facilityId'] : '',
        'patientMrn': this.formSearchWI.value['mrn'] != null ? this.formSearchWI.value['mrn'] : '',
        'workItemStatusId': this.formSearchWI.value['workItemStatusId'] != null ? this.formSearchWI.value['workItemStatusId'] : '',
        'dateOut': (searchWI.dateOut != null) ? (searchWI.dateOut.year + '-' + searchWI.dateOut.month + '-' + searchWI.dateOut.day) : '',
        'orderTypeId': this.formSearchWI.value['orderTypeId'] ?? '',
        'teamMemberId': searchWI.teamMemberId != null ? searchWI.teamMemberId : '',
        'pageNum': 0,
        'pageSize': 10,
        'orderBy': this.defaultSort
      }

      this.showGrid = true;
      if( this.wiTable){
        this.wiTable.reset();
      }
    }

  }

  loadWorkItemDetails(event: LazyLoadEvent) {
    this.workItemMaintenaceParams.pageNum = event.first/event.rows;
    this.workItemMaintenaceParams.pageSize = event.rows;

    let multiSortMeta = event.multiSortMeta;
    if(multiSortMeta) {
      this.workItemMaintenaceParams.orderBy = multiSortMeta.map(sort => sort.field + " " + sort.order);
    }
    else {
      this.workItemMaintenaceParams.orderBy = this.defaultSort;
    }

    this.updateTable();
  }

  updateTable() {
    this.loading = true;
    this.wiService.getWorkItemsPage(this.workItemMaintenaceParams).subscribe((data) => {
      this.datasource = data.content;
      this.totalRecords = data.totalElements;
      this.loading = false;
    })
  }

  onReset() {
    this.formSearchWI.get("facilityId").setValue('');
    this.formSearchWI.get("mrn").reset();
    this.formSearchWI.get("workItemStatusId").setValue('');
    this.formSearchWI.get("teamMemberId").setValue('');
    this.formSearchWI.get("orderTypeId").setValue('');
    this.formSearchWI.get("dateOut").setValue(null);
    this.showGrid = false;
  }

  onEdit(wiNumber) {
    let params: NavigationExtras = {
      queryParams: {
        "workItemNumber": wiNumber
      }
    }
    this.router.navigate(['/dashboard/workmenu/editWorkItem'], params);
  }

  showSuccess(msg) {
    this.toastr.success(msg);
  }

  showInfo(msg) {
    this.toastr.info(msg);
  }

  showFailure(msg) {
    this.toastr.error(msg)
  }
}
