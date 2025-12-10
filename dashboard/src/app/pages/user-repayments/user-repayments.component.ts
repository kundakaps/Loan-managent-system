import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../config';
import {ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-repayments',
  templateUrl: './user-repayments.component.html',
  styleUrls: ['./user-repayments.component.scss']
})
export class UserRepaymentsComponent implements OnInit {

  loading=false;
  id:any
  repayments=[]
  singleLoanRepayment=[]
  required=false
  pop: string = '';

  constructor(private activatedRoute: ActivatedRoute,private http: HttpClient,private route: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params["id"];
      this.getUserRepaments()
      this.getsingleLoanRepayment()

     });
  }


  formData: FormData = new FormData();
  onFileChange(event: any, field: string) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.formData.append(field, file);

      // Update file name variables
      if (field === 'pop') {
        this.pop = file.name;
      }
    }
  }

  getsingleLoanRepayment(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getsingleloanrepayment/'+this.id, { headers }).subscribe((response:any)=>{
        this.singleLoanRepayment=response['data']


        this.loading=false
      })
    }
    catch(error){
      console.log(error)
      this.loading=false
    }
  }

  getUserRepaments(){
    this.loading=true
    const token = sessionStorage.getItem('token');
    //console.log("token is: "+token)
    const headers = { 'Authorization': 'Bearer '+token }
    try {
      this.http.get(BASE_URL+'/api/getuserrepayment/'+this.id, { headers }).subscribe((response:any)=>{
        this.repayments=response['data']
        $('#repaymentsTable').DataTable().clear().destroy();

        setTimeout(() => {
          $('#repaymentsTable').DataTable({
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


  addRepayment(data:any){
    this.loading=true

    const token=sessionStorage.getItem('token');
    const headers ={ 'Authorization': 'Bearer '+token}
    this.formData.append('loan_id', this.id);
    this.formData.append('amount', data.value.amount);
   //console.log(this.formData)

    try {
      this.http.post(BASE_URL+'/api/addrepayment',this.formData, { headers }).subscribe((response:any)=>{


      //Swal.fire(response.message);
      Swal.fire({
        icon: 'success',
        title: 'success',
        text: response.message,
      });
      this.getUserRepaments();
      this.loading=false
      })
    }
    catch(error){
      console.log(error)
    }

  }


}
