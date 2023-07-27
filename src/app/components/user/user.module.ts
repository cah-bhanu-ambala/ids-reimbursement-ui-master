import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login-content/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginContentComponent } from './login-content/login-content.component';
import { LoginHelpComponent } from './login-content/login-help/login-help.component';
import { ResetPasswordComponent } from './login-content/reset-password/reset-password.component';
import { SecurityQuestionComponent } from './login-content/security-question/security-question.component';
import { SharedModule } from '../shared/shared.module';
import { LoginTemplateComponent } from './login-template/login-template.component';
import { PwdContentComponent } from './pwd-content/pwd-content.component';


@NgModule({
  declarations: [
    LoginTemplateComponent,
    LoginComponent,
    LoginContentComponent,
    LoginHelpComponent,
    ResetPasswordComponent,
    SecurityQuestionComponent,
    PwdContentComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class UserModule { }
