import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastrModule } from "ngx-toastr";

import { SidebarModule } from './sidebar/sidebar.module';
import { FooterModule } from './shared/footer/footer.module';
import { NavbarModule} from './shared/navbar/navbar.module';
import { FixedPluginModule} from './shared/fixedplugin/fixedplugin.module';

import { AppComponent } from './app.component';
import { AppRoutes } from './app.routing';

import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

import { HomeComponent } from './home/home.component';
import { SignUpComponent } from './sign-up/sign-up.component';

import {HttpClientModule} from '@angular/common/http'
import {FormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';





import { SpinnerComponent } from './spinner/spinner.component';

import { PrivacyComponent } from './privacy/privacy.component';

import { SendInviteComponent } from './pages/send-invite/send-invite.component';


import { PaymentsComponent } from './pages/payments/payments.component';

import { PasswordLinkComponent } from './password-link/password-link.component';
import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { ReactiveFormsModule } from '@angular/forms';



import { AllUsersComponent } from './pages/all-users/all-users.component';



import { UserInformationComponent } from './pages/user-information/user-information.component';
import { ContributionsComponent } from './pages/contributions/contributions.component';
import { AddUserComponent } from './pages/add-user/add-user.component';
import { PendingContributionsComponent } from './pages/pending-contributions/pending-contributions.component';
import { ContributionDetailsComponent } from './pages/contribution-details/contribution-details.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { SubPackagesComponent } from './pages/sub-packages/sub-packages.component';
import { PendingSubPaymentComponent } from './pages/pending-sub-payment/pending-sub-payment.component';
import { SubPaymentDetailsComponent } from './pages/sub-payment-details/sub-payment-details.component';
import { UserLoansComponent } from './pages/user-loans/user-loans.component';
import { LoansComponent } from './pages/loans/loans.component';
import { UserRepaymentsComponent } from './pages/user-repayments/user-repayments.component';
import { LoanRepaymentComponent } from './pages/loan-repayment/loan-repayment.component';
import { LoanRepaymentDetailsComponent } from './pages/loan-repayment-details/loan-repayment-details.component';
import { DepartmentsComponent } from './pages/departments/departments.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { TestingComponent } from './pages/testing/testing.component';
import { FinalApproverComponent } from './pages/final-approver/final-approver.component';
import { RmSidebarComponent } from './rm-sidebar/rm-sidebar.component';
import { RmDashboardComponent } from './rm_pages/rm-dashboard/rm-dashboard.component';
import { RmLayoutComponent } from "./layouts/rm_layout/rm-layout.component";
import { LandingComponent } from './landing/landing.component';
import { AppointmentsComponent } from './rm_pages/appointments/appointments.component';
import { IpSidebarComponent } from './ip-sidebar/ip-sidebar.component';
import { IpLayoutComponent } from "./layouts/ip_layout/ip-layout.component";
import { DashboardComponent } from './ip_pages/dashboard/dashboard.component';
import { UtilityPaymentsComponent } from './ip_pages/utility-payments/utility-payments.component';
import { SchoolPaymentsComponent } from './ip_pages/school-payments/school-payments.component';
import { ErpPaymentsComponent } from './ip_pages/erp-payments/erp-payments.component';
import { AppointmentDetailsComponent } from './rm_pages/appointment-details/appointment-details.component';
import { SAppointmentComponent } from './rm_pages/s-appointment/s-appointment.component';
import { ReportsDetailsComponent } from './rm_pages/reports-details/reports-details.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { EmployeeDetailsComponent } from './pages/employee-details/employee-details.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { LeaveComponent } from './pages/leave/leave.component';
import { LeaveApprovalComponent } from './pages/leave-approval/leave-approval.component';
import { EditComponent } from './pages/edit/edit.component';
import { UserEditComponent } from './pages/user-edit/user-edit.component';
import { EmployeeApprovalsComponent } from './pages/employee-approvals/employee-approvals.component';
import { EmployeeUpdatesComponent } from './pages/employee-updates/employee-updates.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { SelfOnboardingComponent } from './self-onboarding/self-onboarding.component';
import { DatePipe } from "@angular/common";
import { ReportsComponent } from './pages/reports/reports.component';
import { InnovationsHubComponent } from './pages/innovations-hub/innovations-hub.component';
import { CreditLayoutComponent } from "./layouts/credit_layout/credit-layout.component";
import { CreditSidebarComponent } from "./credit-sidebar/credit-sidebar.component";
import { DocumentsComponent } from './pages/documents/documents.component';
import { EventsComponent } from './pages/events/events.component';
import { EventsDetailsComponent } from './pages/events-details/events-details.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { FacilitiesComponent } from './pages/facilities/facilities.component';
import { LoanDetailsComponent } from './pages/loan-details/loan-details.component';







@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    RmLayoutComponent,
    IpLayoutComponent,
    CreditLayoutComponent,
    HomeComponent,
    SignUpComponent,
    SpinnerComponent,
    PrivacyComponent,
    SendInviteComponent,
    PaymentsComponent,
    PasswordLinkComponent,
    PasswordresetComponent,
    AllUsersComponent,
    UserInformationComponent,
    ContributionsComponent,
    AddUserComponent,
    PendingContributionsComponent,
    ContributionDetailsComponent,
    SubscriptionsComponent,
    SubPackagesComponent,
    PendingSubPaymentComponent,
    SubPaymentDetailsComponent,
    UserLoansComponent,
    LoansComponent,
    UserRepaymentsComponent,
    LoanRepaymentComponent,
    LoanRepaymentDetailsComponent,
    DepartmentsComponent,
    MessagesComponent,
    TestingComponent,
    FinalApproverComponent,
    RmSidebarComponent,
    RmDashboardComponent,

    LandingComponent,
    AppointmentsComponent,
    IpSidebarComponent,
    CreditSidebarComponent,
    DashboardComponent,
    UtilityPaymentsComponent,
    SchoolPaymentsComponent,
    ErpPaymentsComponent,
    AppointmentDetailsComponent,
    SAppointmentComponent,
    ReportsDetailsComponent,
    EmployeesComponent,
    EmployeeDetailsComponent,
    ProfileComponent,
    LeaveComponent,
    LeaveApprovalComponent,
    EditComponent,
    UserEditComponent,
    EmployeeApprovalsComponent,
    EmployeeUpdatesComponent,
    SettingsComponent,
    SelfOnboardingComponent,
    ReportsComponent,
    InnovationsHubComponent,
    DocumentsComponent,
    EventsComponent,
    EventsDetailsComponent,
    CustomersComponent,
    FacilitiesComponent,
    LoanDetailsComponent

  ],
  imports: [
    BrowserAnimationsModule,
    RouterModule.forRoot(AppRoutes,{
      useHash: true
    }),
    BrowserModule,

    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,


    SidebarModule,
    NavbarModule,
    ToastrModule.forRoot(),
    FooterModule,
    FixedPluginModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
