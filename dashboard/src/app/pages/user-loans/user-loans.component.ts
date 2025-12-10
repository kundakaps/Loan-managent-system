import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import { Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-loans',
  templateUrl: './user-loans.component.html',
  styleUrls: ['./user-loans.component.scss']
})
export class UserLoansComponent implements OnInit {

  Loans=[]
  loading=false
  required=false
  max_borrow:any
  total_contributions:any
  pop: string = '';
  constructor(private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.getloans()
  }


  getloans(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getuserloans', { headers }).subscribe((response:any)=>{
        this.Loans=response['data']
        this.total_contributions=response['total_contributions']
        this.max_borrow=response['max_borrow_amount']
        $('#loansTable').DataTable().clear().destroy();

        setTimeout(() => {
          $('#loansTable').DataTable({
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

  onSubmit(userForm: any) {
    if (userForm.valid) {
      console.log('Form Data:', userForm.value);
    }



    this.loading=true;

    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }

    try {
      this.http.post(BASE_URL+'/api/loanapplications',userForm.value, { headers }).subscribe((response:any)=>{

        Swal.fire({
          icon: 'success',
          title: 'success',
          text: response.message,
        });

        this.getloans()

        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }


  makeRepayment(loanId:any){
    //console.log(loanId);

    //navigate to repayment page with loan id as query parameter

    this.route.navigate(['/user-repayment'],{queryParams:{id:loanId}})
  }


}
