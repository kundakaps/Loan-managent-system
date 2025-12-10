import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/ip_pages/dashboard/dashboard.component';
import { ErpPaymentsComponent } from 'app/ip_pages/erp-payments/erp-payments.component';
import { SchoolPaymentsComponent } from 'app/ip_pages/school-payments/school-payments.component';
import { UtilityPaymentsComponent } from 'app/ip_pages/utility-payments/utility-payments.component';
// Adjust path as necessary
import { AuthGuard } from 'app/services/auth/auth.guard';


export const IpLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard]},
  { path: 'utilitypayments', component: UtilityPaymentsComponent ,canActivate:[AuthGuard],
    children: [
      { path: 'waterpayments', component: UtilityPaymentsComponent },


    ]
  },

  { path: 'schoolpayments', component: SchoolPaymentsComponent ,canActivate:[AuthGuard],
    children: [
      { path: 'newpayment', component: SchoolPaymentsComponent },


    ]
  },

  { path: 'erppayments', component: ErpPaymentsComponent ,canActivate:[AuthGuard],
    children: [
      { path: 'newpayment', component: ErpPaymentsComponent },


    ]
  }

];
