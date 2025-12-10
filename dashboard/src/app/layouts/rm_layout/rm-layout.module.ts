import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { RmLayoutRoutes } from './rm-layout.routing';
import { RmDashboardComponent } from '../../rm_pages/rm-dashboard/rm-dashboard.component'; // Adjust path
import { RmSidebarComponent } from '../../rm-sidebar/rm-sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(RmLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [
    //RmDashboardComponent,
    //RmSidebarComponent
  ]
})
export class RmLayoutModule {}
