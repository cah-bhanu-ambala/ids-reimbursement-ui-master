import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { LazyLoadEvent } from 'primeng/api';
import { PatientService } from 'src/app/common/services/http/patient.service';

@Component({
  selector: 'app-view-patient-data',
  templateUrl: './view-patient-data.component.html',
  styleUrls: ['./view-patient-data.component.scss']
})
export class ViewPatientDataComponent implements OnInit {
  viewPatientForm: FormGroup;
  userId: number;
  facilities: any[];
  searched: boolean;
  showGrid: boolean;
  showError: boolean;

  datasource: any[];
  totalRecords: number;
  cols: any[];
  loading: boolean;
  exportColumns: any[] = [];
  patientsList: any[];

  constructor( 
    private formBuilder: FormBuilder, 
    private change: ChangeDetectorRef,
    private patientService: PatientService
    ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    this.buildViewPatientForm();
    this.getFacilityList();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  get f() { return this.viewPatientForm != null ? this.viewPatientForm.controls : null; }

  buildViewPatientForm() {
    this.viewPatientForm = this.formBuilder.group({
      facilityId:[''],
      mrn:''
    });
  }

  getViewPatientData() {
    this.showGrid = false;   
    let params = {
      facilityId: this.viewPatientForm.get('facilityId').value,
      mrn: this.viewPatientForm.get('mrn').value
    };

    if (this.viewPatientForm.invalid) {
      this.showError = true;
      // this.showFailure('Please select any facility or valid date')
      this.searched = true;
      this.showGrid = false;      
      return false;
    }
    else {
      this.showError = false;
      this.patientService.getClinicRespondedPatients(params).subscribe(data => {
        if(data.length > 0){
        this.datasource = data;
        this.totalRecords = data.length;
        this.showGrid = true;
        }
        else
        {
          this.showGrid = false;
          this.showError = true;
        }
      });
    }
  }

  loadPatientData(event: LazyLoadEvent) {
    this.loading = true;
    setTimeout(() => {
      if (this.datasource) {
        this.patientsList = this.datasource.slice(event.first, (event.first + event.rows));
        this.loading = false;
      }
    }, 500);
  }


  getFacilityList() {
    this.patientService.getFacilityList().subscribe(
      (result) => {
        this.facilities = result;
      },
      (err) => { }
    );
  }

  onReset(){
    this.viewPatientForm.reset();
    this.viewPatientForm.markAsPristine();
    this.searched = false;
    this.showGrid = false;
    this.showError = true;
  }
}
