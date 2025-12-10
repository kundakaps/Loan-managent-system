import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import {ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loan-repayment-details',
  templateUrl: './loan-repayment-details.component.html',
  styleUrls: ['./loan-repayment-details.component.scss']
})
export class LoanRepaymentDetailsComponent implements OnInit {


  loading=false;
  id:any
  payment=[]
  pop_url:string =''
  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params["id"];
      this.getsinglePayment()



     });
  }


  getsinglePayment(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getadminsinglerepayment/'+this.id, { headers }).subscribe((response:any)=>{
        this.payment=response['data']
        this.pop_url = BASE_URL+'/storage/'+response['data']['pop']

      // console.log(this.contribution)
        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }


  approve(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    const body = { 'status':'approved' }
    try {
      this.http.post(BASE_URL+'/api/approverejectrepayment/'+this.id, body, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });
        this.route.navigate(['/loan-repayment'])

        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }

  reject(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    const body = { 'status':'rejected' }
    try {
      this.http.post(BASE_URL+'/api/approverejectrepayment/'+this.id, body, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });
        this.route.navigate(['/loan-repayment'])
        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }
}
