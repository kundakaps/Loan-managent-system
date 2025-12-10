import { PasswordresetComponent } from './passwordreset/passwordreset.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { PasswordLinkComponent } from './password-link/password-link.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { RmLayoutComponent } from './layouts/rm_layout/rm-layout.component';
import { LandingComponent } from './landing/landing.component';
import { AuthGuard } from './services/auth/auth.guard';
import { IpLayoutComponent } from './layouts/ip_layout/ip-layout.component';
import { SelfOnboardingComponent } from './self-onboarding/self-onboarding.component';
import { CreditLayoutComponent } from './layouts/credit_layout/credit-layout.component';


export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
        {
      path: '',
      loadChildren: () => import('./layouts/admin-layout/admin-layout.module').then(x => x.AdminLayoutModule)
  }]},
  // {
  //   path: '**',
  //   redirectTo: 'dashboard'
  // },

  {
    path: 'rm',
    component: RmLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/rm_layout/rm-layout.module').then((m) => m.RmLayoutModule),
      },
    ],
  },
  {
    path: 'ip',
    component: IpLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/ip_layout/ip-layout.module').then((i) => i.IpLayoutModule),
      },
    ],
  },

  {
    path: 'credit',
    component: CreditLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layouts/credit_layout/credit-layout.module').then((i) => i.CreditLayoutModule),
      },
    ],
  },

  {
    path: 'home',
    component: HomeComponent},
    {
      path: 'selfonboard',
      component: SelfOnboardingComponent},
    {
      path: 'landing',
      component: LandingComponent ,canActivate:[AuthGuard]},
     // component: LandingComponent},
    {
      path: 'password-reset',
      component: PasswordLinkComponent},

      {
        path: 'send-password-reset',
        component: PasswordresetComponent},
        {
          path: 'subscriptions',
          component: SubscriptionsComponent},

        {
          path: 'signup',
          component: SignUpComponent},
        {
            path: 'Privacy-policy',
         component: PrivacyComponent}
]
