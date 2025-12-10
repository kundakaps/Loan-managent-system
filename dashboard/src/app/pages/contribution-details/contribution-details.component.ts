import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import {ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contribution-details',
  templateUrl: './contribution-details.component.html',
  styleUrls: ['./contribution-details.component.scss']
})
export class ContributionDetailsComponent implements OnInit {

  loading=false;
  id:any
  contribution=[]
  pop_url:string =''
  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params["id"];
      this.getsingleContribution()



     });
  }


  getsingleContribution(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getsinglegcontributions/'+this.id, { headers }).subscribe((response:any)=>{
        this.contribution=response['data']
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
      this.http.post(BASE_URL+'/api/approvereject/'+this.id, body, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });
        this.route.navigate(['/pending-contributions'])

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
      this.http.post(BASE_URL+'/api/approvereject/'+this.id, body, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });
        this.route.navigate(['/pending-contributions'])
        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }
}
