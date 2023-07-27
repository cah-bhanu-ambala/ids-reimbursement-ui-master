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
import { DrugAdvocacyService } from 'src/app/common/services/http/drug-advocacy.service';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { InputModalComponent } from '../../shared/input-modal/input-modal.component';

@Component({
  selector: 'app-drug-advocacy-management',
  templateUrl: './drug-advocacy-management.component.html',
  styleUrls: ['./drug-advocacy-management.component.scss'],
})
export class DrugAdvocacyManagementComponent
  implements OnInit, AfterContentChecked {
  userId: number;

  advocacyForm: FormGroup;
  advSearchForm: FormGroup;

  submitted = false;
  isUpdate = false;
  searched = false;
  showGrid: boolean;

  advloading: boolean;
  advDatasource: any;
  advSearchResult: any;
  advTotalRecords: any;

  icdCodesFiltered$: Observable<any>;
  icdCodesLoading = false;
  icdCodesInput$ = new Subject<string>();
  selectedIcdCodes: any;
  selectedSecInsIds: any;
  minLengthTerm = 2;
  icdSearchResult: any;
  icdDatasource: any;
  icdtotalRecords: any;
  icdloading: boolean;

  drugCodesFiltered$: Observable<any>;
  drugCodesLoading = false;
  drugCodesInput$ = new Subject<string>();
  selectedDrugCode: any;

  drugSearchResult: any;
  drugDatasource: any;
  drugtotalRecords: any;
  drugloading: boolean;
  noOfICDCodes = 1;

  icdList: any[];
  primaryInsurance: any[];
  secondaryInsurance: any[];
  wiApprovalReasons: any[];
  webSitesList: any[];
  advocacyInfo: any;
  icdInfo = {};
  advocacyTypes: any[];
  coPayPremiumOptions: any[] = [
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
    private drugAdvocacyService: DrugAdvocacyService,
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
    this.selectedIcdCodes = [];

    this.buildAdvocacySearchForm();
    this.buildAdvocacyForm();
    this.loadIcdCodes();
    this.loadDrugCodes();
    this.getApprovalReasons();
    this.getAdvocacyTypes();
    this.loadWebsiteControlsByDefault();
    this.onSearch();

    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  getAdvocacyTypes() {
    this.advocacyService.getAllAdvocacyTypes().subscribe(
      (result) => {
        this.advocacyTypes = result;
      },
      (err) => { }
    );
  }

  buildAdvocacySearchForm() {
    this.advSearchForm = this.formBuilder.group({
      drugId: new FormControl(null),
      icdCode: new FormControl(null),
      primaryInsuranceId: new FormControl(''),
      secondaryInsuranceId: new FormControl(''),
      priorAuthStatusId: new FormControl(''),
      copay:  new FormControl(''),
      premium:  new FormControl('')
    });
  }

  buildAdvocacyForm() {
   const reg = '(https?://|\s)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    this.advocacyForm = this.formBuilder.group({
      drugId: new FormControl(null, Validators.compose([Validators.required])),
      icdId: new FormControl(null, Validators.compose([Validators.required])),
      primaryInsuranceId: new FormControl('', [Validators.required]),
      secondaryInsuranceId: new FormControl('', [Validators.required] ),
      priorAuthStatusId: new FormControl('',Validators.compose([Validators.required])),
      website: new FormControl(''),
      websites: new FormArray([]),
      notes: new FormControl('', Validators.maxLength(1000)),
      advocacyTypeId: new FormControl('', [Validators.required]),
      copay:  new FormControl(''),
      premium:  new FormControl('')

    });
  }

    generateWebsiteControls() {
          const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

      this.websites.push(this.formBuilder.group({
                    website: new FormControl('')
                  }));
    }

    loadWebsiteControlsByDefault() {
      console.log("Load Website control")
      const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
      for (let i = 0; i < 1; i++) {
        this.generateWebsiteControls();
      }
    }

  get websites(): FormArray { return this.advocacyForm.get('websites') as FormArray };

  get f() {
    return this.advocacyForm != null ? this.advocacyForm.controls : null;
  }

  get fa() {
    return this.advSearchForm != null ? this.advSearchForm.controls : null;
  }

  getIcdList() {
    this.commonService.getICDList().subscribe(
      (result) => {
        this.icdList = result;
      },
      (err) => {}
    );
  }

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
        this.wiApprovalReasons = result;
      },
      (err) => {}
    );
  }

  loadDrugCodes() {
    let editVal =[];

    if(this.isUpdate){
      editVal = this.advocacyInfo!=null? [ { drugValue: this.advocacyInfo.drugProcCode +'-'+this.advocacyInfo.drugShortDesc,drugId: this.advocacyInfo.drugId}] :[];
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

  loadIcdCodes() {
       let editVal = [];
       if(this.isUpdate){
          editVal = this.icdList;
        }
    }


  getIcdCodesInfo(icds){
    let icdCodes = [];
    if(icds) {
      icdCodes = icds.split(",")
    }
    return icdCodes;
  }

  onSearch() {
    this.searched = true;
    this.showGrid = false;
    this.advloading = true;

    let advSearchFormVal = this.advSearchForm.value;

    let params = {
      drugId: advSearchFormVal.drugId != null ? advSearchFormVal.drugId : '',
      icdCode: advSearchFormVal.icdCode != null ? advSearchFormVal.icdCode : '',
      primaryInsuranceId: advSearchFormVal.primaryInsuranceId != null ? advSearchFormVal.primaryInsuranceId : '',
      secondaryInsuranceId:  advSearchFormVal.secondaryInsuranceId != null  ? advSearchFormVal.secondaryInsuranceId : '',
      priorAuthStatusId: advSearchFormVal.priorAuthStatusId != null ? advSearchFormVal.priorAuthStatusId : '',
      copay: (advSearchFormVal.copay !=null && advSearchFormVal.copay !== '') ? advSearchFormVal.copay : '',
      premium: (advSearchFormVal.premium !=null && advSearchFormVal.premium !=='') ? advSearchFormVal.premium : '',
    };

    this.drugAdvocacyService.getAllAdvocaciesBySearchParam(params).subscribe((data) => {
        if (data.length > 0) {
          for(let i=0;i<data.length;i++) {
            const result = data[i];
            let secondaryInsuranceNames =[];
            if(result.secondaryInsuranceId) {
              const insuranceIds =  result.secondaryInsuranceId?.split(', ')
              for(let j=0;j<insuranceIds.length;j++) {
                secondaryInsuranceNames.push(this.secondaryInsurance.find(ins=> ins.insuranceId == insuranceIds[j]).insuranceName);
              }
            }
            result.secondaryInsuranceName=secondaryInsuranceNames.join(", ")
            
            let websites = [];
            if(result.drugAdvocacyWebsites) {
              for(let j in result.drugAdvocacyWebsites) {
                websites.push(result.drugAdvocacyWebsites[j].website);
              }
            }
            result.website = websites.join(", ");
          };
          this.showGrid = true;
          this.advDatasource = data;
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
      if (this.advDatasource) {
        this.advSearchResult = this.advDatasource.slice(
          event.first,
          event.first + event.rows
        );
        this.advloading = false;
      }
    }, 500);
  }

  onSaveNew() {
    this.isUpdate = false;
    this.onSubmit();
  }

  onSubmit() {
    console.log('on submit::' + this.advocacyForm.value);
    this.submitted = true;

    if (this.advocacyForm.invalid) {    
      // this.showFailure('Advocacy Form invalid')
      return false;
    } else {
      let advocacyFormValue = this.advocacyForm.value;
      let selectedIcdIds = '';
      let icd;

      for (var i = advocacyFormValue.websites.length - 1; i >= 0; i--) {
        if (advocacyFormValue.websites[i].website === "" || advocacyFormValue.websites[i].website === null) {
          advocacyFormValue.websites.splice(i, 1);
        }
        else {
          advocacyFormValue.websites[i].createdBy = this.userId;
          advocacyFormValue.websites[i].modifiedBy = this.userId;
        }
      }

      if (this.isUpdate) {
        let formData = {
          drugAdvocacyId: this.advocacyInfo.drugAdvocacyId,
          drugId: advocacyFormValue.drugId,
          icds: this.selectedIcdCodes.join(', '),
          primaryInsuranceId: advocacyFormValue.primaryInsuranceId,
          secondaryInsuranceId: this.selectedSecInsIds.join(', '),
          priorAuthStatusId: advocacyFormValue.priorAuthStatusId,
          notes: advocacyFormValue.notes,
          drugAdvocacyWebsites: advocacyFormValue.websites,
          modifiedBy: this.userId,
          advocacyTypeId: advocacyFormValue.advocacyTypeId,
          copay:advocacyFormValue.copay,
          premium:advocacyFormValue.premium
        };

        this.drugAdvocacyService.updateAdvocacy(formData).subscribe(result => {
          this.submitted = false;
          this.showSuccess('Updated advocacy successfully');
          this.onReset();
          this.advocacyForm.reset();
          this.onSearch();
        },
        (err) => {
          console.log(err);
          this.showFailure(err);
        });
      } else {
        let formData = {
          drugId: advocacyFormValue.drugId,
          icds: this.selectedIcdCodes.join(', '),
          primaryInsuranceId: advocacyFormValue.primaryInsuranceId,
          secondaryInsuranceId:  this.selectedSecInsIds.join(', '),
          priorAuthStatusId: advocacyFormValue.priorAuthStatusId,
          notes: advocacyFormValue.notes,
          website: advocacyFormValue.website,
          drugAdvocacyWebsites: advocacyFormValue.websites,
          createdBy: this.userId,
          modifiedBy: this.userId,
          advocacyTypeId: advocacyFormValue.advocacyTypeId,
          copay:advocacyFormValue.copay,
          premium:advocacyFormValue.premium
        };

        formData.drugAdvocacyWebsites.forEach(site => {
          delete site.drugAdvocacyWebsiteId;
        });

        this.drugAdvocacyService.createAdvocacy(formData).subscribe(result => {
            this.submitted = false;
            // this.showSuccess('Created advocacy successfully for Drug Code '+ result.drugCode);
            this.showSuccess('Created advocacy successfully ');
            this.onReset();
            this.advocacyForm.reset();
            this.onSearch();
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
    this.isUpdate= true;

    this.advocacyInfo = adv;

    this.advocacyForm.patchValue({
      drugAdvocacyId: adv.drugAdvocacyId,
      drugId: adv.drugId,
      icdId: adv.icds?.split(', '),
      primaryInsuranceId: adv.primaryInsuranceId,
      secondaryInsuranceId: adv.secondaryInsuranceId?.split(', '),
      priorAuthStatusId: adv.priorAuthStatusId,
      website: adv.website,
      notes: adv.notes,
      advocacyTypeId: adv.advocacyTypeId,
      copay: adv.copay || '',
      premium: adv.premium || ''
    });
    this.selectedIcdCodes = adv.icds?.split(', ');
    this.selectedSecInsIds = adv.secondaryInsuranceId?.split(', ').map(Number);

     let websiteList = this.formBuilder.array([]);

        if (this.advocacyInfo.drugAdvocacyWebsites.length > 0) {
          this.advocacyInfo.drugAdvocacyWebsites.forEach(e => {
            websiteList.push(this.formBuilder.group
              ({
                drugAdvocacyId : e.drugAdvocacyId,
                drugAdvocacyWebsiteId: e.drugAdvocacyWebsiteId,
                website: new FormControl(e.website)
              })
            )
          })
          this.advocacyForm.setControl('websites', websiteList)
        } else {
        const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
        websiteList.push(this.formBuilder.group({
                               website: new FormControl('')
                             }));
          this.advocacyForm.setControl('websites', websiteList)
        }
    this.advocacyForm.controls['drugId'].setValue(  adv.drugId);
    //TODO
    //loop thru icdids and push  this.advocacyForm.controls['icdId'].setValue(  adv.icdId);
    this.loadDrugCodes();
    this.loadIcdCodes();
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
      svoId: adv.drugAdvocacyId,
      modifiedBy : this.userId
    }
    this.drugAdvocacyService.deleteAdvocacyByDrugId(params).subscribe(
      (result) => {
        this.showSuccess('Successfully deleted Advocacy for Drug Code '+adv.drugProcCode);
        this.onSearch();
      },
      err=>{
        this.showFailure('Failed to Delete Advocacy for Drug Code '+adv.drugProcCode);
      }
    );
  }


  onReset() {
    console.log('reset');

    this.advocacyForm.reset();
    this.selectedIcdCodes = [];
    this.advocacyForm.controls.websites.reset();

    this.submitted = false;
    this.isUpdate = false;

    this.advocacyForm.markAsPristine();
    this.advocacyForm.markAsUntouched();
  }

  onResetSF() {
    this.advSearchForm.reset();
  }

  onSelectAll(type) {
    if (type === 'website') {
      const selected = this.webSitesList.map((w) => w.websiteId);
      this.advocacyForm.get('website').patchValue(selected);
    }
  }

  onClearAll(type) {
    if (type === 'website') {
      this.advocacyForm.get('website').patchValue([]);
    }
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

  bulkAddAdv() {
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
      let icdCodesAdv = this.modal.componentInstance.notes;
      let enteredCodesAdv = icdCodesAdv.split(',').map(code => code.trim()).filter(code => code != '');
      let newList: Observable<any>[] = [];
      for(let i in enteredCodesAdv) {
        newList.push(this.commonService.getExactIcd(enteredCodesAdv[i]));
      }
      forkJoin(newList).subscribe(codes => {
        let validCodesAdv = [];
        for(let i in codes) {
          if(codes[i] != null) {
            validCodesAdv.push(codes[i].icdCode);
          }
        }
        this.selectedIcdCodes = [...new Set([...this.selectedIcdCodes.concat(validCodesAdv)])];
      })
    });
  }
}