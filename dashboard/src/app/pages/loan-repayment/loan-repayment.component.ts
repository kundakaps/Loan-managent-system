import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import {ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-loan-repayment',
  templateUrl: './loan-repayment.component.html',
  styleUrls: ['./loan-repayment.component.scss']
})
export class LoanRepaymentComponent implements OnInit {

  Repayments=[]
  loading=false
  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private route: Router) { }


  ngOnInit(): void {
    this.getRepayments('pending')
  }



 getRepayments(status:any) {
  this.loading = true;
  const token = sessionStorage.getItem('token');
  const headers = { 'Authorization': 'Bearer ' + token };

  try {
    this.http.get(BASE_URL + '/api/getrepayments/'+status, { headers }).subscribe((response: any) => {
      this.Repayments = response['data'];
      $('#repaymentsTable').DataTable().clear().destroy();
      // Destroy existing DataTable if it has been initialized
      // if ($.fn.dataTable.isDataTable('#usersTable')) {
      //   $('#usersTable').DataTable().clear().destroy();
      // }

      setTimeout(() => {
        $('#repaymentsTable').DataTable({
          pagingType: 'full_numbers',
          pageLength: 5,
          processing: true,
          lengthMenu: [5, 10, 25],
        });
      }, 1);

      this.loading = false;
    });
  } catch (error) {
    console.log(error);
    this.loading = false;
  }
}

Details(loanId:any){
  console.log(loanId);

  this.route.navigate(['/loan-repayment-details'],{queryParams:{id:loanId}})
}

}
