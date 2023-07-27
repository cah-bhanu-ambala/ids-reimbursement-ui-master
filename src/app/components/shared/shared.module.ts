import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { HeaderComponent } from './header/header.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { FooterComponent } from './footer/footer.component';
import { SuccessModalComponent } from './success-modal/success-modal.component';
import { SearchRevenueComponent } from './search-revenue/search-revenue.component';
import { InputModalComponent } from './input-modal/input-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HideShowPassDirective } from 'src/app/common/directives/hide-show-pass.directive';
import { FormMessagingComponent } from './form-messaging/form-messaging.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { FileAttachmentsComponent } from './file-attachments/file-attachments.component';
import { AssignedDropdownComponent } from './assigned-dropdown/assigned-dropdown.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    HeaderComponent,
    ConfirmModalComponent,
    FooterComponent,
    SpinnerComponent,
    SuccessModalComponent,
    SearchRevenueComponent,
    InputModalComponent,
    HideShowPassDirective,
    FormMessagingComponent,
    FileAttachmentsComponent,
    AssignedDropdownComponent
  ],
  imports: [
    CommonModule,
    SharedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports:[
    HeaderComponent,
    FooterComponent,
    SpinnerComponent,
    SearchRevenueComponent,
    HideShowPassDirective,
    FormMessagingComponent,
    FileAttachmentsComponent,
    AssignedDropdownComponent
  ]
})
export class SharedModule { }
