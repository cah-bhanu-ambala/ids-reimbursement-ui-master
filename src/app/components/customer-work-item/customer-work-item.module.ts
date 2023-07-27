import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { DataViewModule } from 'primeng/dataview';

import { SharedModule } from '../shared/shared.module';
import { AddCustomerWorkitemComponent } from './add-customer-workitem/add-customer-workitem.component';
import { ViewSubmittedCustomerWorkitemComponent } from './view-submitted-customer-workitem/view-submitted-customer-workitem.component';
import { ViewCompletedCustomerWorkitemsComponent } from './view-completed-customer-workitems/view-completed-customer-workitems.component';
import { AppointmentMaintenanceComponent } from './appointment-maintenance/appointment-maintenance.component';
import { CustomerWorkItemRoutingModule } from './customer-work-item-routing.module';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { NgSelectModule } from '@ng-select/ng-select';
import { AccordionModule } from 'primeng/accordion';
import { CustomerPatientInfoComponent } from './customer-patient-info/customer-patient-info.component';
import {FacilityModule} from "../shared/customer-shared/facility.module";

const PNG_MODULES = [
  ButtonModule,
  DropdownModule,
  DataViewModule,
];

@NgModule({
  declarations: [
    AddCustomerWorkitemComponent,
    ViewSubmittedCustomerWorkitemComponent,
    ViewCompletedCustomerWorkitemsComponent,
    AppointmentMaintenanceComponent,
    CustomerPatientInfoComponent,
  ]
  ,
  imports: [
    CommonModule,
    CustomerWorkItemRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule, 
    SharedModule,
    TableModule,
    TooltipModule,
    NgSelectModule,
    TableModule, 
    AccordionModule,
    FacilityModule,
    ...PNG_MODULES
  ]
})
export class CustomerWorkItemModule { }

