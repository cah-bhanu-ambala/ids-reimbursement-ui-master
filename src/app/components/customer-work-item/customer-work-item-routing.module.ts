import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddCustomerWorkitemComponent } from './add-customer-workitem/add-customer-workitem.component';
import { ViewSubmittedCustomerWorkitemComponent } from './view-submitted-customer-workitem/view-submitted-customer-workitem.component';
import { AppointmentMaintenanceComponent } from './appointment-maintenance/appointment-maintenance.component';
import { ViewCompletedCustomerWorkitemsComponent } from './view-completed-customer-workitems/view-completed-customer-workitems.component';
import { CustomerPatientInfoComponent } from './customer-patient-info/customer-patient-info.component';
import { DirtyCheckGuard } from 'src/app/common/guards/dirty/dirty.guard';

const routes: Routes = [
  { path: 'addCustomerWorkItem', component: AddCustomerWorkitemComponent , canDeactivate: [DirtyCheckGuard]},
  { path: 'viewSubmittedCustomerWork', component: ViewSubmittedCustomerWorkitemComponent },
  { path: 'submitPatientInfo', component: CustomerPatientInfoComponent , canDeactivate: [DirtyCheckGuard]},
  { path: 'viewCompletedCustomerWorkItems', component: ViewCompletedCustomerWorkitemsComponent },
  { path: 'appointmentMaintenance',component:AppointmentMaintenanceComponent , canDeactivate: [DirtyCheckGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerWorkItemRoutingModule { }
