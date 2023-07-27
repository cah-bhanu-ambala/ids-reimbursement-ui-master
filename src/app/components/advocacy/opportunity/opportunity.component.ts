import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss']
})
export class OpportunityComponent implements OnInit {

  formAdvocacyOpportunity: FormGroup;
  formAdvOppSearch: FormGroup;
  showAdvOppGrid: boolean;
  advOpploading: boolean;
  advOppDatasource: any;
  advOppSearchResult: any;
  advOppTotalRecords: any;

  showAdvocacyOpportunityForm: boolean = true;
  submitted: boolean = false;
  isUpdate: boolean = false;
  userId: any;
  primaryInsurance: any;
  secondaryInsurance: any;
  advocacyOpportunityTypes: any;
  selectedFiles = [];
  filesList: any[] = [];
  advocacyOpportunityId: number;
  searched = false;
  userRole: string = '';
  showError: boolean;
  isDirty = false;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private advocacyService: AdvocacyService,
    private toastr: ToastrService,
    private ngbModal: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPrimaryInsurance();
    this.getSecondaryInsurance();
    this.getAdvocacyOpportunityTypes();
    this.buildAdvocacySearchForm();
    this.buildAdvocacyOpportunityForm();

    this.userId = localStorage.getItem("userId");
    this.userRole = localStorage.getItem("currentUserRole");
    this.formAdvocacyOpportunity.valueChanges.subscribe(e => {
      if (this.formAdvocacyOpportunity.dirty)
        this.isDirty = true
    });
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  buildAdvocacySearchForm() {
    this.formAdvOppSearch = this.formBuilder.group({
      primaryInsId: new FormControl('', [Validators.required]),
      secondaryInsId: new FormControl('', [Validators.required]),
      // advocacyOpportunityTypeId: new FormControl('', [Validators.required])
    });
  }

  buildAdvocacyOpportunityForm() {
    this.formAdvocacyOpportunity = this.formBuilder.group({
      advocacyOpportunityId: '',
      primaryInsuranceId: new FormControl('', [Validators.required]),
      secondaryInsuranceId: new FormControl('', [Validators.required]),
      advocacyOpportunityTypeId: new FormControl('', [Validators.required]),
      notes: new FormControl('', Validators.maxLength(1200))
    });

  }

  get fa() { return this.formAdvOppSearch != null ? this.formAdvOppSearch.controls : null }
  get f() { return this.formAdvocacyOpportunity != null ? this.formAdvocacyOpportunity.controls : null }

  getPrimaryInsurance() {
    this.advocacyService.getPrimaryInsuranceList().subscribe(
      (result) => {
        this.primaryInsurance = result;
      },
      (err) => {
        console.log(err);
      }
    );

  }

  getSecondaryInsurance() {
    this.advocacyService.getSecondaryInsuranceList().subscribe(
      (result) => {
        this.secondaryInsurance = result;
      },
      (err) => {
        console.log(err);
      }
    );

  }

  getAdvocacyOpportunityTypes() {
    this.advocacyService.getAdvocacyOpportunityTypes().subscribe(
      (result) => {
        this.advocacyOpportunityTypes = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onSearch() {
    //this.loadAdvOppSearchResults(val)
    this.onSearchByPrimInsAndSecondIns()
  }

  onSearchByPrimInsAndSecondIns() {
    this.searched = true
    if (this.formAdvOppSearch.invalid) {
      return false;
    }
    this.showAdvOppGrid = false;
    this.showError = false;
    let advocacyOppParams = {
      'primaryInsuranceId': this.formAdvOppSearch.value['primaryInsId'] != null ? this.formAdvOppSearch.value['primaryInsId'] : '',
      'secondaryInsuranceId': this.formAdvOppSearch.value['secondaryInsId'] != null ? this.formAdvOppSearch.value['secondaryInsId'] : '',
      // 'advocacyOpportunityTypeId': this.formAdvOppSearch.value['advocacyOpportunityTypeId'] != null ? this.formAdvOppSearch.value['advocacyOpportunityTypeId'] : ''
    }

    this.advocacyService.SearchForOpportunities(advocacyOppParams).subscribe(
      (data) => {
        if (data.length > 0) {
          this.showError = false;
          this.showAdvOppGrid = true;
          this.advOppDatasource = data;
          this.advOppTotalRecords = data.length;
          this.advOpploading = false;
        }
        else {
          this.showAdvOppGrid = false;
          this.showError = true;
        }
      },
      (err) => {
        console.log(err);
      }
    );

  }

  loadAdvOppSearchResults(val) {
    this.showAdvOppGrid = false;
    this.advOpploading = true;

    this.advocacyService.SearchForAllOpportunities(val).subscribe((data) => {
      if (data.length > 0) {
        this.showAdvOppGrid = true;
        this.advOppDatasource = data;
        this.advOppTotalRecords = data.length;
        this.advOpploading = false;

      }
    });
  }

  loadAdvOppDetails(event: LazyLoadEvent) {
    this.advOpploading = true;
    setTimeout(() => {
      if (this.advOppDatasource) {
        this.advOppSearchResult = this.advOppDatasource.slice(event.first, (event.first + event.rows));
        this.advOpploading = false;
      }
    }, 500);
  }


  onSubmit() {
    this.submitted = true;
    if (this.formAdvocacyOpportunity.invalid)
      return;
    else {
      let advocacyOpportunity = this.formAdvocacyOpportunity.getRawValue();
      let advocOppId = this.formAdvocacyOpportunity.value != null ? this.formAdvocacyOpportunity.value.advocacyOpportunityId : ''
      advocacyOpportunity.createdBy = this.userId;
      advocacyOpportunity.modifiedBy = this.userId;

      if (advocOppId != null && advocOppId != '') {
        this.advocacyService.updateOpportunityType(advocacyOpportunity).subscribe(
          (result) => {
            this.submitted = false;
            this.isDirty = false;
            this.showSuccess('Updated advocacy opportunity successfully');
            this.isUpdate = false;
            this.onClear();
            // this.loadAdvOppSearchResults('');
            this.onSearch();
          },
          (err) => {
            console.log(err);
            this.showFailure(err);
          }
        );
      } else {

        this.advocacyService.createOpportunityType(advocacyOpportunity).subscribe(
          (result) => {
            this.submitted = false;
            this.isDirty = false;
            this.showSuccess('Created advocacy opportunity successfully');
            this.onClear();
            this.onSearch();
            // this.loadAdvOppSearchResults('');
          },
          (err) => {
            console.log(err);
            this.showFailure(err);
          }
        );
      }
    }
  }

  onEdit(advocacyOpportunity) {
    this.showAdvOppGrid = true;
    this.showAdvocacyOpportunityForm = true;
    this.formAdvocacyOpportunity.patchValue(
      {
        advocacyOpportunityId: advocacyOpportunity.advocacyOpportunityId,
        primaryInsuranceId: advocacyOpportunity.primaryInsuranceId,
        secondaryInsuranceId: advocacyOpportunity.secondaryInsuranceId,
        advocacyOpportunityTypeId: advocacyOpportunity.advocacyOpportunityTypeId,
        notes: advocacyOpportunity.notes
      }
    );
    this.formAdvocacyOpportunity.get('primaryInsuranceId').disable();
    this.formAdvocacyOpportunity.get('secondaryInsuranceId').disable();
    this.formAdvocacyOpportunity.get('advocacyOpportunityTypeId').disable();
    this.isUpdate = true;
  }

  onReset() {
    this.formAdvOppSearch.reset({
      primaryInsId: '',
      secondaryInsId: '',
      advocacyOpportunityTypeId: ''
    });
    // this.loadAdvOppSearchResults('');
    this.showAdvOppGrid = false;
    this.searched = false;
    this.formAdvOppSearch.markAsUntouched();
    this.formAdvOppSearch.markAsPristine();
  }

  onClear() {
    this.formAdvocacyOpportunity.reset({
      primaryInsuranceId: '',
      secondaryInsuranceId: '',
      advocacyOpportunityTypeId: '',
      notes: ''
    });

    this.submitted = false;
    this.isUpdate = false;

    this.formAdvocacyOpportunity.get('primaryInsuranceId').enable();
    this.formAdvocacyOpportunity.get('secondaryInsuranceId').enable();
    this.formAdvocacyOpportunity.get('advocacyOpportunityTypeId').enable();

    this.formAdvocacyOpportunity.markAsUntouched();
    this.formAdvocacyOpportunity.markAsPristine();
  }


  deleteAdvocacyOpportunity(opportunity) {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "delete";
    modal.componentInstance.delete.subscribe(() => {
      this.onDeleteAdvocacyOpportunity(opportunity);
    });
  }

  onDeleteAdvocacyOpportunity(opportunity) {
    this.advocacyService.deleteAdvOpp(opportunity.advocacyOpportunityId, this.userId).subscribe(
      (result) => {
        this.showSuccess('Deleted advocacy opportunity successfully');
        this.onSearch();
        // this.loadAdvOppSearchResults('');
      },
      (err) => {
        console.log(err);
        this.showFailure(err);
      }
    );
  }

  addAttachment(selectedFiles) {
    this.selectedFiles = selectedFiles;
  }

  addFileList(filesList) {
    this.filesList = filesList;
  }

  deleteSelectedFile(selectedFiles, filesList) {
    this.selectedFiles = selectedFiles;
    this.filesList = filesList;
  }


  showSuccess(msg) {
    this.toastr.success(msg);
  }

  showFailure(msg) {
    this.toastr.error(msg);
  }

  showInfo(msg) {
    this.toastr.info(msg);
  }

}
