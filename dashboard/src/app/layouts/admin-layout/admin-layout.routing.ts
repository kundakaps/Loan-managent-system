import { InnovationsHubComponent } from './../../pages/innovations-hub/innovations-hub.component';
import { ReportsComponent } from './../../pages/reports/reports.component';

import { AllUsersComponent } from './../../pages/all-users/all-users.component';

import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserComponent } from '../../pages/user/user.component';
import { TableComponent } from '../../pages/table/table.component';
import { TypographyComponent } from '../../pages/typography/typography.component';
import { IconsComponent } from '../../pages/icons/icons.component';

import { NotificationsComponent } from '../../pages/notifications/notifications.component';
import { UpgradeComponent } from '../../pages/upgrade/upgrade.component';

import { SendInviteComponent } from 'app/pages/send-invite/send-invite.component';

import { PaymentsComponent } from 'app/pages/payments/payments.component';

import { AuthGuard } from 'app/services/auth/auth.guard';

import { UserInformationComponent } from 'app/pages/user-information/user-information.component';
import { ContributionsComponent } from 'app/pages/contributions/contributions.component';
import { AddUserComponent } from 'app/pages/add-user/add-user.component';
import { PendingContributionsComponent } from 'app/pages/pending-contributions/pending-contributions.component';
import { ContributionDetailsComponent } from 'app/pages/contribution-details/contribution-details.component';
import { SubPackagesComponent } from 'app/pages/sub-packages/sub-packages.component';
import { PendingSubPaymentComponent } from 'app/pages/pending-sub-payment/pending-sub-payment.component';
import { SubPaymentDetailsComponent } from 'app/pages/sub-payment-details/sub-payment-details.component';
import { UserLoansComponent } from 'app/pages/user-loans/user-loans.component';
import { LoansComponent } from 'app/pages/loans/loans.component';
import { UserRepaymentsComponent } from 'app/pages/user-repayments/user-repayments.component';
import { LoanRepaymentComponent } from 'app/pages/loan-repayment/loan-repayment.component';
import { LoanRepaymentDetailsComponent } from 'app/pages/loan-repayment-details/loan-repayment-details.component';
import { DepartmentsComponent } from 'app/pages/departments/departments.component';
import { MessagesComponent } from 'app/pages/messages/messages.component';
import { TestingComponent } from 'app/pages/testing/testing.component';
import { FinalApproverComponent } from 'app/pages/final-approver/final-approver.component';
import { EmployeesComponent } from 'app/pages/employees/employees.component';
import { EmployeeDetailsComponent } from 'app/pages/employee-details/employee-details.component';
import { ProfileComponent } from 'app/pages/profile/profile.component';
import { LeaveComponent } from 'app/pages/leave/leave.component';
import { LeaveApprovalComponent } from 'app/pages/leave-approval/leave-approval.component';
import { EditComponent } from 'app/pages/edit/edit.component';
import { UserEditComponent } from 'app/pages/user-edit/user-edit.component';
import { EmployeeApprovalsComponent } from 'app/pages/employee-approvals/employee-approvals.component';
import { EmployeeUpdatesComponent } from 'app/pages/employee-updates/employee-updates.component';
import { SettingsComponent } from 'app/pages/settings/settings.component';
import { DocumentsComponent } from 'app/pages/documents/documents.component';
import { EventsComponent } from 'app/pages/events/events.component';
import { EventsDetailsComponent } from 'app/pages/events-details/events-details.component';
import { CustomersComponent } from 'app/pages/customers/customers.component';
import { FacilitiesComponent } from 'app/pages/facilities/facilities.component';
import { LoanDetailsComponent } from 'app/pages/loan-details/loan-details.component';

