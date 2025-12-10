import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rm-dashboard',
  templateUrl: './rm-dashboard.component.html',
  styleUrls: ['./rm-dashboard.component.scss']
})
export class RmDashboardComponent implements OnInit {
  userdashboadData:any=[]
  isLoading= false

  constructor() { }

  ngOnInit(): void {
  }

}
