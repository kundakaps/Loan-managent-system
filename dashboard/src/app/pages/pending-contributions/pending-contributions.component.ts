import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pending-contributions',
  templateUrl: './pending-contributions.component.html',
  styleUrls: ['./pending-contributions.component.scss']
})
export class PendingContributionsComponent implements OnInit {

  contributions=[]
  loading=false
  required=false
  pop: string = '';
  constructor(private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.getPendingContributions();
  }

  getPendingContributions(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getpendingcontributions', { headers }).subscribe((response:any)=>{
        this.contributions=response['data']

        setTimeout(() => {
          $('#contributionsTable').DataTable({
              pagingType: 'full_numbers',
              pageLength: 5,
              processing: true,
              lengthMenu: [5, 10, 25],
          });
      }, 1);

        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }

  viewDetails(id){
    this.route.navigate(['/contributions-details'],{queryParams:{id:id,}})
    //console.log(id)
  }

}
