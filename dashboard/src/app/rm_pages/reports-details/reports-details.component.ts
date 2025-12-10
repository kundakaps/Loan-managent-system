import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router  } from '@angular/router';
import { BASE_URL } from 'app/pages/config';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reports-details',
  templateUrl: './reports-details.component.html',
  styleUrls: ['./reports-details.component.scss']
})
export class ReportsDetailsComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private route: Router) { }
  id:any
  isLoading=false
  report:any=[]


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params["id"];
     });

     this.getSingleReport()
  }

 getSingleReport(){
  this.isLoading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getreport/'+this.id, { headers }).subscribe((response:any)=>{
        this.report=response['data']
        console.log(this.report)
        this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
      this.isLoading=false
    }
 }

}
