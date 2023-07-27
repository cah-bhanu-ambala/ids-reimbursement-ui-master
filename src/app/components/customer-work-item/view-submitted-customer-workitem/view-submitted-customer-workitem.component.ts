import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LazyLoadEvent } from 'primeng/api';
import { CustomerWorkitemService } from 'src/app/common/services/http/customer-workitem.service';
import { saveAs } from 'file-saver';
import { ConfirmModalComponent } from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-view-submitted-customer-workitem',
  templateUrl: './view-submitted-customer-workitem.component.html',
  styleUrls: ['./view-submitted-customer-workitem.component.scss']
})
export class ViewSubmittedCustomerWorkitemComponent implements OnInit {

  formSearchSubmittedCWI: FormGroup;
  selectedFacilityId: any[];
  facilities: any[];
  providerList: any[];
  searchResults: any[];
  wiStatuses: any[];
  providerName: any;
  sCWItem: any;
  showSCWI: boolean;
  showError: boolean;
  searched: boolean;
  submitted: boolean;
  dxCodes: string = '';
  dxDesc: string = '';
  drugCodes: string = '';
  drugShortDesc: string = '';

  searchResult: any;
  showGrid: boolean;
  datasource: any;
  totalRecords: any;
  loading: boolean;
  userId: number;
  customerFacilityId: number;
  customerFacilityName: string;

  constructor(
    private formBuilder: FormBuilder,
    private cwiService: CustomerWorkitemService,
    private ngbModal: NgbModal,
    private toastr: ToastrService,
    private change: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    // this.customerFacilityId = parseInt(localStorage.CustomerfacilityId);
    // this.customerFacilityName = localStorage.CustomerfacilityName;
    // this.getFacilityList();
    this.buildSearchForm();
    // this.formSearchSubmittedCWI.addControl('intFacilityId', new FormControl('', [Validators.required]));
    // if (this.customerFacilityId != 0)
    // {
    //   this.onSearch();
    // }
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.formSearchSubmittedCWI = this.formBuilder.group({
      facilityId: 0,
      facilityName: { value: '', disabled: true },
      intFacilityId: ['', Validators.compose([Validators.required])],
      patientMrn: '',
      whoAdded: ''
    });
  }

  get f() {
    return this.formSearchSubmittedCWI != null ? this.formSearchSubmittedCWI.controls : null;
  }

  // getFacilityList() {
  //   this.cwiService.getApprovedFacilities().subscribe(
  //     (result) => {
  //       this.facilities = result;
  //     })
  // }


  loadSubmittedWorkItems(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.datasource) {
        this.searchResult = this.datasource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }


  onSearch() {
    this.showError = false;
    this.searched = true;
    this.showGrid = false;

    if (this.formSearchSubmittedCWI.invalid) {
      return false;
    }
    else {
      let searchSubmittedCWI = this.formSearchSubmittedCWI.value;

      let params = {
        'facilityId': this.formSearchSubmittedCWI.get("intFacilityId").value ,
        'patientMrn': searchSubmittedCWI.patientMrn,
        'whoAdded': searchSubmittedCWI.whoAdded
      };
      this.showError = false;
      this.cwiService.getSubmittedCustomerWorkItems(params).subscribe(
        (result) => {
          if (result.length > 0) {
            this.showGrid = true;
            this.datasource = result;
            this.totalRecords = result.length;
            this.loading = false;
          }
          else {
            this.showGrid = false;
            this.showError = true;
          }
        },
        (err) => {
          this.showGrid = false;
          this.showError = true;
          this.searched = true;
          this.showSCWI = false;
        }
      );
    }
  }

  onReset() {
    this.showGrid = false;
    if(this.formSearchSubmittedCWI.get("patientMrn") !=null) {
      this.formSearchSubmittedCWI.get("patientMrn").reset()
    }
    if(this.formSearchSubmittedCWI.get("intFacilityId") !=null) {
      this.formSearchSubmittedCWI.get("intFacilityId").setValue('')
    }
    this.formSearchSubmittedCWI.get("whoAdded").reset();
  }

  onDelete(custWorkItemId) {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "send a request to delete for";
    modal.componentInstance.delete.subscribe(() => {
      this.deleteWI(custWorkItemId);
    });
  }


  deleteWI(cwiNumber) {
    let params = {
      'svoid': cwiNumber,
      'modifiedBy': this.userId
    };
    this.cwiService.requestToDeleteCustomerWorkItem(params).subscribe(
      (result) => {
        this.showSuccess('Submitted request to delete for customer workitem id: ' + cwiNumber);
        this.cwiService.setwItemInfo(result);
        console.log("deleteCWIResult", result)
        this.onSearch()
      }
    );
  }

  openFile(id, name) {
    this.cwiService.getAttachmentById(id).subscribe(
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

  showSuccess(msg) {
    this.toastr.success(msg);
  }

  showFailure(msg) {
    this.toastr.error(msg);
  }
}