export const AdminLayoutRoutes: Routes = [
     { path: 'dashboard',      component: DashboardComponent,canActivate:[AuthGuard]},
    //{ path: 'dashboard',      component: DashboardComponent},
    { path: 'customers',      component: CustomersComponent,canActivate:[AuthGuard],
      children: [
        { path: 'add-customer', component: CustomersComponent },
        { path: 'all-customers', component: CustomersComponent },


      ]
    },

    { path: 'facilities',      component: FacilitiesComponent,canActivate:[AuthGuard],
      children: [
        { path: 'add-facility', component: FacilitiesComponent },
        { path: 'all-facilities', component: FacilitiesComponent },


      ]
    },
       { path: 'loans',      component: LoansComponent,canActivate:[AuthGuard],
        children: [
        { path: 'add-loan', component: LoansComponent },
        { path: 'waiting-activation', component: LoansComponent },
        { path: 'all-loans', component: LoansComponent },


      ]
    },
     { path: 'users',      component: UserComponent,canActivate:[AuthGuard],
        children: [
        { path: 'add-user', component: UserComponent },
        { path: 'all-users', component: UserComponent },


      ]
    },
    { path: 'loan-details',      component: LoanDetailsComponent},
   // { path: 'event-details',      component: EventsDetailsComponent,canActivate:[AuthGuard]},

    // { path: 'documents',      component: DocumentsComponent,canActivate:[AuthGuard],
    //   children: [
    //     { path: 'policies', component: DocumentsComponent },
    //     { path: 'circulars', component: DocumentsComponent },
    //     { path: 'staff-documents', component: DocumentsComponent },


    //   ]
    // },
    // { path: 'edit',      component: EditComponent,canActivate:[AuthGuard],},
    // { path: 'user-edit',      component: UserEditComponent,canActivate:[AuthGuard],},


    // { path: 'leave',      component: LeaveComponent,canActivate:[AuthGuard],
    //   children: [
    //     { path: 'apply', component: LeaveComponent },
    //     { path: 'history', component: LeaveComponent },


    //   ]
    // },
    // { path: 'leave-approval',      component: LeaveApprovalComponent,canActivate:[AuthGuard],
    //   children: [
    //     { path: 'pending-leave', component: LeaveApprovalComponent },
    //     { path: 'approved-leave', component: LeaveApprovalComponent },




    //   ]
    // },



    // { path: 'employees',      component: EmployeesComponent,canActivate:[AuthGuard],
    //   children: [
    //     { path: 'all-employees', component: EmployeesComponent },
    //     { path: 'documents', component: EmployeesComponent },
    //     { path: 'add-employee', component: EmployeesComponent },

    //     { path: 'employee-updates', component: EmployeesComponent },
    //     { path: 'employee-positions', component: EmployeesComponent },

    //   ]
    // },
    // { path: 'Settings',      component: SettingsComponent,canActivate:[AuthGuard],
    //   children: [
    //     { path: 'holiday-maintenance', component: SettingsComponent },


    //   ]
    // },
    // { path: 'innovation-hub',      component: InnovationsHubComponent,canActivate:[AuthGuard],
    //   children: [
    //     { path: 'submit-innovation', component: InnovationsHubComponent },


    //   ]
    // },

    // { path: 'reports',      component: ReportsComponent,canActivate:[AuthGuard],
    //   children: [
    //     { path: 'employee-report', component: ReportsComponent },


    //   ]
    // },


    // { path: 'employees-approvals',      component: EmployeeApprovalsComponent,canActivate:[AuthGuard],
    //   children: [
    //     { path: 'pending-employees', component: EmployeeApprovalsComponent },
    //     { path: 'all-employees', component: EmployeeApprovalsComponent },

    //   ]
    // },

    // { path: 'employee-details',      component: EmployeeDetailsComponent,canActivate:[AuthGuard]},
    // { path: 'employee-updates',      component: EmployeeUpdatesComponent,canActivate:[AuthGuard]},














    // { path: 'adduserinfo',      component: UserInformationComponent,canActivate:[AuthGuard]},
    // { path: 'contributions',      component: ContributionsComponent,canActivate:[AuthGuard]},
    // { path: 'pending-contributions',      component: PendingContributionsComponent,canActivate:[AuthGuard]},
    // { path: 'contributions-details',      component: ContributionDetailsComponent,canActivate:[AuthGuard]},
    // { path: 'updatesubamount',      component: SubPackagesComponent,canActivate:[AuthGuard]},
    // { path: 'pendingsubpayment',      component: PendingSubPaymentComponent,canActivate:[AuthGuard]},
    // { path: 'subpayment-details',      component: SubPaymentDetailsComponent,canActivate:[AuthGuard]},
    // { path: 'user-loans',      component: UserLoansComponent,canActivate:[AuthGuard]},
    // { path: 'loans',      component: LoansComponent,canActivate:[AuthGuard]},
    // { path: 'user-repayment',      component: UserRepaymentsComponent,canActivate:[AuthGuard]},
    // { path: 'loan-repayment',      component: LoanRepaymentComponent,canActivate:[AuthGuard]},
    // { path: 'loan-repayment-details',      component: LoanRepaymentDetailsComponent,canActivate:[AuthGuard]},
    // { path: 'user',           component: UserComponent },
    // { path: 'table',          component: TableComponent },
    // { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    // { path: 'maps',           component: MapsComponent },
    // { path: 'notifications',  component: NotificationsComponent },
    // { path: 'upgrade',        component: UpgradeComponent },
    // { path: 'buses',        component: BusesComponent },
    // { path: 'routes',        component: RoutesComponent },
    // { path: 'Busstops',        component: BusPointsComponent },
    // { path: 'busonroute',        component: AddbustoRouteComponent },
    // { path: 'seatnumber',        component: SeatNumbersComponent },
    // { path: 'makebooking',        component: MakeBookingComponent },
    // { path: 'events',        component: EventsComponent, canActivate:[AuthGuard]},
    // { path: 'send-invite',        component: SendInviteComponent,canActivate:[AuthGuard] },
    // { path: 'cash-approval',        component: CashApprovalComponent },
    // { path: 'edit',        component: EditComponent,canActivate:[AuthGuard]  },
    // { path: 'payment',        component: PaymentsComponent ,canActivate:[AuthGuard] },
    // { path: 'edit-event',        component: EditEventComponent,canActivate:[AuthGuard]  },

    { path: 'all-users',        component: AllUsersComponent,canActivate:[AuthGuard]  },

];
