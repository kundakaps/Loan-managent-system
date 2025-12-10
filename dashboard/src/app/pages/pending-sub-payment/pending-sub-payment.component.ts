import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-pending-sub-payment',
  templateUrl: './pending-sub-payment.component.html',
  styleUrls: ['./pending-sub-payment.component.scss']
})
export class PendingSubPaymentComponent implements OnInit {

  constructor(private http: HttpClient,private route: Router) { }


  payments=[]
  loading=false
  required=false
  pop: string = '';

  ngOnInit(): void {
    this.getPendingSubpayment()
  }


  getPendingSubpayment(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getpendingsubpayments', { headers }).subscribe((response:any)=>{
        this.payments=response['data']

        setTimeout(() => {
          $('#paymentsTable').DataTable({
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
    this.route.navigate(['/subpayment-details'],{queryParams:{id:id,}})
    //console.log(id)
  }


}
