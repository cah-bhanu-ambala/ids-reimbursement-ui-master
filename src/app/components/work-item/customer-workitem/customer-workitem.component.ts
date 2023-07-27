import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerWorkitemService } from 'src/app/common/services/http/customer-workitem.service';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-customer-workitem',
  templateUrl: './customer-workitem.component.html',
  styleUrls: ['./customer-workitem.component.scss']
})
export class CustomerWorkitemComponent implements OnInit {

  formSearchCustomerWI: FormGroup;
  facilities: any[];
  customerWiStatuses: any[];
  searchResult: any;
  showGrid: boolean;
  searched: boolean;
  datasource: any;
  totalRecords: any;
  loading: boolean;
  selectedFacilityIds: any;
  facilityIds: any;
  userId: number;
  showError: boolean;

  constructor(private formBuilder: FormBuilder
    , private router: Router
    , private customerWiService: CustomerWorkitemService
    , private toastr: ToastrService
    , private change: ChangeDetectorRef
    , private ngbModal: NgbModal

  ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.buildSearchForm();
    this.getFacilityList();
    this.getwiStatuses();
    this.onSearch();
  }

  ngAfterViewChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.formSearchCustomerWI = this.formBuilder.group({
      facilityIds: [''],
      workItemStatusId: { value: 1, disabled: true },
      teamMemberId: [''],
      mrn: ['']
    });
  }

  get sf() { return this.formSearchCustomerWI != null ? this.formSearchCustomerWI.controls : null; }


  getFacilityList() {
    this.customerWiService.getApprovedFacilities().subscribe(
      (result) => {
        this.facilities = result;

      },
      (err) => { }
    );
  }

  getwiStatuses() {
    this.customerWiService.getwiStatuses().subscribe(
      (result) => {
        this.customerWiStatuses = result;
      },
      (err) => { }
    );
  }

  onSearch() {
    this.searched = true;
    this.showError = false;
    //Check form is valid or not
    if (this.formSearchCustomerWI.invalid) {
      return false;
    }
    else {
      this.showGrid = false;
      let searchCustomerWI = this.formSearchCustomerWI.value;

      let CustomerWorkItemParams = {
        'facilityIds': this.formSearchCustomerWI.value['facilityIds'] != null ? this.formSearchCustomerWI.value['facilityIds'] : '',
        'statusIds': 1,
        'teamMemberId': searchCustomerWI.teamMemberId != null ? searchCustomerWI.teamMemberId : ''
      }

      this.customerWiService.getCustomerSubmittedWorkItem(CustomerWorkItemParams).subscribe(
        (data) => {
          if (data.length > 0) {
            this.showGrid = true;
            this.datasource = data;
            this.totalRecords = data.length;
            this.loading = false;
          }
          else {
            this.showGrid = false;
            this.showError = true;
          }

        },
        (err) => {
          console.log(err);
        }
      );
    }

  }


  loadCustomerWorkItemDetails(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.datasource) {
        this.searchResult = this.datasource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }

  openFile(id, name) {
    this.customerWiService.getAttachmentById(id).subscribe(
      (response) => {
        let mediaType = response.type;
        let blob = new Blob([response], { type: mediaType });
        var url = window.URL.createObjectURL(blob);
        if (mediaType == 'application/pdf' || mediaType == 'image/jpeg' || mediaType == 'image/png') {
          window.open(url);
        } else {
          saveAs(blob, name);
        }
      }, err => {
        this.showFailure('Failed to Open the file!');
        console.log(err);
      });
  }

  getIcdCodesInfo(icdCodes) {
    let icdCodeValues = [];
    icdCodes.forEach((element, idx) => {
      if (idx <= 2)
        icdCodeValues.push(element.icdCode)
    });
    return icdCodeValues;
  }

  getdrugCodeInfo(drugCodes) {
    let drugCodeValues = [];
    drugCodes.forEach((element, idx) => {
      if (idx <= 2)
        drugCodeValues.push(element.drugProcCode)
    });
    return drugCodeValues;
  }

  onSelectAll(type) {
    if (type === 'facilities') {
      const selected = this.facilities.map(item => item.facilityId);
      this.formSearchCustomerWI.get('facilityIds').patchValue(selected);
    }
  }

  onClearAll(type) {
    if (type === 'facilities') {
      this.formSearchCustomerWI.get('facilityIds').patchValue([]);
    }
  }

  addPatient(customerWorkItem) {
    let params: NavigationExtras = {
      queryParams: {
        "facilityId": customerWorkItem.facilityId,
        "mrn": customerWorkItem.patientMrn,
        "primaryInsuranceId": 'U',
        'customerWorkItemId': customerWorkItem.customerWorkItemId
      }
    }
    this.router.navigate(['/dashboard/support/patientMaintenance'], params);
  }

  onDelete(custWorkItemId) {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "delete";
    modal.componentInstance.delete.subscribe(() => {
      this.deleteWI(custWorkItemId);
    });
  }


  deleteWI(cwiNumber) {
    let params = {
      'customerWorkItemId': cwiNumber,
      'modifiedBy': this.userId
    };
    this.customerWiService.deleteCustomerWorkItem(params).subscribe(
      (result) => {
        this.showSuccess('Deleted successfully! ' + result.customerWorkItemId);
        this.onSearch()
      }
    );
  }

  addNewWorkItem(customerWorkItem) {
    let params: NavigationExtras = {
      queryParams: {
        "customerWorkItemNumber": customerWorkItem.customerWorkItemId,
        "patientId": customerWorkItem.patientId,
      }
    }
    this.router.navigate(['/dashboard/workmenu/addInternalWorkItem'], params);
  }

  onReset() {
    this.searched = false;
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
