import { AfterContentChecked } from '@angular/core';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormArray,
  FormControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { Observable, Subject, concat, of, forkJoin } from 'rxjs';
import { filter,distinctUntilChanged,debounceTime,tap,switchMap,catchError } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../shared/confirm-modal/confirm-modal.component';

import { AdvocacyService } from 'src/app/common/services/http/advocacy.service';
import { CommonService } from 'src/app/common/services/http/common.service';
import { DrugAdvocacyClearanceService } from 'src/app/common/services/http/drug-advocacy-clearance.service';

import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { InputModalComponent } from '../../shared/input-modal/input-modal.component';

@Component({
  selector: 'app-drug-advocacy-clearance',
  templateUrl: './drug-advocacy-clearance.component.html',
  styleUrls: ['./drug-advocacy-clearance.component.scss'],
})
export class DrugAdvocacyClearanceComponent
  implements OnInit, AfterContentChecked {
  userId: number;

  drugAdvocacyClearanceForm: FormGroup;
  advClearanceSearchForm: FormGroup;

  advClearshowAddICDGrid = false;
  isUpdate = false;
  searched = false;
  advClearshowGrid: boolean;

  advloading: boolean;
  advClearadvDatasource: any;
  advClearSearchResult: any;
  advTotalRecords: any;

  icdCodesFiltered$: Observable<any>;
  icdCodesLoading = false;
  icdCodesInput$ = new Subject<string>();
  advClearselectedIcdCodes: any;
  selectedSecInsIds: any;
  minLengthTerm = 2;
  advClearsIcdSearchResult: any;
  icdDatasource: any;
  icdtotalRecords: any;
  icdloading: boolean;

  drugCodesFiltered$: Observable<any>;
  drugCodesLoading = false;
  drugCodesInput$ = new Subject<string>();
  selectedDrugCode: any;

  advClearsDrugSearchResult: any;
  advClearDrugDatasource: any;
  drugtotalRecords: any;
  drugloading: boolean;
  noOfICDCodes = 1;

  advClearsIcdList: any[];
  advClearprimaryInsurance: any[];
  advClearSecondaryInsurance: any[];
  advClearWiApprovalReasons: any[];
  webSitesList: any[];
  advClearAdvocacyInfo: any;
  icdInfo = {};
  advocacyClearanceTypes: any[];
  advClearanceOptions: any[] = [
    {
      'value': true,
      'label': 'Yes'
    },
    {
      'value': false,
      'label': 'No'
    }
  ];
  modal: NgbModalRef;
  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private wiService: WorkitemService,
    private drugAdvocacyClearanceService: DrugAdvocacyClearanceService,
    private advocacyService: AdvocacyService,
    private change: ChangeDetectorRef,
    private ngbModal: NgbModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getIcdList();
    this.getPrimaryInsurance();
    this.getSecondaryInsurance();
    this.userId = parseInt(localStorage.userId);
    this.advClearselectedIcdCodes = [];

    this.buildAdvocacySearchForm();
    this.buildAdvocacyForm();
    this.loadIcdClearanceCodes();
    this.loadDrugCodes();
    this.getApprovalReasons();
    this.getAdvocacyTypes();
    this.onClearanceSearch();
    
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  getAdvocacyTypes() {
    this.advocacyService.getAllAdvocacyTypes().subscribe(
      (result) => {
        this.advocacyClearanceTypes = result;
      },
      (err) => { }
    );
  }

  buildAdvocacySearchForm() {
    this.advClearanceSearchForm = this.formBuilder.group({
      drugId: new FormControl(null),
      icdCode: new FormControl(null),
      primaryInsuranceId: new FormControl(''),
      secondaryInsuranceId: new FormControl(''),
      priorAuthStatusId: new FormControl(''),
      clearance:  new FormControl('')
    });
  }

  buildAdvocacyForm() {
    this.drugAdvocacyClearanceForm = this.formBuilder.group({
      drugId: new FormControl(null, Validators.compose([Validators.required])),
      icdId: new FormControl(null, Validators.compose([Validators.required])),
      primaryInsuranceId: new FormControl('', [Validators.required]),
      secondaryInsuranceId: new FormControl('', [Validators.required] ),
      priorAuthStatusId: new FormControl('',Validators.compose([Validators.required])),
      advocacyTypeId: new FormControl('', [Validators.required]),
      clearance:  new FormControl('', [Validators.required])

    });
  }

  get f() {
    return this.drugAdvocacyClearanceForm != null ? this.drugAdvocacyClearanceForm.controls : null;
  }
getIcdListadvClear
  get fa() {
    return this.advClearanceSearchForm != null ? this.advClearanceSearchForm.controls : null;
  }

  getIcdList() {
    this.commonService.getICDList().subscribe(
      (result) => {
        this.advClearsIcdList = result;
      },
      (err) => {}
    );
  }

  getPrimaryInsurance() {
    this.advocacyService.getPrimaryInsuranceList().subscribe(
      (result) => {
        this.advClearprimaryInsurance = result;
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getSecondaryInsurance() {
    this.advocacyService.getSecondaryInsuranceList().subscribe(
      (result) => {
        this.advClearSecondaryInsurance = result;
        //this.searchSecondaryInsurance()
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getApprovalReasons() {
    this.wiService.getAllApprovalReasons().subscribe(
      (result) => {
        this.advClearWiApprovalReasons = result;
      },
      (err) => {}
    );
  }

  loadDrugCodes() {
    let editVal =[];

    if(this.isUpdate){
      editVal = this.advClearAdvocacyInfo!=null? [ { drugValue: this.advClearAdvocacyInfo.drugProcCode +'-'+this.advClearAdvocacyInfo.drugShortDesc,drugId: this.advClearAdvocacyInfo.drugId}] :[];
    }

    this.drugCodesFiltered$ = concat(
      of(editVal),
      // of([]),
      this.drugCodesInput$.pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1500),
        tap(() => (this.drugCodesLoading = true)),
        switchMap((term) => {
          return this.commonService.getDrugDetails(term).pipe(
            catchError(() => of([])),
            tap(() => (this.drugCodesLoading = false))
          );
        })
      )
    );
  }

  loadIcdClearanceCodes() {

       let editVal = [];
       if(this.isUpdate){
          editVal = this.advClearsIcdList;
        }
      this.icdCodesFiltered$ = concat(
        of(this.advClearsIcdList),
        this.icdCodesInput$.pipe(
          filter((res) => {
            return res !== null && res.length >= this.minLengthTerm;
          }),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => (this.icdCodesLoading = true)),
          switchMap((term) => {
              return this.commonService.getIcdDetails(term).pipe(
              catchError(() => of([])),
              tap(() => (this.icdCodesLoading = false))
            );
          })
        )
      );
    }

  onClearanceSearch() {
    this.searched = true;
    this.advClearshowGrid = false;
    this.advloading = true;

    let advSearchFormVal = this.advClearanceSearchForm.value;

    let params = {
      drugId: advSearchFormVal.drugId != null ? advSearchFormVal.drugId : '',
      icdCode: advSearchFormVal.icdCode != null ? advSearchFormVal.icdCode : '',
      primaryInsuranceId: advSearchFormVal.primaryInsuranceId != null ? advSearchFormVal.primaryInsuranceId : '',
      secondaryInsuranceId:  advSearchFormVal.secondaryInsuranceId != null  ? advSearchFormVal.secondaryInsuranceId : '',
      priorAuthStatusId: advSearchFormVal.priorAuthStatusId != null ? advSearchFormVal.priorAuthStatusId : '',
      clearance: (advSearchFormVal.clearance !=null && advSearchFormVal.clearance !== '') ? advSearchFormVal.clearance : ''
    };

    this.drugAdvocacyClearanceService.getAllAdvocaciesWithClearanceBySearchParam(params).subscribe((data) => {
        if (data.length > 0) {
          for(let i=0;i<data.length;i++) {
            const result = data[i];
            let secondaryInsuranceNames =[];
            if(result.secondaryInsuranceId) {
              const insuranceIds =  result.secondaryInsuranceId?.split(', ')
              for(let j=0;j<insuranceIds.length;j++) {
                secondaryInsuranceNames.push(this.advClearSecondaryInsurance.find(ins=> ins.insuranceId == insuranceIds[j]).insuranceName);
              }

            }
            result.secondaryInsuranceName=secondaryInsuranceNames.join(", ")
          };
          this.advClearshowGrid = true;
          this.advClearadvDatasource = data;
          this.advTotalRecords = data.length;
          this.advloading = false;
        } else {
          this.showInfo('No Records found!');
        }
      });
  }

  loadAdvDetails(event: LazyLoadEvent) {
    this.advloading = true;
    setTimeout(() => {
      if (this.advClearadvDatasource) {
        this.advClearSearchResult = this.advClearadvDatasource.slice(
          event.first,
          event.first + event.rows
        );
        this.advloading = false;
      }
    }, 500);
  }

  onSubmit() {
    this.advClearshowAddICDGrid = true;

    if (this.drugAdvocacyClearanceForm.invalid) {
      return false;
    } else {
      let advocacyFormValue = this.drugAdvocacyClearanceForm.value; 
        if (this.isUpdate) {
        let advClearformData = {
          drugAdvocacyClearanceId: this.advClearAdvocacyInfo.drugAdvocacyClearanceId,
          drugId: advocacyFormValue.drugId,
          icds: this.advClearselectedIcdCodes.join(', '),
          primaryInsuranceId: advocacyFormValue.primaryInsuranceId,
          secondaryInsuranceId: this.selectedSecInsIds.join(', '),
          priorAuthStatusId: advocacyFormValue.priorAuthStatusId,
          modifiedBy: this.userId,
          advocacyTypeId: advocacyFormValue.advocacyTypeId,
          clearance:advocacyFormValue.clearance
        };

          this.drugAdvocacyClearanceService.updateAdvocacyWithClearance(advClearformData).subscribe(result => {
          console.log(result);
          this.advClearshowAddICDGrid = false;
          this.showSuccess('Updated advocacy successfully');
          this.onReset();
          this.drugAdvocacyClearanceForm.reset();
          this.onClearanceSearch();
        },
        (err) => {
          console.log(err);
          this.showFailure(err);
        });
      } else {
        let formData = {
          drugId: advocacyFormValue.drugId,
          icds: this.advClearselectedIcdCodes.join(', '),
          primaryInsuranceId: advocacyFormValue.primaryInsuranceId,
          secondaryInsuranceId:  this.selectedSecInsIds.join(', '),
          priorAuthStatusId: advocacyFormValue.priorAuthStatusId,
          createdBy: this.userId,
          modifiedBy: this.userId,
          advocacyTypeId: advocacyFormValue.advocacyTypeId,
          clearance:advocacyFormValue.clearance
        };

        this.drugAdvocacyClearanceService.createAdvocacyWithClearance(formData).subscribe(result => {
            this.advClearshowAddICDGrid = false;
            this.showSuccess('Created advocacy successfully ');
            this.onReset();
            this.drugAdvocacyClearanceForm.reset();
            this.onClearanceSearch();
          },
          (err) => {
            console.log(err);
            this.showFailure(err);
          }
        );
      }
    }
  }

  onEdit(adv) {
    console.log(adv);
    this.isUpdate= true;

    this.advClearAdvocacyInfo = adv;

    this.drugAdvocacyClearanceForm.patchValue({
      drugAdvocacyClearanceId: adv.drugAdvocacyClearanceId,
      drugId: adv.drugId,
      icdId: adv.icds?.split(', '),
      primaryInsuranceId: adv.primaryInsuranceId,
      secondaryInsuranceId: adv.secondaryInsuranceId?.split(', '),
      priorAuthStatusId: adv.priorAuthStatusId,
      advocacyTypeId: adv.advocacyTypeId,
      clearance: adv.clearance
    });
    this.advClearselectedIcdCodes = adv.icds?.split(', ');
    this.selectedSecInsIds = adv.secondaryInsuranceId?.split(', ').map(Number);
    this.drugAdvocacyClearanceForm.controls['drugId'].setValue(  adv.drugId);
    //TODO
    //loop thru icdids and push  this.drugAdvocacyClearanceForm.controls['icdId'].setValue(  adv.icdId);
    this.loadDrugCodes();
    this.loadIcdClearanceCodes();
  }

  onDelete(adv) {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "delete";
    modal.componentInstance.delete.subscribe(() => {
      this.deleteAdvocacy(adv);
    });
  }

  deleteAdvocacy(adv) {
    let params={
      svoId: adv.drugAdvocacyClearanceId,
      modifiedBy : this.userId
    }
    this.drugAdvocacyClearanceService.deleteAdvocacyClearanceByDrugId(params).subscribe(
      (result) => {
        this.showSuccess('Successfully deleted Advocacy for Drug Code '+adv.drugProcCode);
        this.onClearanceSearch();
      },
      err=>{
        this.showFailure('Failed to Delete Advocacy for Drug Code '+adv.drugProcCode);
      }
    );
  }


  onReset() {
    console.log('reset');

    this.drugAdvocacyClearanceForm.patchValue({
      drugId: null,
      primaryInsuranceId: '',
      secondaryInsuranceId: '',
      priorAuthStatusId: '',
      advocacyTypeId: '',
      clearance: '',
    });
    this.advClearselectedIcdCodes = [];

    // this.advClearshowGrid = false;
    this.advClearshowAddICDGrid = false;
    this.isUpdate = false;

    this.drugAdvocacyClearanceForm.markAsPristine();
    this.drugAdvocacyClearanceForm.markAsUntouched();

    // this.onClearanceSearch();
  }

  onResetSF() {
    this.advClearanceSearchForm.reset();
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

  bulkAddClearance() {
    this.modal = this.ngbModal.open(InputModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    this.modal.componentInstance.label = "Paste codes below separated by commas: only exact codes will be accepted. (ex: ICD1,ICD2,ICD3,etc...)";
    this.modal.componentInstance.buttonText = "Confirm";
    this.modal.componentInstance.title = "Add ICD Codes";
    this.modal.componentInstance.maxLength = 10000;
    this.modal.componentInstance.confirm.subscribe(() => {
      let notesClearance = this.modal.componentInstance.notes;
      let enteredCodesClearance = notesClearance.split(',').map(code => code.trim()).filter(code => code != '');
      let newList: Observable<any>[] = [];
      for(let i in enteredCodesClearance) {
        newList.push(this.commonService.getExactIcd(enteredCodesClearance[i]));
      }
      forkJoin(newList).subscribe(codes => {
        let validCodesClearance = [];
        for(let i in codes) {
          if(codes[i] != null) {
            validCodesClearance.push(codes[i].icdCode);
          }
        }
        this.advClearselectedIcdCodes = [...new Set([...this.advClearselectedIcdCodes.concat(validCodesClearance)])];
        console.log(this.advClearselectedIcdCodes);
      })
    });
  }
}
