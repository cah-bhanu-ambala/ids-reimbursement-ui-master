import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LazyLoadEvent } from 'primeng/api';
import { ProviderService } from 'src/app/common/services/http/provider.service';
import { alphaNumericValidator, alphaNumericSpaceValidator } from 'src/app/common/utils';
import { Provider } from 'src/app/models/classes/provider';

@Component({
  selector: 'app-provider-maintenance',
  templateUrl: './provider-maintenance.component.html',
  styleUrls: ['./provider-maintenance.component.scss']
})

export class ProviderMaintenanceComponent implements OnInit {

  formProvider: FormGroup;
  submitted: boolean;
  provider: Provider;
  isUpdate: any;
  showGrid: boolean;
  searchResult: any;
  providerSearchParam: string;
  providerId: number;
  errorMessage: any;
  showError: boolean;
  showForm: boolean = true;

  providerGridloading: boolean;
  providerDatasource: any;
  providerSearchResult: any;
  providerTotalRecords: any;
  isDirty = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private providerService: ProviderService,
    private router: Router,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.buildProviderform();
    this.onSearch('');
    this.formProvider.valueChanges.subscribe( e =>  {
      if(this.formProvider.dirty)
        this.isDirty = true
    } );
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }
  
  buildProviderform() {
    this.formProvider = this.formBuilder.group({
      // provider: new FormControl('', Validators.compose([
      //    Validators.required,
      //    Validators.maxLength(50),
      //    Validators.pattern(alphaNumericValidator)
      // ])),
      providerFirstName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(alphaNumericSpaceValidator)
      ])),
      providerLastName: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(alphaNumericSpaceValidator)
      ])),
      npi: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(15),
        Validators.pattern(alphaNumericValidator)
      ]))
    });
  }
  get f() { return this.formProvider != null ? this.formProvider.controls : null; }

  onSubmit() {
    this.submitted = true;
    //Check form is valid or not
    if (this.formProvider.invalid) {
      return false;
    }
    else {
      this.provider = this.formProvider.value;
      this.provider.active = true;
      this.provider.modifiedBy = parseInt(localStorage.userId);

      if (this.isUpdate) {

        this.provider.providerId = this.providerId;
        this.providerService.updateProvider(this.provider).subscribe(
          (result) => {
            this.onReset();
            this.isDirty = false;
            this.isUpdate = false;
            this.formProvider.reset();
            this.showSuccess('Updated Provider successfully, NPI:: '+this.provider.npi);
            this.onSearch('');
          },
          (err) => {
            console.log(err);
            // this.showFailure('Update Failed!!');
            this.showFailure(err);
          }
        );
      }
      else {
        this.provider.createdBy = parseInt(localStorage.userId);
        this.providerService.createProvider(this.provider).subscribe(
          (result) => {
            this.showGrid = false;
            this.isDirty = false;
            this.onReset();
            this.showSuccess('Added provider successfully, NPI :: '+result.npi);
            this.onSearch('');
          },
          (err) => {
            console.log(err);
            // this.showFailure('Create Provider Failed!!');
            this.showFailure(err);
          }
        );
      }
    }
  }

  onReset() {
    this.formProvider.reset();
    this.formProvider.markAsPristine();
    this.submitted = false;
  }

  onCancel() {
    this.onReset();
    this.isUpdate = false;
    this.showGrid = true;
  }

  onSearch(searchValue) {
    this.showGrid = false;  
      this.providerSearchParam = searchValue;
      this.providerService.searchProvider(this.providerSearchParam).subscribe(
        (result) => {
          this.searchResult = result;
          if (this.searchResult != null && this.searchResult.length > 0) {
            this.showGrid = true;
            this.showError = false;
            this.showForm = false;
            this.providerDatasource = result;
            this.providerTotalRecords = result.length;
            this.providerGridloading = false;
          }
          else {
            this.showError = true;
            // this.showInfo('No Records Found!');
            this.showGrid = false;
          }

        },
        (err) => { this.showFailure(err); }
      );   
  }

  loadProviderDetails(event: LazyLoadEvent) {
    this.providerGridloading = true;
    setTimeout(() => {
      if (this.providerDatasource) {
        this.providerSearchResult = this.providerDatasource.slice(event.first, (event.first + event.rows));
        this.providerGridloading = false;
      }
    }, 500);
  }

  onEdit(provider) {
    this.formProvider.reset();
    this.showGrid = false;
    this.showForm = true;
    this.formProvider.patchValue(
      {
        // provider: provider.provider ,
        providerFirstName: provider.providerFirstName,
        providerLastName: provider.providerLastName,
        npi: provider.npi
      }
    );
    this.isUpdate = true;
    this.providerId = provider.providerId;
    this.router.navigate(['/dashboard/support/ProviderMaintenance']);
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
