import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdvocacyRoutingModule } from './advocacy-routing.module';
import { AddAdvocacyComponent } from './add-advocacy/add-advocacy.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdvocacyMaintenanceComponent } from './advocacy-maintenance/advocacy-maintenance.component';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { SharedModule } from '../shared/shared.module';
import { TableModule } from 'primeng/table';
import { AccordionModule } from 'primeng/accordion';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditAdvocacyComponent } from './advocacy-maintenance/edit-advocacy/edit-advocacy.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import {TreeTableModule} from 'primeng/treetable';

@NgModule({
  declarations: [AddAdvocacyComponent, AdvocacyMaintenanceComponent, AddAppointmentComponent, EditAdvocacyComponent, OpportunityComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdvocacyRoutingModule,
    NgbModule,
    SharedModule,
    TableModule,
    AccordionModule,
    NgSelectModule,
    TreeTableModule
  ],
  bootstrap: [ AddAdvocacyComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class AdvocacyModule { }
