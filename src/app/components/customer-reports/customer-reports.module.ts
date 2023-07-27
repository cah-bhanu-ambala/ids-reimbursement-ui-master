import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomerReportsRoutingModule } from './customer-reports-routing.module';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';

import { CustomerOrdersCompletedComponent } from './customer-orders-completed/customer-orders-completed.component';
import { CustomerAdvocacyByTypeComponent } from './customer-advocacy-by-type/customer-advocacy-by-type.component';
import { CustomerAdvocacyByAmountComponent } from './customer-advocacy-by-amount/customer-advocacy-by-amount.component';
import { CustomerSecuredAdvocacyComponent } from './customer-secured-advocacy/customer-secured-advocacy.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {FacilityModule} from "../shared/customer-shared/facility.module";

@NgModule({
  declarations: [
    CustomerOrdersCompletedComponent,
    CustomerAdvocacyByTypeComponent,
    CustomerAdvocacyByAmountComponent,
    CustomerSecuredAdvocacyComponent],

  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FacilityModule,
    CustomerReportsRoutingModule,
    CalendarModule,
    MultiSelectModule,
    TableModule,
    NgxChartsModule
  ]

})
export class CustomerReportsModule { }
