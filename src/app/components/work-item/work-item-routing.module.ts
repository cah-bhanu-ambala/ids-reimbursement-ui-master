import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirtyCheckGuard } from 'src/app/common/guards/dirty/dirty.guard';
import { AddWorkitemComponent } from './add-workitem/add-workitem.component';
import { AddInternalWorkitemComponent } from './customer-workitem/add-internal-workitem/add-internal-workitem.component';
import { CustomerWorkitemComponent } from './customer-workitem/customer-workitem.component';
import { ViewPatientDataComponent } from './view-patient-data/view-patient-data.component';
import { ViewWorkitemComponent } from './view-workitem/view-workitem.component';
import { EditWorkitemComponent } from './workitem-maintenance/edit-workitem/edit-workitem.component';
import { WorkitemMaintenanceComponent } from './workitem-maintenance/workitem-maintenance.component';


const routes: Routes = [
  { path: 'addWorkItem', component: AddWorkitemComponent, canDeactivate: [DirtyCheckGuard]},
  { path: 'workItemMaintenance', component: WorkitemMaintenanceComponent , canDeactivate: [DirtyCheckGuard]}, 
  { path: 'viewWorkItem', component: ViewWorkitemComponent },
  { path: 'viewPatientData', component: ViewPatientDataComponent },
  {path:'editWorkItem',component:EditWorkitemComponent, canDeactivate: [DirtyCheckGuard]},

  { path: 'addInternalWorkItem', component: AddInternalWorkitemComponent , canDeactivate: [DirtyCheckGuard]},
  { path: 'customerWorkItem', component: CustomerWorkitemComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]  
})

export class WorkItemRoutingModule { }
