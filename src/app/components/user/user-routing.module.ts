import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginContentComponent } from './login-content/login-content.component';
import { ResetPasswordComponent } from './login-content/reset-password/reset-password.component';
import { SecurityQuestionComponent } from './login-content/security-question/security-question.component';
import { PwdContentComponent } from './pwd-content/pwd-content.component';


const routes: Routes = [
  { path: 'login', component: LoginContentComponent },
  {
    path: 'password',
    component: PwdContentComponent,
    children: [
      { path: 'security-question', component: SecurityQuestionComponent },
      { path: 'security-question/:code', component: SecurityQuestionComponent },
      { path: 'set', component: ResetPasswordComponent },
      { path: '', redirectTo: 'security-question' }
    ]
  },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
