import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BASE_URL } from '../pages/config';
import {ActivatedRoute, Router } from '@angular/router';
import * as $ from 'jquery';
import 'datatables.net';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.scss']
})
export class SubscriptionsComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute, private router:Router,private http: HttpClient) { }
  test : Date = new Date();
  isLoading =false


  id:any
  topay:any
  required=false
  pop: string = '';
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.id = params["id"];
      this.getamountToPay();



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

  getUserFormdata(data:any){
    this.isLoading=true


    this.formData.append('user_id', this.id);
    this.formData.append('amount', this.topay);

   console.log(this.formData)

    try {
      this.http.post(BASE_URL+'/api/addsubpayment',this.formData).subscribe((response:any)=>{


      //Swal.fire(response.message);
      Swal.fire({
        icon: 'success',
        title: 'success',
        text: response.message,
      });
      this.router.navigate(['/']);

      this.isLoading=false
      })
    }
    catch(error){
      console.log(error)
    }

  }

  getamountToPay(){
    this.isLoading = true;
    this.http.get(`${BASE_URL}/api/getamounttopay/`+this.id).subscribe(
      (result)=>{
        this.isLoading = false;
        this.topay=result['amount']
       // console.log(this.topay)
      },
      (error)=>{
        this.isLoading = false;
        console.log(error);
      }
    )
  }

}
