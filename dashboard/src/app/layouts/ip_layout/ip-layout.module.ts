import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { IpLayoutRoutes } from './ip-layout.routing';




@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(IpLayoutRoutes),
    FormsModule,
    NgbModule
  ],
  declarations: [

  ]
})
export class IpLayoutModule {}
