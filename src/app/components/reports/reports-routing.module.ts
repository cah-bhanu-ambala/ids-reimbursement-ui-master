import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelinquencyComponent } from './delinquency/delinquency.component';
import { SummaryComponent } from './summary/summary.component';
import { AdvocacyAnalysisComponent } from './advocacy-analysis/advocacy-analysis.component';
import { BillingComponent } from './billing/billing.component';
import { WorkstatusComponent } from './workstatus/workstatus.component';
import { DeletedWorkitemsComponent } from './deleted-workitems/deleted-workitems.component';
import { BossInvoiceComponent } from './boss-invoice/boss-invoice.component';
import { FacilityBillingComponent } from './facility-billing/facility-billing.component';
import { AdvocacyBillingComponent } from './advocacy-billing/advocacy-billing.component';


const routes: Routes = [
  { path: 'delinquency', component: DelinquencyComponent },
  { path: 'summary', component: SummaryComponent },
  { path: 'advocacyanalysis', component: AdvocacyAnalysisComponent },
  { path: 'billing', component: BillingComponent },
  { path: 'bossInvoice', component: BossInvoiceComponent },
  { path: 'workstatus', component: WorkstatusComponent, },
  { path: 'facilityBilling', component: FacilityBillingComponent, },
  { path: 'advocacyBilling', component: AdvocacyBillingComponent, },
  { path: 'deletedWorkItems', component: DeletedWorkitemsComponent, },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
