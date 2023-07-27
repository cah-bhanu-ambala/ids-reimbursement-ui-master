import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DirtyCheckGuard } from 'src/app/common/guards/dirty/dirty.guard';
import { ContactMaintenanceComponent } from './contact-maintenance/contact-maintenance.component';
import { PatientMaintenanceComponent } from './patient-maintenance/patient-maintenance.component';
import { ProviderMaintenanceComponent } from './provider-maintenance/provider-maintenance.component';


const routes: Routes = [
  {path:'patientMaintenance',component:PatientMaintenanceComponent, canDeactivate: [DirtyCheckGuard] },
  {path:'ProviderMaintenance',component:ProviderMaintenanceComponent, canDeactivate: [DirtyCheckGuard]},
  {path:'contactMaintenance',component:ContactMaintenanceComponent, canDeactivate: [DirtyCheckGuard]},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupportRoutingModule { }
