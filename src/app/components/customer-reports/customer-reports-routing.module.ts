import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerAdvocacyByAmountComponent } from './customer-advocacy-by-amount/customer-advocacy-by-amount.component';
import { CustomerAdvocacyByTypeComponent } from './customer-advocacy-by-type/customer-advocacy-by-type.component';
import { CustomerOrdersCompletedComponent } from './customer-orders-completed/customer-orders-completed.component';
import { CustomerSecuredAdvocacyComponent } from './customer-secured-advocacy/customer-secured-advocacy.component';


const routes: Routes = [
  { path: 'ordersCompleted', component: CustomerOrdersCompletedComponent },
  { path: 'advocacyByType', component: CustomerAdvocacyByTypeComponent },
  { path: 'advocacyByAmount', component: CustomerAdvocacyByAmountComponent },
  { path: 'securedAdvocacy', component: CustomerSecuredAdvocacyComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerReportsRoutingModule { }
