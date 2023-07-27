import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WorkItemRoutingModule } from './work-item-routing.module';
import { AddWorkitemComponent } from './add-workitem/add-workitem.component';
import { ViewWorkitemComponent } from './view-workitem/view-workitem.component';
import { WorkitemMaintenanceComponent } from './workitem-maintenance/workitem-maintenance.component';
import { CustomerWorkitemComponent } from './customer-workitem/customer-workitem.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditWorkitemComponent } from './workitem-maintenance/edit-workitem/edit-workitem.component';
import { HttpClientModule } from '@angular/common/http';
import { EditDrugFormComponent } from './workitem-maintenance/edit-drug-form/edit-drug-form.component';
import { SharedModule } from '../shared/shared.module';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { MultiSelectModule } from 'primeng/multiselect';
import { AddInternalWorkitemComponent } from './customer-workitem/add-internal-workitem/add-internal-workitem.component';
import { ViewPatientDataComponent } from './view-patient-data/view-patient-data.component';


@NgModule({
  declarations: [AddWorkitemComponent, ViewWorkitemComponent, WorkitemMaintenanceComponent, CustomerWorkitemComponent, EditWorkitemComponent, EditDrugFormComponent, AddInternalWorkitemComponent, ViewPatientDataComponent],
  imports: [
    CommonModule,
    WorkItemRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    SharedModule,
    TableModule,
    ButtonModule,
    TooltipModule,
    NgSelectModule,
    MultiSelectModule 
  ],
  exports:[AddInternalWorkitemComponent]
})
export class WorkItemModule { }
