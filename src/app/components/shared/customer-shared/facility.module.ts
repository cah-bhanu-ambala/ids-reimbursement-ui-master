import { NgModule } from '@angular/core';
import {FacilityComponent} from "./facility.component";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    FacilityComponent,
  ] ,
  imports: [
  CommonModule,
  FormsModule,
  ReactiveFormsModule
],
   exports:[
    FacilityComponent,
  ]
})
export class FacilityModule{ }
