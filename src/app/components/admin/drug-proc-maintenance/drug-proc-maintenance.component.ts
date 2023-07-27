import { ChangeDetectorRef, Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { alphaNumericValidator } from 'src/app/common/utils';
import { DrugOrProc } from 'src/app/models/classes/drug-or-proc';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/common/services/http/common.service';
import { DrugprocService } from 'src/app/common/services/http/drugproc.service';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-drug-proc-maintenance',
  templateUrl: './drug-proc-maintenance.component.html',
  styleUrls: ['./drug-proc-maintenance.component.scss']
})
export class DrugProcMaintenanceComponent implements OnInit {
  @ViewChild('drugProcTable') drugProcTable: Table;

  drugForm: FormGroup;
  submitted: boolean;
  isUpdate: boolean;
  searched: boolean;
  drugId: number;
  drugOrProcList: DrugOrProc[];
  drugorproc: DrugOrProc;
  searchResult: any[];
  showForm: boolean;
  drugSearchParam: any = {};
  errorMessage: any;
  showError: boolean;
  isReadOnly: boolean;

  showViewDrugGrid: boolean;
  drugProcloading: boolean;
  drugDatasource: any;
  drugTotalRecords: any;
  isDirty = false;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private drugprocService: DrugprocService,
    private ngbModal: NgbModal,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.buildDrugForm();
    this.onSearch('');
    this.showForm = false;
    this.drugForm.valueChanges.subscribe( e => this.isDirty = true );
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  buildDrugForm() {
    this.drugForm = this.formBuilder.group({
      drugProcCode: new FormControl('', [Validators.required]),
      shortDesc: new FormControl('', [Validators.required]),
      longDesc: new FormControl('', [Validators.required]),
      brandName: new FormControl(''),
      genericName: new FormControl(''),
      lcd: new FormControl('', [Validators.maxLength(7), Validators.pattern(alphaNumericValidator)]),
      notes: new FormControl('', [Validators.maxLength(1000)])
    });
  }

  get f() { return this.drugForm != null ? this.drugForm.controls : null; }


  getDrugsByCode() {
    let drugCode = this.drugForm.controls['drugProcCode'].value != null ? this.drugForm.controls['drugProcCode'].value : '';
    this.drugprocService.getDrugsByCode(drugCode).subscribe
      (
        (result) => {
          if (result != null) {
            this.drugorproc = result;
            this.drugForm.patchValue(
              {
                longDesc: this.drugorproc.longDesc,
                shortDesc: this.drugorproc.shortDesc,
                brandName: this.drugorproc.brandName,
                genericName: this.drugorproc.genericName,
                lcd: this.drugorproc.lcd,
                notes: this.drugorproc.notes
              });
          }
        }, err => console.log(err)
      );
  }

  onSubmit() {
    this.submitted = true;

    //Check form is valid or not
    if (this.drugForm.invalid) {
      return false;
    }
    else {
      let drugOrProc = new DrugOrProc();
      drugOrProc = this.drugForm.value;
      drugOrProc.active = true;
      drugOrProc.modifiedBy = parseInt(localStorage.userId);
      drugOrProc.drugId = this.drugId;
      this.drugprocService.updateDrugProc(drugOrProc).subscribe(
        (result) => {
          this.showSuccess(`Updated Drug/Procedure Code ${drugOrProc.drugProcCode} successfully`);
          this.showForm = false;
          this.isDirty = false;
          //this.drugForm.reset();
          this.onReset();
          this.onSearch('');
        },
        (err) => {
          // this.errorMessage=err;
          this.showFailure(err)
        }
      );
    }
  }

  onEdit(drug) {
    this.showForm = true;
    this.showViewDrugGrid = false;
    this.isReadOnly = true;
    this.drugForm.setValue(
      {
        drugProcCode: drug.drugProcCode,
        shortDesc: drug.shortDesc,
        longDesc: drug.longDesc,
        brandName: drug.brandName,
        genericName: drug.genericName,
        lcd: drug.lcd,
        notes: drug.notes
      }
    );
    this.drugId = drug.drugId;
    this.isUpdate = true;
  }

  onDelete(drugId) {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "delete";
    modal.componentInstance.delete.subscribe(() => {
      this.deleteDrug(drugId);
    });
  }

  deleteDrug(drugId) {
    this.drugprocService.deleteDrugProc(drugId, parseInt(localStorage.userId)).subscribe(
      (result) => {
        this.onSearch('');
      }
    );
  }


  onSearch(val) {
    this.drugSearchParam.searchParam = val;
    this.drugSearchParam.pageNum = 0;
    this.drugSearchParam.pageSize = 5;
    this.showViewDrugGrid = true;
    if(this.drugProcTable) {
      this.drugProcTable.reset();
    }
  }

  loadSearchResults() {
    this.drugProcloading = true;
    this.showError = false;
    this.drugprocService.searchByDrugProc(this.drugSearchParam.searchParam, this.drugSearchParam.pageNum, this.drugSearchParam.pageSize).subscribe((data) => {
      if (data != null && data.totalElements > 0) {
        this.showForm = false;
        this.drugDatasource = data.content;
        this.drugTotalRecords = data.totalElements;
        this.drugProcloading = false;
      }
      else {
        this.showError = true;
      }
    });
  }

  loadDrugDetails(event: LazyLoadEvent) {
    this.drugProcloading = true;
    this.drugSearchParam.pageNum = event.first/event.rows;
    this.drugSearchParam.pageSize = event.rows;
    this.loadSearchResults();
  }

  onReset() {
    this.drugForm.markAsPristine();
    this.drugForm.markAsUntouched();
    this.drugForm.get('lcd').setValue('');
    this.drugForm.get('notes').setValue('');
    this.submitted = false;
  }

  onCancel() {
    this.showForm = false;
    this.submitted = false;
    this.onSearch('');
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
