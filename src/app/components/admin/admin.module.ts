import { NgModule } from '@angular/core';
import { NgbModule,NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { FacilityMaintenanceComponent } from './facility-maintenance/facility-maintenance.component';
import { SystemMaintenanceComponent } from './system-maintenance/system-maintenance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FacilityApprovalComponent } from './facility-approval/facility-approval.component';
import { DrugProcMaintenanceComponent } from './drug-proc-maintenance/drug-proc-maintenance.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask'
import { TableModule } from 'primeng/table';
import { DrugAdvocacyManagementComponent } from './drug-advocacy-management/drug-advocacy-management.component';
import { DrugAdvocacyClearanceComponent } from './drug-advocacy-clearance/drug-advocacy-clearance.component';

import { NgSelectModule } from '@ng-select/ng-select';
import { MultiSelectModule } from 'primeng/multiselect';


@NgModule({
  declarations: [
    FacilityMaintenanceComponent,
    FacilityApprovalComponent,
    FacilityApprovalComponent,
    SystemMaintenanceComponent,
    DrugProcMaintenanceComponent,
    UserManagementComponent,
    DrugAdvocacyManagementComponent,
    DrugAdvocacyClearanceComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    NgxMaskModule.forRoot(),
    TableModule,
    NgbModule,
    NgbDatepickerModule,
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    TableModule,
    MultiSelectModule,
    TableModule,
    NgSelectModule
  ],
  exports: [],
})

export class AdminModule { }

