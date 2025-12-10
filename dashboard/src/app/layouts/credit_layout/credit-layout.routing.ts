import { Routes } from '@angular/router';
import { DashboardComponent } from 'app/credit_pages/dashboard/dashboard.component';


// Adjust path as necessary
import { AuthGuard } from 'app/services/auth/auth.guard';


export const CreditLayoutRoutes: Routes = [
  { path: 'dashboard', component: DashboardComponent,canActivate:[AuthGuard]},

];
