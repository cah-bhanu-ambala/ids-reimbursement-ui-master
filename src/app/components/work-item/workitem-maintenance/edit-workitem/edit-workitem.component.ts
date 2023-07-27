import {Component, OnInit, Renderer2, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {WorkitemService} from 'src/app/common/services/http/workitem.service';
import {DrugAdvocacyService} from 'src/app/common/services/http/drug-advocacy.service';
import {
  alphaNumericSpaceValidator,
  alphaNumericValidator,
  amountValidator,
  percentageValidator
} from 'src/app/common/utils';
import {ConfirmModalComponent} from 'src/app/components/shared/confirm-modal/confirm-modal.component';
import {ToastrService} from 'ngx-toastr';
import {CommonService} from 'src/app/common/services/http/common.service';
import {concat, forkJoin, Observable, of, Subject} from 'rxjs';
import {catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap} from 'rxjs/operators';
import {FileAttachmentData} from "../../../shared/file-attachments/file-attachment-data";
import {FileAttachmentService} from "../../../../common/services/http/file-attachment.service";
import jsPDF from "jspdf";
import * as moment from "moment";
import 'jspdf-autotable';

@Component({
  selector: 'app-edit-workitem',
  templateUrl: './edit-workitem.component.html',
  styleUrls: ['./edit-workitem.component.scss']
})
export class EditWorkitemComponent implements OnInit {
  wiNumber: number;
  wiInfo: any;
  wiStatuses: any[];
  deniedStatus: number = 4;
  denialTypes: any[];
  orderTypes: any[];
  wiTeamMembers: any[];
  wiApprovalReasons: any[];
  formWorkItem: FormGroup;
  submitted: boolean;
  billingLevels: any[];
  facilities: any[];
  icdList: any;
  drugList: any;
  primaryInsList: any;
  secondaryInsList: any;
  userId: number;
  noOfICDCodes: number = 1;
  noOfdrugCodes: number = 1;
  drugAdvocacies: any[];
  drugAdvocacyLoaded = false;
  icdCodesFiltered$: Observable<any>[];
  drugCodesFiltered$: Observable<any>[];
  icdCodesLoading = false;
  drugCodesLoading = false;
  icdCodesInput$: Subject<string>[];
  drugCodesInput$: Subject<string>[];
  selectedicdCode: any;
  minLengthTerm = 2;
  buyBillUnknown: boolean;
  dependantEndpointsLoaded = false;
  viewOnly = false;
  @ViewChild('buyBill')
      buyBill: any;

  @ViewChild('priorAuthApprovalReason')
  approvalReasonRef : any;

  @ViewChild('priorAuth')
  priorAuth: any;

  fileAttachmentData: FileAttachmentData = new FileAttachmentData();
  isDirty = false;
  duplicateDrugCodeExists = false;
  constructor(
    private formBuilder: FormBuilder
    , private wiService: WorkitemService
    , private commonService: CommonService
    , private ngbModal: NgbModal
    , private router: Router
    , private activatedRouter: ActivatedRoute
    , private toastr: ToastrService
    , private drugAdvocacyService: DrugAdvocacyService
    , private renderer: Renderer2
    , private fileAttachmentService: FileAttachmentService

  ) {

    this.activatedRouter.queryParams.subscribe((paramts) => {
      let wno = paramts['workItemNumber'];
      this.wiNumber = parseInt(wno);
      let viewOnly_=paramts['viewOnly'];
      if (viewOnly_){
        this.viewOnly = viewOnly_;
      }

    });

  }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.loadEditWorkItem(this.wiNumber);
    this.loadDrugAdvocacy()
    if (!!this.formWorkItem) {
      this.formWorkItem.valueChanges.subscribe(e => {
        if (this.formWorkItem.dirty)
          this.isDirty = true
      });
    }
  }

  loadDrugAdvocacy(){
    this.drugAdvocacyService.getAllAdvocacies().subscribe((data) => {
          this.drugAdvocacyLoaded = true;
          this.drugAdvocacies = data;
        },  (err) => {
         this.drugAdvocacyLoaded = true;
       });
  }

  loadEditWorkItem(wiNumber) {
    this.wiService.getWorkItemById(wiNumber).subscribe(
      (result) => {
        this.wiInfo = result;
        this.callDependantEndpoint();
        this.initializeFormList();
        // console.log(JSON.stringify(this.wiStatuses));
        this.buildWorkItemForm();

        this.loadicdCodes();
        this.loadDrugCodes();
        this.loadDenialTypes();
        this.loadOrderTypes();

        // this.formWorkItem.setControl('icdCodes', this.setICDForm(this.icdList) || []);
      }
    );
  }

  buildWorkItemForm() {
    if (this.wiInfo !== undefined && this.wiInfo !== null) {
      // var di = new Date(this.wiInfo.dateIn);
      // var diDate = this.wiInfo.dateIn != null ? { year: di.getFullYear(), month: di.getMonth() + 1, day: di.getUTCDate() } : '';

      // var dO = new Date(this.wiInfo.dateOut);
      // this.wiInfo.dateOut = this.wiInfo.dateOut != null ? { year: dO.getFullYear(), month: dO.getMonth() + 1, day: dO.getUTCDate() } : null;

      // var od = new Date(this.wiInfo.orderDate);
      // var oDate = this.wiInfo.orderDate != null ? { year: od.getFullYear(), month: od.getMonth() + 1, day: od.getUTCDate() } : '';

      var di = this.wiInfo.dateIn != null ? this.wiInfo.dateIn.slice(0,10).split('-') : null;
      var diDate = this.wiInfo.dateIn != null ? { year: parseInt(di[0]), month: parseInt(di[1]), day: parseInt(di[2]) } : '';

      var dO = this.wiInfo.dateOut != null ? this.wiInfo.dateOut.slice(0,10).split('-') : null;
      var doDate = this.wiInfo.dateOut != null ? { year: parseInt(dO[0]), month: parseInt(dO[1]), day: parseInt(dO[2]) } : '' || null;

      var od = this.wiInfo.orderDate != null ? this.wiInfo.orderDate.slice(0,10).split('-') : null;
      var oDate = this.wiInfo.orderDate != null ? { year: parseInt(od[0]), month: parseInt(od[1]), day: parseInt(od[2]) } : '' || null;
    }

    this.formWorkItem = this.formBuilder.group({
      //PSS INFORMATION
      workItemNo: [{ value: this.wiNumber, disabled: true }],
      workItemId: [this.wiInfo.workItemId],
      patientMrn: [{ value: this.wiInfo.patientMrn, disabled: true }],
      dateIn: [{ value: diDate, disabled: true }],
      createdBy: [{ value: this.wiInfo.createdByName, disabled: true }],
      teamMemberId: [this.wiInfo.createdBy],
      assignedToId: [this.wiInfo.assignedToId],
      workItemStatusId: [this.wiInfo.workItemStatusId],
      facilityBillingLevelId: [this.wiInfo.facilityBillingLevelId],
      dateOut: [doDate],
      referralNumber: [this.wiInfo.referralNumber, Validators.compose([Validators.maxLength(25), Validators.pattern(alphaNumericValidator)])],
      //ORDER INFORMATION
      facilityEin: [{ value: this.wiInfo.facilityEin, disabled: true }],
      providerName: [{ value: this.wiInfo.providerName, disabled: true }],
      providerId: [this.wiInfo.providerId],
      providerNPi: [{ value: this.wiInfo.providerNPi, disabled: true }],
      facilityNPI: [{ value: this.wiInfo.facilityNPI, disabled: true }],
      orderDate:  oDate,
      buyBill: [this.wiInfo.buyBill],
      externalWorkId: [this.wiInfo.externalWorkId
        , Validators.compose([Validators.maxLength(25), Validators.pattern(alphaNumericValidator)])],
      facilityName: [{ value: this.wiInfo.facilityName, disabled: true }],
      orderTypeId: [this.wiInfo.orderTypeId],

      //DIAGNOSIS INFORMATION
      icdCodes: this.setICDForm(),

      //DRUG/TEST INFORMATION
      drugCodes: this.setDrugForm(),

      //PRIMARY INSURANCE INFORMATION && SECONDARY INSURANCE INFORMATION
      wiInsurance: this.formBuilder.group(
        {
          primaryInsRep: [this.wiInfo.wiInsurance.primaryInsRep
            , Validators.compose([
              Validators.maxLength(25),
              Validators.pattern(alphaNumericSpaceValidator)])
          ],

          primaryInsRefNum: [this.wiInfo.wiInsurance.primaryInsRefNum
            , Validators.compose([
              Validators.maxLength(25),
              Validators.pattern(alphaNumericValidator)])],

          primaryInNetwork: [this.wiInfo.wiInsurance.primaryInNetwork],

          deductibleMax: [this.wiInfo.wiInsurance.deductibleMax
            , Validators.compose([
              Validators.maxLength(13),
              Validators.pattern(amountValidator)])
          ],

          deductibleMet: [this.wiInfo.wiInsurance.deductibleMet
            , Validators.compose([
              Validators.maxLength(13),
              Validators.pattern(amountValidator)])
          ],

          outOfPocketMax: [this.wiInfo.wiInsurance.outOfPocketMax
            , Validators.compose([
              Validators.maxLength(13),
              Validators.pattern(amountValidator)])
          ],

          outOfPocketMet: [this.wiInfo.wiInsurance.outOfPocketMet
            , Validators.compose([
              Validators.maxLength(13),
              Validators.pattern(amountValidator)])
          ],

          coInsurance: [this.wiInfo.wiInsurance.coInsurance
            , Validators.pattern(percentageValidator)],

          primaryInsClassification: [this.wiInfo.wiInsurance.primaryInsClassification],
          primaryInsNotes: [this.wiInfo.wiInsurance.primaryInsNotes
            , Validators.maxLength(1000)
          ],

          secondaryInsRefNum: [this.wiInfo.wiInsurance.secondaryInsRefNum
            , Validators.compose([
              Validators.maxLength(25),
              Validators.pattern(alphaNumericValidator)])
          ],
          secondaryInsRep: [this.wiInfo.wiInsurance.secondaryInsRep
            , Validators.compose([
              Validators.maxLength(25),
              Validators.pattern(alphaNumericSpaceValidator)])
          ],
          secondaryInNetwork: [this.wiInfo.wiInsurance.secondaryInNetwork],
          secondaryInsClassification: [this.wiInfo.wiInsurance.secondaryInsClassification],
          secondaryInsNotes: [this.wiInfo.wiInsurance.secondaryInsNotes
            , Validators.maxLength(1000)
          ]

        }
      ),

      //NOTES SECTION
      // referralNumber: [this.wiInfo.referralNumber],
      generalNotes: [this.wiInfo.generalNotes, Validators.maxLength(1000)]

    });

    this.wiInfo.attachments.forEach(attachment => {
      this.fileAttachmentData.filesList.push({ name: attachment.attachmentPath, attachmentId: attachment.workItemAttachmentId });
    });

  }
  get f() { return this.formWorkItem != null ? this.formWorkItem.controls : null; }

  get icdCodes(): FormArray { return this.formWorkItem.get('icdCodes') as FormArray };
  get drugCodes(): FormArray { return this.formWorkItem.get('drugCodes') as FormArray };

  setDrugForm(): any {
    let drugArray = this.formBuilder.array([]);
    for (let i = 0; i < 13; i++) {
      if (this.wiInfo.drugCodes.length > i) {

        // var fDate = new Date(this.wiInfo.drugCodes[i].priorAuthFromDate);
        // this.wiInfo.drugCodes[i].priorAuthFromDate = this.wiInfo.drugCodes[i].priorAuthFromDate != null ? { year: fDate.getFullYear(), month: fDate.getMonth() + 1, day: fDate.getUTCDate() } : null;

        // var tDate = new Date(this.wiInfo.drugCodes[i].priorAuthToDate);
        // this.wiInfo.drugCodes[i].priorAuthToDate = this.wiInfo.drugCodes[i].priorAuthToDate ? { year: tDate.getFullYear(), month: tDate.getMonth() + 1, day: tDate.getUTCDate() } : null;

        var fD = this.wiInfo.drugCodes[i].priorAuthFromDate != null ? this.wiInfo.drugCodes[i].priorAuthFromDate.slice(0,10).split('-') : null;
        var fDate = this.wiInfo.drugCodes[i].priorAuthFromDate != null ? { year: parseInt(fD[0]), month: parseInt(fD[1]), day: parseInt(fD[2]) } : '';

        var tD = this.wiInfo.drugCodes[i].priorAuthToDate != null ? this.wiInfo.drugCodes[i].priorAuthToDate.slice(0,10).split('-') : null;
        var tDate = this.wiInfo.drugCodes[i].priorAuthToDate != null ? { year: parseInt(tD[0]), month: parseInt(tD[1]), day: parseInt(tD[2]) } : '';
        drugArray.push(this.formBuilder.group
          ({
            createdBy: new FormControl(this.wiInfo.drugCodes[i].createdBy),
            modifiedBy: new FormControl(this.wiInfo.drugCodes[i].modifiedBy),
            drugId: new FormControl(this.wiInfo.drugCodes[i].drugId),
            drugProcCode: new FormControl(this.wiInfo.drugCodes[i].drugProcCode),
            drugShortDesc: new FormControl({ value: this.wiInfo.drugCodes[i].drugShortDesc, disabled: true }),
            isCover: new FormControl(this.wiInfo.drugCodes[i].isCover != null ? this.wiInfo.drugCodes[i].isCover : 'U'),
            clearance: new FormControl(this.wiInfo.drugCodes[i].clearance != null ? this.wiInfo.drugCodes[i].clearance : 'U'),
            priorAuth: new FormControl(this.wiInfo.drugCodes[i].priorAuth != null ? this.wiInfo.drugCodes[i].priorAuth : 'U'),
            priorAuthApprovalReason: new FormControl(this.wiInfo.drugCodes[i].priorAuthApprovalReason != null ? this.wiInfo.drugCodes[i].priorAuthApprovalReason : 'N/A'),
            workItemDrugCodeId: new FormControl(this.wiInfo.drugCodes[i].workItemDrugCodeId),
            workItemId: new FormControl(this.wiInfo.workItemId),
            drugLongDesc: new FormControl({ value: this.wiInfo.drugCodes[i].drugLongDesc, disabled: true }),
            priorAuthNo: new FormControl({ value: this.wiInfo.drugCodes[i].priorAuthNo, disabled: this.wiInfo.drugCodes[i].priorAuth == 'Y' ? false : true }),
            priorAuthFromDate: new FormControl({ value: fDate ? fDate : null, disabled: this.wiInfo.drugCodes[i].priorAuth == 'Y' ? false : true }),
            priorAuthToDate: new FormControl({ value: tDate ? tDate : null, disabled: this.wiInfo.drugCodes[i].priorAuth == 'Y' ? false : true }),
            priorAuthNotes: new FormControl({ value: this.wiInfo.drugCodes[i].priorAuthNotes, disabled: this.wiInfo.drugCodes[i].priorAuth == 'Y' ? false : true }),
            visitsApproved: new FormControl({ value: this.wiInfo.drugCodes[i].visitsApproved, disabled: this.wiInfo.drugCodes[i].priorAuth == 'Y' ? false : true }),
            unitsApproved: new FormControl({ value: this.wiInfo.drugCodes[i].unitsApproved, disabled: this.wiInfo.drugCodes[i].priorAuth == 'Y' ? false : true }),
            drugDosage: new FormControl({ value: this.wiInfo.drugCodes[i].drugDosage, disabled: this.wiInfo.drugCodes[i].priorAuth != 'Y' && this.wiInfo.drugCodes[i].isDenied == false }, Validators.min(0.0001)),
            isDenied: new FormControl({ value: this.wiInfo.drugCodes[i].isDenied ? "true" : "false", disabled: this.wiInfo.workItemStatusId != this.deniedStatus }, Validators.required),
            denialTypeId: new FormControl({ value: this.wiInfo.drugCodes[i].denialTypeId, disabled: this.wiInfo.workItemStatusId != this.deniedStatus || this.wiInfo.drugCodes[i].isDenied == false }, Validators.required),
            advocacyNeeded: new FormControl({value:this.wiInfo.drugCodes[i].advocacyNeeded, disabled: this.wiInfo.drugCodes[i].drugAdvocacyId}),
            overrideAdvocacyNeeded: new FormControl(this.wiInfo.drugCodes[i].overrideAdvocacyNeeded),
            drugAdvocacyId: new  FormControl(this.wiInfo.drugCodes[i].drugAdvocacyId),
            advocacyNotes: new FormControl(this.wiInfo.drugCodes[i].advocacyNotes),
            overrideAdvocacyNotes: new FormControl(this.wiInfo.drugCodes[i].overrideAdvocacyNotes, this.wiInfo.drugCodes[i].overrideAdvocacyNeeded ? Validators.required: null)
          }));
      }
    }

    this.noOfdrugCodes = drugArray.length;
    return drugArray;
  }



  OnApprovalReason(ix: number) {
    let matchFound = false;
    const wiInsurance = this.formWorkItem.get('wiInsurance').value;
    if(this.icdCodes && this.icdCodes.value && this.icdCodes.value.length>0) {
      for(let i = 0; i < this.icdCodes.value.length; i++) {
      const drugAdvocacy  = this.drugAdvocacies.find(drugAdv=> drugAdv.active &&
              this.drugCodes.value[ix].drugProcCode === drugAdv.drugProcCode &&
              this.drugCodes.value[ix].priorAuthApprovalReason == drugAdv.priorAuthStatusId &&
              drugAdv.icds &&
              drugAdv.icds.split(", ").includes(this.icdCodes.value[i].icdCode) &&
              wiInsurance.primaryInsClassification == drugAdv.primaryInsuranceId &&
              drugAdv.secondaryInsuranceId &&
              drugAdv.secondaryInsuranceId.split(", ").includes(wiInsurance.secondaryInsClassification.toString())
              )
        if(drugAdvocacy) {
          this.checkHasClearanceAndSetAdvocacyNeeded(drugAdvocacy, ix, i);
          matchFound = true;
          break;
        }
      }
   }
   if(!matchFound && this.drugCodes.at(ix).value.drugAdvocacyId){
   this.unsetAdvocacyNeeded(ix);
    }
  }

  private unsetAdvocacyNeeded(ix: number) {
    this.drugCodes.controls[ix].get('advocacyNeeded').enable();
    this.drugCodes.controls[ix].get('clearance').enable();

    this.drugCodes.at(ix).patchValue(
      {
        advocacyNeeded: 'U',
        clearance: 'U',
        drugAdvocacyId: null,
        overrideAdvocacyNeeded: false,
        overrideAdvocacyNotes: null
      }
    );
  }

  private checkHasClearanceAndSetAdvocacyNeeded(drugAdvocacy: any, ix: number, i: number) {
    this.drugAdvocacyService.drugAdvocacyHasClearance(drugAdvocacy).subscribe((hasClearance) => {
      if (hasClearance) {
        this.drugCodes.at(ix).patchValue(
          {
            advocacyNeeded: 'Y',
            clearance: 'Y',
            drugAdvocacyId: drugAdvocacy.drugAdvocacyId,
            overrideAdvocacyNeeded: false
          }
        );
        this.drugCodes.controls[i].get('advocacyNeeded').disable();
        this.drugCodes.controls[i].get('clearance').disable();

      } else {

        this.unsetAdvocacyNeeded(ix)

      }
    }, (err) => {
      console.log('error checking clearance');
    });
  }

 /*  changeAdvocacyNeeded(ix: number) {

    if(this.drugCodes.controls[ix].get('advocacyNeeded').value!=='Y' && this.drugCodes.controls[ix].get('overrideAdvocacyNeeded').value){
      this.drugCodes.at(ix).patchValue(
              {
                drugAdvocacyId: null
              });
    } else if(this.drugCodes.controls[ix].get('advocacyNeeded').value==='Y'  && !this.drugCodes.controls[ix].get('drugAdvocacyId').value){
       this.OnApprovalReason(ix);
    }
  } */

  enableAdvocacyNeeded(ix: number) {

    if (this.drugCodes.controls[ix].get('overrideAdvocacyNeeded').value) {
     this.drugCodes.at(ix).patchValue(
                      {
                        advocacyNeeded: 'N',
                        overrideAdvocacyNotes: ''
                      });
      this.drugCodes.controls[ix].get('overrideAdvocacyNotes').setValidators([Validators.required]);
      this.drugCodes.controls[ix].get('overrideAdvocacyNotes').updateValueAndValidity();
    } else{
       this.drugCodes.at(ix).patchValue(
                  {
                    advocacyNeeded: 'Y',
                    overrideAdvocacyNotes: ''
                  });
      this.drugCodes.controls[ix].get('overrideAdvocacyNotes').clearValidators();
      this.drugCodes.controls[ix].get('overrideAdvocacyNotes').updateValueAndValidity();

    }
  }

  OnPirorAuth(event: any, ix: number, id: any): void {
    if (event.target.value == 'Y') {
      this.drugCodes.controls[ix].get('priorAuthNo').enable();
      this.drugCodes.controls[ix].get('priorAuthFromDate').enable();
      this.drugCodes.controls[ix].get('priorAuthToDate').enable();
      this.drugCodes.controls[ix].get('priorAuthNotes').enable();
      this.drugCodes.controls[ix].get('visitsApproved').enable();
      this.drugCodes.controls[ix].get('unitsApproved').enable();
      this.drugCodes.controls[ix].get('drugDosage').enable();
      //this.drugCodes.controls[ix].get('priorAuthApprovalReason').enable();
    }
    else {
      this.drugCodes.controls[ix].get('priorAuthNo').disable();
      this.drugCodes.controls[ix].get('priorAuthFromDate').disable();
      this.drugCodes.controls[ix].get('priorAuthToDate').disable();
      this.drugCodes.controls[ix].get('priorAuthNotes').disable();
      this.drugCodes.controls[ix].get('visitsApproved').disable();
      this.drugCodes.controls[ix].get('unitsApproved').disable();
      if(this.drugCodes.controls[ix].get('isDenied').value != "true" || this.formWorkItem.controls.workItemStatusId.value != this.deniedStatus) {
        this.drugCodes.controls[ix].get('drugDosage').disable();
      }
      //this.drugCodes.controls[ix].get('priorAuthApprovalReason').disable();
    }
  }

  onStatusChange(event: any) {
    if(event.target.value == this.deniedStatus) {
      this.drugCodes.controls.forEach((x: any) => {
        x.get("isDenied").enable();
        if(x.get("isDenied").value == "true") {
          x.get('denialTypeId').enable();
          x.get('drugDosage').enable();
        }
      });
    }
    else {
      this.drugCodes.controls.forEach((x: any) => {
        x.get('isDenied').disable();
        x.get('denialTypeId').disable();
        if(x.get('priorAuth').value != 'Y') {
          x.get('drugDosage').disable();
        }
      });
    }
  }

  onDenialChange(event: any, i: number) {
    if(event.target.value == "true") {
      this.drugCodes.controls[i].get('denialTypeId').enable();
      this.drugCodes.controls[i].get('drugDosage').enable();
    }
    else {
      this.drugCodes.controls[i].get('denialTypeId').disable();
      if(this.drugCodes.controls[i].get('priorAuth').value != 'Y') {
        this.drugCodes.controls[i].get('drugDosage').disable();
      }
    }
  }

  setICDForm(): any {
    let icdArray = this.formBuilder.array([]);
    for (let i = 0; i < 10; i++) {
      if (this.wiInfo.icdCodes.length > i) {
        icdArray.push(this.formBuilder.group
          ({
            createdBy: new FormControl(this.wiInfo.icdCodes[i].createdBy),
            modifiedBy: new FormControl(this.wiInfo.icdCodes[i].modifiedBy),
            icdCode: new FormControl(this.wiInfo.icdCodes[i].icdCode),
            icdDescription: new FormControl({ value: this.wiInfo.icdCodes[i].icdDescription, disabled: true }),
            workItemIcdCodeId: new FormControl(this.wiInfo.icdCodes[i].workItemIcdCodeId),
            icdId: new FormControl(this.wiInfo.icdCodes[i].icdId)
          }));
      }
    }
    this.noOfICDCodes = icdArray.length;
    return icdArray;
  }


  generateDianosisGridRows() {
    if (!this.enableUpdateButton()){
      this.showInfo("Please wait, page is loading...");
      return;
    }

    if (this.noOfICDCodes < 10) {
      if (this.icdCodes.length <= this.noOfICDCodes) {
        for (let i = this.icdCodes.length; i <= this.noOfICDCodes; i++) {
          this.icdCodes.push(this.formBuilder.group({
            icdCode: [null],
            icdDescription: [{ value: '', disabled: true }],
            icdId: [null]
          }));
          this.loadIcdSearch();
        }
      } else {
        for (let i = this.icdCodes.length; i >= this.noOfICDCodes; i--) {
          this.icdCodes.removeAt(i);
        }
      }
      this.noOfICDCodes++;
    }
    else
      this.showInfo("You can only add max 10 ICD codes");

  }

  showOverrideAdvocacyNotes() {
    return this.drugCodes.value.some(drug=>!!drug.overrideAdvocacyNeeded)
  }

 showOverride() {
    return this.drugCodes.value.some(drug=>!!drug.drugAdvocacyId)
  }

  generateDrugGridRows() {
    if (!this.enableUpdateButton()){
      this.showInfo("Please wait, page is loading...");
      return false;
    }
    if (this.noOfdrugCodes <= 13) {
      if (this.drugCodes.length <= this.noOfdrugCodes) {
        for (let i = this.drugCodes.length; i <= this.noOfdrugCodes; i++) {
          this.drugCodes.push(this.formBuilder.group({
            drugProcCode: [null],
            drugShortDesc: [{ value: '', disabled: true }],
            drugLongDesc: [{ value: '', disabled: true }],
            isCover: 'U',
            clearance: 'U',
            drugDosage: [{value: 0, disabled: true}, Validators.min(0.0001)],
            isDenied: [{value: "false", disabled: this.formWorkItem.controls.workItemStatusId.value != this.deniedStatus}, Validators.required],
            denialTypeId: [{value: null, disabled: true}, Validators.required],
            drugType: {},
            priorAuth: 'U',
            priorAuthNo: [{ value: '', disabled: true }],
            priorAuthNotes: [{ value: '', disabled: true }],
            priorAuthFromDate: [{ value: null, disabled: true }],
            priorAuthToDate: [{ value: null, disabled: true }],
            visitsApproved: [{ value: '', disabled: true }],
            unitsApproved: [{ value: '', disabled: true }],
            priorAuthApprovalReason: [null],
            advocacyNeeded: 'U',
            drugAdvocacyId:  [null],
            overrideAdvocacyNeeded:  false,
            advocacyNotes: [null],
            overrideAdvocacyNotes: [null],
            drugId: [null]
          }));
          this.loadDrugSearch();
        }
      } else {
        for (let i = this.drugCodes.length; i >= this.noOfdrugCodes; i--) {
          this.drugCodes.removeAt(i);
        }
      }
      this.noOfdrugCodes++;
    }
    else
      this.showInfo("You can only add max 13 Drug codes");
  }

  // getICDList() {
  //   this.commonService.getICDList().subscribe(
  //     (result) => {
  //       this.icdList = result;
  //       this.formWorkItem.setControl('icdCodes', this.setICDForm(this.icdList) || []);
  //     },
  //     (err) => { }
  //   );
  // }


  onSubmit() {
    this.submitted = true;
    // console.log(this.formWorkItem.controls)

    if(this.formWorkItem.controls.buyBill.value == "U"){
      this.buyBillUnknown = true;
      let msg ="Buy Bill value has to be Yes or No";
      this.showFailure(msg);
      this.buyBill.nativeElement.focus();
      return false;
    }

    else if (this.formWorkItem.invalid) {
      let msg = "Form invalid";
      this.drugCodes.controls.forEach((drugControl)=>{
        if(drugControl.get('drugProcCode').value != ''){
          if(drugControl.get('denialTypeId').value == null && drugControl.get('denialTypeId').enabled) {
            msg = "Denial type must have a value";
          }
          if(drugControl.get('drugDosage').value <= 0 && drugControl.get('drugDosage').enabled) {
            msg = "Drug Dosage must be greater than 0";
          }
        }
      });
      this.showFailure(msg);
      return false;
    }

    else {
      this.drugCodes.controls.forEach((drugControl)=>{
        drugControl.get('advocacyNeeded').enable();
      })
      let workItemInfo = this.formWorkItem.value;

      let anyDisabled = workItemInfo.workItemStatusId != this.deniedStatus;
      this.drugCodes.controls.forEach((drugControl) => {
        if(drugControl.get('isDenied').value == true || drugControl.get('isDenied').value == "true") {
          anyDisabled = true;
        }
      })
      if(!anyDisabled) {
        this.showFailure("Need at least one denied drug");
        return false;
      }

      workItemInfo.modifiedBy = 1;

      for (var i = workItemInfo.drugCodes.length - 1; i >= 0; i--) {
        if (!workItemInfo.drugCodes[i].drugProcCode) {
          workItemInfo.drugCodes.splice(i, 1);
        }

        else if(workItemInfo.drugCodes[i].drugProcCode && workItemInfo.drugCodes[i].priorAuthApprovalReason === null){
          let msg ="Approval Reason must have a value";
          this.showFailure(msg);
          this.approvalReasonRef.nativeElement.focus();
        }

        else {
          workItemInfo.drugCodes[i].workItemId = this.wiInfo.workItemId;

          let st = workItemInfo.drugCodes[i].priorAuthFromDate;
          if(st != null){
            workItemInfo.drugCodes[i].priorAuthFromDate = new Date(st.year + '-' + st.month + '-' + st.day)
          }

          let td = workItemInfo.drugCodes[i].priorAuthToDate;
          if(td != null) {
            workItemInfo.drugCodes[i].priorAuthToDate = new Date(td.year + '-' + td.month + '-' + td.day)
          }

          workItemInfo.drugCodes[i].createdBy = this.userId;
          workItemInfo.drugCodes[i].modifiedBy = this.userId;
          workItemInfo.drugCodes[i].denialTypeId = parseInt(workItemInfo.drugCodes[i].denialTypeId);

          if(workItemInfo.drugCodes[i].isDenied == null) {
            workItemInfo.drugCodes[i].isDenied = false;
          }
        }
      }
      for (var i = workItemInfo.icdCodes.length - 1; i >= 0; i--) {
        if (!workItemInfo.icdCodes[i].icdCode) {
          workItemInfo.icdCodes.splice(i, 1);
        }
        else {
          workItemInfo.icdCodes[i].workItemId = this.wiInfo.workItemId;
          workItemInfo.icdCodes[i].createdBy = this.userId;
          workItemInfo.icdCodes[i].modifiedBy = this.userId;
          // var iCD = this.icdList.filter(dp => dp.icdCode === workItemInfo.icdCodes[i].icdCode)[0];
          // if (iCD !== undefined)
          //   workItemInfo.icdCodes[i].icdId = iCD.icdId;

        }
      }

      let oDate = this.formWorkItem.value['orderDate'];
      workItemInfo.orderDate = oDate != null ? new Date(oDate.year + '-' + oDate.month + '-' + oDate.day) : '';

      let dateIn = this.formWorkItem.value['dateIn'];
      workItemInfo.dateIn = dateIn != null ? new Date(dateIn.year + '-' + dateIn.month + '-' + dateIn.day) : '';

      let dateOut = this.formWorkItem.value['dateOut'];
      workItemInfo.dateOut = dateOut != null ? new Date(dateOut.year + '-' + dateOut.month + '-' + dateOut.day) : '';

      workItemInfo.patientId = this.wiInfo.patientId;
      workItemInfo.wiInsurance.workItemId = this.wiInfo.workItemId;
      workItemInfo.wiInsurance.modifiedBy = this.userId;
      workItemInfo.wiInsurance.createdBy = this.userId;
      workItemInfo.wiInsurance.workItemInsId = this.wiInfo.wiInsurance.workItemInsId;
      workItemInfo.workItemId = this.wiNumber;
      workItemInfo.modifiedBy = this.userId;
      // workItemInfo.assignedToId =this.wiInfo.assignedToId;

      this.wiService.updateWorkItem(workItemInfo).subscribe(
        (result) => {
          this.submitted = false;
          this.isDirty = false;
          this.buyBillUnknown =false;
          this.formWorkItem.reset();
          this.showSuccess('Work Item Id# ' + result.workItemId + ' updated successfully');
          this.showSuccess('Work Item Id# ' + result.workItemId + ' updated successfully');

          this.fileAttachmentService.postAttachments('workItemId', result.workItemId, this.fileAttachmentData).subscribe(
            (responseIgnored) => {
              this.submitted = false;
              this.isDirty = false;
              this.buyBillUnknown =false;
              this.formWorkItem.reset();
              this.showSuccess('Work Item Id# ' + result.workItemId + ' updated successfully');
            },
            (errIgnored) => {
              this.showFailure('Failed to save attachment!');
            }
          );

          this.fileAttachmentService.deleteAttachments('workItemId', this.fileAttachmentData).subscribe(
            (resultIgnored) => {
              this.fileAttachmentData.deletedFilesList.forEach(deletedFileAttachmentId => {
                this.wiInfo.attachments =this.wiInfo.attachments.filter(row=>
                  row.workItemAttachmentId != deletedFileAttachmentId);
              });
            },
            (err) => {
              this.showFailure('Failed to delete the attachment!');
              console.log(err);
            }
          );

          if (workItemInfo.advocacyNeeded === 'Y')
            this.router.navigate(['/dashboard/advocacy/addAdvocacy']);
          else
            this.router.navigate(['/dashboard/workmenu/workItemMaintenance']);
        }
      );

    }
  }

  onDelete(workItemId) {
    const modal = this.ngbModal.open(ConfirmModalComponent, {
      backdrop: 'static',
      keyboard: false,
      size: 'm'
    });
    modal.componentInstance.textMessage = "delete";
    modal.componentInstance.delete.subscribe(() => {
      this.deleteWI(workItemId);
    });
  }

  deleteWI(workItemId) {
    let params = {
      'workItemId': workItemId,
      'userId': this.userId
    }
    this.wiService.deleteWorkItem(params).subscribe(
      (result) => {
        this.showSuccess('Work Item Id# ' + result.workItemId + ' deleted successfully');
        this.router.navigate(['/dashboard/workmenu/workItemMaintenance']);
      },
      (error) => {
        this.showFailure('Work item is not deleted due to an internal error');
      }

    );
  }

  trackByIcdCode(item: any) {
    return item.icdId;
  }

  private loadIcdSearch() {
    this.icdCodesInput$.push(new Subject<string>());
      this.icdCodesFiltered$.push(concat(
        of([]),
        this.icdCodesInput$[this.icdCodesInput$.length - 1].pipe(
          filter(res => {
            return res !== null && res.length >= this.minLengthTerm;
          }),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.icdCodesLoading = true),
          switchMap(term => {
            return this.wiService.getIcdDetails(term)
              .pipe(
                catchError(() => of([])),
                tap(() =>
                  this.icdCodesLoading = false
              ))
          }))
      ));
  }

  loadicdCodes() {
    this.icdCodesFiltered$ = [] as any;
    this.icdCodesInput$ = [] as any;
    for(let i = 0; i < this.wiInfo.icdCodes.length; i++) {
      this.loadIcdSearch();
    }
  }

  onIcdCodeChange(selectedValue, Ctrlidx) {
    var val = selectedValue ? selectedValue : ' - '
    let icd = val.split(' - ');
    const wiInsurance = this.formWorkItem.get('wiInsurance').value;
    if(this.drugCodes && this.drugCodes.value && this.drugCodes.value.length>0) {
      for(let i = 0; i < this.drugCodes.value.length; i++) {
        const drugAdvocacy = this.drugAdvocacies.find(drug=> drug.active && this.drugCodes.value[i].drugProcCode === drug.drugProcCode &&
                  this.drugCodes.value[i].priorAuthApprovalReason == drug.priorAuthStatusId &&
                  drug.icds && drug.icds.split(", ").includes(icd[0]) &&
                  wiInsurance.primaryInsClassification == drug.primaryInsuranceId &&
                  drug.secondaryInsuranceId &&
                  drug.secondaryInsuranceId.split(", ").includes(wiInsurance.secondaryInsClassification.toString()))
          if(drugAdvocacy){
            this.checkHasClearanceAndSetAdvocacyNeeded(drugAdvocacy, i, i);
          } else if(this.drugCodes.value[i].drugAdvocacyId) {
            this.unsetAdvocacyNeeded(i)
          }
      }
    }
    this.icdCodes.at(Ctrlidx).patchValue(
      {
        icdCode: icd[0],
        icdDescription: icd[1],
        icdId: icd[2]
      }
    );
  }

  private loadDrugSearch() {
    this.drugCodesInput$.push(new Subject<string>());
      this.drugCodesFiltered$.push(concat(
        of([]),
        this.drugCodesInput$[this.drugCodesInput$.length - 1].pipe(
          filter(res => {
            return res !== null && res.length >= this.minLengthTerm;
          }),
          distinctUntilChanged(),
          debounceTime(800),
          tap(() => this.drugCodesLoading = true),
          switchMap(term => {
            return this.wiService.getDrugDetails(term)
              .pipe(
                catchError(() => of([])),
                tap(() =>
                  this.drugCodesLoading = false
                ))
          }))
      ));
  }

  loadDrugCodes() {
    this.drugCodesFiltered$ = [] as any;
    this.drugCodesInput$ = [] as any;
    for(let i = 0; i < this.wiInfo.drugCodes.length; i++) {
      this.loadDrugSearch();
    }
  }

  loadDenialTypes() {
    this.wiService.getDenialTypes().subscribe((result) => {
      this.denialTypes = result;
    });
  }

  loadOrderTypes() {
      this.wiService.getOrderTypes().subscribe((result) => {
        this.orderTypes = result;
      });
    }

  trackByDrugCode(item: any) {
    return item;
  }

  onFileAttachmentsChanged(fileAttachmentData: FileAttachmentData) {
    this.fileAttachmentData = fileAttachmentData;
  }

  onDrugCodeChange(selectedValue, Ctrlidx) {
    var val = selectedValue
    let matchFound = false;
    const wiInsurance = this.formWorkItem.get('wiInsurance').value;
    if (val && val.length > 0) {
      let drug = val.split(' - ');
      if(this.drugCodes.value && this.drugCodes.value.length>1) {
        const matchingDrugCodes = this.drugCodes.value.filter(drugCode=> drug[0] === drugCode.drugProcCode )
        if(matchingDrugCodes && matchingDrugCodes.length>0){
          this.duplicateDrugCodeExists = true
          this.drugCodes.controls[Ctrlidx].get('drugProcCode').setErrors({'duplicate':true});
          return;
        } else {
          this.duplicateDrugCodeExists = false
          this.drugCodes.controls[Ctrlidx].get('drugProcCode').setErrors(null);

        }
      }
       if(this.icdCodes && this.icdCodes.value && this.icdCodes.value.length>0) {
          for(let i = 0; i < this.icdCodes.value.length; i++) {
           const drugAdvocacy = this.drugAdvocacies.find(drugAdv=> drugAdv.active && drug[0] === drugAdv.drugProcCode &&
                        this.drugCodes.value[Ctrlidx].priorAuthApprovalReason == drugAdv.priorAuthStatusId &&
                        drugAdv.icds &&
                        drugAdv.icds.split(", ").includes(this.icdCodes.value[i].icdCode) &&
                        wiInsurance.primaryInsClassification == drugAdv.primaryInsuranceId &&
                        drugAdv.secondaryInsuranceId &&
                        drugAdv.secondaryInsuranceId.split(", ").includes(wiInsurance.secondaryInsClassification.toString()))
              if(drugAdvocacy) {
                this.checkHasClearanceAndSetAdvocacyNeeded(drugAdvocacy, Ctrlidx, i);
                break;
                }
            }
          }
        this.drugCodes.at(Ctrlidx).patchValue(
          {
            drugProcCode: drug[0],
            drugShortDesc: drug[1],
            drugLongDesc: drug[2],
            drugId: drug[3]
          }
        );
      } else {
        this.drugCodes.at(Ctrlidx).patchValue(
            {
              drugProcCode: '',
              drugShortDesc:'',
              drugLongDesc: '',
              drugId: ''
            }
          );
      }
      if(!matchFound && this.drugCodes.at(Ctrlidx).value.drugAdvocacyId){
        this.unsetAdvocacyNeeded(Ctrlidx)

     }
  }
  onInsuranceChange() {
      const wiInsurance = this.formWorkItem.get('wiInsurance').value;
      let matchFound = false;
      if (this.drugCodes && this.drugCodes.value && this.drugCodes.value.length > 0) {
          for (let Ctrlidx = 0; Ctrlidx < this.drugCodes.value.length; Ctrlidx++) {
              const currentDrugCode = this.drugCodes.value[Ctrlidx].drugProcCode
              if (currentDrugCode && currentDrugCode.length > 0) {
                  if (this.icdCodes && this.icdCodes.value && this.icdCodes.value.length > 0) {
                      for (let i = 0; i < this.icdCodes.value.length; i++) {
                          const drugAdvocacy = this.drugAdvocacies.find(drugAdv => drugAdv.active && currentDrugCode === drugAdv.drugProcCode &&
                              this.drugCodes.value[Ctrlidx].priorAuthApprovalReason == drugAdv.priorAuthStatusId &&
                              drugAdv.icds &&
                              drugAdv.icds.split(", ").includes(this.icdCodes.value[i].icdCode) &&
                              wiInsurance.primaryInsClassification == drugAdv.primaryInsuranceId &&
                              drugAdv.secondaryInsuranceId &&
                              drugAdv.secondaryInsuranceId.split(", ").includes(wiInsurance.secondaryInsClassification.toString()))
                          if (drugAdvocacy) {
                              this.checkHasClearanceAndSetAdvocacyNeeded(drugAdvocacy, Ctrlidx, i);
                              matchFound = true
                              break;
                          }
                      }
                  }
              }
              if (!matchFound && this.drugCodes.at(Ctrlidx).value.drugAdvocacyId) {
                this.unsetAdvocacyNeeded(Ctrlidx)

              }
          }
      }
  }

  numericOnly(event: any) {
    const pattern = /[0-9]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && event.charCode != '0') {
      event.preventDefault();
    }
  }

  decimalNumericOnly(event: any) {
    const pattern = /[0-9\.]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && event.charCode != '0') {
      event.preventDefault();
    }
  }

  alphanumericOnly(event: any) {
    const pattern = /^[A-Za-z0-9]+$/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar) && event.charCode != '0') {
      event.preventDefault();
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

  callDependantEndpoint() {
    let serviceList: Observable<any>[] = [];
    //serviceList.push(this.commonService.getdrugList().pipe(catchError(() => {return of([]) }))); REIM-178
    serviceList.push(this.wiService.getwiStatuses().pipe(catchError(() => {return of([]) })));
    serviceList.push(this.wiService.getAllTeamMembers().pipe(catchError(() => {return of([]) })));
    serviceList.push(this.wiService.getAllApprovalReasons().pipe(catchError(() => {return of([]) })));
    serviceList.push(this.wiService.getbilligLevels().pipe(catchError(() => {return of([]) })));
    serviceList.push(this.wiService.getPrimaryIns().pipe(catchError(() => {return of([]) })));
    serviceList.push(this.wiService.getSecondaryIns().pipe(catchError(() => {return of([]) })));

    forkJoin(serviceList).subscribe(results => {

        //this.drugList = results[0];
        this.wiStatuses = results[0];
        this.wiStatuses.forEach((x: any) => {
          if(x.workItemStatusName == "Denied")
            this.deniedStatus = x.workItemStatusId;
        });

        this.wiTeamMembers = results[1];
        this.wiApprovalReasons = results[2];
        this.billingLevels = results[3];
        this.primaryInsList = results[4];
        this.secondaryInsList = results[5];
      },
      (error) => {
        console.log(error)
      },
      () => {
        this.dependantEndpointsLoaded = true;
        if (this.viewOnly) {
          Object.keys(this.formWorkItem.controls).forEach((controlName) => {
            this.formWorkItem.controls[controlName].disable();
          });
        }
      })
  }

  enableUpdateButton() : boolean{
    return (this.dependantEndpointsLoaded && this.drugAdvocacyLoaded)
  }

  initializeFormList(){
    this.facilities = [{"facilityName" : this.wiInfo.facilityName}]
  }
  exportPDF(){
    var pdfObj = new jsPDF('p', 'mm', 'a4');
    pdfObj.setFontSize(10);
    pdfObj.setTextColor(150,0,0);
    pdfObj.setFont(undefined, 'bold');

    // Header 1
    pdfObj.text('Reimbursement Solution Information',20, 15).setFontSize(10); // setting font size or font applies the style to the next line
    pdfObj.setTextColor(99);


    // Row 1
    pdfObj.text ('MRN', 20,20).setFontSize(10).setFont(undefined, 'normal')
    pdfObj.text(''+this.wiInfo.patientMrn+'', 40,20).setFont(undefined, 'bold');

    pdfObj.text ('Work Item Status',70,20).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.workItemStatusName+'', 100,20).setFont(undefined, 'bold');

    pdfObj.text ('Date In', 140,20).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+moment(this.wiInfo.dateIn).utc().format('MM/DD/YYYY').toString()+'', 165,20).setFont(undefined, 'bold');

    // Row 2
    pdfObj.text ('Order Type', 20,25).setFontSize(10).setFont(undefined, 'normal');

    pdfObj.text(''+this.wiInfo.orderTypeName+'', 45,25).setFont(undefined, 'bold');


    pdfObj.text ('Billing Type', 70,25).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.facilityBillingTypeName+'', 100,25).setFont(undefined, 'bold');

    pdfObj.text ('Date Out', 140,25).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+moment(this.wiInfo.dateOut).utc().format('MM/DD/YYYY').toString()+'', 165,25).setFont(undefined, 'bold');

    // Row 3
    pdfObj.text ('Team Member Assigned', 20,30).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.getTeamMemberNameLabel(this.wiInfo.assignedToId)+'', 65,30).setFont(undefined, 'bold');

    pdfObj.text ('Referral #', 120,30).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.referralNumber+'', 140,30).setFont(undefined, 'bold');

    // Row 4
    pdfObj.text ('Team Member Who Added', 20,35).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.getTeamMemberNameLabel(this.wiInfo.createdBy)+'', 65,35).setFont(undefined, 'bold');

    // Order Information Header 2
    pdfObj.setFontSize(10);
    pdfObj.setTextColor(150,0,0);
    pdfObj.text('Order Information',20, 40).setFontSize(10); // setting font size or font applies the style to the next line
    pdfObj.setTextColor(99);

    // Row 1
    pdfObj.text ('Facility EIN', 20,45).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.facilityEin+'', 45,45).setFont(undefined, 'bold');

    pdfObj.text ('Physician', 70,45).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.providerName+'', 100,45).setFont(undefined, 'bold');

    // Row 2
    pdfObj.text ('Physician NPI', 20,50).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.providerNPi+'', 45,50).setFont(undefined, 'bold');

    pdfObj.text ('Facility NPI', 70,50).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.facilityNPI+'', 100,50).setFont(undefined, 'bold');

    pdfObj.text ('Facility', 125,50).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.facilityName+'', 140,50).setFont(undefined, 'bold');



    // Row 3
    pdfObj.text ('Order Date', 20,55).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+moment(this.wiInfo.orderDate).utc().format('MM/DD/YYYY').toString()+'', 45,55).setFont(undefined, 'bold');
    pdfObj.text ('Buy & Bill or', 70,55).setFontSize(10).setFont(undefined, 'normal');
    if('U' === this.wiInfo.buyBill){
      pdfObj.text('Unknown', 100,55).setFont(undefined, 'bold');
    }else if('Y' === this.wiInfo.buyBill){
      pdfObj.text('Yes', 100,55).setFont(undefined, 'bold');
    }else if('N' === this.wiInfo.buyBill){
      pdfObj.text('No', 100,55).setFont(undefined, 'bold');
    }
    pdfObj.text ('WB (White Bag)', 70,60).setFontSize(10).setFont(undefined, 'bold');

    // Diagnosis Information Header 3
    pdfObj.setFontSize(10);
    pdfObj.setTextColor(150,0,0);
    pdfObj.text('Diagnosis Information',20, 65).setFontSize(10); // setting font size or font applies the style to the next line
    pdfObj.setTextColor(99);


    // Table Header Row
    const diagnosisHeader = [['DX Code', 'Description']];
    var diagnosisTableData = [];
    this.wiInfo.icdCodes.forEach((icd) => {

      diagnosisTableData.push([icd.icdCode, icd.icdDescription])
    });
    (pdfObj as any).autoTable({
      startX: 40,
      body: diagnosisTableData,
      headStyles : {
        textColor: [0, 0, 0 ],
        halign: 'center',
        fillColor: [132, 132, 136]
      },
      pageBreak: 'auto',
      startY: 70,
      theme : 'grid',
      margin: {top: 5, bottom: 10, left: 20, right: 10},
      didDrawCell: data => {
      },
      head: diagnosisHeader,
      columnStyles: {
        0: {cellWidth: 25 },
        1: {cellWidth: 150 },
      }

    })
    let finalY =  (pdfObj as any).lastAutoTable.finalY;
    finalY += 10;

    let pageHeight= pdfObj.internal.pageSize.height;
    if ((finalY+5)>=pageHeight)
    {
      pdfObj.addPage();
      finalY = 15;
    }
    // Drug Code Table
    // Drug Information Header 4
    pdfObj.setFontSize(10);
    pdfObj.setTextColor(150,0,0);
    pdfObj.text('Drug Information',20, finalY + 5).setFontSize(10); // setting font size or font applies the style to the next line
    pdfObj.setTextColor(99);

    const tableHeader = [['Codes', 'Long Description',  'Is Cover',  'Prior Auth',
      'Approval Reason','Advocacy Needed']];
    var tableContent = [];
    this.wiInfo.drugCodes.forEach((d) => {

      tableContent.push([d.drugProcCode, d.drugLongDesc, d.isCover,
        d.priorAuth,
        this.getApprovalReasonValue(d.priorAuthApprovalReason), d.advocacyNeeded])
    });
    (pdfObj as any).autoTable({
      startY: finalY + 10,
      startX: 40,
      head: tableHeader,
      body: tableContent,
       // 'auto', 'wrap' or a number,
      didDrawCell: data => {
      },
      columnStyles: {
        3: {cellWidth: 25},
        4: {cellWidth: 33},
        0: {cellWidth: 28},
        2: {cellWidth: 21},
        5: {cellWidth: 35},
        1: {cellWidth: 45},
      },
      margin: {top: 10, right: 10, bottom: 10, left: 20},
      theme : 'grid',
      pageBreak: 'auto',
      headStyles : {
        fillColor: [132, 132, 136 ],
        textColor: [0, 0, 0 ],
        halign: 'center'
      },
      tableWidth: 'wrap'
    })

    let splitPrimaryNotes = pdfObj.splitTextToSize(this.wiInfo.wiInsurance.primaryInsNotes, 150);
    finalY =  (pdfObj as any).lastAutoTable.finalY + 10;
    let totalHeight = finalY + 30 + splitPrimaryNotes.length * 5;
    if ((totalHeight)>=pageHeight){
      pdfObj.addPage();
      finalY = 15;
    }
    // Primary Insurance Information Header 5
    pdfObj.setFontSize(10);
    pdfObj.setTextColor(150,0,0);
    pdfObj.text('Primary Insurance Information',20, finalY).setFontSize(10); // setting font size or font applies the style to the next line
    finalY += 5;
    pdfObj.setTextColor(99);

    // Row 1
    pdfObj.text ('Representatives', 20,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.primaryInsRep+'', 55,finalY).setFont(undefined, 'bold');
    finalY += 5;

    pdfObj.text ('Reference #', 20,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.primaryInsRefNum+'', 55,finalY).setFont(undefined, 'bold');

    pdfObj.text ('In Network', 140,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.primaryInNetwork+'', 175,finalY).setFont(undefined, 'bold');
    finalY += 5;

    // Row 2
    pdfObj.text ('Deductible Max', 20,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.deductibleMax+'', 55,finalY).setFont(undefined, 'bold');

    pdfObj.text ('Deductible Met', 80,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.deductibleMet+'', 110,finalY).setFont(undefined, 'bold');

    pdfObj.text ('Out of Pocket Max', 140,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.outOfPocketMax+'', 175,finalY).setFont(undefined, 'bold');
    finalY += 5;

    // Row 3
    pdfObj.text ('Out of Pocket Met', 20,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.outOfPocketMet+'', 55,finalY).setFont(undefined, 'bold');

    pdfObj.text ('Insurance ', 80,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.getInsuranceClassificationName('primaryInsurance',this.wiInfo.wiInsurance.primaryInsClassification)+'', 110,finalY, { maxWidth: 25 }).setFont(undefined, 'bold');
    pdfObj.text ('Classification', 80,finalY+5).setFontSize(10).setFont(undefined, 'bold');

    pdfObj.text ('Co-Insurance%', 140,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.coInsurance+'', 175,finalY).setFont(undefined, 'bold');
    finalY += 10;

    // Row 4
    pdfObj.text ('Insurance Notes', 20,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(splitPrimaryNotes, 55, finalY).setFont(undefined, 'bold');
    finalY += splitPrimaryNotes.length * 5 + 10;



    let splitSecondaryNotes = pdfObj.splitTextToSize(this.wiInfo.wiInsurance.secondaryInsNotes, 150);
    totalHeight = finalY + 35 + splitSecondaryNotes.length * 5;
    if ((totalHeight)>=pageHeight){
      pdfObj.addPage();
      finalY = 15;
    }
    // Secondary Insurance Information Header 6
    pdfObj.setFontSize(10);
    pdfObj.setTextColor(150,0,0);
    pdfObj.text('Secondary Insurance Information',20, finalY).setFontSize(10); // setting font size or font applies the style to the next line
    pdfObj.setTextColor(99);
    finalY += 5;

    // Row 1
    pdfObj.text ('Representatives', 20,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.secondaryInsRep+'', 55,finalY).setFont(undefined, 'bold');
    finalY += 5;

    pdfObj.text ('Reference #', 20,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.secondaryInsRefNum+'', 55,finalY).setFont(undefined, 'bold');

    pdfObj.text ('In Network', 140,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.wiInfo.wiInsurance.secondaryInNetwork+'', 175,finalY).setFont(undefined, 'bold');
    finalY += 5;

    // Row 2
    pdfObj.text ('Insurance ', 20,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(''+this.getInsuranceClassificationName('secondaryInsurance',this.wiInfo.wiInsurance.secondaryInsClassification)+'', 55,finalY).setFont(undefined, 'bold');
    finalY += 5;
    pdfObj.text ('Classification', 20,finalY).setFontSize(10).setFont(undefined, 'bold');
    finalY += 5;

    pdfObj.text ('Insurance Notes', 20,finalY).setFontSize(10).setFont(undefined, 'normal');
    pdfObj.text(splitSecondaryNotes, 55, finalY).setFont(undefined, 'bold');
    finalY += splitSecondaryNotes.length * 5 + 10;



    // Row 1
    let splitGeneralNotes = pdfObj.splitTextToSize(this.wiInfo.generalNotes, 170);
    totalHeight = finalY + splitGeneralNotes.length * 5;
    if (totalHeight >= pageHeight) {
      pdfObj.addPage();
      finalY = 15;
    }
    // Notes Header 7
    pdfObj.setFontSize(10);
    pdfObj.setTextColor(150,0,0);
    pdfObj.text('Notes',20, finalY).setFontSize(10); // setting font size or font applies the style to the next line
    pdfObj.setTextColor(99);

    pdfObj.text ('General Notes',40,finalY).setFontSize(10).setFont(undefined, 'normal');
    finalY += 5;
    pdfObj.text((this.wiInfo.generalNotes?this.wiInfo.generalNotes:''), 20, finalY, {maxWidth: 170}).setFont(undefined, 'bold');
    //Save PDF
    pdfObj.save(this.wiInfo.patientMrn+'_Workitem-'+this.wiInfo.workItemId+'.pdf');

  }

  getTeamMemberNameLabel(teamMemberId){
    let teamMemberNameLabel = '';
    if(this.wiTeamMembers  && this.wiTeamMembers .length > 0){
      this.wiTeamMembers.forEach((tm) =>{
        if(tm.userId === teamMemberId){
          teamMemberNameLabel = tm.userName;
        }
      });
    }
    return teamMemberNameLabel;
  }

  getApprovalReasonValue(approvalReasonId) {
    let approvalReasonLabel = '';
    if(this.wiApprovalReasons && this.wiApprovalReasons.length > 0){
      this.wiApprovalReasons.forEach((ar) => {
        if(ar.priorAuthStatusId === approvalReasonId){
          approvalReasonLabel = ar.priorAuthStatusName;
        }
      });
    }
    return approvalReasonLabel;
  }

  getInsuranceClassificationName(insuranceType, id){
    let insuranceClassification = ''
    if ('primaryInsurance' === insuranceType){
      if(this.primaryInsList && this.primaryInsList.length > 0){
        this.primaryInsList.forEach((pi) => {
          if(pi.insuranceId === id){
            insuranceClassification = pi.insuranceName;
          }
        });
      }
    }
    if ('secondaryInsurance' === insuranceType){
      if(this.secondaryInsList && this.secondaryInsList.length > 0){
        this.secondaryInsList.forEach((pi) => {
          if(pi.insuranceId === id){
            insuranceClassification = pi.insuranceName;
          }
        });
      }
    }
    return insuranceClassification;
  }
}

