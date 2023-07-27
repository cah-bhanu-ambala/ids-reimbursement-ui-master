import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupportRoutingModule } from './support-routing.module';
import { PatientMaintenanceComponent } from './patient-maintenance/patient-maintenance.component';
import { ProviderMaintenanceComponent } from './provider-maintenance/provider-maintenance.component';
import { ContactMaintenanceComponent } from './contact-maintenance/contact-maintenance.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../shared/shared.module';
import { NgxMaskModule } from 'ngx-mask';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [ 
     PatientMaintenanceComponent,
     ProviderMaintenanceComponent,
     ContactMaintenanceComponent
     ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    SharedModule,
    NgxMaskModule.forRoot(),   
    TableModule 
  ]
})
export class SupportModule { }
