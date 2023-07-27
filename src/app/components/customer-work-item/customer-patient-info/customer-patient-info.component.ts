import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { CustomerService } from 'src/app/common/services/http/customer.service';
import { PatientService } from 'src/app/common/services/http/patient.service';
import { amountValidator } from 'src/app/common/utils';
import { Patient } from 'src/app/models/classes/patient';

@Component({
  selector: 'app-customer-patient-info',
  templateUrl: './customer-patient-info.component.html',
  styleUrls: ['./customer-patient-info.component.scss'],
})
export class CustomerPatientInfoComponent implements OnInit {
  formSearchPatient: FormGroup;
  userId: number;
  patientId: any;

  facilities: any[];
  contactStatuses: any;

  showGrid = false;
  submitted = false;
  searched = false;

  errorMessage: any;
  showForm: boolean = false;
  resultGridloading: boolean;
  patientDatasource: any;
  totalSearchRecords: any;
  patientTotalRecords: any;

  patient: Patient;
  formPatient: FormGroup;

  searchResult: any;
  showError: boolean;
  showSearchForm = true;
  // customerFacilityId: number;
  // customerFacilityName: string;
  isDirty = false;

  constructor(
    private formBuilder: FormBuilder,
    private patientService: PatientService,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private change: ChangeDetectorRef  
  ) { }

  ngOnInit(): void {
    this.userId = parseInt(localStorage.userId);
    // this.customerFacilityId = parseInt(localStorage.CustomerfacilityId);
    // this.customerFacilityName = localStorage.CustomerfacilityName;
    // this.getFacilityList();
    this.getContactStatus();
    this.buildSearchForm();
    this.buildFormPatient();
    // if (this.customerFacilityId != 0) {
    //   this.formSearchPatient.removeControl("facilityId");
    // }
    this.formPatient.valueChanges.subscribe(e => {
      if (this.formPatient.dirty)
        this.isDirty = true
    });
  }

  ngAfterViewChecked() {
    this.change.detectChanges();
  }

  get sf() {
    return this.formSearchPatient != null ? this.formSearchPatient.controls : null;
  }

  get f() {
    return this.formPatient != null ? this.formPatient.controls : null;
  }

  buildSearchForm() {
    this.formSearchPatient = this.formBuilder.group({
      intFacilityId: ['', Validators.compose([Validators.required])],
      facilityId: 0,
      facilityName: { value: '', disabled: true },
      mrn: ''
    });
  }

  buildFormPatient() {
    this.formPatient = this.formBuilder.group({
      facilityId: [{ value: null, disabled: true }, Validators.required],
      mrn: [{ value: '', disabled: true }, Validators.required],
      contactStatusId: ['', Validators.required],
      proofOfIncome: ['', Validators.compose([Validators.maxLength(13), Validators.pattern(amountValidator)])],
      householdSize: '',
      notes: ['', Validators.compose([Validators.maxLength(1000)])],
    });
  }
  //
  // getFacilityList() {
  //   this.patientService.getFacilityList().subscribe(
  //     (result) => {
  //       this.facilities = result;
  //     }
  //   );
  // }

  getContactStatus() {
    this.patientService.getContactStatus().subscribe(
      (result) => {
        this.contactStatuses = result;
      }
    );
  }
  onSearch() {
    this.showForm = false;
    this.showError = false;

    if (this.formSearchPatient.invalid) {
      this.searched = true;
      return false;
    } else {
      this.showGrid = false;
      this.searched = true;
      const params = {
        facilityId: this.formSearchPatient.get('intFacilityId').value ,
        mrn: this.formSearchPatient.get('mrn').value
      };
      this.customerService
        .getPatientNotRespondedStatusPatients(params)
        .subscribe(
          (result) => {
            if (result != null && result.length > 0) {
              this.searchResult = result;
              this.showError = false;
              this.showGrid = true;
              this.patientDatasource = result;
              this.patientTotalRecords = result.length;
              this.resultGridloading = false;
            } else {
              this.showGrid = false;
              this.showError = true;
              // this.showInfo('No Records Found!');
            }
          },
          (err) => {
            this.showFailure(err);
          }
        );
    }
  }

  loadPatientDetails(event: LazyLoadEvent) {
    this.resultGridloading = true;
    setTimeout(() => {
      if (this.patientDatasource) {
        this.totalSearchRecords = this.patientDatasource.slice(
          event.first,
          event.first + event.rows
        );
        this.resultGridloading = false;
      }
    }, 500);
  }

  onEditPatient(patientId) {
    console.log(patientId);

    this.formPatient.reset();
    this.showGrid = false;
    this.showForm = true;

    this.patientId = patientId;

    this.patientService.getByPatientId(patientId).subscribe(
      (result) => {
        this.patient = result;

        this.formPatient.setValue({
          mrn: this.patient.mrn,
          facilityId: this.patient.facilityId,
          proofOfIncome: this.patient.proofOfIncome,
          householdSize: this.patient.householdSize,
          contactStatusId: this.patient.contactStatusId,
          notes: this.patient.notes,
        });
      },
      (err) => {
        this.showFailure(err);
      }
    );
  }

  onSubmit() {
    this.submitted = true;

    //Check form is valid or not
    if (this.formPatient.invalid) {
      return false;
    }
    else {
      let data = this.formPatient.value;

      data.modifiedBy = this.userId;
      data.patientId = this.patientId;
      // data.primaryInsuranceId = this.patient.primaryInsuranceId;
      // data.secondaryInsuranceId = this.patient.secondaryInsuranceId;

      this.customerService.updatePatient(data).subscribe(
        (result) => {
          this.submitted = false;
          this.isDirty = false;
          this.searched = false;
          this.showSuccess('Updated Patient Successfully');
          this.formPatient.reset();
          this.onSearch();
        },
        (err) => {
          console.log(err);
          this.showFailure(err);
        }
      );
    }

  }

  onClear() {
    this.formPatient.patchValue({
      contactStatusId: null,
      proofOfIncome: '',
      householdSize: '',
      notes: ''
    });
    this.submitted = false;
    this.showGrid = false;
    this.showForm = true;
  }

  onCancel() {
    this.onClear();
    this.showGrid = false;
    this.showForm = false;
  }

  onResetSF() {
    this.formSearchPatient.patchValue({
      intFacilityId: '',
      facilityId: 0,
      mrn: ''
    });

    this.formSearchPatient.markAsPristine();
    this.submitted = false;
    this.showGrid = false;
    this.searched = false;
    this.showError = false;
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
