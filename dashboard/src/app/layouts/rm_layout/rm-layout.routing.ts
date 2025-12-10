import { Routes } from '@angular/router';
import { RmDashboardComponent } from '../../rm_pages/rm-dashboard/rm-dashboard.component'; // Adjust path as necessary
import { AuthGuard } from 'app/services/auth/auth.guard';
import { AppointmentsComponent } from 'app/rm_pages/appointments/appointments.component';
import { AppointmentDetailsComponent } from 'app/rm_pages/appointment-details/appointment-details.component';
import { SAppointmentComponent } from 'app/rm_pages/s-appointment/s-appointment.component';
import { ReportsDetailsComponent } from 'app/rm_pages/reports-details/reports-details.component';

export const RmLayoutRoutes: Routes = [
  { path: 'dashboard', component: RmDashboardComponent ,canActivate:[AuthGuard]},
  { path: 'appointments', component: AppointmentsComponent ,canActivate:[AuthGuard],
    children: [
      { path: 'create', component: AppointmentsComponent },
      { path: 'pending', component: AppointmentsComponent },
      { path: 'approved', component: AppointmentsComponent },
      { path: 'declined', component: AppointmentsComponent },

    ]
  },

  { path: 's-appointments', component: SAppointmentComponent ,canActivate:[AuthGuard],
    children: [
      { path: 'pending', component: AppointmentsComponent },
      { path: 'reports', component: AppointmentsComponent },


    ]
  },
  { path: 'appointment-details', component: AppointmentDetailsComponent ,canActivate:[AuthGuard]},
  { path: 'report-details', component: ReportsDetailsComponent ,canActivate:[AuthGuard]},
];
