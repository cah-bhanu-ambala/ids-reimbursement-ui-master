import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportsRoutingModule } from './reports-routing.module';
import { BillingComponent } from './billing/billing.component';
import { DelinquencyComponent } from './delinquency/delinquency.component';
import { WorkstatusComponent } from './workstatus/workstatus.component';
import { AdvocacyAnalysisComponent } from './advocacy-analysis/advocacy-analysis.component';
import { SummaryComponent } from './summary/summary.component';
import { CalendarModule } from 'primeng/calendar';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { DeletedWorkitemsComponent } from './deleted-workitems/deleted-workitems.component';
import { BossInvoiceComponent } from './boss-invoice/boss-invoice.component';
import { FacilityBillingComponent } from './facility-billing/facility-billing.component';
import { AdvocacyBillingComponent } from './advocacy-billing/advocacy-billing.component';

//import { NgselectComponent } from '../shared/ngselect/ngselect.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    BillingComponent,
    DelinquencyComponent,
    WorkstatusComponent,
    AdvocacyAnalysisComponent,
    SummaryComponent,
    DeletedWorkitemsComponent, BossInvoiceComponent, FacilityBillingComponent, AdvocacyBillingComponent
    //NgselectComponent
  ],

  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ReportsRoutingModule,
    CalendarModule,
    MultiSelectModule,
    NgSelectModule,
    TableModule,
    SharedModule
  ]

})
export class ReportsModule { }
