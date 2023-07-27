import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
// import { DashboardComponent } from './dashboard/dashboard.component';


const routes: Routes = [
  {
    path: '', component: HomeComponent,

    children: [
      // {
      //   path:'home',component: DashboardComponent,
      // },
      {
        path: 'admin',
        loadChildren: () => import('src/app/components/admin/admin.module').then(m => m.AdminModule)
      },
      {
        path: 'support',
        loadChildren: () => import('src/app/components/support/support.module').then(m => m.SupportModule)
      },
      {
        path: 'workmenu',
        loadChildren: () => import('src/app/components/work-item/work-item.module').then(m => m.WorkItemModule)
      },
      {
        path: 'advocacy',
        loadChildren: () => import('src/app/components/advocacy/advocacy.module').then(m => m.AdvocacyModule  )
      },
      {
        path: 'reports',
        loadChildren: () => import('src/app/components/reports/reports.module').then(m => m.ReportsModule  )
      },
      {
        path: 'customerworkmenu',
        loadChildren: () => import('src/app/components/customer-work-item/customer-work-item.module').then(m => m.CustomerWorkItemModule  )
      },
      {
        path: 'customerReports',
        loadChildren: () => import('src/app/components/customer-reports/customer-reports.module').then(m => m.CustomerReportsModule) 
      } 
    ]
  },

  //{ path: '', redirectTo: 'admin', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
