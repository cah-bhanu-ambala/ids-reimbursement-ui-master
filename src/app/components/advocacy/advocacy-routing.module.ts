import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddAdvocacyComponent } from './add-advocacy/add-advocacy.component';
import { AdvocacyMaintenanceComponent } from './advocacy-maintenance/advocacy-maintenance.component';
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { EditAdvocacyComponent } from './advocacy-maintenance/edit-advocacy/edit-advocacy.component';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { DirtyCheckGuard } from 'src/app/common/guards/dirty/dirty.guard';

const routes: Routes = [
  { path: 'addAdvocacy', component: AddAdvocacyComponent, canDeactivate: [DirtyCheckGuard]},
  { path: 'advocacyMaintenance', component: AdvocacyMaintenanceComponent },
  { path: 'editAdvocacy', component: EditAdvocacyComponent , canDeactivate: [DirtyCheckGuard]},
  { path: 'addAppointment', component: AddAppointmentComponent , canDeactivate: [DirtyCheckGuard]},
  { path: 'opportunities', component: OpportunityComponent , canDeactivate: [DirtyCheckGuard]},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdvocacyRoutingModule { }
