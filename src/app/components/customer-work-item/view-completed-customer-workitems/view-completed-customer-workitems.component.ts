import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as logoFile from './../../reports/billing/logo.js';
import { LazyLoadEvent } from 'primeng/api';
import { saveAs } from 'file-saver';
import { WorkitemService } from './../../../common/services/http/workitem.service';
import jsPDF from 'jspdf';
// import * as html2pdf from 'html2pdf.js'
import 'jspdf-autotable';
import * as moment from 'moment';
import html2canvas from 'html2canvas';
// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as htmlToPdfmake from 'html-to-pdfmake'

// import * as pdfMake from 'pdfmake/build/pdfmake';
// import * as pdfFonts from 'pdfmake/build/vfs_fonts';
// //pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-view-completed-customer-workitems',
  templateUrl: './view-completed-customer-workitems.component.html',
  styleUrls: ['./view-completed-customer-workitems.component.scss']
})
export class ViewCompletedCustomerWorkitemsComponent implements OnInit {
  completedFormSearchWI: FormGroup;
  completedFormWorkItem: FormGroup;
  wiNumber: number;
  completedWiInfo: any;
  wiStatuses: any[];
  wiTeamMembers: any[];
  wiApprovalReasons: any[];
  billingLevels: any[];
  facilities: any[];
  primaryInsList: any;
  secondaryInsList: any;
  userId: number;

  wiSearchResult: any;
  showViewWorkItemGrid: boolean = false;
  searched: boolean;
  wiDatasource: any;
  wiTotalRecords: any;
  workItemsloading: boolean;
  showSearchWorkItem: boolean;
  showWorkItem: boolean = false;

  filesList: any[] = [];
  showError: boolean;
  // customerFacilityId: number;
  // customerFacilityName: string;

  constructor(
    private formBuilder: FormBuilder,
    private wiService: WorkitemService,
    private change: ChangeDetectorRef,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    // this.customerFacilityId = parseInt(localStorage.CustomerfacilityId);
    // this.customerFacilityName = localStorage.CustomerfacilityName;
    // this.getFacilityList();
    this.getwiStatuses();
    this.getTeamMembers();
    this.getPrimaryIns();
    this.getSecondaryIns();
    this.getApprovalReasons();
    this.buildSearchForm();
    // if (this.customerFacilityId != 0) {
    //   this.completedFormSearchWI.removeControl("facilityId");
    // }
  }

  ngAfterViewChecked() {
    this.change.detectChanges();
  }
  buildSearchForm() {
    this.completedFormSearchWI = this.formBuilder.group({
      mrn: [''],
      intFacilityId: ['', Validators.compose([Validators.required])],
      facilityId: 0,
      facilityName: { value: '', disabled: true },
      workItemStatusId: [''],
      teamMemberId: [''],
      dateOut: [null]
    });
  }

  get sf() { return this.completedFormSearchWI != null ? this.completedFormSearchWI.controls : null; }

  onSearch() {
    this.searched = true;
    this.showError = false;
    this.showWorkItem = false;
    this.showViewWorkItemGrid = false;

    //Check form is valid or not
    if (this.completedFormSearchWI.invalid) {
      return false;
    }
    else {
      //this.showViewWorkItemGrid = false;
      let searchWI = this.completedFormSearchWI.value;

      let params = {
          'facilityId': this.completedFormSearchWI.get("intFacilityId").value ,
          'patientMrn': this.completedFormSearchWI.value['mrn'] != null ? this.completedFormSearchWI.value['mrn'] : '',
          'workItemStatusId': this.completedFormSearchWI.value['workItemStatusId'] != null ? this.completedFormSearchWI.value['workItemStatusId'] : '',
          'dateOut': (searchWI.dateOut != null) ? (searchWI.dateOut.year + '-' + searchWI.dateOut.month + '-' + searchWI.dateOut.day) : '',
          'teamMemberId': searchWI.teamMemberId != null ? searchWI.teamMemberId : ''
        }
      this.wiService.getAllWorkItem(params).subscribe((data) => {
        this.wiDatasource = data;
        this.wiTotalRecords = data.length;
        if (data.length > 0) {
          this.workItemsloading = false;
          this.showViewWorkItemGrid = true;
        } else {
          this.showError = true;
          // this.showInfo('No Records Found!');
        }
      });
    }
  }

  loadWiDetails(event: LazyLoadEvent) {
    this.workItemsloading = true;
    setTimeout(() => {
      if (this.wiDatasource) {
        this.showWorkItem = false;
        this.wiSearchResult = this.wiDatasource.slice(event.first, (event.first + event.rows));
        this.workItemsloading = false;
      }
    }, 500);
  }

  onView(workItemId) {
    this.filesList = [];
    this.loadViewWorkItem(workItemId);
  }

  loadViewWorkItem(wiNumber) {
    this.wiService.getWorkItemByIdAndFacilityId(wiNumber, this.completedFormSearchWI.get("intFacilityId").value ).subscribe(
      (result) => {
        this.showViewWorkItemGrid = false;
        this.showWorkItem = true;
        this.completedWiInfo = result;
        this.buildWorkItemForm();
      }
    );
  }

  buildWorkItemForm() {

    if (this.completedWiInfo !== undefined && this.completedWiInfo !== null) {

      var di = new Date(this.completedWiInfo.dateIn);
      var diDate = this.completedWiInfo.dateIn != null ? { year: di.getUTCFullYear(), month: di.getUTCMonth() + 1, day: di.getUTCDate() } : '';

      var dO = new Date(this.completedWiInfo.dateOut);
      var doDate = this.completedWiInfo.dateOut != null ? { year: dO.getUTCFullYear(), month: dO.getUTCMonth() + 1, day: dO.getUTCDate() } : '';

      var od = new Date(this.completedWiInfo.orderDate);
      var oDate = this.completedWiInfo.orderDate != null ? { year: od.getUTCFullYear(), month: od.getUTCMonth() + 1, day: od.getUTCDate() } : '';

      // var di = this.completedWiInfo.dateIn != null ? this.completedWiInfo.dateIn.slice(0,10).split('-') : null;
      // var diDate = this.completedWiInfo.dateIn != null ? { year: parseInt(di[0]), month: parseInt(di[1]), day: parseInt(di[2]) } : '';

      // var dO = this.completedWiInfo.dateOut != null ? this.completedWiInfo.dateOut.slice(0,10).split('-') : null;
      // var doDate = this.completedWiInfo.dateOut != null ? { year: parseInt(dO[0]), month: parseInt(dO[1]), day: parseInt(dO[2]) } : '';

      // var od = this.completedWiInfo.orderDate != null ? this.completedWiInfo.orderDate.slice(0,10).split('-') : null;
      // var oDate = this.completedWiInfo.orderDate != null ? { year: parseInt(od[0]), month: parseInt(od[1]), day: parseInt(od[2]) } : '';

      this.completedFormWorkItem = this.formBuilder.group({
        //PSS INFORMATION
        workIdtemId: this.completedWiInfo.workItemId,
        workItemStatusName: this.completedWiInfo.workItemStatusName,
        assignedToId: this.completedWiInfo.assignedToId!==0?this.getTeamMemberName(this.completedWiInfo.assignedToId) : '',
        orderTypeId: this.completedWiInfo.orderTypeId,
        // facilityBillingLevelName: this.completedWiInfo.facilityBillingLevelName,
        facilityBillingTypeName: this.completedWiInfo.facilityBillingTypeName,
        dateIn: diDate,
        dateOut: doDate,
        createdBy: this.completedWiInfo.createdBy!==0?this.getTeamMemberName(this.completedWiInfo.createdBy):'',

        //ORDER INFORMATION
        patientMrn: this.completedWiInfo.patientMrn,
        orderDate: [oDate],
        buyBill: [this.completedWiInfo.buyBill],
        externalWorkId: [this.completedWiInfo.externalWorkId],
        facilityName: this.completedWiInfo.facilityName,
        //facility dept here
        providerNPi: this.completedWiInfo.providerNPi,
        //facility tax id here
        facilityEin: this.completedWiInfo.facilityEin,
        providerName: this.completedWiInfo.providerName,
        providerId: this.completedWiInfo.providerId,
        facilityNPI: this.completedWiInfo.facilityNPI,

        //DIAGNOSIS INFORMATION
        icdCodes: this.setICDForm(),

        //DRUG/TEST INFORMATION
        drugCodes: this.setDrugForm(),

        //PRIMARY INSURANCE INFORMATION && SECONDARY INSURANCE INFORMATION
        wiInsurance: this.formBuilder.group(
          {
            primaryInsRep: [this.completedWiInfo.wiInsurance.primaryInsRep],
            primaryInsRefNum: [this.completedWiInfo.wiInsurance.primaryInsRefNum],
            primaryInNetwork: [this.completedWiInfo.wiInsurance.primaryInNetwork],
            deductibleMax: [this.completedWiInfo.wiInsurance.deductibleMax],
            deductibleMet: [this.completedWiInfo.wiInsurance.deductibleMet],
            outOfPocketMax: [this.completedWiInfo.wiInsurance.outOfPocketMax],
            outOfPocketMet: [this.completedWiInfo.wiInsurance.outOfPocketMet],
            coInsurance: [this.completedWiInfo.wiInsurance.coInsurance],
            primaryInsClassification: [this.completedWiInfo.wiInsurance.primaryInsClassification],
            primaryInsNotes: [this.completedWiInfo.wiInsurance.primaryInsNotes],

            secondaryInsRep: [this.completedWiInfo.wiInsurance.secondaryInsRep],
            secondaryInsRefNum: [this.completedWiInfo.wiInsurance.secondaryInsRefNum],
            secondaryInNetwork: [this.completedWiInfo.wiInsurance.secondaryInNetwork],
            secondaryInsClassification: [this.completedWiInfo.wiInsurance.secondaryInsClassification],
            secondaryInsNotes: [this.completedWiInfo.wiInsurance.secondaryInsNotes]
          }
        ),

        //NOTES SECTION
        // referralNumber: [this.completedWiInfo.referralNumber],
        generalNotes: [this.completedWiInfo.generalNotes, Validators.maxLength(500)]

      });

      this.completedWiInfo.attachments.forEach(attachment => {
        this.filesList.push({ name: attachment.attachmentPath, attachmentId: attachment.workItemAttachmentId });
      });

      this.completedFormWorkItem.disable();
    }

  }


  get f() { return this.completedFormWorkItem != null ? this.completedFormWorkItem.controls : null; }
  get icdCodes(): FormArray { return this.completedFormWorkItem.get('icdCodes') as FormArray };
  get drugCodes(): FormArray { return this.completedFormWorkItem.get('drugCodes') as FormArray };

  setDrugForm() {
    let completedDrugArray = this.formBuilder.array([]);
    for (let i = 0; i < 10; i++) {
      if (this.completedWiInfo.drugCodes.length > i) {

        var fDate = new Date(this.completedWiInfo.drugCodes[i].priorAuthFromDate);
        this.completedWiInfo.drugCodes[i].priorAuthFromDate = this.completedWiInfo.drugCodes[i].priorAuthFromDate != null ? { year: fDate.getUTCFullYear(), month: fDate.getUTCMonth() + 1, day: fDate.getUTCDate() } : '';

        var tDate = new Date(this.completedWiInfo.drugCodes[i].priorAuthToDate);
        this.completedWiInfo.drugCodes[i].priorAuthToDate = this.completedWiInfo.drugCodes[i].priorAuthToDate ? { year: tDate.getUTCFullYear(), month: tDate.getUTCMonth() + 1, day: tDate.getUTCDate() } : '';

        // var fD = this.completedWiInfo.drugCodes[i].priorAuthFromDate != null ? this.completedWiInfo.drugCodes[i].priorAuthFromDate.slice(0,10).split('-') : null;
        // var fDate = this.completedWiInfo.drugCodes[i].priorAuthFromDate != null ? { year: parseInt(fD[0]), month: parseInt(fD[1]), day: parseInt(fD[2]) } : '';

        // var tD = this.completedWiInfo.drugCodes[i].priorAuthToDate != null ? this.completedWiInfo.drugCodes[i].priorAuthToDate.slice(0,10).split('-') : null;
        // var tDate = this.completedWiInfo.drugCodes[i].priorAuthToDate != null ? { year: parseInt(tD[0]), month: parseInt(tD[1]), day: parseInt(tD[2]) } : '';

        completedDrugArray.push(this.formBuilder.group
          ({
            createdBy: new FormControl({ value: this.completedWiInfo.drugCodes[i].createdBy, disabled: true }),
            modifiedBy: new FormControl({ value: this.completedWiInfo.drugCodes[i].modifiedBy, disabled: true }),
            drugProcCode: new FormControl({ value: this.completedWiInfo.drugCodes[i].drugProcCode, disabled: true }),
            drugShortDesc: new FormControl({ value: this.completedWiInfo.drugCodes[i].drugShortDesc, disabled: true }),
            isCover: new FormControl({ value: this.completedWiInfo.drugCodes[i].isCover, disabled: true }),
            priorAuth: new FormControl({ value: this.completedWiInfo.drugCodes[i].priorAuth, disabled: true }),
            priorAuthApprovalReason: new FormControl({ value: this.completedWiInfo.drugCodes[i].priorAuthApprovalReason, disabled: true }),
            workItemDrugCodeId: new FormControl({ value: this.completedWiInfo.drugCodes[i].workItemDrugCodeId, disabled: true }),
            drugLongDesc: new FormControl({ value: this.completedWiInfo.drugCodes[i].drugLongDesc, disabled: true }),
            priorAuthNo: new FormControl({ value: this.completedWiInfo.drugCodes[i].priorAuthNo, disabled: true }),
            priorAuthFromDate: new FormControl({ value: this.completedWiInfo.drugCodes[i].priorAuthFromDate, disabled: true }),
            priorAuthToDate: new FormControl({ value: this.completedWiInfo.drugCodes[i].priorAuthToDate, disabled: true }),
            priorAuthNotes: new FormControl({ value: this.completedWiInfo.drugCodes[i].priorAuthNotes, disabled: true }),
            visitsApproved: new FormControl({ value: this.completedWiInfo.drugCodes[i].visitsApproved, disabled: true }),
            unitsApproved: new FormControl({ value: this.completedWiInfo.drugCodes[i].unitsApproved, disabled: true }),
            advocacyNeeded: new FormControl({ value: this.completedWiInfo.drugCodes[i].advocacyNeeded, disabled: true }),
            advocacyNotes: new FormControl({ value: this.completedWiInfo.drugCodes[i].advocacyNotes, disabled: true })
          }));
      }
    }
    return completedDrugArray;
  }

  setICDForm(): any {
    let completedIcdArray = this.formBuilder.array([]);
    for (let i = 0; i < 13; i++) {
      if (this.completedWiInfo.icdCodes.length > i) {
        completedIcdArray.push(this.formBuilder.group
          ({
            createdBy: new FormControl({ value: this.completedWiInfo.icdCodes[i].createdBy, disabled: true }),
            modifiedBy: new FormControl({ value: this.completedWiInfo.icdCodes[i].modifiedBy, disabled: true }),
            icdCode: new FormControl({ value: this.completedWiInfo.icdCodes[i].icdCode, disabled: true }),
            icdDescription: new FormControl({ value: this.completedWiInfo.icdCodes[i].icdDescription, disabled: true }),
            workItemIcdCodeId: new FormControl({ value: this.completedWiInfo.icdCodes[i].workItemIcdCodeId, disabled: true })
          }));
      }
    }
    return completedIcdArray;
  }

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
      },
      (err) => { }
    );
  }

  getApprovalReasons() {
    this.wiService.getAllApprovalReasons().subscribe(
      (result) => {
        this.wiApprovalReasons = result;
      },
      (err) => { }
    );
  }

  getPrimaryIns() {
    this.wiService.getPrimaryIns().subscribe(
      (result) => {
        this.primaryInsList = result;
      },
      (err) => { }
    );
  }

  getSecondaryIns() {
    this.wiService.getSecondaryIns().subscribe(
      (result) => {
        this.secondaryInsList = result;
      },
      (err) => { }
    );
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

  openFile(id, name) {
    if (id) {
      this.wiService.getAttachmentById(id).subscribe(
        (response) => {
          let mediaType = response.type;
          let blob = new Blob([response], { type: mediaType });
          let url = window.URL.createObjectURL(blob);
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
  }

  onReset() {
    this.showViewWorkItemGrid = false;
    this.showWorkItem = false;
    this.showError = false;
    this.searched = false;
    this.completedFormSearchWI.markAsPristine();
    this.completedFormSearchWI.markAsUntouched();
    this.completedFormSearchWI.get("facilityId").setValue('');
    this.completedFormSearchWI.get("intFacilityId").setValue('');
    this.completedFormSearchWI.get("workItemStatusId").setValue('');
    this.completedFormSearchWI.get("teamMemberId").setValue('');
    this.completedFormSearchWI.get("dateOut").setValue(null)
    this.completedFormSearchWI.get("mrn").reset();
  }

 exportPDF(){
      var pdf = new jsPDF('p', 'mm', 'a4');
      pdf.setFontSize(10);
      pdf.setTextColor(150,0,0);
      pdf.setFont(undefined, 'bold');

      // Header 1
      pdf.text('Reimbursement Solution Information',20, 15).setFontSize(10); // setting font size or font applies the style to the next line
      pdf.setTextColor(99);


      // Row 1
      pdf.text ('MRN', 20,20).setFontSize(10).setFont(undefined, 'normal')
      pdf.text(''+this.completedWiInfo.patientMrn+'', 40,20).setFont(undefined, 'bold');

      pdf.text ('Work Item Status',70,20).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+this.completedWiInfo.workItemStatusName+'', 100,20).setFont(undefined, 'bold');

      pdf.text ('Date In', 140,20).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+moment(this.completedWiInfo.dateIn).utc().format('MM/DD/YYYY').toString()+'', 165,20).setFont(undefined, 'bold');

      // Row 2
      pdf.text ('Order Type', 20,25).setFontSize(10).setFont(undefined, 'normal');
      if(this.completedWiInfo.orderTypeId === 1){
        pdf.text('Oncology', 40,25).setFont(undefined, 'bold');
      } else if( this.completedWiInfo.orderTypeId=== 2){
        pdf.text('Non Oncology', 40,25).setFont(undefined, 'bold');
      }
      else {
       pdf.text(''+this.completedWiInfo.orderTypeId+'', 45,25).setFont(undefined, 'bold');
      }

      pdf.text ('Billing Type', 70,25).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+this.completedWiInfo.facilityBillingTypeName+'', 100,25).setFont(undefined, 'bold');

      pdf.text ('Date Out', 140,25).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+moment(this.completedWiInfo.dateOut).utc().format('MM/DD/YYYY').toString()+'', 165,25).setFont(undefined, 'bold');

      // Row 3
      pdf.text ('Team Member Assigned', 20,30).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+this.getTeamMemberName(this.completedWiInfo.assignedToId)+'', 65,30).setFont(undefined, 'bold');

      //Row 4
      pdf.text ('Team Member Who Added', 20,35).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+this.getTeamMemberName(this.completedWiInfo.createdBy)+'', 65,35).setFont(undefined, 'bold');

      // Order Information Header 2
      pdf.setFontSize(10);
      pdf.setTextColor(150,0,0);
      pdf.text('Order Information',20, 40).setFontSize(10); // setting font size or font applies the style to the next line
      pdf.setTextColor(99);

      // Row 1
      pdf.text ('Facility EIN', 20,45).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+this.completedWiInfo.facilityEin+'', 45,45).setFont(undefined, 'bold');

      pdf.text ('Physician', 70,45).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+this.completedWiInfo.providerName+'', 100,45).setFont(undefined, 'bold');

      // Row 2
      pdf.text ('Physician NPI', 20,50).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+this.completedWiInfo.providerNPi+'', 45,50).setFont(undefined, 'bold');

      pdf.text ('Facility NPI', 70,50).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+this.completedWiInfo.facilityNPI+'', 100,50).setFont(undefined, 'bold');

      pdf.text ('Facility', 125,50).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+this.completedWiInfo.facilityName+'', 140,50).setFont(undefined, 'bold');



      // Row 3
      pdf.text ('Order Date', 20,55).setFontSize(10).setFont(undefined, 'normal');
      pdf.text(''+moment(this.completedWiInfo.orderDate).utc().format('MM/DD/YYYY').toString()+'', 45,55).setFont(undefined, 'bold');
      pdf.text ('Buy & Bill or', 70,55).setFontSize(10).setFont(undefined, 'normal');
      if('U' === this.completedWiInfo.buyBill){
        pdf.text('Unknown', 100,55).setFont(undefined, 'bold');
      }else if('Y' === this.completedWiInfo.buyBill){
        pdf.text('Yes', 100,55).setFont(undefined, 'bold');
      }else if('N' === this.completedWiInfo.buyBill){
       pdf.text('No', 100,55).setFont(undefined, 'bold');
     }
      pdf.text ('WB (White Bag)', 70,60).setFontSize(10).setFont(undefined, 'bold');

       // Diagnosis Information Header 3
      pdf.setFontSize(10);
      pdf.setTextColor(150,0,0);
      pdf.text('Diagnosis Information',20, 65).setFontSize(10); // setting font size or font applies the style to the next line
      pdf.setTextColor(99);


      // Table Header Row
      const diagnosisHeader = [['DX Code', 'Description']];
      var diagnosisTableData = [];
      this.completedWiInfo.icdCodes.forEach((icd) => {

           diagnosisTableData.push([icd.icdCode, icd.icdDescription])
      });
      (pdf as any).autoTable({
       startY: 70,
        startX: 40,
      head: diagnosisHeader,
      body: diagnosisTableData,
      theme : 'grid',
      headStyles : {
                    fillColor: [132, 132, 136],
                    textColor: [0, 0, 0],
                    halign: 'center'
                  },
      margin: {top: 5, right: 10, bottom: 10, left: 20},
      columnStyles: {
             0: {cellWidth: 25},
             1: {cellWidth: 150},
           },
      pageBreak: 'auto',
      didDrawCell: data => {
      }
      })
      let finalY =  (pdf as any).lastAutoTable.finalY;

      let pageHeight= pdf.internal.pageSize.height;
      if ((finalY+5)>=pageHeight)
      {
        pdf.addPage();
        finalY = 0;
      }
      // Drug Code Table
      // Drug Information Header 4
      pdf.setFontSize(10);
      pdf.setTextColor(150,0,0);
      pdf.text('Drug Information',20, finalY + 5).setFontSize(10); // setting font size or font applies the style to the next line
      pdf.setTextColor(99);

      const header = [['Codes', 'Long Description',  'Is Cover',  'Prior Auth',
                                       'Approval Reason','Advocacy Needed']];
          var tableData = [];
          this.completedWiInfo.drugCodes.forEach((d) => {

               tableData.push([d.drugProcCode, d.drugLongDesc, d.isCover,
                                     d.priorAuth,
                                     this.getApprovalReasonLabel(d.priorAuthApprovalReason), d.advocacyNeeded])
          });
          (pdf as any).autoTable({
               startY: finalY + 10,
                startX: 40,
              head: header,
              body: tableData,
              tableWidth: 'wrap', // 'auto', 'wrap' or a number,
              theme : 'grid',
              headStyles : {
                            fillColor: [132, 132, 136],
                            textColor: [0, 0, 0],
                            halign: 'center'
                          },
              margin: {top: 10, right: 10, bottom: 10, left: 20},
              columnStyles: {
                     0: {cellWidth: 28},
                     1: {cellWidth: 45},
                     2: {cellWidth: 21},
                     3: {cellWidth: 25},
                     4: {cellWidth: 33},
                     5: {cellWidth: 35}
                   },
              pageBreak: 'auto',
              didDrawCell: data => {
              }
              })
            finalY =  (pdf as any).lastAutoTable.finalY;
            if ((finalY+5)>=pageHeight){
              pdf.addPage();
              finalY = 0;
            }
            // Primary Insurance Information Header 5
            pdf.setFontSize(10);
            pdf.setTextColor(150,0,0);
            pdf.text('Primary Insurance Information',20, finalY+5).setFontSize(10); // setting font size or font applies the style to the next line
            pdf.setTextColor(99);
            if ((finalY+10)>=pageHeight){
              pdf.addPage();
              finalY = 0;
            }
            // Row 1
            pdf.text ('Representatives', 20,finalY+10).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.completedWiInfo.wiInsurance.primaryInsRep+'', 55,finalY+10).setFont(undefined, 'bold');
            finalY += 5;

            pdf.text ('Reference #', 20,finalY+10).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.completedWiInfo.wiInsurance.primaryInsRefNum+'', 55,finalY+10).setFont(undefined, 'bold');

            pdf.text ('In Network', 80,finalY+10).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.completedWiInfo.wiInsurance.primaryInNetwork+'', 110,finalY+10).setFont(undefined, 'bold');

            if ((finalY+20)>=pageHeight){
              pdf.addPage();
              finalY = 0;
            }
            // Row 2
            pdf.text ('Deductible Max', 20,finalY+15).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.completedWiInfo.wiInsurance.deductibleMax+'', 55,finalY+15).setFont(undefined, 'bold');

            pdf.text ('Deductible Met', 80,finalY+15).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.completedWiInfo.wiInsurance.deductibleMet+'', 110,finalY+15).setFont(undefined, 'bold');

            pdf.text ('Out of Pocket Max', 140,finalY+15).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.completedWiInfo.wiInsurance.outOfPocketMax+'', 175,finalY+15).setFont(undefined, 'bold');
           // pdf.text ('Max', 140,finalY+20).setFontSize(10).setFont(undefined, 'bold');

            if ((finalY+25)>=pageHeight){
              pdf.addPage();
              finalY = 0;
            }
            // Row 3
            pdf.text ('Out of Pocket Met', 20,finalY+20).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.completedWiInfo.wiInsurance.outOfPocketMet+'', 55,finalY+20).setFont(undefined, 'bold');

            pdf.text ('Insurance ', 80,finalY+20).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.getInsuranceClassification('primaryInsurance',this.completedWiInfo.wiInsurance.primaryInsClassification)+'', 110,finalY+20, { maxWidth: 25 }).setFont(undefined, 'bold');
            pdf.text ('Classification', 80,finalY+25).setFontSize(10).setFont(undefined, 'bold');

            pdf.text ('Co-Insurance%', 140,finalY+20).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.completedWiInfo.wiInsurance.coInsurance+'', 175,finalY+20).setFont(undefined, 'bold');

            if ((finalY+30)>=pageHeight){
              pdf.addPage();
              finalY = 0;
            }
            // Row 4
            pdf.text ('Insurance Notes', 20,finalY+30).setFontSize(10).setFont(undefined, 'normal');
            pdf.text(''+this.completedWiInfo.wiInsurance.primaryInsNotes+'', 55,finalY+30, { maxWidth: 150 }).setFont(undefined, 'bold');
           if ((finalY+45)>=pageHeight){
             pdf.addPage();
             finalY = 0;
           }
            // Secondary Insurance Information Header 6
              pdf.setFontSize(10);
              pdf.setTextColor(150,0,0);
              pdf.text('Secondary Insurance Information',20, finalY+40).setFontSize(10); // setting font size or font applies the style to the next line
              pdf.setTextColor(99);

              // Row 1
              pdf.text ('Representatives', 20,finalY+45).setFontSize(10).setFont(undefined, 'normal');
              pdf.text(''+this.completedWiInfo.wiInsurance.secondaryInsRep+'', 55,finalY+45).setFont(undefined, 'bold');
              finalY += 5;

              pdf.text ('Reference #', 20,finalY+45).setFontSize(10).setFont(undefined, 'normal');
              pdf.text(''+this.completedWiInfo.wiInsurance.secondaryInsRefNum+'', 55,finalY+45).setFont(undefined, 'bold');

              pdf.text ('In Network', 85,finalY+45).setFontSize(10).setFont(undefined, 'normal');
              pdf.text(''+this.completedWiInfo.wiInsurance.secondaryInNetwork+'', 110,finalY+45).setFont(undefined, 'bold');
              if ((finalY+50)>=pageHeight){
                 pdf.addPage();
                 finalY = 0;
               }
              // Row 2
              pdf.text ('Insurance ', 20,finalY+50).setFontSize(10).setFont(undefined, 'normal');
              pdf.text(''+this.getInsuranceClassification('secondaryInsurance',this.completedWiInfo.wiInsurance.secondaryInsClassification)+'', 55,finalY+50).setFont(undefined, 'bold');
              pdf.text ('Classification', 20,finalY+55).setFontSize(10).setFont(undefined, 'bold');

              pdf.text ('Insurance Notes', 20,finalY+60).setFontSize(10).setFont(undefined, 'normal');
              pdf.text(''+this.completedWiInfo.wiInsurance.secondaryInsNotes+'', 55,finalY+60, { maxWidth: 150 }).setFont(undefined, 'bold');
             if ((finalY+75)>=pageHeight){
               pdf.addPage();
               finalY = 0;
             }

              // Notes Header 7
              pdf.setFontSize(10);
              pdf.setTextColor(150,0,0);
              pdf.text('Notes',20, finalY+70).setFontSize(10); // setting font size or font applies the style to the next line
              pdf.setTextColor(99);

              // Row 1
              pdf.text ('General Notes',40,finalY+70).setFontSize(10).setFont(undefined, 'normal');
              pdf.text(''+this.completedFormWorkItem.controls.generalNotes.value+'', 20,finalY+75).setFont(undefined, 'bold');
      //Save PDF
      pdf.save(this.completedWiInfo.patientMrn+'_Workitem-'+this.completedWiInfo.workItemId+'.pdf');
 }

 getInsuranceClassification(type, id){
   let classification = ''
   if ('primaryInsurance' === type){
     if(this.primaryInsList && this.primaryInsList.length > 0){
        this.primaryInsList.forEach((pi) => {
             if(pi.insuranceId === id){
               classification = pi.insuranceName;
             }
        });
      }
   }
   if ('secondaryInsurance' === type){
        if(this.secondaryInsList && this.secondaryInsList.length > 0){
           this.secondaryInsList.forEach((pi) => {
                if(pi.insuranceId === id){
                  classification = pi.insuranceName;
                }
           });
         }
      }
   return classification;
 }

getApprovalReasonLabel(approvalId) {
    let approvalLabel = '';
    if(this.wiApprovalReasons && this.wiApprovalReasons.length > 0){
       this.wiApprovalReasons.forEach((ar) => {
          if(ar.priorAuthStatusId === approvalId){
            approvalLabel = ar.priorAuthStatusName;
          }
       });
    }
   return approvalLabel;
}

getTeamMemberName(teamMemberId){
  let teamMemberName = '';
  if(this.wiTeamMembers  && this.wiTeamMembers .length > 0){
    this.wiTeamMembers.forEach((tm) =>{
      if(tm.userId === teamMemberId){
        teamMemberName = tm.userName;
      }
    });
  }
  return teamMemberName;
}
   getFormattedDate(selectedDate)  {
     let dateObj = JSON.parse(JSON.stringify(selectedDate));
     dateObj.month = dateObj.month - 1;
     return selectedDate != null ? moment(dateObj).format('MM/DD/YYYY').toString() : null;
   }
  showFailure(msg) {
    this.toastr.error(msg);
  }

  refreshViewWorkItemGrid(){
    this.showViewWorkItemGrid = false;
    this.wiSearchResult =[];
  }
}

