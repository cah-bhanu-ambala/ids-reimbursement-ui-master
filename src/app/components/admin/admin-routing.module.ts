import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirtyCheckGuard } from 'src/app/common/guards/dirty/dirty.guard';
import { DrugProcMaintenanceComponent } from './drug-proc-maintenance/drug-proc-maintenance.component';
import { FacilityApprovalComponent } from './facility-approval/facility-approval.component';
import { FacilityMaintenanceComponent } from './facility-maintenance/facility-maintenance.component';
import { SystemMaintenanceComponent } from './system-maintenance/system-maintenance.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { DrugAdvocacyManagementComponent } from './drug-advocacy-management/drug-advocacy-management.component';
import { DrugAdvocacyClearanceComponent } from './drug-advocacy-clearance/drug-advocacy-clearance.component';


const routes: Routes = [
  { path: 'drugProcMaintenance', component: DrugProcMaintenanceComponent, canDeactivate: [DirtyCheckGuard] },
  { path: 'facilityApproval', component: FacilityApprovalComponent , canDeactivate: [DirtyCheckGuard]},
  { path: 'facilityMaintenance', component: FacilityMaintenanceComponent, canDeactivate: [DirtyCheckGuard] },
  { path: 'systemMaintenance', component: SystemMaintenanceComponent, canDeactivate: [DirtyCheckGuard] },
  { path: 'userManagement', component: UserManagementComponent , canDeactivate: [DirtyCheckGuard]},
  { path: 'drugAdvocacyManagement', component: DrugAdvocacyManagementComponent , canDeactivate: [DirtyCheckGuard]},
  { path: 'drugAdvocacyClearance', component: DrugAdvocacyClearanceComponent , canDeactivate: [DirtyCheckGuard]}

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
