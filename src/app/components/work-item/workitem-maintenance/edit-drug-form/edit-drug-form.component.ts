import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpService } from 'src/app/common/services/http/http.service';

@Component({
  selector: 'app-edit-drug-form',
  templateUrl: './edit-drug-form.component.html',
  styleUrls: ['./edit-drug-form.component.scss']
})
export class EditDrugFormComponent implements OnInit {

  formDrug:FormGroup;
  drugList:any[];
  @Output() setDrug : EventEmitter<any> = new EventEmitter();
  @Input() textMessage:string;

  constructor(private formBuilder:FormBuilder
    ,private httpService:HttpService
    ,public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.buildDrugForm();
    this.getdrugList();
  }

  buildDrugForm()
  {
    this.formDrug = this.formBuilder.group({
    createdBy: new FormControl(1),
    modifiedBy: new FormControl(1),
    drugId:new FormControl(),
    drugProcCode: new FormControl(),
    drugShortDesc:new FormControl(),
    isCover:new FormControl(),
    priorAuth:new FormControl(),
    priorAuthApprovalReason:new FormControl(),
    priorAuthFromDate:new FormControl(),
    priorAuthToDate:new FormControl(),
    priorAuthNo:new FormControl(),
    priorAuthNotes:new FormControl(),
    unitsApproved:new FormControl(),
    visitsApproved:new FormControl()
    });
  }
  getdrugList() {
    this.httpService.getAll('drug/getAll').subscribe(
      (result) => {
        this.drugList = result;
      },
      (err) => { }
    );
  }
  getDrugsByCode()
  {

  }

  Close()
  {
    this.activeModal.close();
  }
  onSubmit()
  {
    this.setDrug.emit();
    this.activeModal.close();
  }
}
