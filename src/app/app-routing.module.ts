import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {OktaCallbackComponent} from '@okta/okta-angular';
import {AuthGuard} from './common/guards/auth.guard';

const redirectTo = 'user';
const routes: Routes = [
  { path: 'login/callback', component: OktaCallbackComponent },
  {
    path: 'user',
    loadChildren: () => import('./components/user/user.module').then(m => m.UserModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./components/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  { path: '', redirectTo, pathMatch: 'full' },
  {
    path: 'reports',
    loadChildren: () => import('./components/reports/reports.module').then(m => m.ReportsModule),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
